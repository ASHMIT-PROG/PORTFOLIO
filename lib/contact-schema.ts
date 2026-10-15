import { z } from "zod";
import { site } from "@/data/site";
export const contactSchema = z.object({
  name: z.string().trim().min(2, site.contact.invalidName).max(80, site.contact.invalidName).refine((value) => !/[\r\n]/.test(value), site.contact.invalidName),
  email: z.string().trim().pipe(z.email(site.contact.invalidEmail).max(254, site.contact.invalidEmail)),
  message: z.string().trim().min(10, site.contact.invalidMessage).max(5000, site.contact.invalidMessage),
  website: z.string().max(200).optional().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;
export function contactMailto(data: Pick<ContactInput, "name" | "email" | "message">) {
  const subject = encodeURIComponent(`${site.contact.subject} ${data.name}`);
  const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`);
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}
