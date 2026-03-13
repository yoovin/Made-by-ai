import {
  DNS,
  EMAIL,
  IP,
  SubjectAlternativeNameExtension,
  URL,
  X509Certificate,
} from "@peculiar/x509";

export type CertificateStatus = "valid" | "expired" | "not-yet-valid";

export type CertificateSummary = {
  subject: string;
  issuer: string;
  serialNumber: string;
  notBeforeIso: string;
  notAfterIso: string;
  validityStatus: CertificateStatus;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  publicKeyDetail: string | null;
  sans: string[];
  sha256Fingerprint: string;
  sha256PublicKeyFingerprint: string;
};

export type CertificateInspectResult =
  | {
      ok: true;
      summary: CertificateSummary;
    }
  | {
      ok: false;
      error: string;
    };

const CERTIFICATE_LABEL = "CERTIFICATE";
const CSR_LABELS = ["CERTIFICATE REQUEST", "NEW CERTIFICATE REQUEST"];
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

function getValidityStatus(notBefore: Date, notAfter: Date, now = new Date()): CertificateStatus {
  if (now < notBefore) {
    return "not-yet-valid";
  }

  if (now > notAfter) {
    return "expired";
  }

  return "valid";
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
    throw new Error("현재 환경에서는 인증서 fingerprint를 계산할 수 없습니다.");
  }

  const digest = await subtle.digest("SHA-256", rawData);
  return formatFingerprint(new Uint8Array(digest));
}

function getSans(certificate: X509Certificate) {
  const extension = certificate.extensions.find((item) => item.type === "2.5.29.17");
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

export async function inspectCertificate(input: string): Promise<CertificateInspectResult> {
  const normalized = input.trim();
  if (!normalized) {
    return {
      ok: false,
      error: "해석할 PEM 인증서를 입력해 주세요.",
    };
  }

  const labels = getPemLabels(normalized);
  if (labels.length === 0) {
    return {
      ok: false,
      error: "PEM 형식의 인증서를 입력해 주세요.",
    };
  }

  if (labels.length !== 1) {
    return {
      ok: false,
      error: "이번 단계에서는 PEM 인증서 1개만 지원합니다.",
    };
  }

  const label = labels[0];
  if (CSR_LABELS.includes(label)) {
    return {
      ok: false,
      error: "이번 단계에서는 CSR이 아니라 인증서 PEM만 지원합니다.",
    };
  }

  if (KEY_LABELS.includes(label)) {
    return {
      ok: false,
      error: "이번 단계에서는 키 PEM이 아니라 인증서 PEM만 지원합니다.",
    };
  }

  if (label !== CERTIFICATE_LABEL) {
    return {
      ok: false,
      error: "지원하지 않는 PEM 블록입니다. CERTIFICATE만 해석할 수 있습니다.",
    };
  }

  try {
    const certificate = new X509Certificate(normalized);
    const algorithm = certificate.publicKey.algorithm;

    return {
      ok: true,
      summary: {
        subject: certificate.subject,
        issuer: certificate.issuer,
        serialNumber: certificate.serialNumber,
        notBeforeIso: certificate.notBefore.toISOString(),
        notAfterIso: certificate.notAfter.toISOString(),
        validityStatus: getValidityStatus(certificate.notBefore, certificate.notAfter),
        signatureAlgorithm: formatAlgorithmName(certificate.signatureAlgorithm),
        publicKeyAlgorithm: formatAlgorithmName(algorithm),
        publicKeyDetail: getPublicKeyDetail(algorithm),
        sans: getSans(certificate),
        sha256Fingerprint: await getSha256Fingerprint(certificate.rawData),
        sha256PublicKeyFingerprint: await getSha256Fingerprint(certificate.publicKey.rawData),
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "인증서를 해석할 수 없습니다.",
    };
  }
}
