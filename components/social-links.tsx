import { ArrowUpRight, Mail, Paperclip } from "lucide-react";
import { SiX, SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { socials } from "@/data/socials";

const icons = { github: SiGithub, linkedin: FaLinkedinIn, x: SiX, mail: Mail, resume: Paperclip };
export function SocialLinks() {
  return <div className="social-grid">{socials.map((social) => {
    const Icon = icons[social.icon];
    return <a key={social.label} href={social.href} target={social.icon === "mail" ? undefined : "_blank"} rel={social.icon === "mail" ? undefined : "noopener noreferrer"} className="group flex min-w-0 items-center gap-2.5 px-3 py-3 text-sm transition-colors hover:bg-accent sm:text-base">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-muted/40"><Icon aria-hidden="true" className="size-[22px]" /></span><span>{social.label}</span><ArrowUpRight aria-hidden="true" className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>;
  })}</div>;
}
