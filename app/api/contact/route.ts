import { Resend } from "resend";
import { site } from "@/data/site";
import { contactSchema, contactMailto } from "@/lib/contact-schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { sameOrigin, readLimitedJson } from "@/lib/request";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ message: site.contact.failed }, { status: 403 });
  let input: unknown;
  try { input = await readLimitedJson(request); } catch { return Response.json({ message: site.contact.invalid }, { status: 400 }); }
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return Response.json({ message: site.contact.invalid }, { status: 400 });
  if (parsed.data.website) return Response.json({ ok: true });
  try {
    if (!await checkRateLimit(request, "contact", 5, 600)) return Response.json({ message: site.contact.rateLimited }, { status: 429, headers: { "Retry-After": "600" } });
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return Response.json({ fallback: true, mailto: contactMailto(parsed.data) });
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({ from: process.env.RESEND_FROM_EMAIL, to: site.email, replyTo: parsed.data.email, subject: `${site.contact.subject} ${parsed.data.name}`, text: `${parsed.data.message}\n\nFrom: ${parsed.data.name}\nEmail: ${parsed.data.email}` });
    if (error) return Response.json({ message: site.contact.failed }, { status: 502 });
    return Response.json({ ok: true });
  } catch { return Response.json({ message: site.contact.failed }, { status: 503 }); }
}
