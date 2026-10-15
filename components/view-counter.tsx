"use client";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { site } from "@/data/site";
import { getViewCount } from "@/lib/view-count";
export function ViewCounter({ enabled }: { enabled: boolean }) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    void getViewCount().then((value) => { if (active) setCount(value); });
    return () => { active = false; };
  }, [enabled]);
  if (count === null) return null;
  return <span aria-label={`${site.views.label}: ${count}`} className="absolute top-3 right-5 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground sm:top-7 sm:right-8"><Eye aria-hidden="true" className="size-4" />{count.toLocaleString("en-US")}</span>;
}
