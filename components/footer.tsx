import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="blueprint-section mt-auto">
      <div className="page-column px-5 py-12 text-center text-sm leading-7 text-muted-foreground sm:py-14">
        <p>{site.footer.credit} <Link href="/" className="font-semibold text-foreground hover:underline underline-offset-4">{site.wordmark}</Link></p>
        <p>© {new Date().getFullYear()} {site.footer.copyright}</p>
      </div>
    </footer>
  );
}
