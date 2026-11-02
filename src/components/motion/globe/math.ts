// Pure 3D helpers for the hero globe. No DOM access, so they run on the server
// (static poster), in the browser (live canvas) and in unit tests.

export type Vec3 = [number, number, number];
/** Row-major 3x3 rotation matrix. */
export type Mat3 = [number, number, number, number, number, number, number, number, number];

/** Camera distance in sphere radii: close enough for visible perspective. */
export const CAMERA_DISTANCE = 4.2;
/** With a perspective camera the horizon sits slightly in front of z = 0. */
export const HORIZON_Z = 1 / CAMERA_DISTANCE;
/** Sphere radius that makes the projected silhouette span exactly `silhouette`. */
export const sphereRadiusFor = (silhouette: number) =>
  (silhouette * Math.sqrt(CAMERA_DISTANCE ** 2 - 1)) / CAMERA_DISTANCE;

export function latLonToVec(latDeg: number, lonDeg: number): Vec3 {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
}

export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

/** R = Rz(roll) · Rx(pitch) · Ry(yaw): spin first, then the axial tilt. */
export function rotationMatrix(yaw: number, pitch: number, roll: number): Mat3 {
  const [sy, cy] = [Math.sin(yaw), Math.cos(yaw)];
  const [sp, cp] = [Math.sin(pitch), Math.cos(pitch)];
  const [sr, cr] = [Math.sin(roll), Math.cos(roll)];
  // Rx · Ry
  const m00 = cy;
  const m02 = sy;
  const m10 = sp * sy;
  const m11 = cp;
  const m12 = -sp * cy;
  const m20 = -cp * sy;
  const m21 = sp;
  const m22 = cp * cy;
  // Rz · (Rx · Ry)
  return [
    cr * m00 - sr * m10,
    -sr * m11,
    cr * m02 - sr * m12,
    sr * m00 + cr * m10,
    cr * m11,
    sr * m02 + cr * m12,
    m20,
    m21,
    m22,
  ];
}

export function rotate(m: Mat3, v: Vec3): Vec3 {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

/** Perspective factor for a point at depth `z` (radii, +z towards the camera). */
export const perspective = (z: number) => CAMERA_DISTANCE / (CAMERA_DISTANCE - z);

/** A unit-sphere point faces the camera when it lies beyond the horizon plane. */
export const isFrontFacing = (z: number) => z > HORIZON_Z;

/** Spherical interpolation between two unit vectors. */
export function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const cos = Math.min(1, Math.max(-1, dot(a, b)));
  const angle = Math.acos(cos);
  if (angle < 1e-5) return [...a];
  const sin = Math.sin(angle);
  const wa = Math.sin((1 - t) * angle) / sin;
  const wb = Math.sin(t * angle) / sin;
  return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb];
}

/** Small deterministic PRNG (mulberry32): the same seed gives the same globe. */
export function createRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
