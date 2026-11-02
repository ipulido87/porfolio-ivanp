import { describe, expect, it } from "vitest";
import {
  CAMERA_DISTANCE,
  createRng,
  dot,
  HORIZON_Z,
  isFrontFacing,
  latLonToVec,
  perspective,
  rotate,
  rotationMatrix,
  slerp,
  sphereRadiusFor,
  type Vec3,
} from "@/components/motion/globe/math";
import { buildScene, REVOLUTION_MS } from "@/components/motion/globe/scene";

const expectVec = (actual: Vec3, expected: Vec3) => {
  actual.forEach((value, i) => expect(value).toBeCloseTo(expected[i]!, 6));
};

describe("globe rotation", () => {
  it("spins around the vertical axis: the pole does not move", () => {
    expectVec(rotate(rotationMatrix(1.3, 0, 0), [0, 1, 0]), [0, 1, 0]);
  });

  it("is a true 3D rotation: a point on the equator keeps its height", () => {
    const start = latLonToVec(0, 25);
    for (const yaw of [0.5, 1.5, 3]) expect(rotate(rotationMatrix(yaw, 0, 0), start)[1]).toBeCloseTo(0, 6);
  });

  it("moves the front of the globe from left to right", () => {
    const [x] = rotate(rotationMatrix(0.2, 0, 0), [0, 0, 1]);
    expect(x).toBeGreaterThan(0);
  });

  it("sends the far side to the front after half a turn", () => {
    expectVec(rotate(rotationMatrix(Math.PI, 0, 0), [0, 0, 1]), [0, 0, -1]);
  });

  it("preserves length under any orientation", () => {
    const [x, y, z] = rotate(rotationMatrix(0.7, 0.4, -0.2), latLonToVec(39.57, 2.65));
    expect(Math.hypot(x, y, z)).toBeCloseTo(1, 6);
  });

  it("completes a revolution in 30 to 45 seconds", () => {
    expect(REVOLUTION_MS).toBeGreaterThanOrEqual(30_000);
    expect(REVOLUTION_MS).toBeLessThanOrEqual(45_000);
  });
});

describe("globe projection", () => {
  it("magnifies near points and shrinks far ones", () => {
    expect(perspective(1)).toBeGreaterThan(1);
    expect(perspective(-1)).toBeLessThan(1);
  });

  it("classifies back-facing points using the perspective horizon", () => {
    expect(isFrontFacing(0.9)).toBe(true);
    expect(isFrontFacing(0)).toBe(false);
    expect(isFrontFacing(HORIZON_Z + 0.01)).toBe(true);
  });

  it("sizes the sphere so the horizon projects onto the silhouette", () => {
    const radius = sphereRadiusFor(100);
    const ringRadius = Math.sqrt(1 - HORIZON_Z ** 2);
    expect(ringRadius * perspective(HORIZON_Z) * radius).toBeCloseTo(100, 6);
    expect(CAMERA_DISTANCE).toBeGreaterThan(1);
  });
});

describe("globe scene", () => {
  it("interpolates along the sphere surface", () => {
    const midpoint = slerp([1, 0, 0], [0, 1, 0], 0.5);
    expect(Math.hypot(...midpoint)).toBeCloseTo(1, 6);
    expect(dot(midpoint, [1, 0, 0])).toBeCloseTo(Math.SQRT1_2, 6);
  });

  it("generates the same world every time", () => {
    expect(createRng(7)()).toBe(createRng(7)());
    expect(buildScene().dots).toEqual(buildScene().dots);
  });

  it("contains every layer of the visual", () => {
    const scene = buildScene();
    expect(scene.dots.length).toBeGreaterThan(0);
    expect(scene.gridSegments.length).toBeGreaterThan(0);
    expect(scene.hubs.filter((hub) => hub.home)).toHaveLength(1);
    expect(scene.routes.length).toBeGreaterThan(5);
    expect(scene.particles.length).toBeGreaterThan(0);
  });

  it("keeps dots on the unit sphere", () => {
    const { dots } = buildScene();
    for (let i = 0; i < dots.length; i += 300) {
      expect(Math.hypot(dots[i]!, dots[i + 1]!, dots[i + 2]!)).toBeCloseTo(1, 4);
    }
  });
});
