import { inspectPemBlocks } from "./pem-block-tools";

function expect(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const CERT = "-----BEGIN CERTIFICATE-----\nQQ==\n-----END CERTIFICATE-----";
const CSR = "-----BEGIN CERTIFICATE REQUEST-----\nQQ==\n-----END CERTIFICATE REQUEST-----";
const PUB = "-----BEGIN PUBLIC KEY-----\nQQ==\n-----END PUBLIC KEY-----";
const PRIV = "-----BEGIN PRIVATE KEY-----\nQQ==\n-----END PRIVATE KEY-----";
const ENC = "-----BEGIN ENCRYPTED PRIVATE KEY-----\nQQ==\n-----END ENCRYPTED PRIVATE KEY-----";
const BUNDLE = `${CERT}\n${CERT}`;
const MIXED = `${CERT}\n${PRIV}`;
const MISMATCH = "-----BEGIN CERTIFICATE-----\nQQ==\n-----END PUBLIC KEY-----";
const STRAY = "-----END CERTIFICATE-----";
const MISSING_END = "-----BEGIN CERTIFICATE-----\nQQ==";

const blank = inspectPemBlocks("");
expect(!blank.ok, "blank should fail");

const noPem = inspectPemBlocks("hello");
expect(!noPem.ok && noPem.issues[0]?.kind === "no-pem", "no-pem should fail with issue");

const cert = inspectPemBlocks(CERT);
expect(cert.ok && cert.blockCount === 1 && cert.blocks[0].category === "certificate", "single cert should work");

const csr = inspectPemBlocks(CSR);
expect(csr.ok && csr.blocks[0].category === "csr", "single csr should work");

const pub = inspectPemBlocks(PUB);
expect(pub.ok && pub.blocks[0].category === "public-key", "single public key should work");

const priv = inspectPemBlocks(PRIV);
expect(priv.ok && priv.blocks[0].category === "private-key", "single private key should classify");

const enc = inspectPemBlocks(ENC);
expect(enc.ok && enc.blocks[0].category === "encrypted-private-key", "single encrypted key should classify");

const bundle = inspectPemBlocks(BUNDLE);
expect(bundle.ok && bundle.sameLabelBundle && !bundle.mixedBundle, "same-label bundle should classify");

const mixed = inspectPemBlocks(MIXED);
expect(mixed.ok && mixed.mixedBundle, "mixed bundle should classify");

const mismatch = inspectPemBlocks(MISMATCH);
expect(!mismatch.ok && mismatch.issues.some((issue) => issue.kind === "mismatched-end"), "mismatch should fail");

const stray = inspectPemBlocks(STRAY);
expect(!stray.ok && stray.issues.some((issue) => issue.kind === "stray-end"), "stray end should fail");

const missingEnd = inspectPemBlocks(MISSING_END);
expect(!missingEnd.ok && missingEnd.issues.some((issue) => issue.kind === "missing-end"), "missing end should fail");

console.log("pem-block-tools tests passed");
