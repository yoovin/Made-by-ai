import { ServiceEntry } from "@/types/service";

export type CategorySummary = {
  category: string;
  count: number;
  examples: string[];
};

export type TagSummary = {
  tag: string;
  count: number;
};

export type RecommendationBundle = {
  key: string;
  title: string;
  description: string;
  query: string;
  services: ServiceEntry[];
  matchCount: number;
};

type RecommendationDefinition = {
  key: string;
  title: string;
  description: string;
  query: string;
  matchTerms: string[];
  includeSlugs: string[];
};

const recommendationDefinitions: RecommendationDefinition[] = [
  {
    key: "hub-start",
    title: "허브 시작하기",
    description: "허브 구조와 최근 변경 흐름을 먼저 파악할 때 보는 묶음입니다.",
    query: "hub",
    matchTerms: ["hub", "core", "소개", "release", "history"],
    includeSlugs: ["hub-intro", "release-log", "experiments"],
  },
  {
    key: "ops-quick-check",
    title: "운영 빠른 점검",
    description: "현재 서버 상태와 운영 기록을 빠르게 확인할 때 쓰는 묶음입니다.",
    query: "ops",
    matchTerms: ["ops", "operations", "status", "health", "server"],
    includeSlugs: ["server-status", "release-log"],
  },
  {
    key: "local-productivity",
    title: "로컬 작업 도구",
    description: "브라우저 안에서 바로 쓰는 로컬 생산성 서비스를 모아 둔 묶음입니다.",
    query: "productivity",
    matchTerms: ["productivity", "memo", "markdown", "bookmark", "local", "notes"],
    includeSlugs: ["bookmarks", "markdown-memo"],
  },
];

export function getCategorySummaries(services: ServiceEntry[]): CategorySummary[] {
  const grouped = new Map<string, ServiceEntry[]>();

  for (const service of services) {
    const current = grouped.get(service.category) ?? [];
    current.push(service);
    grouped.set(service.category, current);
  }

  return Array.from(grouped.entries())
    .map(([category, items]) => ({
      category,
      count: items.length,
      examples: items.map((item) => item.title).sort().slice(0, 2),
    }))
    .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category));
}

export function getTagSummaries(services: ServiceEntry[], limit = 8): TagSummary[] {
  const counts = new Map<string, number>();

  for (const service of services) {
    for (const tag of service.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag))
    .slice(0, limit);
}

export function getRecommendationBundles(
  services: ServiceEntry[],
  query: string,
): RecommendationBundle[] {
  const normalizedQuery = query.trim().toLowerCase();
  const serviceMap = new Map(services.map((service) => [service.slug, service]));

  const bundles = recommendationDefinitions
    .map((definition) => {
      const bundleServices = definition.includeSlugs
        .map((slug) => serviceMap.get(slug))
        .filter((service): service is ServiceEntry => Boolean(service));

      const serviceHaystack = bundleServices
        .flatMap((service) => [service.title, service.shortDescription, service.category, service.tags.join(" ")])
        .join(" ")
        .toLowerCase();

      const bundleHaystack = [definition.title, definition.description, definition.matchTerms.join(" "), serviceHaystack]
        .join(" ")
        .toLowerCase();

      const matchCount = normalizedQuery
        ? bundleServices.filter((service) =>
            [service.title, service.shortDescription, service.category, service.tags.join(" ")]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery),
          ).length
        : 0;

      return {
        key: definition.key,
        title: definition.title,
        description: definition.description,
        query: definition.query,
        services: bundleServices,
        bundleMatches: normalizedQuery ? bundleHaystack.includes(normalizedQuery) : true,
        matchCount,
      };
    })
    .filter((bundle) => bundle.services.length > 0);

  if (!normalizedQuery) {
    return bundles.map(({ bundleMatches: _bundleMatches, ...bundle }) => bundle);
  }

  const matchingBundles = bundles.filter((bundle) => bundle.bundleMatches || bundle.matchCount > 0);
  const fallbackBundles = matchingBundles.length > 0 ? matchingBundles : bundles.slice(0, 2);

  return fallbackBundles
    .sort((left, right) => right.matchCount - left.matchCount || left.title.localeCompare(right.title))
    .map(({ bundleMatches: _bundleMatches, ...bundle }) => bundle);
}
