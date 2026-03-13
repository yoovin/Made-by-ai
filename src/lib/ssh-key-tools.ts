export type SupportedSshKeyType =
  | "ssh-ed25519"
  | "ssh-rsa"
  | "ecdsa-sha2-nistp256"
  | "ecdsa-sha2-nistp384"
  | "ecdsa-sha2-nistp521";

export type SshKeySummary = {
  keyType: SupportedSshKeyType;
  keyDetail: string;
  rawBlobLength: number;
  sha256Fingerprint: string;
  comment: string | null;
};

export type SshKeyInspectResult =
  | {
      ok: true;
      summary: SshKeySummary;
    }
  | {
      ok: false;
      error: string;
    };

const SUPPORTED_TYPES: SupportedSshKeyType[] = [
  "ssh-ed25519",
  "ssh-rsa",
  "ecdsa-sha2-nistp256",
  "ecdsa-sha2-nistp384",
  "ecdsa-sha2-nistp521",
];

const ECDSA_CURVES = new Set(["nistp256", "nistp384", "nistp521"]);

function isSupportedType(value: string): value is SupportedSshKeyType {
  return SUPPORTED_TYPES.includes(value as SupportedSshKeyType);
}

function decodeBase64(value: string) {
  try {
    const normalized = value.replace(/=+$/, "");
    const binary = atob(normalized);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    throw new Error("OpenSSH base64 payload를 해석할 수 없습니다.");
  }
}

function readUint32(bytes: Uint8Array, offset: number) {
  if (offset + 4 > bytes.length) {
    throw new Error("SSH key blob이 잘렸습니다.");
  }

  return (
    (bytes[offset] << 24) |
    (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) |
    bytes[offset + 3]
  ) >>> 0;
}

function readBytes(bytes: Uint8Array, offset: number, length: number) {
  if (offset + length > bytes.length) {
    throw new Error("SSH key blob이 예상보다 짧습니다.");
  }

  return bytes.slice(offset, offset + length);
}

function readSshString(bytes: Uint8Array, offset: number) {
  const length = readUint32(bytes, offset);
  const start = offset + 4;
  const value = readBytes(bytes, start, length);
  return {
    value,
    nextOffset: start + length,
  };
}

function bytesToText(bytes: Uint8Array) {
  return new TextDecoder().decode(bytes);
}

function getMpintBitLength(bytes: Uint8Array) {
  let start = 0;
  while (start < bytes.length && bytes[start] === 0) {
    start += 1;
  }

  if (start === bytes.length) {
    return 0;
  }

  const first = bytes[start];
  const leadingBits = 8 - Math.clz32(first) + 24;
  return (bytes.length - start - 1) * 8 + leadingBits;
}

function validatePositiveMpint(bytes: Uint8Array, label: string) {
  if (bytes.length === 0) {
    throw new Error(`${label} mpint가 비어 있습니다.`);
  }

  if (bytes[0] & 0x80) {
    throw new Error(`${label} mpint는 양수여야 합니다.`);
  }

  if (bytes.length > 1 && bytes[0] === 0 && (bytes[1] & 0x80) === 0) {
    throw new Error(`${label} mpint가 canonical 형식이 아닙니다.`);
  }
}

function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

async function getFingerprint(rawBlob: Uint8Array) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("현재 환경에서는 SSH key fingerprint를 계산할 수 없습니다.");
  }

  const digestInput = rawBlob.slice().buffer;
  const digest = new Uint8Array(await subtle.digest("SHA-256", digestInput));
  return `SHA256:${toBase64(digest).replace(/=+$/, "")}`;
}

function parseRsaDetail(rawBlob: Uint8Array) {
  let offset = 0;
  const type = readSshString(rawBlob, offset);
  offset = type.nextOffset;
  const exponent = readSshString(rawBlob, offset);
  offset = exponent.nextOffset;
  const modulus = readSshString(rawBlob, offset);
  offset = modulus.nextOffset;
  if (offset !== rawBlob.length) {
    throw new Error("ssh-rsa key blob에 예상하지 않은 trailing bytes가 있습니다.");
  }
  validatePositiveMpint(exponent.value, "RSA exponent");
  validatePositiveMpint(modulus.value, "RSA modulus");
  if (getMpintBitLength(modulus.value) === 0) {
    throw new Error("ssh-rsa modulus가 유효하지 않습니다.");
  }
  return `${getMpintBitLength(modulus.value)}-bit RSA`;
}

function parseEd25519Detail(rawBlob: Uint8Array) {
  let offset = 0;
  const type = readSshString(rawBlob, offset);
  offset = type.nextOffset;
  const key = readSshString(rawBlob, offset);
  offset = key.nextOffset;
  if (key.value.length !== 32) {
    throw new Error("ssh-ed25519 공개키 길이가 유효하지 않습니다.");
  }
  if (offset !== rawBlob.length) {
    throw new Error("ssh-ed25519 key blob에 예상하지 않은 trailing bytes가 있습니다.");
  }
  return "256-bit Ed25519";
}

function parseEcdsaDetail(type: SupportedSshKeyType, rawBlob: Uint8Array) {
  let offset = 0;
  const typeField = readSshString(rawBlob, offset);
  offset = typeField.nextOffset;
  const curve = readSshString(rawBlob, offset);
  offset = curve.nextOffset;
  const point = readSshString(rawBlob, offset);
  offset = point.nextOffset;
  const curveName = bytesToText(curve.value);
  if (!ECDSA_CURVES.has(curveName)) {
    throw new Error("지원하지 않는 ECDSA curve입니다.");
  }
  if (curveName !== type.replace("ecdsa-sha2-", "")) {
    throw new Error("선언된 ECDSA 타입과 key blob 내부 curve가 일치하지 않습니다.");
  }
  if (point.value.length === 0) {
    throw new Error("ECDSA 공개키 point가 비어 있습니다.");
  }
  const coordinateLength = curveName === "nistp256" ? 32 : curveName === "nistp384" ? 48 : 66;
  const firstByte = point.value[0];
  const expectedLength = firstByte === 4 ? 1 + coordinateLength * 2 : firstByte === 2 || firstByte === 3 ? 1 + coordinateLength : 0;
  if (expectedLength === 0 || point.value.length !== expectedLength) {
    throw new Error("ECDSA 공개키 point 형식이 유효하지 않습니다.");
  }
  if (offset !== rawBlob.length) {
    throw new Error("ECDSA key blob에 예상하지 않은 trailing bytes가 있습니다.");
  }
  return curveName;
}

function getKeyDetail(type: SupportedSshKeyType, rawBlob: Uint8Array) {
  if (type === "ssh-rsa") {
    return parseRsaDetail(rawBlob);
  }

  if (type === "ssh-ed25519") {
    return parseEd25519Detail(rawBlob);
  }

  return parseEcdsaDetail(type, rawBlob);
}

function hasAuthorizedKeysOptions(normalized: string, parts: string[]) {
  if (parts.length < 2) {
    return false;
  }

  const firstToken = parts[0];
  if (isSupportedType(firstToken) || firstToken.endsWith("-cert-v01@openssh.com") || firstToken.startsWith("sk-ssh-")) {
    return false;
  }

  return normalized.includes(" ssh-") || normalized.includes(" ecdsa-sha2-");
}

export async function inspectSshPublicKey(input: string): Promise<SshKeyInspectResult> {
  if (!input.trim()) {
    return {
      ok: false,
      error: "해석할 OpenSSH 공개키를 입력해 주세요.",
    };
  }

  const trimmedForPemCheck = input.trim();
  if (trimmedForPemCheck.startsWith("-----BEGIN")) {
    return {
      ok: false,
      error: "이번 단계에서는 PEM이 아니라 OpenSSH 공개키 한 줄만 지원합니다.",
    };
  }

  if (/\r|\n/.test(input)) {
    return {
      ok: false,
      error: "이번 단계에서는 한 줄짜리 OpenSSH 공개키만 지원합니다.",
    };
  }

  const normalized = trimmedForPemCheck;

  if (normalized.startsWith("Host ")) {
    return {
      ok: false,
      error: "SSH config가 아니라 공개키 한 줄을 입력해 주세요.",
    };
  }

  const parts = normalized.split(/\s+/);
  if (hasAuthorizedKeysOptions(normalized, parts)) {
    return {
      ok: false,
      error: "이번 단계에서는 authorized_keys 옵션이 없는 공개키 한 줄만 지원합니다.",
    };
  }

  if (parts.length < 2) {
    return {
      ok: false,
      error: "OpenSSH 공개키는 `<type> <base64> [comment]` 형식이어야 합니다.",
    };
  }

  const [type, base64, ...commentParts] = parts;
  if (type.endsWith("-cert-v01@openssh.com")) {
    return {
      ok: false,
      error: "이번 단계에서는 SSH certificate가 아니라 일반 공개키만 지원합니다.",
    };
  }

  if (!isSupportedType(type)) {
    return {
      ok: false,
      error: "지원하지 않는 OpenSSH 공개키 타입입니다.",
    };
  }

  try {
    const rawBlob = decodeBase64(base64);
    const typeField = readSshString(rawBlob, 0);
    const parsedType = bytesToText(typeField.value);
    if (parsedType !== type) {
      throw new Error("선언된 키 타입과 key blob 내부 타입이 일치하지 않습니다.");
    }

    return {
      ok: true,
      summary: {
        keyType: type,
        keyDetail: getKeyDetail(type, rawBlob),
        rawBlobLength: rawBlob.length,
        sha256Fingerprint: await getFingerprint(rawBlob),
        comment: commentParts.length > 0 ? commentParts.join(" ") : null,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "OpenSSH 공개키를 해석할 수 없습니다.",
    };
  }
}
