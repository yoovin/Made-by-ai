import { inspectCertificate } from "@/lib/certificate-tools";
import { inspectCsr } from "@/lib/csr-tools";
import { inspectPublicKey } from "@/lib/public-key-tools";

export type MatchArtifactType = "certificate" | "csr" | "public-key";

export type PublicKeyMatchSideSummary = {
  artifactType: MatchArtifactType;
  publicKeyAlgorithm: string;
  publicKeyDetail: string | null;
  sha256PublicKeyFingerprint: string;
};

export type PublicKeyMatchResult =
  | {
      ok: true;
      left: PublicKeyMatchSideSummary;
      right: PublicKeyMatchSideSummary;
      match: boolean;
    }
  | {
      ok: false;
      leftError: string | null;
      rightError: string | null;
      error: string;
    };

function detectArtifactType(input: string): MatchArtifactType | null {
  const normalized = input.trim();
  if (normalized.includes("-----BEGIN CERTIFICATE-----")) {
    return "certificate";
  }

  if (
    normalized.includes("-----BEGIN CERTIFICATE REQUEST-----") ||
    normalized.includes("-----BEGIN NEW CERTIFICATE REQUEST-----")
  ) {
    return "csr";
  }

  if (normalized.includes("-----BEGIN PUBLIC KEY-----")) {
    return "public-key";
  }

  return null;
}

async function inspectMatchSide(input: string): Promise<
  | { ok: true; summary: PublicKeyMatchSideSummary }
  | { ok: false; error: string }
> {
  const normalized = input.trim();
  if (!normalized) {
    return { ok: false, error: "비교할 PEM 입력을 붙여 넣어 주세요." };
  }

  if (normalized.startsWith("{") || normalized.startsWith("[")) {
    return { ok: false, error: "이번 단계에서는 JWK/JWKS가 아니라 PEM artifact만 비교할 수 있습니다." };
  }

  if (/^ssh-|^ecdsa-sha2-/m.test(normalized)) {
    return { ok: false, error: "이번 단계에서는 OpenSSH 키가 아니라 PEM artifact만 비교할 수 있습니다." };
  }

  const artifactType = detectArtifactType(normalized);
  if (!artifactType) {
    return { ok: false, error: "지원하지 않는 입력입니다. CERTIFICATE, CERTIFICATE REQUEST, PUBLIC KEY만 비교할 수 있습니다." };
  }

  if (artifactType === "certificate") {
    const result = await inspectCertificate(normalized);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    return {
      ok: true,
      summary: {
        artifactType,
        publicKeyAlgorithm: result.summary.publicKeyAlgorithm,
        publicKeyDetail: result.summary.publicKeyDetail,
        sha256PublicKeyFingerprint: result.summary.sha256PublicKeyFingerprint,
      },
    };
  }

  if (artifactType === "csr") {
    const result = await inspectCsr(normalized);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    return {
      ok: true,
      summary: {
        artifactType,
        publicKeyAlgorithm: result.summary.publicKeyAlgorithm,
        publicKeyDetail: result.summary.publicKeyDetail,
        sha256PublicKeyFingerprint: result.summary.sha256PublicKeyFingerprint,
      },
    };
  }

  const result = await inspectPublicKey(normalized);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return {
    ok: true,
    summary: {
      artifactType,
      publicKeyAlgorithm: result.summary.publicKeyAlgorithm,
      publicKeyDetail: result.summary.publicKeyDetail,
      sha256PublicKeyFingerprint: result.summary.sha256Fingerprint,
    },
  };
}

export async function comparePublicKeyArtifacts(leftInput: string, rightInput: string): Promise<PublicKeyMatchResult> {
  const [left, right] = await Promise.all([inspectMatchSide(leftInput), inspectMatchSide(rightInput)]);

  if (!left.ok || !right.ok) {
    return {
      ok: false,
      leftError: left.ok ? null : left.error,
      rightError: right.ok ? null : right.error,
      error: "비교할 수 없는 입력이 있습니다.",
    };
  }

  return {
    ok: true,
    left: left.summary,
    right: right.summary,
    match: left.summary.sha256PublicKeyFingerprint === right.summary.sha256PublicKeyFingerprint,
  };
}
