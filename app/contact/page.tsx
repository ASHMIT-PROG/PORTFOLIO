import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { site } from "@/data/site";
import { ContactForm } from "@/components/contact-form";
import { PageHeading } from "@/components/page-heading";
import { Section } from "@/components/section";
export const metadata: Metadata = { title: site.sections.contact, description: site.contact.description, alternates: { canonical: "/contact" } };
export default function ContactPage() {
  return <><PageHeading title={site.contact.title} description={site.contact.description} /><div className="page-column px-5 py-8 sm:px-6"><p className="mb-3 text-sm text-muted-foreground">{site.contact.emailLabel}</p><a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-3 text-base underline decoration-border underline-offset-8 sm:text-xl"><Mail aria-hidden="true" className="size-5" />{site.email}<ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" /></a></div><Section title={site.contact.formTitle} id="message"><div className="max-w-2xl py-3"><ContactForm emailEnabled={Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)} /></div></Section></>;
}
