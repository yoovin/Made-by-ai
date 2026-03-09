export type ServiceStatus = "active" | "beta" | "hidden" | "disabled";

export type ServiceEntry = {
  key: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  exposure: "card" | "button" | "link";
  status: ServiceStatus;
  category: string;
  route: string;
  tags: string[];
  updatedAt: string;
};
