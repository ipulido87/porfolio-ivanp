"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type BaseSyntheticEvent, type FormEvent, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { Typewriter, typingDuration } from "@/components/motion/typewriter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceGroup } from "@/components/ui/choice-group";
import { Input, Textarea } from "@/components/ui/input";
import type { Locale } from "@/config/i18n";
import { getRoutes } from "@/config/site";
import type { ContactContent } from "@/content";
import { cn } from "@/lib/utils";
import {
  createLeadSchema,
  type LeadData,
  type LeadFormInput,
  type StageValue,
  type ValidationMessages,
} from "@/lib/validations/lead";
import type { ContactApiResponse } from "./handle-lead-request";

type FormCopy = ContactContent["form"];
type SubmitState = "idle" | "success";

// Asking little up front is the point: the personal details come last, once the
// visitor has already invested in explaining the project.
const STEPS: { id: "stage" | "project" | "details"; fields: (keyof LeadFormInput)[] }[] = [
  { id: "stage", fields: ["stage"] },
  { id: "project", fields: ["message", "service"] },
  { id: "details", fields: ["budget", "name", "email", "company", "consent"] },
];
const LAST_STEP = STEPS.length - 1;
const INITIAL_NAV = { step: 0, furthest: 0, animate: true };
/** A short beat before the next question starts, so it reads as a reply. */
const TYPING_DELAY_MS = 300;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm text-danger">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

function FieldLabel({
  htmlFor,
  id,
  children,
  required,
  optional,
}: {
  htmlFor?: string;
  id?: string;
  children: ReactNode;
  required?: boolean;
  optional?: string;
}) {
  const className = "mb-2 block text-[0.9375rem] font-medium";
  const content = (
    <>
      {children}
      {required ? (
        <span aria-hidden className="ml-0.5 text-cyan">
          *
        </span>
      ) : null}
      {optional ? <span className="ml-1.5 font-normal text-muted">({optional})</span> : null}
    </>
  );
  // Radio groups are labelled by plain text: <label> has no single control to target.
  return htmlFor ? (
    <label htmlFor={htmlFor} className={className}>
      {content}
    </label>
  ) : (
    <span id={id} className={className}>
      {content}
    </span>
  );
}

type ContactFormProps = {
  copy: FormCopy;
  validation: ValidationMessages;
  locale: Locale;
  initialService?: LeadFormInput["service"];
};

export function ContactForm({ copy, validation, locale, initialService }: ContactFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [nav, setNav] = useState(INITIAL_NAV);
  const { step } = nav;
  // Only a step seen for the first time is typed: going back should feel instant.
  const setStep = (next: number) =>
    setNav(({ furthest }) => ({ step: next, furthest: Math.max(furthest, next), animate: next > furthest }));
  const [serverError, setServerError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  // Kept across retries: a response lost in transit cannot create a second lead.
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const [schema] = useState(() => createLeadSchema(validation));
  const successHeading = useRef<HTMLHeadingElement>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const errorAlert = useRef<HTMLDivElement>(null);
  const previousStep = useRef(step);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormInput, unknown, LeadData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    // The most honest default for a visitor who skips the question.
    defaultValues: { name: "", email: "", company: "", service: initialService ?? "other", message: "" },
  });

  // Keyboard and screen reader users land on the outcome, not on a removed form.
  useEffect(() => {
    if (submitState === "success") successHeading.current?.focus();
  }, [submitState]);

  useEffect(() => {
    if (serverError) errorAlert.current?.focus();
  }, [serverError]);

  // Each step replaces the previous one, so focus has to move with it.
  useEffect(() => {
    if (previousStep.current !== step) stepHeading.current?.focus();
    previousStep.current = step;
  }, [step]);

  const goToNextStep = async () => {
    if (await trigger(STEPS[step]!.fields, { shouldFocus: true })) setStep(step + 1);
  };

  const chooseStage = (stage: StageValue) => {
    setValue("stage", stage, { shouldValidate: true });
    setStep(1);
  };

  const onSubmit = async (data: LeadData, event?: BaseSyntheticEvent) => {
    setServerError(null);
    const website = new FormData(event?.target as HTMLFormElement).get("website");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submissionId, website, locale }),
      });
      const result = (await response.json().catch(() => null)) as ContactApiResponse | null;

      if (result?.ok) {
        setSubmissionId(crypto.randomUUID());
        setSubmitState("success");
        return;
      }

      if (result?.error === "invalid") {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof LeadFormInput, { message });
        });
        // The rejected field may live on an earlier step.
        const failing = STEPS.findIndex(({ fields }) => fields.some((field) => field in result.fieldErrors));
        if (failing !== -1) setStep(failing);
        setServerError(copy.errors.invalid);
        return;
      }

      setServerError(result?.error === "rate_limited" ? copy.errors.rateLimited : copy.errors.server);
    } catch {
      setServerError(copy.errors.network);
    }
  };

  const startOver = () => {
    reset();
    setNav(INITIAL_NAV);
    setSubmitState("idle");
    setServerError(null);
    setFormKey((key) => key + 1);
  };

  if (submitState === "success") {
    return (
      <div className="corner-ticks card-surface p-8 sm:p-12" data-testid="contact-success">
        <CheckCircle2 className="size-9 text-cyan" aria-hidden />
        <h2 ref={successHeading} tabIndex={-1} className="mt-6 text-3xl outline-none sm:text-4xl">
          <Typewriter text={copy.success.title} />
        </h2>
        <p className="mt-4 max-w-lg text-muted">{copy.success.body}</p>
        <Button variant="secondary" className="mt-8" onClick={startOver}>
          {copy.success.reset}
        </Button>
      </div>
    );
  }

  const { fields, steps } = copy;
  const current = STEPS[step]!;
  const { title, hint } = steps[current.id];
  const hintDelay = TYPING_DELAY_MS + typingDuration(title);
  const contentDelay = hintDelay + typingDuration(hint);
  const describedBy = (field: keyof LeadFormInput) => (errors[field] ? `${field}-error` : undefined);

  // Enter advances on the intermediate steps instead of submitting a partial lead.
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step === LAST_STEP) return handleSubmit(onSubmit)(event);
    event.preventDefault();
    return goToNextStep();
  };

  return (
    <form
      key={formKey}
      onSubmit={handleFormSubmit}
      noValidate
      aria-label={copy.title}
      className="corner-ticks card-surface p-6 sm:p-10"
    >
      <div className="flex items-center gap-4">
        <p className="label-mono shrink-0" aria-live="polite" data-testid="contact-progress">
          {steps.progress.replace("{current}", String(step + 1)).replace("{total}", String(STEPS.length))}
        </p>
        <div className="flex flex-1 gap-1.5" aria-hidden>
          {STEPS.map((item, index) => (
            <span
              key={item.id}
              className={cn(
                "h-px flex-1 transition-colors duration-500",
                index <= step ? "bg-cyan" : "bg-line-strong",
              )}
            />
          ))}
        </div>
      </div>

      <div key={current.id} className="mt-8">
        <h2 ref={stepHeading} tabIndex={-1} className="text-3xl outline-none sm:text-4xl">
          <Typewriter text={title} delay={TYPING_DELAY_MS} instant={!nav.animate} />
        </h2>
        <p className="mt-3 text-muted">
          <Typewriter text={hint} delay={hintDelay} instant={!nav.animate} />
        </p>

        {/* Fades in after the text, but it is usable from the start: typing never blocks. */}
        <div
          className={nav.animate ? "animate-float-in" : undefined}
          style={nav.animate ? { animationDelay: `${contentDelay}ms` } : undefined}
        >
        {current.id === "stage" ? (
          <ul className="mt-7 space-y-2.5">
            {copy.stageOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => chooseStage(option.value)}
                  aria-pressed={getValues("stage") === option.value}
                  className="group flex min-h-14 w-full items-center justify-between gap-4 rounded-lg border border-line-strong bg-ink-2 px-5 py-3 text-left transition-colors duration-200 hover:border-cyan/60 aria-pressed:border-cyan aria-pressed:bg-cyan/10"
                >
                  {option.label}
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted transition-transform duration-300 ease-out-expo group-hover:translate-x-1 group-hover:text-cyan"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {current.id === "project" ? (
          <div className="mt-7 space-y-7">
            <div>
              <FieldLabel htmlFor="message" required>
                {fields.message.label}
              </FieldLabel>
              <Textarea
                id="message"
                required
                rows={6}
                placeholder={fields.message.placeholder}
                aria-invalid={!!errors.message}
                aria-describedby={describedBy("message")}
                // Clear the error while typing. If it only cleared on blur, the layout
                // would shift under the pointer and swallow the click on Continue.
                {...register("message", { onChange: () => errors.message && trigger("message") })}
              />
              <FieldError id="message-error" message={errors.message?.message} />
            </div>

            <div>
              <FieldLabel id="service-label">{fields.service.label}</FieldLabel>
              <Controller
                control={control}
                name="service"
                render={({ field }) => (
                  <ChoiceGroup
                    ref={field.ref}
                    options={copy.serviceOptions}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    aria-labelledby="service-label"
                    aria-invalid={!!errors.service}
                    aria-describedby={describedBy("service")}
                  />
                )}
              />
              <FieldError id="service-error" message={errors.service?.message} />
            </div>
          </div>
        ) : null}

        {current.id === "details" ? (
          <div className="mt-7 space-y-7">
            <p className="text-sm text-muted">{copy.requiredHint}</p>

            <div className="grid gap-7 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="name" required>
                  {fields.name.label}
                </FieldLabel>
                <Input
                  id="name"
                  autoComplete="name"
                  required
                  placeholder={fields.name.placeholder}
                  aria-invalid={!!errors.name}
                  aria-describedby={describedBy("name")}
                  {...register("name")}
                />
                <FieldError id="name-error" message={errors.name?.message} />
              </div>

              <div>
                <FieldLabel htmlFor="email" required>
                  {fields.email.label}
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder={fields.email.placeholder}
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy("email")}
                  {...register("email")}
                />
                <FieldError id="email-error" message={errors.email?.message} />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="company" optional={copy.optional}>
                {fields.company.label}
              </FieldLabel>
              <Input
                id="company"
                autoComplete="organization"
                placeholder={fields.company.placeholder}
                aria-invalid={!!errors.company}
                aria-describedby={describedBy("company")}
                {...register("company")}
              />
              <FieldError id="company-error" message={errors.company?.message} />
            </div>

            <div>
              <FieldLabel id="budget-label" optional={copy.optional}>
                {fields.budget.label}
              </FieldLabel>
              <Controller
                control={control}
                name="budget"
                render={({ field }) => (
                  <ChoiceGroup
                    ref={field.ref}
                    options={copy.budgetOptions}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    aria-labelledby="budget-label"
                  />
                )}
              />
              <FieldError id="budget-error" message={errors.budget?.message} />
            </div>

            <div>
              <Controller
                control={control}
                name="consent"
                render={({ field }) => (
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      ref={field.ref}
                      checked={field.value === true}
                      onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)}
                      onBlur={field.onBlur}
                      required
                      aria-invalid={!!errors.consent}
                      aria-describedby={describedBy("consent")}
                    />
                    <label htmlFor="consent" className="text-[0.9375rem] text-muted">
                      {fields.consent.before}
                      <Link
                        href={getRoutes(locale).privacy}
                        target="_blank"
                        className="text-text underline underline-offset-3 hover:text-cyan"
                      >
                        {fields.consent.link}
                      </Link>
                      {fields.consent.after}
                      <span aria-hidden className="ml-0.5 text-cyan">
                        *
                      </span>
                    </label>
                  </div>
                )}
              />
              <FieldError id="consent-error" message={errors.consent?.message} />
            </div>
          </div>
        ) : null}
        </div>
      </div>

      {/* Honeypot: off-screen for people, skipped by keyboards and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="website">{fields.honeypot}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {serverError ? (
        <div
          ref={errorAlert}
          role="alert"
          tabIndex={-1}
          data-testid="contact-error"
          className="mt-7 flex items-start gap-3 rounded-lg border border-danger/50 bg-danger/10 p-4 text-[0.9375rem] outline-none"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden />
          {serverError}
        </div>
      ) : null}

      {step > 0 ? (
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} className="w-full sm:w-auto">
            <ArrowLeft aria-hidden />
            {steps.back}
          </Button>

          {step < LAST_STEP ? (
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              {steps.next}
              <ArrowRight aria-hidden className="transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={isSubmitting} aria-busy={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  {copy.submitting}
                </>
              ) : (
                <>
                  {copy.submit}
                  <ArrowRight
                    aria-hidden
                    className="transition-transform duration-300 group-hover/button:translate-x-0.5"
                  />
                </>
              )}
            </Button>
          )}
        </div>
      ) : null}

      {step === LAST_STEP ? <p className="mt-5 text-xs leading-relaxed text-muted">{copy.legalNote}</p> : null}
    </form>
  );
}
