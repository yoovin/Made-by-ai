export type UuidResult =
  | {
      ok: true;
      uuid: string;
      version: string;
      variant: string;
    }
  | {
      ok: false;
      error: string;
    };

export function generateUuid(): UuidResult {
  if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
    return {
      ok: false,
      error: "현재 환경에서는 UUID를 생성할 수 없습니다.",
    };
  }

  const uuid = crypto.randomUUID();
  return {
    ok: true,
    uuid,
    version: uuid.split("-")[2]?.charAt(0) ?? "unknown",
    variant: uuid.split("-")[3]?.charAt(0) ?? "unknown",
  };
}

export function isUuidV4(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
