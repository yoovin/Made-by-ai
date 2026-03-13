import { buildQueryString, QueryStringBuilderRow, QueryStringBuilderResult } from "@/lib/query-string-builder-tools";

export type UrlBuilderInput = {
  baseUrl: string;
  path: string;
  hash: string;
  rows: QueryStringBuilderRow[];
};

export type UrlBuilderResult =
  | {
      ok: true;
      query: QueryStringBuilderResult & { ok: true };
      origin: string;
      pathname: string;
      hash: string;
      output: string;
      copyText: string;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeHash(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

function normalizePath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function buildFullUrl(input: UrlBuilderInput): UrlBuilderResult {
  const rawBaseUrl = input.baseUrl.trim();

  if (!rawBaseUrl) {
    return {
      ok: false,
      error: "base URL을 입력해 주세요.",
    };
  }

  let url: URL;

  try {
    url = new URL(rawBaseUrl);
  } catch {
    return {
      ok: false,
      error: "유효한 base URL을 입력해 주세요. 예: https://example.com",
    };
  }

  const query = buildQueryString(input.rows);
  if (!query.ok) {
    return {
      ok: false,
      error: query.error,
    };
  }

  const pathname = normalizePath(input.path);
  const hash = normalizeHash(input.hash);

  const urlPath = pathname || url.pathname;
  const origin = url.origin;
  const output = `${origin}${urlPath}${query.output ? `?${query.output}` : ""}${hash}`;

  return {
    ok: true,
    query,
    origin,
    pathname: urlPath,
    hash,
    output,
    copyText: output,
  };
}
