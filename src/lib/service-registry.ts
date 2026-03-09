import { ServiceEntry } from "@/types/service";

export const serviceRegistry: ServiceEntry[] = [
  {
    key: "hub-intro",
    slug: "hub-intro",
    title: "허브 소개",
    shortDescription: "이 플랫폼이 어떤 구조로 커지는지 설명하는 기본 서비스",
    longDescription:
      "Made by AI는 하나의 허브 화면 안으로 서비스가 계속 추가되는 구조입니다. 사용자는 허브에서 카드를 눌러 개별 서비스로 이동합니다.",
    exposure: "card",
    status: "active",
    category: "core",
    route: "/services/hub-intro",
    tags: ["hub", "onboarding", "core"],
    updatedAt: "2026-03-09"
  },
  {
    key: "release-log",
    slug: "release-log",
    title: "릴리즈 로그",
    shortDescription: "최근 릴리즈와 체인지로그 방향을 확인하는 서비스",
    longDescription:
      "AI가 어떤 방향으로 기능을 추가하고 개선했는지 사용자가 한 곳에서 볼 수 있는 릴리즈 로그 화면입니다.",
    exposure: "card",
    status: "beta",
    category: "operations",
    route: "/services/release-log",
    tags: ["changelog", "history", "ops"],
    updatedAt: "2026-03-09"
  },
  {
    key: "experiments",
    slug: "experiments",
    title: "실험실",
    shortDescription: "새로운 기능을 작게 실험한 뒤 허브로 승격하기 위한 영역",
    longDescription:
      "무한 확장을 하더라도 바로 메인 기능으로 올리지 않고, 작은 실험을 거쳐 서비스로 승격하는 공간입니다.",
    exposure: "card",
    status: "beta",
    category: "lab",
    route: "/services/experiments",
    tags: ["beta", "experiment", "growth"],
    updatedAt: "2026-03-09"
  }
];

export function getVisibleServices(): ServiceEntry[] {
  return serviceRegistry.filter((service) => service.status !== "hidden");
}

export function getServiceBySlug(slug: string): ServiceEntry | undefined {
  return serviceRegistry.find((service) => service.slug === slug);
}

export function getCategories(): string[] {
  return Array.from(new Set(serviceRegistry.map((service) => service.category)));
}
