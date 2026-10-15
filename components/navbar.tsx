"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { moreNavigation, navigation, navigationLabels, type NavigationItem } from "@/data/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function NavLink({ item, active, mobile = false, ...props }: { item: NavigationItem; active: boolean; mobile?: boolean } & Omit<React.ComponentProps<typeof Link>, "href">) {
  const reduceMotion = useReducedMotion();
  return (
    <Link {...props} href={item.href} aria-current={active ? "location" : undefined} className={cn("nav-link", mobile && "mobile-nav-link", active && "is-active")}>
      <span className="nav-label">{item.label}</span>
      {active && (mobile || reduceMotion
        ? <span aria-hidden="true" className="nav-active-dot" />
        : <motion.span aria-hidden="true" className="nav-active-dot" layoutId="active-page" initial={false} transition={{ type: "spring", stiffness: 450, damping: 36 }} />)}
    </Link>
  );
}

export function Navbar() {
  const navigationId = useId();
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState(navigation[0].href);
  const pendingMobileHref = useRef<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;

    function updateActiveSection() {
      // Match the anchor offset, with room for the section reveal animation.
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 40;
      let current = navigation[0].href;
      for (const item of navigation) {
        const section = document.getElementById(item.href.split("#")[1]);
        if (section && section.getBoundingClientRect().top <= offset) current = item.href;
      }
      setActiveHref(current);
    }

    const frame = requestAnimationFrame(updateActiveSection);
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  return (
    <LayoutGroup id={navigationId}>
    <motion.header layoutRoot className="site-header sticky top-0 z-40 border-b border-dashed border-border bg-background/90 backdrop-blur-xl">
      <div className="page-column flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <Link href={navigation[0].href} className="font-display text-[38px] leading-none tracking-tight" aria-label={`${site.wordmark} — ${navigation[0].label}`}>
          {site.wordmark}
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <nav aria-label={navigationLabels.main} className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => <NavLink key={item.href} item={item} active={pathname === "/" && activeHref === item.href} />)}
            <DropdownMenu>
              <DropdownMenuTrigger className="group nav-link flex items-center gap-2 data-[state=open]:text-foreground">
                <span className="nav-label">{navigationLabels.more}</span><ChevronDown aria-hidden="true" className="nav-chevron relative size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {moreNavigation.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}>
                      {item.label}{item.external && <ArrowUpRight aria-hidden="true" className="ml-auto size-4" />}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={navigationLabels.open}><Menu aria-hidden="true" /></Button>
              </SheetTrigger>
              <SheetContent onCloseAutoFocus={() => {
                const href = pendingMobileHref.current;
                pendingMobileHref.current = null;
                if (!href) return;
                // Wait until the sheet releases its scroll lock and restores focus.
                requestAnimationFrame(() => {
                  const section = document.getElementById(href.split("#")[1]);
                  if (!section) return;
                  window.history.pushState(null, "", href);
                  section.scrollIntoView({ block: "start" });
                });
              }}>
                <div className="flex items-center justify-between">
                  <SheetTitle className="font-display text-4xl">{site.wordmark}</SheetTitle>
                  <SheetClose asChild><Button variant="ghost" size="icon" aria-label={navigationLabels.close}><X aria-hidden="true" /></Button></SheetClose>
                </div>
                <SheetDescription className="sr-only">{navigationLabels.description}</SheetDescription>
                <nav aria-label={navigationLabels.mobile} className="mt-8 flex flex-col gap-2">
                  {navigation.map((item) => <SheetClose asChild key={item.href}><NavLink item={item} active={pathname === "/" && activeHref === item.href} mobile onNavigate={(event) => {
                    if (pathname !== "/") return;
                    event.preventDefault();
                    pendingMobileHref.current = item.href;
                  }} /></SheetClose>)}
                  <div className="my-4 border-t border-dashed border-border" />
                  {moreNavigation.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined} className="flex min-h-12 items-center justify-between rounded-md px-3 text-muted-foreground hover:bg-accent hover:text-foreground">
                        {item.label}<ArrowUpRight aria-hidden="true" className="size-4" />
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
    </LayoutGroup>
  );
}
