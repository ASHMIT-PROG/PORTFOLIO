import { cn } from "@/lib/utils";

export function Section({ title, id, children, className, action, contentClassName }: { title?: string; id?: string; children: React.ReactNode; className?: string; action?: React.ReactNode; contentClassName?: string }) {
  return (
    <section id={id} aria-labelledby={title && id ? `${id}-heading` : undefined} className={cn("blueprint-section", className)}>
      {title && <div className="border-b border-dashed border-border"><div className="page-column flex flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-6"><h2 id={id ? `${id}-heading` : undefined} className="section-heading">{title}</h2>{action}</div></div>}
      <div className={cn("page-column px-5 py-6 sm:px-6", contentClassName)}>{children}</div>
    </section>
  );
}
