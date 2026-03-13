import { PublicKey } from "@peculiar/x509";

export type PublicKeySummary = {
  publicKeyAlgorithm: string;
  publicKeyDetail: string | null;
  spkiByteLength: number;
  sha256Fingerprint: string;
};

export type PublicKeyInspectResult =
  | {
      ok: true;
      summary: PublicKeySummary;
    }
  | {
      ok: false;
      error: string;
    };

const PUBLIC_KEY_LABEL = "PUBLIC KEY";
const CERTIFICATE_LABEL = "CERTIFICATE";
const CSR_LABELS = ["CERTIFICATE REQUEST", "NEW CERTIFICATE REQUEST"];
const PRIVATE_KEY_LABELS = [
  "PRIVATE KEY",
  "RSA PRIVATE KEY",
  "EC PRIVATE KEY",
  "ENCRYPTED PRIVATE KEY",
];
const UNSUPPORTED_KEY_LABELS = ["RSA PUBLIC KEY", "OPENSSH PUBLIC KEY"];

function getPemLabels(input: string) {
  return Array.from(input.matchAll(/-----BEGIN ([A-Z0-9 ]+)-----/g), (match) => match[1]);
}

function formatAlgorithmName(algorithm: Algorithm) {
  return "name" in algorithm && typeof algorithm.name === "string" ? algorithm.name : "알 수 없음";
}

function getPublicKeyDetail(algorithm: Algorithm) {
  if ("modulusLength" in algorithm && typeof algorithm.modulusLength === "number") {
    return `${algorithm.modulusLength}비트 RSA`;
  }

  if ("namedCurve" in algorithm && typeof algorithm.namedCurve === "string") {
    return algorithm.namedCurve;
  }

  return null;
}

function formatFingerprint(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(":");
}

async function getSha256Fingerprint(rawData: ArrayBuffer) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("현재 환경에서는 공개키 fingerprint를 계산할 수 없습니다.");
  }

  const digest = await subtle.digest("SHA-256", rawData);
  return formatFingerprint(new Uint8Array(digest));
}

export async function inspectPublicKey(input: string): Promise<PublicKeyInspectResult> {
  const normalized = input.trim();
  if (!normalized) {
    return {
      ok: false,
      error: "해석할 PEM 공개키를 입력해 주세요.",
    };
  }

  const labels = getPemLabels(normalized);
  if (labels.length === 0) {
    return {
      ok: false,
      error: "PEM 형식의 공개키를 입력해 주세요.",
    };
  }

  if (labels.length !== 1) {
    return {
      ok: false,
      error: "이번 단계에서는 PEM 공개키 1개만 지원합니다.",
    };
  }

  const label = labels[0];
  if (label === CERTIFICATE_LABEL) {
    return {
      ok: false,
      error: "이번 단계에서는 인증서 PEM이 아니라 PUBLIC KEY PEM만 지원합니다.",
    };
  }

  if (CSR_LABELS.includes(label)) {
    return {
      ok: false,
      error: "이번 단계에서는 CSR PEM이 아니라 PUBLIC KEY PEM만 지원합니다.",
    };
  }

  if (PRIVATE_KEY_LABELS.includes(label)) {
    return {
      ok: false,
      error: "이번 단계에서는 private key PEM이 아니라 PUBLIC KEY PEM만 지원합니다.",
    };
  }

  if (UNSUPPORTED_KEY_LABELS.includes(label)) {
    return {
      ok: false,
      error: "이번 단계에서는 BEGIN PUBLIC KEY 형식만 지원합니다.",
    };
  }

  if (label !== PUBLIC_KEY_LABEL) {
    return {
      ok: false,
      error: "지원하지 않는 PEM 블록입니다. PUBLIC KEY만 해석할 수 있습니다.",
    };
  }

  try {
    const publicKey = new PublicKey(normalized);
    const algorithm = publicKey.algorithm;

    return {
      ok: true,
      summary: {
        publicKeyAlgorithm: formatAlgorithmName(algorithm),
        publicKeyDetail: getPublicKeyDetail(algorithm),
        spkiByteLength: publicKey.rawData.byteLength,
        sha256Fingerprint: await getSha256Fingerprint(publicKey.rawData),
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "공개키를 해석할 수 없습니다.",
    };
  }
}
