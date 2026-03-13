export type PrivateKeyFamily = "RSA" | "EC";

export type PrivateKeySummary = {
  format: "PKCS#8";
  keyFamily: PrivateKeyFamily;
  keyDetail: string;
  pkcs8ByteLength: number;
};

export type PrivateKeyInspectResult =
  | {
      ok: true;
      summary: PrivateKeySummary;
    }
  | {
      ok: false;
      error: string;
    };

const PRIVATE_KEY_LABEL = "PRIVATE KEY";
const ENCRYPTED_PRIVATE_KEY_LABEL = "ENCRYPTED PRIVATE KEY";
const LEGACY_PRIVATE_KEY_LABELS = ["RSA PRIVATE KEY", "EC PRIVATE KEY", "DSA PRIVATE KEY", "OPENSSH PRIVATE KEY"];
const WRONG_ARTIFACT_LABELS = [
  "CERTIFICATE",
  "CERTIFICATE REQUEST",
  "NEW CERTIFICATE REQUEST",
  "PUBLIC KEY",
  "RSA PUBLIC KEY",
  "EC PUBLIC KEY",
];

function getPemLabels(input: string) {
  return Array.from(input.matchAll(/-----BEGIN ([A-Z0-9 ]+)-----/g), (match) => match[1]);
}

function pemToDer(input: string) {
  const base64 = input
    .replace(/-----BEGIN [A-Z0-9 ]+-----/g, "")
    .replace(/-----END [A-Z0-9 ]+-----/g, "")
    .replace(/\s+/g, "");

  if (!base64) {
    throw new Error("PEM payload가 비어 있습니다.");
  }

  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function importPkcs8Rsa(der: Uint8Array) {
  return globalThis.crypto?.subtle.importKey(
    "pkcs8",
    der.buffer.slice(0),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    true,
    ["sign"],
  );
}

async function importPkcs8Ec(der: Uint8Array, namedCurve: "P-256" | "P-384" | "P-521") {
  return globalThis.crypto?.subtle.importKey(
    "pkcs8",
    der.buffer.slice(0),
    { name: "ECDSA", namedCurve },
    true,
    ["sign"],
  );
}

async function identifyPkcs8Key(der: Uint8Array): Promise<PrivateKeySummary> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("현재 환경에서는 PKCS#8 개인키를 해석할 수 없습니다.");
  }

  try {
    const key = await importPkcs8Rsa(der);
    if (!key || key.type !== "private") {
      throw new Error("RSA key import failed");
    }
    const algorithm = key.algorithm as RsaHashedKeyAlgorithm;
    return {
      format: "PKCS#8",
      keyFamily: "RSA",
      keyDetail: `${algorithm.modulusLength}-bit RSA`,
      pkcs8ByteLength: der.byteLength,
    };
  } catch {}

  for (const curve of ["P-256", "P-384", "P-521"] as const) {
    try {
      const key = await importPkcs8Ec(der, curve);
      if (!key || key.type !== "private") {
        throw new Error("EC key import failed");
      }
      return {
        format: "PKCS#8",
        keyFamily: "EC",
        keyDetail: curve,
        pkcs8ByteLength: der.byteLength,
      };
    } catch {}
  }

  throw new Error("이번 단계에서는 RSA/EC PKCS#8 개인키만 지원합니다.");
}

export async function inspectPrivateKey(input: string): Promise<PrivateKeyInspectResult> {
  const normalized = input.trim();
  if (!normalized) {
    return {
      ok: false,
      error: "해석할 PEM 개인키를 입력해 주세요.",
    };
  }

  const labels = getPemLabels(normalized);
  if (labels.length === 0) {
    return {
      ok: false,
      error: "PEM 형식의 개인키를 입력해 주세요.",
    };
  }

  if (labels.length !== 1) {
    return {
      ok: false,
      error: "이번 단계에서는 PEM 개인키 1개만 지원합니다.",
    };
  }

  const label = labels[0];
  if (WRONG_ARTIFACT_LABELS.includes(label)) {
    return {
      ok: false,
      error: "이번 단계에서는 CERTIFICATE/CSR/PUBLIC KEY가 아니라 PRIVATE KEY PEM만 지원합니다.",
    };
  }

  if (label === ENCRYPTED_PRIVATE_KEY_LABEL) {
    return {
      ok: false,
      error: "이번 단계에서는 ENCRYPTED PRIVATE KEY를 지원하지 않습니다.",
    };
  }

  if (LEGACY_PRIVATE_KEY_LABELS.includes(label)) {
    return {
      ok: false,
      error: "이번 단계에서는 legacy private key PEM이 아니라 BEGIN PRIVATE KEY (PKCS#8)만 지원합니다.",
    };
  }

  if (label !== PRIVATE_KEY_LABEL) {
    return {
      ok: false,
      error: "지원하지 않는 PEM 블록입니다. BEGIN PRIVATE KEY만 해석할 수 있습니다.",
    };
  }

  try {
    return {
      ok: true,
      summary: await identifyPkcs8Key(pemToDer(normalized)),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "개인키를 해석할 수 없습니다.",
    };
  }
}
