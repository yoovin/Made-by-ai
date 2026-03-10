import { ServiceEntry } from "@/types/service";
import { getRecommendationBundles } from "@/lib/search-discovery";

export type HomeQuickStartBundle = {
  key: string;
  title: string;
  description: string;
  query: string;
  services: ServiceEntry[];
};

export function getHomeQuickStartBundles(services: ServiceEntry[]): HomeQuickStartBundle[] {
  return getRecommendationBundles(services, "").map((bundle) => ({
    key: bundle.key,
    title: bundle.title,
    description: bundle.description,
    query: bundle.query,
    services: bundle.services,
  }));
}

function getStatusRank(status: ServiceEntry["status"]) {
  switch (status) {
    case "active":
      return 0;
    case "beta":
      return 1;
    case "disabled":
      return 2;
    case "hidden":
      return 3;
    default:
      return 4;
  }
}

export function getRecentUpdatedServices(services: ServiceEntry[], limit = 4): ServiceEntry[] {
  return [...services]
    .sort((left, right) => {
      if (left.updatedAt !== right.updatedAt) {
        return right.updatedAt.localeCompare(left.updatedAt);
      }
      const statusRankDiff = getStatusRank(left.status) - getStatusRank(right.status);
      if (statusRankDiff !== 0) {
        return statusRankDiff;
      }
      return left.title.localeCompare(right.title);
    })
    .slice(0, limit);
}
