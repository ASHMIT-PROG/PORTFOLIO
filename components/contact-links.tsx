"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Download, FileText, Mail, Paperclip, X } from "lucide-react";
import { SiX, SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import type { ContactSocial } from "@/data/socials";
import { FallbackImage } from "@/components/fallback-image";
import { copyContactEmail, positionContactPreview } from "@/lib/contact-preview";
import { GitHubProfilePreview } from "@/components/contact-profile-preview";

const icons = { github: SiGithub, linkedin: FaLinkedinIn, x: SiX, mail: Mail, resume: Paperclip };
const CLOSE_DELAY = 180;
const motionSettings = { enter: 0.32, exit: 0.18, stagger: 0.035, ease: [0.22, 1, 0.36, 1] as const };
const subscribe = () => () => {};

function EmailCopy({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current); };
  }, []);

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    const copied = await copyContactEmail(email, navigator.clipboard);
    if (!mounted.current) return;
    if (copied) {
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("failed");
    }
  }

  return <div className="contact-copy">
    <button type="button" className="contact-secondary-action" onClick={copy}>
      {status === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {status === "copied" ? "Email copied" : "Copy email"}
    </button>
    <p role="status" className="contact-copy-status">{status === "copied" ? "Copied to clipboard." : status === "failed" ? "Copy unavailable. Select the email address above and copy it manually." : ""}</p>
  </div>;
}

function ContactPreviewContent({ item, titleId, resumeAvailable, resumeDownloadable }: { item: ContactSocial; titleId: string; resumeAvailable: boolean; resumeDownloadable: boolean }) {
  const { preview } = item;
  const Icon = icons[item.icon];
  const unavailable = item.icon === "resume" && !resumeAvailable;
  if (!preview) return null;
  if (item.icon === "github") return <GitHubProfilePreview item={item} titleId={titleId} />;
  return <>
    <div className="contact-preview-identity contact-stagger">
      {preview.avatar ? <FallbackImage {...preview.avatar} sizes="52px" className="contact-preview-avatar"><span>{preview.title.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span></FallbackImage>
        : <span className="contact-preview-avatar"><Icon aria-hidden="true" /></span>}
      <div className="min-w-0"><h3 id={titleId} className="contact-preview-title">{preview.title}</h3>{preview.handle && <p className="contact-preview-handle">{preview.handle}</p>}</div>
    </div>
    {preview.headline && <p className="contact-preview-headline contact-stagger">{preview.headline}</p>}
    {item.icon === "resume" && <div className="contact-document contact-stagger">
      <FileText aria-hidden="true" /><div><span className="contact-document-type">{preview.fileType}</span><p>{resumeAvailable ? "Ready to read" : "File not available yet"}</p></div>
      <span aria-hidden="true" className="contact-document-lines"><i /><i /><i /></span>
    </div>}
    <p className="contact-preview-bio contact-stagger">{unavailable ? "The resume is currently unavailable. Please reach out by email in the meantime." : preview.bio}</p>
    <div className="contact-preview-actions contact-stagger">
      {unavailable ? <button className="contact-primary-action" disabled>{preview.actionLabel}<ArrowUpRight aria-hidden="true" /></button>
        : <a className="contact-primary-action" href={item.href} target={item.icon === "mail" ? undefined : "_blank"} rel={item.icon === "mail" ? undefined : "noopener noreferrer"}>{preview.actionLabel}<ArrowUpRight aria-hidden="true" /></a>}
      {item.icon === "resume" && resumeDownloadable && <a href={item.href} download={preview.downloadName} className="contact-secondary-action"><Download aria-hidden="true" />Download Resume</a>}
      {item.icon === "mail" && <EmailCopy email={item.href.replace(/^mailto:/, "").split("?")[0]} />}
    </div>
  </>;
}

export function ContactLinks({ items, resumeAvailable, resumeDownloadable }: { items: ContactSocial[]; resumeAvailable: boolean; resumeDownloadable: boolean }) {
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false);
  const reduce = useReducedMotion();
  const id = useId();
  const [active, setActive] = useState<number | null>(null);
  const [position, setPosition] = useState<ReturnType<typeof positionContactPreview> | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusCard = useRef(false);
  const pointerInside = useRef(false);
  const suppressFocus = useRef(false);
  const [direction, setDirection] = useState(1);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const close = useCallback((restoreFocus = false) => {
    cancelClose();
    if (restoreFocus && active !== null) {
      suppressFocus.current = true;
      triggerRefs.current[active]?.focus({ preventScroll: true });
      suppressFocus.current = false;
    }
    setActive(null);
  }, [active, cancelClose]);

  function open(index: number, moveFocus = false) {
    cancelClose();
    if (!items[index].preview) { close(); return; }
    if (active !== null && active !== index) setDirection(index > active ? 1 : -1);
    focusCard.current = moveFocus;
    setActive(index);
    if (moveFocus && index === active) card.current?.focus({ preventScroll: true });
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (pointerInside.current || card.current?.contains(document.activeElement)) return;
      setActive(null);
    }, CLOSE_DELAY);
  }

  useEffect(() => () => cancelClose(), [cancelClose]);

  useLayoutEffect(() => {
    if (active === null) return;
    let frame = 0;
    function update() {
      const anchor = itemRefs.current[active!];
      const panel = card.current;
      if (!anchor || !panel) return;
      const rect = anchor.getBoundingClientRect();
      const topInset = Math.max(12, (document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 64) + 12);
      if (rect.bottom < topInset || rect.top > window.innerHeight) { setActive(null); return; }
      setPosition(positionContactPreview(rect, items[active!].icon === "github" ? 480 : 360, panel.scrollHeight + 2, document.documentElement.clientWidth, window.innerHeight, topInset));
    }
    function scheduleUpdate() { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); }
    update();
    if (focusCard.current) { card.current?.focus({ preventScroll: true }); focusCard.current = false; }
    const observer = new ResizeObserver(scheduleUpdate);
    if (card.current) observer.observe(card.current);
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true, capture: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, [active, items]);

  useEffect(() => {
    if (active === null) return;
    function outside(event: PointerEvent) {
      const target = event.target as Node;
      if (!card.current?.contains(target) && !grid.current?.contains(target)) close();
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close(Boolean(card.current?.contains(document.activeElement)));
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [active, close]);

  const item = active === null ? null : items[active];
  const ServiceIcon = item ? icons[item.icon] : null;
  return <>
    <p id={`${id}-help`} className="sr-only">Preview details by focusing a link with a preview icon button. Activate its icon button to use the preview actions. Escape closes the preview.</p>
    <div ref={grid} className="social-grid" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget) && !card.current?.contains(event.relatedTarget)) scheduleClose();
    }}>
      {items.map((social, index) => {
        const Icon = icons[social.icon];
        const unavailable = social.icon === "resume" && !resumeAvailable;
        if (!social.preview) return <a key={social.icon} href={social.href} target="_blank" rel="noopener noreferrer" className="contact-item contact-direct-link" onPointerEnter={() => { pointerInside.current = false; close(); }} onFocus={() => close()}>
          <span className="contact-preview-toggle"><Icon aria-hidden="true" /></span><span>{social.label}</span><ArrowUpRight aria-hidden="true" className="contact-item-arrow" />
        </a>;
        return <div key={social.icon} ref={(node) => { itemRefs.current[index] = node; }} className="contact-item" data-active={active === index}
          onPointerEnter={(event) => { if (event.pointerType !== "touch") { pointerInside.current = true; open(index); } }} onPointerLeave={() => { pointerInside.current = false; scheduleClose(); }}
          onFocus={() => { if (!suppressFocus.current) open(index); }}>
          <button type="button" ref={(node) => { triggerRefs.current[index] = node; }} hidden={!enhanced} className="contact-preview-toggle" aria-label={`Preview ${social.label}`} title={`Preview ${social.label}`} aria-expanded={active === index} aria-controls={active === index ? `${id}-preview` : undefined} aria-haspopup="dialog" onClick={() => open(index, true)}><Icon aria-hidden="true" /></button>
          {unavailable ? <button type="button" disabled={!enhanced} className="contact-destination" aria-label="Preview Resume — file not available yet" onClick={() => open(index, true)}><span hidden={enhanced} className="contact-preview-toggle"><Icon aria-hidden="true" /></span><span>{social.label}</span><ArrowUpRight aria-hidden="true" className="contact-item-arrow" /></button>
            : <a href={social.href} target={social.icon === "mail" ? undefined : "_blank"} rel={social.icon === "mail" ? undefined : "noopener noreferrer"} className="contact-destination" aria-describedby={`${id}-help`} onClick={() => close()}><span hidden={enhanced} className="contact-preview-toggle"><Icon aria-hidden="true" /></span><span>{social.label}</span><ArrowUpRight aria-hidden="true" className="contact-item-arrow" /></a>}
        </div>;
      })}
    </div>
    {enhanced && createPortal(<AnimatePresence initial={false}>
      {item?.preview && <motion.div key="contact-preview" ref={card} id={`${id}-preview`} role="dialog" aria-modal="false" aria-labelledby={`${id}-title`} tabIndex={-1} className="contact-preview" data-service={item.icon} data-side={position?.side}
        style={{ left: position?.left ?? 12, top: position?.top ?? 80, width: position?.width ?? 360, maxHeight: position?.maxHeight ?? "calc(100dvh - 96px)", visibility: position ? "visible" : "hidden" }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduce ? 0 : 5, scale: reduce ? 1 : 0.985, pointerEvents: "none", transition: { duration: reduce ? 0 : motionSettings.exit } }} transition={{ duration: reduce ? 0 : motionSettings.enter, ease: motionSettings.ease }}
        onPointerEnter={(event) => { if (event.pointerType !== "touch") pointerInside.current = true; cancelClose(); }} onPointerLeave={() => { pointerInside.current = false; scheduleClose(); }} onFocus={cancelClose} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget) && !grid.current?.contains(event.relatedTarget)) scheduleClose(); }}>
        <div aria-hidden="true" className="contact-preview-light" />
        <div className="contact-preview-topline"><span><span aria-hidden="true" className="contact-service-mark">{ServiceIcon && <ServiceIcon />}</span>{item.preview.eyebrow}</span><button type="button" aria-label="Close contact preview" className="contact-preview-close" onClick={() => close(true)}><X aria-hidden="true" /></button></div>
        <motion.div key={item.icon} className="contact-preview-body" style={{ "--contact-stagger": `${motionSettings.stagger}s` } as React.CSSProperties} initial={reduce ? false : { opacity: 0, x: direction * 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduce ? 0 : 0.22, ease: motionSettings.ease }}><ContactPreviewContent item={item} titleId={`${id}-title`} resumeAvailable={resumeAvailable} resumeDownloadable={resumeDownloadable} /></motion.div>
      </motion.div>}
    </AnimatePresence>, document.body)}
  </>;
}
