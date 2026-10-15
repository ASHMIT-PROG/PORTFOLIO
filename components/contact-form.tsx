"use client";
import { useState, useRef } from "react";
import { ArrowUpRight, ArrowRight, LoaderCircle } from "lucide-react";
import { site } from "@/data/site";
import { contactSchema, contactMailto } from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";

export function ContactForm({ emailEnabled }: { emailEnabled: boolean }) {
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(""); setDraft("");
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      const fields = Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]));
      setErrors(fields); setStatus(site.contact.invalid);
      const first = formRef.current?.elements.namedItem(Object.keys(fields)[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    setErrors({});
    if (!emailEnabled) { setDraft(contactMailto(parsed.data)); setStatus(site.contact.draftReady); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok) { setStatus(response.status === 429 ? site.contact.rateLimited : site.contact.failed); setDraft(contactMailto(parsed.data)); return; }
      if (result.fallback) { setDraft(contactMailto(parsed.data)); setStatus(site.contact.draftReady); }
      else { setStatus(site.contact.sent); formRef.current?.reset(); }
    } catch { setStatus(site.contact.failed); setDraft(contactMailto(parsed.data)); }
    finally { setBusy(false); }
  }
  return <form ref={formRef} onSubmit={submit} noValidate className="space-y-5">
    <div className="grid gap-5 sm:grid-cols-2">{(["name", "email"] as const).map((field) => <div key={field}><label htmlFor={field} className="mb-2 block text-sm">{site.contact[field]}</label><input id={field} name={field} type={field === "email" ? "email" : "text"} autoComplete={field} required maxLength={field === "name" ? 80 : 254} placeholder={field === "name" ? site.contact.namePlaceholder : site.contact.emailPlaceholder} className="form-input" aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `${field}-error` : undefined} />{errors[field] && <p id={`${field}-error`} className="mt-2 text-xs text-red-500 dark:text-red-300">{errors[field]}</p>}</div>)}</div>
    <div><label htmlFor="message" className="mb-2 block text-sm">{site.contact.message}</label><textarea id="message" name="message" rows={6} required maxLength={5000} placeholder={site.contact.messagePlaceholder} className="form-input resize-y" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} />{errors.message && <p id="message-error" className="mt-2 text-xs text-red-500 dark:text-red-300">{errors.message}</p>}</div>
    <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"><label htmlFor="website">{site.contact.website}</label><input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    {!emailEnabled && <p className="text-sm text-muted-foreground">{site.contact.fallback}</p>}
    <Button type="submit" disabled={busy} className="rounded-full px-6">{busy ? site.contact.sending : emailEnabled ? site.contact.send : site.contact.prepareDraft}{busy ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <ArrowRight aria-hidden="true" />}</Button>
    <p role="status" aria-live="polite" className="text-sm leading-6 text-muted-foreground">{status}</p>
    {draft && <a href={draft} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4">{site.contact.mailto}<ArrowUpRight aria-hidden="true" className="size-4" /></a>}
  </form>;
}
