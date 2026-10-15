import Link from "next/link";
import { site } from "@/data/site";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <div className="page-column px-5 py-24 sm:px-6"><h1 className="section-heading">{site.notFound.title}</h1><p className="my-6 text-muted-foreground">{site.notFound.text}</p><Button asChild><Link href="/">{site.notFound.action}</Link></Button></div>;
}
