export function PageHeading({ title, description }: { title: string; description: string }) {
  return <div className="border-b border-dashed border-border"><div className="page-column px-5 py-10 sm:px-6 sm:py-14"><h1 className="font-display text-5xl tracking-tight sm:text-6xl">{title}</h1><p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p></div></div>;
}
