import { useSyncExternalStore } from "react";

function subscribe(callback: () => void, query: string) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getSnapshot(query: string) {
  return window.matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => subscribe(cb, query),
    () => getSnapshot(query),
    getServerSnapshot,
  );
}
