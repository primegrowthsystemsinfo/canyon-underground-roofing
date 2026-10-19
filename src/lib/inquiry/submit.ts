import { SITE } from "../../site.config";
import type { InquiryData } from "./schema";

export type SubmitOutcome =
  | { ok: true; delivery: "provider_accepted" | "provider_accepted_pending_activation" }
  | { ok: false; message: string };

const FAIL_MSG = `We couldn't send your request just now. Please try again, or call ${SITE.phoneDisplay} or email ${SITE.ownerEmail}.`;

function stamp(d: Date) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", dateStyle: "full", timeStyle: "short" }).format(d) + " (Pacific)";
}

/** Sends the inquiry straight from the visitor's browser to FormSubmit, which emails SITE.ownerEmail. */
export async function sendInquiry(data: InquiryData, honey: string): Promise<SubmitOutcome> {
  const payload: Record<string, string> = {
    Business: SITE.name,
    Submitted: stamp(new Date()),
    "Customer name": data.name,
    Email: data.email,
    Phone: data.phone || "(not provided)",
    "Preferred contact": data.contactPref || "(no preference)",
    "Requested service": data.service,
    "Roof type": data.roofType || "(not provided)",
    "Property address / ZIP": data.address || "(not provided)",
    Timeline: data.timeline || "(not provided)",
    "Insurance claim involved": data.insurance || "(not provided)",
    "Project details": data.details,
    _subject: `New Free Quote Request \u2014 ${SITE.name}`,
    _replyto: data.email,
    _template: "table",
    _captcha: "false",
    _honey: honey,
  };
  if (SITE.web3formsKey) {
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: SITE.web3formsKey,
          subject: payload._subject,
          from_name: data.name,
          email: data.email,
          botcheck: honey ? "1" : "",
          ...Object.fromEntries(Object.entries(payload).filter(([k]) => !k.startsWith("_"))),
        }),
        signal: AbortSignal.timeout(30000),
      });
      const j = (await r.json().catch(() => ({}))) as { success?: boolean };
      if (r.ok && j.success) return { ok: true, delivery: "provider_accepted" };
    } catch { /* fall through to the error below */ }
    return { ok: false, message: FAIL_MSG };
  }
  try {
    const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(SITE.ownerEmail)}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(150000),
    });
    const raw = await r.text();
    let parsed: { success?: string | boolean; message?: string } = {};
    try { parsed = JSON.parse(raw); } catch { /* not JSON */ }
    const success = parsed.success === true || parsed.success === "true";
    if (r.ok && success) return { ok: true, delivery: "provider_accepted" };
    if (r.ok && /activat/i.test(parsed.message ?? "")) return { ok: true, delivery: "provider_accepted_pending_activation" };
    return { ok: false, message: FAIL_MSG };
  } catch {
    return { ok: false, message: FAIL_MSG };
  }
}
