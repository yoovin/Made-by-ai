import { QueryParseResult, parseQueryStringInput } from "@/lib/query-string-tools";

type SuccessfulQueryParse = Extract<QueryParseResult, { ok: true }>;

export type UrlParserResult =
  | {
      ok: true;
      protocol: string;
      origin: string;
      pathname: string;
      hash: string;
      query: QueryParseResult & { ok: true };
      normalizedUrl: string;
      copyText: string;
    }
  | {
      ok: false;
      error: string;
    };

export function parseUrlInput(input: string): UrlParserResult {
  const normalized = input.trim();

  if (!normalized) {
    return {
      ok: false,
      error: "파싱할 URL을 입력해 주세요.",
    };
  }

  let url: URL;

  try {
    url = new URL(normalized);
  } catch {
    return {
      ok: false,
      error: "유효한 absolute URL을 입력해 주세요. 예: https://example.com/docs",
    };
  }

  if (url.username || url.password) {
    return {
      ok: false,
      error: "이번 단계에서는 username/password가 포함된 URL을 지원하지 않습니다.",
    };
  }

  const queryString = url.search.startsWith("?") ? url.search.slice(1) : url.search;
  let query: SuccessfulQueryParse;

  if (queryString) {
    const parsedQuery = parseQueryStringInput(queryString);
    if (!parsedQuery.ok) {
      return {
        ok: false,
        error: parsedQuery.error,
      };
    }

    query = parsedQuery;
  } else {
    query = {
      ok: true,
      rows: [],
      normalizedQuery: "",
      totalParams: 0,
      uniqueKeys: 0,
    };
  }

  const normalizedUrl = `${url.origin}${url.pathname}${query.normalizedQuery ? `?${query.normalizedQuery}` : ""}${url.hash}`;

  return {
    ok: true,
    protocol: url.protocol,
    origin: url.origin,
    pathname: url.pathname,
    hash: url.hash,
    query,
    normalizedUrl,
    copyText: normalizedUrl,
  };
}
