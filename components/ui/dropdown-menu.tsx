"use client";

import * as React from "react";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownPrimitive.Root;
const DropdownMenuTrigger = DropdownPrimitive.Trigger;

function DropdownMenuContent({ className, sideOffset = 10, ...props }: React.ComponentProps<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content sideOffset={sideOffset} className={cn("nav-dropdown z-50 min-w-44 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl outline-none", className)} {...props} />
    </DropdownPrimitive.Portal>
  );
}

function DropdownMenuItem({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Item>) {
  return <DropdownPrimitive.Item className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground outline-none transition-colors duration-150 focus:bg-accent focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props} />;
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
