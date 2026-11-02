// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { contact } from "@/content/es/contact";
import { contact as contactEn } from "@/content/en/contact";
import { ContactForm } from "@/features/contact/contact-form";
import type { LeadFormInput } from "@/lib/validations/lead";

const { form: copy, validation } = contact;

const fetchMock = vi.fn<typeof fetch>();
const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

type User = ReturnType<typeof userEvent.setup>;

const renderForm = (initialService?: LeadFormInput["service"]) =>
  render(<ContactForm copy={copy} validation={validation} locale="es" initialService={initialService} />);

const continueButton = () => screen.getByRole("button", { name: copy.steps.next });
const submitButton = () => screen.getByRole("button", { name: copy.submit });
const chooseStage = (user: User) => user.click(screen.getByRole("button", { name: copy.stageOptions[0]!.label }));

async function goToDetails(user: User) {
  await chooseStage(user);
  await user.type(await screen.findByLabelText(/^Tu proyecto/), "Necesito una plataforma de reservas para mi negocio.");
  await user.click(continueButton());
  await screen.findByLabelText(/^Nombre/);
}

async function fillValidForm(user: User) {
  await goToDetails(user);
  await user.type(screen.getByLabelText(/^Nombre/), "Ana García");
  await user.type(screen.getByLabelText(/^Correo electrónico/), "ana@empresa.es");
  await user.click(screen.getByRole("checkbox"));
}

describe("ContactForm steps", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("opens on the first question, without personal fields", () => {
    renderForm();

    expect(screen.getByTestId("contact-progress")).toHaveTextContent("Paso 1 de 3");
    expect(screen.queryByLabelText(/^Nombre/)).not.toBeInTheDocument();
  });

  it("advances as soon as a starting point is chosen, and moves focus", async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseStage(user);

    expect(await screen.findByRole("heading", { name: copy.steps.project.title })).toHaveFocus();
    expect(screen.getByTestId("contact-progress")).toHaveTextContent("Paso 2 de 3");
  });

  it("will not pass the project step with a short description", async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseStage(user);
    await user.type(await screen.findByLabelText(/^Tu proyecto/), "Hola");
    await user.click(continueButton());

    expect(await screen.findByText(validation.messageMin)).toBeInTheDocument();
    expect(screen.getByTestId("contact-progress")).toHaveTextContent("Paso 2 de 3");
  });

  it("does not ask about the service as a requirement", async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseStage(user);

    expect(await screen.findByRole("radio", { name: "Aún no lo tengo claro" })).toBeChecked();
  });

  it("preselects the service coming from the services page", async () => {
    const user = userEvent.setup();
    renderForm("qa");

    await chooseStage(user);

    expect(await screen.findByRole("radio", { name: "QA y pruebas" })).toBeChecked();
  });

  it("keeps answers when going back", async () => {
    const user = userEvent.setup();
    renderForm();

    await goToDetails(user);
    await user.type(screen.getByLabelText(/^Nombre/), "Ana");
    await user.click(screen.getByRole("button", { name: copy.steps.back }));

    expect(await screen.findByLabelText(/^Tu proyecto/)).toHaveValue("Necesito una plataforma de reservas para mi negocio.");

    await user.click(continueButton());
    expect(await screen.findByLabelText(/^Nombre/)).toHaveValue("Ana");
  });

  it("marks the chosen starting point when returning to it", async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseStage(user);
    await user.click(await screen.findByRole("button", { name: copy.steps.back }));

    expect(await screen.findByRole("button", { name: copy.stageOptions[0]!.label })).toHaveAttribute("aria-pressed", "true");
  });

  it("never reaches the API before the last step", async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseStage(user);
    await user.type(await screen.findByLabelText(/^Tu proyecto/), "Necesito una plataforma de reservas para mi negocio.");
    await user.click(continueButton());

    await screen.findByLabelText(/^Nombre/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("ContactForm submission", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("shows accessible errors and does not call the API with an empty last step", async () => {
    const user = userEvent.setup();
    renderForm();

    await goToDetails(user);
    await user.click(submitButton());

    expect(await screen.findByText(validation.nameMin)).toBeInTheDocument();
    expect(screen.getByText(validation.consent)).toBeInTheDocument();

    const name = screen.getByLabelText(/^Nombre/);
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(validation.nameMin);
    await waitFor(() => expect(name).toHaveFocus());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("validates the email when leaving the field", async () => {
    const user = userEvent.setup();
    renderForm();

    await goToDetails(user);
    await user.type(screen.getByLabelText(/^Correo electrónico/), "mal");
    await user.tab();

    expect(await screen.findByText(validation.emailFormat)).toBeInTheDocument();
  });

  it("submits every step and moves focus to the success message", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }, 201));
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(submitButton());

    const heading = await screen.findByRole("heading", { name: copy.success.title });
    expect(heading).toHaveFocus();

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("/api/contact");
    expect(JSON.parse(init?.body as string)).toMatchObject({
      stage: "idea",
      service: "other",
      name: "Ana García",
      email: "ana@empresa.es",
      consent: true,
      website: "",
      locale: "es",
      submissionId: expect.stringMatching(/^[0-9a-f-]{36}$/),
    });
  });

  it("speaks the language of the page", async () => {
    const user = userEvent.setup();
    render(<ContactForm copy={contactEn.form} validation={contactEn.validation} locale="en" />);

    expect(screen.getByTestId("contact-progress")).toHaveTextContent("Step 1 of 3");
    await user.click(screen.getByRole("button", { name: contactEn.form.stageOptions[0]!.label }));
    await user.click(await screen.findByRole("button", { name: contactEn.form.steps.next }));

    expect(await screen.findByText(contactEn.validation.messageMin)).toBeInTheDocument();
  });

  it("prevents double submission while the request is in flight", async () => {
    let resolve: (value: Response) => void = () => {};
    fetchMock.mockReturnValue(new Promise((r) => (resolve = r)));
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(submitButton());

    const busy = await screen.findByRole("button", { name: copy.submitting });
    expect(busy).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledOnce();

    resolve(jsonResponse({ ok: true }));
    await screen.findByRole("heading", { name: copy.success.title });
  });

  it("reuses the submission id when retrying after a server error", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, error: "server" }, 503));
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }, 201));
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(submitButton());
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(copy.errors.server);
    expect(alert).toHaveFocus();

    await user.click(submitButton());
    await screen.findByRole("heading", { name: copy.success.title });

    const ids = fetchMock.mock.calls.map(([, init]) => JSON.parse(init?.body as string).submissionId);
    expect(ids[0]).toBe(ids[1]);
  });

  it("explains rate limiting", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: false, error: "rate_limited", retryAfterSeconds: 60 }, 429));
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(copy.errors.rateLimited);
  });

  it("handles a network failure", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(copy.errors.network);
  });

  it("maps server field errors back onto the fields", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ ok: false, error: "invalid", fieldErrors: { email: "Correo rechazado por el servidor." } }, 400),
    );
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByText("Correo rechazado por el servidor.")).toBeInTheDocument();
  });

  it("returns to the step that holds a field the server rejected", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ ok: false, error: "invalid", fieldErrors: { message: "Texto rechazado por el servidor." } }, 400),
    );
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByText("Texto rechazado por el servidor.")).toBeInTheDocument();
    expect(screen.getByTestId("contact-progress")).toHaveTextContent("Paso 2 de 3");
  });

  it("forwards a filled honeypot so the server can discard the bot", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
    const user = userEvent.setup();
    const { container } = renderForm();

    await fillValidForm(user);
    await user.type(container.querySelector<HTMLInputElement>("#website")!, "spam");
    await user.click(submitButton());

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0]![1]?.body as string).website).toBe("spam");
  });

  it("keeps the honeypot away from keyboards and assistive technology", () => {
    const { container } = renderForm();
    const honeypot = container.querySelector("#website")!;

    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("returns to the first step after a success", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }, 201));
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(submitButton());
    await user.click(await screen.findByRole("button", { name: copy.success.reset }));

    expect(screen.getByTestId("contact-progress")).toHaveTextContent("Paso 1 de 3");
  });
});
