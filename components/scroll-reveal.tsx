"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ScrollRevealProps = HTMLMotionProps<"div"> & {
  /** Delay in seconds before the animation starts */
  delay?: number;
  /** Direction the element slides in from */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** How far the element travels (in px) */
  distance?: number;
  /** Duration in seconds */
  duration?: number;
  /** How much of the element must be visible to trigger (0–1) */
  threshold?: number;
  /** If true, animate only on the first entry into the viewport */
  once?: boolean;
};

const directionMap = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
} as const;

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  distance = 32,
  duration = 0.5,
  threshold = 0.15,
  once = true,
  className,
  ...rest
}: ScrollRevealProps) {
  const reduce = useReducedMotion();

  const d = directionMap[direction];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: d.x * distance, y: d.y * distance }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration: reduce ? 0 : duration,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("scroll-reveal", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** A stagger container — wraps children and reveals them one by one */
export function StaggerReveal({
  children,
  stagger = 0.08,
  className,
  ...rest
}: HTMLMotionProps<"div"> & { stagger?: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        visible: { transition: { staggerChildren: reduce ? 0 : stagger } },
      }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Individual stagger child — must be used inside StaggerReveal */
export function StaggerItem({
  children,
  className,
  ...rest
}: HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={cn("stagger-item", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
