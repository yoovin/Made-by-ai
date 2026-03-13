"use client";

import { useEffect, useState } from "react";
import { ServiceEntry } from "@/types/service";
import { canPinService, parsePinnedServiceSlugs, PINNED_SERVICES_STORAGE_KEY, togglePinnedService } from "@/lib/pinned-services";

type Props = {
  service: ServiceEntry;
};

export function PinServiceButton({ service }: Props) {
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !canPinService(service)) {
      return;
    }

    const sync = () => {
      const current = parsePinnedServiceSlugs(window.localStorage.getItem(PINNED_SERVICES_STORAGE_KEY));
      setIsPinned(current.includes(service.slug));
    };

    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [service]);

  if (!canPinService(service)) {
    return null;
  }

  function handleToggle() {
    if (typeof window === "undefined") {
      return;
    }

    const current = parsePinnedServiceSlugs(window.localStorage.getItem(PINNED_SERVICES_STORAGE_KEY));
    const next = togglePinnedService(current, service.slug);
    window.localStorage.setItem(PINNED_SERVICES_STORAGE_KEY, JSON.stringify(next));
    setIsPinned(next.includes(service.slug));
  }

  return (
    <button className="back-link pin-service-button" type="button" onClick={handleToggle}>
      {isPinned ? "고정 해제" : "홈에 고정"}
    </button>
  );
}
