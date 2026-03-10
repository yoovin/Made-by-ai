export type SlugResult =
  | {
      ok: true;
      slug: string;
      length: number;
      segments: number;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeInput(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function generateSlug(input: string): SlugResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      ok: false,
      error: "슬러그를 만들 텍스트를 입력해 주세요.",
    };
  }

  const slug = normalizeInput(trimmed)
    .replace(/[^a-z0-9\s_-]/g, " ")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) {
    return {
      ok: false,
      error: "ASCII slug로 변환할 수 있는 문자나 숫자가 없습니다.",
    };
  }

  return {
    ok: true,
    slug,
    length: slug.length,
    segments: slug.split("-").length,
  };
}
