import {
  DNS,
  EMAIL,
  IP,
  Pkcs10CertificateRequest,
  SubjectAlternativeNameExtension,
  URL,
} from "@peculiar/x509";

export type CsrSummary = {
  subject: string;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  publicKeyDetail: string | null;
  sanEntries: string[];
  extensionCount: number;
  signatureStatus: "valid" | "invalid" | "unable-to-verify";
  sha256PublicKeyFingerprint: string;
};

export type CsrInspectResult =
  | {
      ok: true;
      summary: CsrSummary;
    }
  | {
      ok: false;
      error: string;
    };

const CSR_LABELS = ["CERTIFICATE REQUEST", "NEW CERTIFICATE REQUEST"];
const CERTIFICATE_LABEL = "CERTIFICATE";
const KEY_LABELS = [
  "PUBLIC KEY",
  "PRIVATE KEY",
  "RSA PRIVATE KEY",
  "RSA PUBLIC KEY",
  "EC PRIVATE KEY",
  "EC PUBLIC KEY",
  "ENCRYPTED PRIVATE KEY",
];

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

function getSanEntries(request: Pkcs10CertificateRequest) {
  const extension = request.getExtension("2.5.29.17");
  if (!extension) {
    return [];
  }

  const subjectAlternativeName = new SubjectAlternativeNameExtension(extension.rawData);
  return subjectAlternativeName.names.items.map((name) => {
    if (name.type === DNS || name.type === EMAIL || name.type === IP || name.type === URL) {
      return `${name.type}: ${name.value}`;
    }

    return `${name.type}: ${name.value}`;
  });
}

async function getSignatureStatus(request: Pkcs10CertificateRequest): Promise<CsrSummary["signatureStatus"]> {
  try {
    const verified = await request.verify();
    return verified ? "valid" : "invalid";
  } catch {
    return "unable-to-verify";
  }
}

export async function inspectCsr(input: string): Promise<CsrInspectResult> {
  const normalized = input.trim();
  if (!normalized) {
    return {
      ok: false,
      error: "해석할 PEM CSR을 입력해 주세요.",
    };
  }

  const labels = getPemLabels(normalized);
  if (labels.length === 0) {
    return {
      ok: false,
      error: "PEM 형식의 CSR을 입력해 주세요.",
    };
  }

  if (labels.length !== 1) {
    return {
      ok: false,
      error: "이번 단계에서는 PEM CSR 1개만 지원합니다.",
    };
  }

  const label = labels[0];
  if (label === CERTIFICATE_LABEL) {
    return {
      ok: false,
      error: "이번 단계에서는 인증서 PEM이 아니라 CSR PEM만 지원합니다.",
    };
  }

  if (KEY_LABELS.includes(label)) {
    return {
      ok: false,
      error: "이번 단계에서는 키 PEM이 아니라 CSR PEM만 지원합니다.",
    };
  }

  if (!CSR_LABELS.includes(label)) {
    return {
      ok: false,
      error: "지원하지 않는 PEM 블록입니다. CERTIFICATE REQUEST만 해석할 수 있습니다.",
    };
  }

  try {
    const request = new Pkcs10CertificateRequest(normalized);
    const algorithm = request.publicKey.algorithm;

    return {
      ok: true,
      summary: {
        subject: request.subject,
        signatureAlgorithm: formatAlgorithmName(request.signatureAlgorithm),
        publicKeyAlgorithm: formatAlgorithmName(algorithm),
        publicKeyDetail: getPublicKeyDetail(algorithm),
        sanEntries: getSanEntries(request),
        extensionCount: request.extensions.length,
        signatureStatus: await getSignatureStatus(request),
        sha256PublicKeyFingerprint: await getSha256Fingerprint(request.publicKey.rawData),
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "CSR을 해석할 수 없습니다.",
    };
  }
}
