import { randomUUID } from "node:crypto";

export const validLead = {
  stage: "idea",
  name: "Ana García",
  email: "ana@empresa.es",
  company: "Empresa Ejemplo",
  service: "web",
  budget: "3k-10k",
  message: "Necesito una plataforma para gestionar las reservas de mi negocio.",
  consent: true,
} as const;

export const validRequest = (overrides: Record<string, unknown> = {}) => ({
  ...validLead,
  submissionId: randomUUID(),
  website: "",
  ...overrides,
});
