"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ServiceEntry } from "@/types/service";
import { parseRecentServiceSlugs, RECENT_SERVICES_STORAGE_KEY, resolveRecentServices } from "@/lib/recent-services";

type Props = {
  services: ServiceEntry[];
};

export function RecentlyUsedServices({ services }: Props) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const sync = () => {
      setRecentSlugs(parseRecentServiceSlugs(window.localStorage.getItem(RECENT_SERVICES_STORAGE_KEY)));
    };

    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const recentServices = useMemo(() => resolveRecentServices(services, recentSlugs), [services, recentSlugs]);

  if (!recentServices.length) {
    return null;
  }

  return (
    <section className="panel home-recently-used">
      <div className="home-guided-header">
        <div>
          <h2 className="section-title home-guided-title">최근 사용한 서비스</h2>
          <p className="section-desc">실제로 방금 열어본 서비스를 홈에서 바로 다시 열 수 있습니다.</p>
        </div>
      </div>

      <div className="home-recent-grid">
        {recentServices.map((service) => (
          <Link className="card" key={service.key} href={service.route}>
            <div className="badge-row">
              <span className={`badge ${service.status}`}>{service.status}</span>
              <span className="badge">{service.category}</span>
            </div>
            <h3>{service.title}</h3>
            <p>{service.shortDescription}</p>
            <span className="card-meta">다시 열기</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
