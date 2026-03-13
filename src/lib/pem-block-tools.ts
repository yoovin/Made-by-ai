export type PemArtifactCategory =
  | "certificate"
  | "csr"
  | "public-key"
  | "private-key"
  | "encrypted-private-key"
  | "crl"
  | "pkcs7"
  | "unknown";

export type PemBlockSummary = {
  label: string;
  category: PemArtifactCategory;
  suggestedService: string | null;
};

export type PemIssue = {
  kind: "mismatched-end" | "stray-end" | "missing-end" | "nested-begin" | "no-pem";
  message: string;
};

export type PemInspectionResult =
  | {
      ok: true;
      blockCount: number;
      blocks: PemBlockSummary[];
      sameLabelBundle: boolean;
      mixedBundle: boolean;
      issues: PemIssue[];
    }
  | {
      ok: false;
      error: string;
      issues: PemIssue[];
    };

type BlockMatch = { type: "begin" | "end"; label: string };

const LABEL_CONFIG: Record<string, { category: PemArtifactCategory; suggestedService: string | null }> = {
  CERTIFICATE: { category: "certificate", suggestedService: "/services/certificate-inspector" },
  "CERTIFICATE REQUEST": { category: "csr", suggestedService: "/services/csr-inspector" },
  "NEW CERTIFICATE REQUEST": { category: "csr", suggestedService: "/services/csr-inspector" },
  "PUBLIC KEY": { category: "public-key", suggestedService: "/services/public-key-inspector" },
  "PRIVATE KEY": { category: "private-key", suggestedService: "/services/private-key-inspector" },
  "RSA PRIVATE KEY": { category: "private-key", suggestedService: null },
  "EC PRIVATE KEY": { category: "private-key", suggestedService: null },
  "DSA PRIVATE KEY": { category: "private-key", suggestedService: null },
  "OPENSSH PRIVATE KEY": { category: "private-key", suggestedService: null },
  "ENCRYPTED PRIVATE KEY": { category: "encrypted-private-key", suggestedService: null },
  "X509 CRL": { category: "crl", suggestedService: null },
  PKCS7: { category: "pkcs7", suggestedService: null },
  CMS: { category: "pkcs7", suggestedService: null },
};

function getLabelConfig(label: string) {
  return LABEL_CONFIG[label] ?? { category: "unknown" as const, suggestedService: null };
}

function parsePemMarkers(input: string) {
  const matches: Array<BlockMatch & { index: number }> = [];
  const regex = /-----BEGIN ([A-Z0-9 ]+)-----|-----END ([A-Z0-9 ]+)-----/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match[1]) {
      matches.push({ type: "begin", label: match[1], index: match.index });
    } else if (match[2]) {
      matches.push({ type: "end", label: match[2], index: match.index });
    }
  }

  return matches;
}

export function inspectPemBlocks(input: string): PemInspectionResult {
  if (!input.trim()) {
    return {
      ok: false,
      error: "식별할 PEM 텍스트를 입력해 주세요.",
      issues: [],
    };
  }

  const markers = parsePemMarkers(input);
  if (markers.length === 0) {
    return {
      ok: false,
      error: "PEM boundary를 찾을 수 없습니다.",
      issues: [{ kind: "no-pem", message: "BEGIN/END PEM boundary가 없습니다." }],
    };
  }

  const issues: PemIssue[] = [];
  const blocks: PemBlockSummary[] = [];
  let openLabel: string | null = null;

  for (const marker of markers) {
    if (marker.type === "begin") {
      if (openLabel) {
        issues.push({ kind: "nested-begin", message: `닫히지 않은 ${openLabel} 블록 안에서 ${marker.label} BEGIN을 발견했습니다.` });
      }
      openLabel = marker.label;
      continue;
    }

    if (!openLabel) {
      issues.push({ kind: "stray-end", message: `${marker.label} END가 대응하는 BEGIN 없이 나타났습니다.` });
      continue;
    }

    if (openLabel !== marker.label) {
      issues.push({ kind: "mismatched-end", message: `${openLabel} BEGIN이 ${marker.label} END로 닫혔습니다.` });
      openLabel = null;
      continue;
    }

    const config = getLabelConfig(marker.label);
    blocks.push({ label: marker.label, category: config.category, suggestedService: config.suggestedService });
    openLabel = null;
  }

  if (openLabel) {
    issues.push({ kind: "missing-end", message: `${openLabel} BEGIN에 대응하는 END가 없습니다.` });
  }

  if (blocks.length === 0) {
    return {
      ok: false,
      error: "완전한 PEM 블록을 식별할 수 없습니다.",
      issues,
    };
  }

  const labels = blocks.map((block) => block.label);
  const sameLabelBundle = blocks.length > 1 && new Set(labels).size === 1;
  const mixedBundle = blocks.length > 1 && new Set(labels).size > 1;

  return {
    ok: true,
    blockCount: blocks.length,
    blocks,
    sameLabelBundle,
    mixedBundle,
    issues,
  };
}
