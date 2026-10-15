"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SiPython, SiFastapi, SiNodedotjs, SiPytorch, SiTensorflow } from "react-icons/si";
import { FaJava } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { techCategories, techstack, type TechCategory } from "@/data/techstack";
import { site } from "@/data/site";
import { Section } from "@/components/section";

const icons: Record<string, IconType> = { python: SiPython, java: FaJava, fastapi: SiFastapi, node: SiNodedotjs, pytorch: SiPytorch, tensorflow: SiTensorflow };
export function TechStack() {
  const [filter, setFilter] = useState<TechCategory>("All");
  const reduce = useReducedMotion();
  return <Section title={site.sections.tech} id="tech-stack" action={<div role="group" aria-label={site.tech.filters} className="flex flex-wrap gap-1">{techCategories.map((category) => <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)} className="filter-button">{category}</button>)}</div>} contentClassName="min-h-44 sm:min-h-48">
    <p className="mb-4 font-mono text-[10px] text-muted-foreground">{site.tech.hint}</p><span className="sr-only">{site.tech.instructions}</span>
    <motion.div layout={!reduce} className="flex flex-wrap gap-2.5"><AnimatePresence initial={false} mode="popLayout">{techstack.filter((tech) => filter === "All" || tech.category === filter).map((tech) => {
      const Icon = icons[tech.icon];
      return <motion.button key={tech.name} type="button" layout={!reduce} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={reduce ? undefined : { y: -4, rotate: -2 }} whileTap={reduce ? undefined : { scale: 0.92, rotate: 3 }} transition={{ duration: reduce ? 0 : 0.18 }} className="tech-chip"><Icon aria-hidden="true" className="size-[18px]" />{tech.name}</motion.button>;
    })}</AnimatePresence></motion.div>
  </Section>;
}
