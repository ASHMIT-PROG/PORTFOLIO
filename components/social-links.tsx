import { socials } from "@/data/socials";
import { hasPublicAsset } from "@/lib/assets";
import { ContactLinks } from "@/components/contact-links";

export async function SocialLinks() {
  const resume = socials.find((social) => social.icon === "resume");
  const localResume = Boolean(resume?.href.startsWith("/") && !resume.href.startsWith("//"));
  const resumeAvailable = Boolean(resume && (localResume ? await hasPublicAsset(resume.href) : /^https?:\/\//.test(resume.href)));
  return <ContactLinks items={socials} resumeAvailable={resumeAvailable} resumeDownloadable={localResume && resumeAvailable} />;
}
