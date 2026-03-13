"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  extractRecentServiceSlug,
  parseRecentServiceSlugs,
  RECENT_SERVICES_STORAGE_KEY,
  shouldTrackRecentServicePath,
  updateRecentServiceSlugs,
} from "@/lib/recent-services";

export function RecentServiceTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || typeof window === "undefined") {
      return;
    }

    if (!shouldTrackRecentServicePath(pathname)) {
      return;
    }

    const slug = extractRecentServiceSlug(pathname);
    const current = parseRecentServiceSlugs(window.localStorage.getItem(RECENT_SERVICES_STORAGE_KEY));
    const next = updateRecentServiceSlugs(current, slug);
    window.localStorage.setItem(RECENT_SERVICES_STORAGE_KEY, JSON.stringify(next));
  }, [pathname]);

  return null;
}
