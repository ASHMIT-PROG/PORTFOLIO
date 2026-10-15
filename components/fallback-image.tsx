"use client";
import Image from "next/image";
import { useState } from "react";

export function FallbackImage({ src, alt, sizes, priority = false, children, className }: { src: string; alt: string; sizes: string; priority?: boolean; children: React.ReactNode; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return <div className={className}>{children}{failedSrc !== src && <Image src={src} alt={alt} fill sizes={sizes} preload={priority} onError={() => setFailedSrc(src)} className="object-cover" />}</div>;
}
