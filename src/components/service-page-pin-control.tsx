"use client";

import { usePathname } from "next/navigation";
import { getServiceBySlug } from "@/lib/service-registry";
import { PinServiceButton } from "@/components/pin-service-button";

export function ServicePagePinControl() {
  const pathname = usePathname();

  if (!pathname?.startsWith("/services/")) {
    return null;
  }

  const slug = pathname.replace(/^\/services\//, "").trim();
  if (!slug || slug.includes("/")) {
    return null;
  }

  const service = getServiceBySlug(slug);
  if (!service) {
    return null;
  }

  return (
    <div className="service-page-pin-control">
      <PinServiceButton service={service} />
    </div>
  );
}
