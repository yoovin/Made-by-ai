import { ServiceEntry } from "@/types/service";

export const RECENT_SERVICES_STORAGE_KEY = "made-by-ai:recent-services";
const RECENT_SERVICES_LIMIT = 6;
const EXCLUDED_SLUGS = new Set(["search", "hub-intro", "release-log", "experiments"]);

export function shouldTrackRecentServicePath(pathname: string) {
  if (!pathname.startsWith("/services/")) {
    return false;
  }

  const slug = pathname.replace(/^\/services\//, "").trim();
  if (!slug || slug.includes("/")) {
    return false;
  }

  return !EXCLUDED_SLUGS.has(slug);
}

export function extractRecentServiceSlug(pathname: string) {
  return pathname.replace(/^\/services\//, "").trim();
}

export function parseRecentServiceSlugs(rawValue: string | null) {
  if (!rawValue) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string").slice(0, RECENT_SERVICES_LIMIT);
  } catch {
    return [];
  }
}

export function updateRecentServiceSlugs(current: string[], slug: string) {
  return [slug, ...current.filter((item) => item !== slug)].slice(0, RECENT_SERVICES_LIMIT);
}

export function resolveRecentServices(services: ServiceEntry[], slugs: string[]) {
  return slugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is ServiceEntry => Boolean(service));
}
