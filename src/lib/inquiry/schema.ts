import { z } from "zod";

// Shared client + server validation. Keep in sync with the form fields.
export const SERVICES = [
  "Roof replacement",
  "Roof repair / leak",
  "Metal roofing",
  "Gutters & drip edge",
  "Roof inspection",
  "Storm or insurance claim",
  "Not sure yet",
] as const;

export const ROOF_TYPES = [
  "Asphalt shingle",
  "Concrete or clay tile",
  "Metal",
  "Flat / foam",
  "Not sure",
] as const;

export const TIMELINES = [
  "As soon as possible",
  "Within a month",
  "1 to 3 months",
  "Just planning",
] as const;

export const INSURANCE = ["Yes", "No", "Not sure"] as const;
export const CONTACT_PREFS = ["Phone call", "Text message", "Email"] as const;

const trimmed = (max: number) => z.string().trim().max(max);

export const inquirySchema = z.object({
  name: trimmed(120).min(2, "Please enter your name."),
  email: trimmed(200).pipe(z.email("Please enter a valid email address.")),
  phone: trimmed(40)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || v.replace(/\D/g, "").length >= 10, "Please enter a 10-digit phone number."),
  service: z.enum(SERVICES, { message: "Please choose a service." }),
  roofType: z.enum(ROOF_TYPES).optional().or(z.literal("")),
  address: trimmed(200).optional().or(z.literal("")),
  timeline: z.enum(TIMELINES).optional().or(z.literal("")),
  insurance: z.enum(INSURANCE).optional().or(z.literal("")),
  contactPref: z.enum(CONTACT_PREFS).optional().or(z.literal("")),
  details: trimmed(3000).min(10, "Tell us a little about the project (at least 10 characters)."),
  // Anti-spam: honeypot must stay empty; startedAt is set when the form mounts.
  company: z.string().max(0, "Spam check failed.").optional().or(z.literal("")),
  startedAt: z.number().int().optional(),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryData = z.output<typeof inquirySchema>;

export type InquiryResponse =
  | {
      ok: true;
      id: number | null;
      // What we can actually prove about delivery at response time.
      delivery: "provider_accepted" | "provider_accepted_pending_activation" | "stored_only";
      provider: "resend" | "formsubmit";
      message: string;
      // Present only when the server-side relay could not reach the provider
      // (e.g. shared-egress rate limiting). The browser retries the relay
      // directly, then reports the outcome to /api/inquiry-status.
      fallback?: { url: string; payload: Record<string, string> };
    }
  | { ok: false; code: "validation" | "rate_limited" | "spam" | "delivery_failed" | "server"; message: string; fieldErrors?: Record<string, string>; fallback?: { url: string; payload: Record<string, string> } };
