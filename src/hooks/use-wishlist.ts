"use client";

import * as React from "react";

const WISHLIST_KEY = "studiospace.wishlist";

/**
 * Saved-studios wishlist persisted to localStorage so hearts survive reloads.
 * Stored as an array of studio IDs; hydrated after mount to avoid prerender
 * mismatches (useMounted pattern).
 */
export function useWishlist() {
  const [ids, setIds] = React.useState<string[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    // Deferred so state isn't set synchronously within the effect body
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(WISHLIST_KEY);
        if (raw) setIds(JSON.parse(raw) as string[]);
      } catch {
        /* corrupted storage — start empty */
      }
      setHydrated(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    } catch {
      /* storage full or blocked — state still works in-memory */
    }
  }, [ids, hydrated]);

  const toggle = React.useCallback((id: string) => {
    setIds((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
    );
  }, []);

  const remove = React.useCallback((id: string) => {
    setIds((list) => list.filter((x) => x !== id));
  }, []);

  const has = React.useCallback(
    (id: string) => ids.includes(id),
    [ids],
  );

  return { ids, has, toggle, remove, hydrated };
}
