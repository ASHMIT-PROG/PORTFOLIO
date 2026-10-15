let pending: Promise<number | null> | null = null;

// Share the request across simultaneous mounts. Aborting fetch cannot undo a
// server increment, so React Strict Mode cleanup must only ignore the result.
export function getViewCount(): Promise<number | null> {
  if (!pending) {
    pending = fetch("/api/views", { method: "POST", signal: AbortSignal.timeout(10000) })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => Number.isSafeInteger(data?.count) && data.count >= 0 ? data.count as number : null)
      .catch(() => null)
      .finally(() => { pending = null; });
  }
  return pending;
}
