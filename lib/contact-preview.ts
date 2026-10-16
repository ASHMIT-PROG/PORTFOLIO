type AnchorRect = { left: number; right: number; top: number; bottom: number };

export async function copyContactEmail(email: string, clipboard?: { writeText: (value: string) => Promise<void> }) {
  try {
    if (!clipboard) return false;
    await clipboard.writeText(email);
    return true;
  } catch {
    return false;
  }
}

/** Viewport coordinates: used by the body portal, outside animated section transforms. */
export function positionContactPreview(anchor: AnchorRect, width: number, height: number, viewportWidth: number, viewportHeight: number, topInset = 80) {
  const margin = 12;
  const gap = 14;
  const cardWidth = Math.min(width, viewportWidth - margin * 2);
  const aboveSpace = Math.max(0, anchor.top - gap - topInset);
  const belowSpace = Math.max(0, viewportHeight - margin - anchor.bottom - gap);
  const side = height <= aboveSpace ? "above" : height <= belowSpace ? "below" : aboveSpace >= belowSpace ? "above" : "below";
  // Scroll inside a constrained card instead of covering its source item.
  const maxHeight = Math.max(1, Math.min(viewportHeight - topInset - margin, side === "above" ? aboveSpace : belowSpace));
  const cardHeight = Math.min(height, maxHeight);
  const above = anchor.top - gap - cardHeight;
  const below = anchor.bottom + gap;
  return {
    left: Math.max(margin, Math.min((anchor.left + anchor.right - cardWidth) / 2, viewportWidth - cardWidth - margin)),
    top: Math.max(topInset, Math.min(side === "above" ? above : below, viewportHeight - cardHeight - margin)),
    width: cardWidth,
    maxHeight,
    side,
  };
}
