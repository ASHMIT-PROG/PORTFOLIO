"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { navigationLabels } from "@/data/navigation";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="theme-toggle text-foreground">
      <Sun aria-hidden="true" className="theme-icon theme-sun" />
      <Moon aria-hidden="true" className="theme-icon theme-moon" />
      <span className="sr-only hidden dark:block">{navigationLabels.light}</span>
      <span className="sr-only block dark:hidden">{navigationLabels.dark}</span>
    </Button>
  );
}
