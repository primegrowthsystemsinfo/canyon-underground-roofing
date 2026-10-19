import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import {
  CONTACT_PREFS,
  INSURANCE,
  ROOF_TYPES,
  SERVICES,
  TIMELINES,
  inquirySchema,
  type InquiryInput,
  type InquiryResponse,
} from "../../lib/inquiry/schema";
import { SITE } from "../../site.config";
import { sendInquiry } from "../../lib/inquiry/submit";

type Values = {
  name: string;
  email: string;
  phone: string;
  service: string;
  roofType: string;
  address: string;
  timeline: string;
  insurance: string;
  contactPref: string;
  details: string;
  company: string;
};

const EMPTY: Values = {
  name: "",
  email: "",
  phone: "",
  service: "",
  roofType: "",
  address: "",
  timeline: "",
  insurance: "",
  contactPref: "",
  details: "",
  company: "",
};

type Status = "idle" | "submitting" | "success" | "error";

type OkResponse = Extract<InquiryResponse, { ok: true }>;

function validate(values: Values) {
  // The hidden bot trap is checked separately (never block a real person on it).
  const r = inquirySchema.safeParse({ ...values, company: "" } as InquiryInput);
  const errors: Partial<Record<keyof Values, string>> = {};
  if (!r.success) {
    for (const issue of r.error.issues) {
      const k = String(issue.path[0] ?? "") as keyof Values;
      if (k && !errors[k]) errors[k] = issue.message;
    }
  }
  return errors;
}

export function QuoteForm() {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState<string>("");
  const [result, setResult] = useState<Extract<InquiryResponse, { ok: true }> | null>(null);
  const startedAt = useRef<number>(0);
  const inflight = useRef(false);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    const v = e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
    if (touched[k]) setErrors(validate({ ...values, [k]: v }));
  };
  const blur = (k: keyof Values) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inflight.current) return; // duplicate-click guard
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, email: true, phone: true, service: true, details: true });
    const firstBad = (Object.keys(errs) as (keyof Values)[])[0];
    if (firstBad) {
      document.getElementById(`${uid}-${firstBad}`)?.focus();
      return;
    }
    inflight.current = true;
    setStatus("submitting");
    setServerMsg("");
    try {
      if (Date.now() - startedAt.current < 2500) {
        setServerMsg("Please take a moment to review your details, then submit again.");
        setStatus("error");
        return;
      }
      const parsed = inquirySchema.parse({ ...values, company: "" } as InquiryInput);
      // Bots fill the hidden field: pretend it worked, send nothing.
      const out = values.company.trim()
        ? ({ ok: true, delivery: "provider_accepted" } as const)
        : await sendInquiry(parsed, "");
      if (out.ok) {
        setResult({ ok: true, id: null, provider: "formsubmit", delivery: out.delivery, message: "" });
        setStatus("success");
      } else {
        setServerMsg(out.message);
        setStatus("error");
      }
    } catch {
      setServerMsg("We couldn't reach the server. Check your connection and try again; your answers are still here.");
      setStatus("error");
    } finally {
      inflight.current = false;
      requestAnimationFrame(() => {
        alertRef.current?.focus({ preventScroll: true });
        alertRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    }
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setResult(null);
    setStatus("idle");
    startedAt.current = Date.now();
  }

  const id = (k: keyof Values) => `${uid}-${k}`;
  const err = (k: keyof Values) => (touched[k] || status === "error" ? errors[k] : undefined);
  const describedBy = (k: keyof Values, hint?: boolean) =>
    [err(k) ? `${id(k)}-err` : null, hint ? `${id(k)}-hint` : null].filter(Boolean).join(" ") || undefined;

  if (status === "success" && result) {
    const pending = result.delivery === "provider_accepted_pending_activation";
    const storedOnly = result.delivery === "stored_only";
    return (
      <div
        ref={alertRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="rounded-2xl p-8 outline-none md:p-10"
        style={{ background: "#fff", border: "1px solid var(--line)" }}
      >
        <p className="eyebrow">Request received</p>
        <h3 className="font-display mt-3 text-4xl">Thanks, {values.name.split(" ")[0] || "neighbor"}.</h3>
        <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--mute)" }}>
          {storedOnly
            ? "Your request was saved on our end, but the email notification didn't go through. Please call us to confirm so nothing slips."
            : pending
              ? "Your request was accepted by our form service and will be delivered to the office. For anything urgent, call us directly."
              : "Your request was accepted and is on its way to the office. We'll reach out by your preferred method, usually within one business day."}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          <a href={`tel:${SITE.phoneE164}`} className="btn-call">Call {SITE.phoneDisplay}</a>
          <button type="button" onClick={reset} className="btn-call">Send another request</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby="quote-heading" className="grid gap-5 rounded-2xl p-6 md:p-8" style={{ background: "#fff", border: "1px solid var(--line)" }}>
      {status === "error" && (
        <div
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl p-4 text-sm font-semibold outline-none"
          style={{ background: "rgba(184,67,46,0.08)", color: "var(--red-2)", border: "1px solid rgba(184,67,46,0.3)" }}
        >
          {serverMsg || "Please fix the highlighted fields."} Your answers have been kept.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={id("name")}>Full name <span aria-hidden="true" style={{ color: "var(--red)" }}>*</span></label>
          <input id={id("name")} name="name" autoComplete="name" required value={values.name} onChange={set("name")} onBlur={blur("name")} aria-invalid={!!err("name")} aria-describedby={describedBy("name")} />
          {err("name") && <p id={`${id("name")}-err`} className="error">{err("name")}</p>}
        </div>
        <div className="field">
          <label htmlFor={id("email")}>Email <span aria-hidden="true" style={{ color: "var(--red)" }}>*</span></label>
          <input id={id("email")} name="email" type="email" inputMode="email" autoComplete="email" required value={values.email} onChange={set("email")} onBlur={blur("email")} aria-invalid={!!err("email")} aria-describedby={describedBy("email")} />
          {err("email") && <p id={`${id("email")}-err`} className="error">{err("email")}</p>}
        </div>
        <div className="field">
          <label htmlFor={id("phone")}>Phone <span className="hint">(optional)</span></label>
          <input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} onBlur={blur("phone")} aria-invalid={!!err("phone")} aria-describedby={describedBy("phone")} />
          {err("phone") && <p id={`${id("phone")}-err`} className="error">{err("phone")}</p>}
        </div>
        <div className="field">
          <label htmlFor={id("service")}>What do you need? <span aria-hidden="true" style={{ color: "var(--red)" }}>*</span></label>
          <select id={id("service")} name="service" required value={values.service} onChange={set("service")} onBlur={blur("service")} aria-invalid={!!err("service")} aria-describedby={describedBy("service")}>
            <option value="">Choose a service</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {err("service") && <p id={`${id("service")}-err`} className="error">{err("service")}</p>}
        </div>
        <div className="field">
          <label htmlFor={id("roofType")}>Current roof type</label>
          <select id={id("roofType")} name="roofType" value={values.roofType} onChange={set("roofType")}>
            <option value="">Select if known</option>
            {ROOF_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor={id("address")}>Property address or ZIP</label>
          <input id={id("address")} name="address" autoComplete="street-address" value={values.address} onChange={set("address")} aria-describedby={describedBy("address", true)} />
          <p id={`${id("address")}-hint`} className="hint">Helps us schedule the right crew.</p>
        </div>
        <div className="field">
          <label htmlFor={id("timeline")}>Timeline</label>
          <select id={id("timeline")} name="timeline" value={values.timeline} onChange={set("timeline")}>
            <option value="">Select one</option>
            {TIMELINES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor={id("insurance")}>Insurance claim involved?</label>
          <select id={id("insurance")} name="insurance" value={values.insurance} onChange={set("insurance")}>
            <option value="">Select one</option>
            {INSURANCE.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor={id("details")}>Tell us about the project <span aria-hidden="true" style={{ color: "var(--red)" }}>*</span></label>
        <textarea id={id("details")} name="details" required value={values.details} onChange={set("details")} onBlur={blur("details")} aria-invalid={!!err("details")} aria-describedby={describedBy("details", true)} placeholder="Leaks, age of the roof, storm damage, what you've noticed..." />
        <p id={`${id("details")}-hint`} className="hint">A few sentences is plenty. Photos can be shared once we reach out.</p>
        {err("details") && <p id={`${id("details")}-err`} className="error">{err("details")}</p>}
      </div>

      <fieldset className="field">
        <legend className="text-sm font-bold">How should we reach you?</legend>
        <div className="mt-1 flex flex-wrap gap-x-6 gap-y-2">
          {CONTACT_PREFS.map((c) => (
            <label key={c} className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input type="radio" name="contactPref" value={c} checked={values.contactPref === c} onChange={set("contactPref")} className="h-4 w-4 accent-[var(--red)]" />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Honeypot: hidden from humans, filled by bots */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={id("company")}>Leave this field empty</label>
        <input id={id("company")} name="trap_field_x7" type="text" tabIndex={-1} autoComplete="off" autoCorrect="off" autoCapitalize="off" data-lpignore="true" data-1p-ignore="true" data-form-type="other" value={values.company} onChange={set("company")} />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <button type="submit" className="btn-quote on-light" aria-busy={status === "submitting"} disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
              Sending...
            </>
          ) : (
            "Get My Free Quote"
          )}
        </button>
        {status === "submitting" ? (
          <p className="text-xs" role="status" style={{ color: "var(--mute)" }}>Sending your request. This can take up to a minute, please keep this page open.</p>
        ) : null}
        <p className="text-xs" style={{ color: "var(--mute)" }}>No obligation. Your details go only to Canyon Underground.</p>
      </div>
    </form>
  );
}
