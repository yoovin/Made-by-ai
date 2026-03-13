"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ServiceEntry } from "@/types/service";
import { parsePinnedServiceSlugs, PINNED_SERVICES_STORAGE_KEY, resolvePinnedServices } from "@/lib/pinned-services";

type Props = {
  services: ServiceEntry[];
};

export function PinnedServices({ services }: Props) {
  const [pinnedSlugs, setPinnedSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const sync = () => {
      setPinnedSlugs(parsePinnedServiceSlugs(window.localStorage.getItem(PINNED_SERVICES_STORAGE_KEY)));
    };

    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const pinnedServices = useMemo(() => resolvePinnedServices(services, pinnedSlugs), [services, pinnedSlugs]);

  if (!pinnedServices.length) {
    return null;
  }

  return (
    <section className="panel home-pinned-services">
      <div className="home-guided-header">
        <div>
          <h2 className="section-title home-guided-title">고정한 서비스</h2>
          <p className="section-desc">자주 쓰는 도구를 홈 상단에 고정해 두고 바로 다시 열 수 있습니다.</p>
        </div>
      </div>

      <div className="home-recent-grid">
        {pinnedServices.map((service) => (
          <Link className="card" key={service.key} href={service.route}>
            <div className="badge-row">
              <span className={`badge ${service.status}`}>{service.status}</span>
              <span className="badge">{service.category}</span>
            </div>
            <h3>{service.title}</h3>
            <p>{service.shortDescription}</p>
            <span className="card-meta">고정됨</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
