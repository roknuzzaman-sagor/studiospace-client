import * as React from "react";

const subscribe = () => () => {};

/**
 * True after hydration, false during SSR/prerender.
 *
 * Uses useSyncExternalStore instead of a setState-in-effect so components can
 * gate browser-only code (Swiper, theme icons, current year) without tripping
 * the react-hooks/set-state-in-effect rule or prerender unstable-value errors.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
