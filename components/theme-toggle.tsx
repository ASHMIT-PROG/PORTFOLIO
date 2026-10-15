"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { navigationLabels } from "@/data/navigation";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="text-foreground">
      <Sun aria-hidden="true" className="hidden dark:block" />
      <Moon aria-hidden="true" className="block dark:hidden" />
      <span className="sr-only hidden dark:block">{navigationLabels.light}</span>
      <span className="sr-only block dark:hidden">{navigationLabels.dark}</span>
    </Button>
  );
}
