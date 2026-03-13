import { ServiceEntry } from "@/types/service";

export const PINNED_SERVICES_STORAGE_KEY = "made-by-ai:pinned-services";
const PINNED_SERVICES_LIMIT = 8;
const EXCLUDED_SLUGS = new Set(["search", "hub-intro", "release-log", "experiments"]);

export function canPinService(service: ServiceEntry) {
  return !EXCLUDED_SLUGS.has(service.slug);
}

export function parsePinnedServiceSlugs(rawValue: string | null) {
  if (!rawValue) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string").slice(0, PINNED_SERVICES_LIMIT);
  } catch {
    return [];
  }
}

export function togglePinnedService(current: string[], slug: string) {
  if (current.includes(slug)) {
    return current.filter((item) => item !== slug);
  }

  return [slug, ...current].slice(0, PINNED_SERVICES_LIMIT);
}

export function resolvePinnedServices(services: ServiceEntry[], slugs: string[]) {
  return slugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is ServiceEntry => Boolean(service))
    .filter((service) => canPinService(service));
}
