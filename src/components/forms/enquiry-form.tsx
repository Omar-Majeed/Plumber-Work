"use client";

import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { AlertCircle, Info, Loader2, Send } from "lucide-react";
import { submitEnquiry } from "@/app/actions/enquiry";
import { services } from "@/content/services";
import {
  initialEnquiryState,
  preferredTimeOptions,
  type FieldErrors,
} from "@/lib/enquiry-state";
import { cn } from "@/lib/cn";

const fieldLabels: Record<string, string> = {
  service: "What do you need help with?",
  name: "Your name",
  phone: "Phone number",
  email: "Email address",
  suburb: "Suburb or postcode",
  preferredTime: "Preferred contact time",
  message: "Anything else we should know?",
  privacy: "Privacy acknowledgement",
};

interface FormValues {
  service: string;
  name: string;
  phone: string;
  email: string;
  suburb: string;
  preferredTime: string;
  message: string;
  privacy: boolean;
}

const emptyValues: FormValues = {
  service: "",
  name: "",
  phone: "",
  email: "",
  suburb: "",
  preferredTime: "",
  message: "",
  privacy: false,
};

interface EnquiryFormProps {
  /** "hero" is the compact card used on the homepage. */
  variant?: "hero" | "page";
  headingLevel?: "h2" | "h3";
  className?: string;
}

export function EnquiryForm({
  variant = "hero",
  headingLevel: Heading = "h2",
  className,
}: EnquiryFormProps) {
  const [state, formAction, pending] = useActionState(
    submitEnquiry,
    initialEnquiryState,
  );

  /**
   * Fields are controlled so that a validation failure never wipes what
   * someone typed — React resets uncontrolled inputs once a form action
   * settles.
   */
  const [values, setValues] = useState<FormValues>(emptyValues);
  const baseId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const errors = state.fieldErrors;
  const problemCount = Object.keys(errors).length;
  const showSummary = problemCount > 1;

  /**
   * Clear the form once — and only once — after a genuine successful send.
   * Adjusting state during render is React's documented alternative to
   * resetting state from an effect.
   */
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.status === "sent") setValues(emptyValues);
  }

  useEffect(() => {
    if (state.status === "invalid") {
      if (Object.keys(state.fieldErrors).length > 1) summaryRef.current?.focus();
      return;
    }
    if (
      state.status === "demo" ||
      state.status === "sent" ||
      state.status === "error"
    ) {
      statusRef.current?.focus();
    }
  }, [state]);

  const handleChange =
    (field: keyof FormValues) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const target = event.target;
      const next =
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.value;
      setValues((current) => ({ ...current, [field]: next }));
    };

  const fieldId = (name: string) => `${baseId}-${name}`;
  const errorId = (name: string) => `${baseId}-${name}-error`;
  const hintId = (name: string) => `${baseId}-${name}-hint`;

  const describedBy = (name: string, hasHint = false) =>
    [
      hasHint ? hintId(name) : null,
      errors[name as keyof FieldErrors] ? errorId(name) : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const inputClass = (name: string) =>
    cn(
      "w-full rounded-[var(--radius-control)] border bg-white px-3 py-2.5 text-base text-[var(--colour-ink)]",
      "placeholder:text-[var(--colour-muted)]/70 transition-colors duration-200",
      errors[name as keyof FieldErrors]
        ? "border-[var(--colour-orange-700)]"
        : "border-[var(--colour-line)] hover:border-[var(--colour-muted)]",
    );

  const labelClass = "text-sm font-medium text-[var(--colour-navy-900)]";

  return (
    <div
      id="enquiry"
      className={cn(
        "scroll-mt-28 rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-white",
        variant === "hero"
          ? "p-5 shadow-[0_28px_60px_-40px_rgba(7,24,39,0.75)] sm:p-6"
          : "p-5 sm:p-7",
        className,
      )}
    >
      <Heading className="text-[1.375rem] text-[var(--colour-navy-900)]">
        What can we help with?
      </Heading>
      <p className="mt-2 text-sm text-[var(--colour-muted)]">
        Leave your details and the business can contact you to discuss the job.
      </p>

      {showSummary ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-4 rounded-[var(--radius-control)] border border-[var(--colour-orange-700)] bg-[var(--colour-orange-100)] p-3"
        >
          <p className="flex items-center gap-2 text-sm font-medium text-[var(--colour-orange-700)]">
            <AlertCircle aria-hidden="true" className="size-4" />
            {`There are ${problemCount} problems with this enquiry`}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--colour-navy-900)]">
            {Object.entries(errors).map(([name, message]) => (
              <li key={name}>
                <a
                  href={`#${fieldId(name)}`}
                  className="underline underline-offset-2"
                >
                  {fieldLabels[name] ?? name}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form action={formAction} noValidate className="mt-5 flex flex-col gap-4">
        {/* Honeypot: display:none, unreachable by keyboard and by screen
            readers, still submitted by naive bots. */}
        <div hidden aria-hidden="true">
          <label htmlFor={fieldId("company")}>
            Company (leave this field empty)
          </label>
          <input
            id={fieldId("company")}
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={fieldId("service")} className={labelClass}>
            {fieldLabels.service} <RequiredMark />
          </label>
          <select
            id={fieldId("service")}
            name="service"
            required
            value={values.service}
            onChange={handleChange("service")}
            aria-describedby={describedBy("service")}
            aria-invalid={errors.service ? true : undefined}
            className={inputClass("service")}
          >
            <option value="" disabled>
              Select an option
            </option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
            <option value="other">Something else</option>
          </select>
          <FieldError id={errorId("service")} message={errors.service} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={fieldId("name")} className={labelClass}>
              {fieldLabels.name} <RequiredMark />
            </label>
            <input
              id={fieldId("name")}
              name="name"
              type="text"
              required
              autoComplete="name"
              value={values.name}
              onChange={handleChange("name")}
              aria-describedby={describedBy("name")}
              aria-invalid={errors.name ? true : undefined}
              className={inputClass("name")}
            />
            <FieldError id={errorId("name")} message={errors.name} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={fieldId("phone")} className={labelClass}>
              {fieldLabels.phone} <RequiredMark />
            </label>
            <input
              id={fieldId("phone")}
              name="phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              value={values.phone}
              onChange={handleChange("phone")}
              aria-describedby={describedBy("phone", true)}
              aria-invalid={errors.phone ? true : undefined}
              className={inputClass("phone")}
            />
            <p id={hintId("phone")} className="text-xs text-[var(--colour-muted)]">
              Landline or mobile.
            </p>
            <FieldError id={errorId("phone")} message={errors.phone} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={fieldId("suburb")} className={labelClass}>
              {fieldLabels.suburb} <RequiredMark />
            </label>
            <input
              id={fieldId("suburb")}
              name="suburb"
              type="text"
              required
              autoComplete="address-level2"
              value={values.suburb}
              onChange={handleChange("suburb")}
              aria-describedby={describedBy("suburb")}
              aria-invalid={errors.suburb ? true : undefined}
              className={inputClass("suburb")}
            />
            <FieldError id={errorId("suburb")} message={errors.suburb} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={fieldId("preferredTime")} className={labelClass}>
              {fieldLabels.preferredTime}{" "}
              <span className="font-normal text-[var(--colour-muted)]">
                (optional)
              </span>
            </label>
            <select
              id={fieldId("preferredTime")}
              name="preferredTime"
              value={values.preferredTime}
              onChange={handleChange("preferredTime")}
              className={inputClass("preferredTime")}
            >
              {preferredTimeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {variant === "page" ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={fieldId("email")} className={labelClass}>
              {fieldLabels.email}{" "}
              <span className="font-normal text-[var(--colour-muted)]">
                (optional)
              </span>
            </label>
            <input
              id={fieldId("email")}
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange("email")}
              aria-describedby={describedBy("email")}
              aria-invalid={errors.email ? true : undefined}
              className={inputClass("email")}
            />
            <FieldError id={errorId("email")} message={errors.email} />
          </div>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <label htmlFor={fieldId("message")} className={labelClass}>
            {fieldLabels.message}{" "}
            <span className="font-normal text-[var(--colour-muted)]">
              (optional)
            </span>
          </label>
          <textarea
            id={fieldId("message")}
            name="message"
            rows={variant === "hero" ? 3 : 5}
            maxLength={1200}
            value={values.message}
            onChange={handleChange("message")}
            aria-describedby={describedBy("message")}
            aria-invalid={errors.message ? true : undefined}
            className={cn(inputClass("message"), "resize-y")}
          />
          <FieldError id={errorId("message")} message={errors.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-start gap-2.5">
            <input
              id={fieldId("privacy")}
              name="privacy"
              type="checkbox"
              required
              checked={values.privacy}
              onChange={handleChange("privacy")}
              aria-describedby={describedBy("privacy")}
              aria-invalid={errors.privacy ? true : undefined}
              className="mt-1 size-5 shrink-0 accent-[var(--colour-aqua-700)]"
            />
            <label
              htmlFor={fieldId("privacy")}
              className="text-sm text-[var(--colour-navy-900)]"
            >
              I understand my details will be used only to respond to this enquiry.{" "}
              <RequiredMark />
            </label>
          </div>
          <FieldError id={errorId("privacy")} message={errors.privacy} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] px-5 py-3",
            "bg-[var(--colour-navy-900)] text-base font-medium text-white",
            "transition-colors duration-200 hover:bg-[var(--colour-navy-800)]",
            "disabled:cursor-not-allowed disabled:opacity-70",
          )}
        >
          {pending ? (
            <Loader2 aria-hidden="true" className="size-[18px] animate-spin" />
          ) : (
            <Send aria-hidden="true" className="size-[18px]" />
          )}
          {pending ? "Sending…" : "Request a callback"}
        </button>

        <p className="text-xs text-[var(--colour-muted)]">
          Your details are used only to respond to this enquiry.
        </p>

        <div
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className={cn(
            state.status === "idle" || state.status === "invalid"
              ? "sr-only"
              : "flex items-start gap-2 rounded-[var(--radius-control)] border p-3 text-sm",
            state.status === "demo" &&
              "border-[var(--colour-line)] bg-[var(--colour-cream-50)] text-[var(--colour-navy-900)]",
            state.status === "sent" &&
              "border-[var(--colour-success)] bg-[var(--colour-aqua-100)] text-[var(--colour-navy-900)]",
            state.status === "error" &&
              "border-[var(--colour-orange-700)] bg-[var(--colour-orange-100)] text-[var(--colour-navy-900)]",
          )}
        >
          {state.status !== "idle" && state.status !== "invalid" ? (
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          ) : null}
          <span>{state.message}</span>
        </div>
      </form>
    </div>
  );
}

function RequiredMark() {
  return (
    <span className="text-[var(--colour-orange-700)]">
      <span aria-hidden="true">*</span>
      <span className="sr-only">(required)</span>
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="flex items-start gap-1.5 text-sm text-[var(--colour-orange-700)]"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}
