import { inspectPrivateKey } from "./private-key-tools";
import { generateKeyPairSync } from "node:crypto";

function expect(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const VALID_RSA = generateKeyPairSync("rsa", { modulusLength: 2048 }).privateKey.export({
  type: "pkcs8",
  format: "pem",
}) as string;

const VALID_EC = generateKeyPairSync("ec", { namedCurve: "prime256v1" }).privateKey.export({
  type: "pkcs8",
  format: "pem",
}) as string;

async function run() {
  const blank = await inspectPrivateKey("");
  expect(!blank.ok, "blank should fail");

  const nonPem = await inspectPrivateKey("hello");
  expect(!nonPem.ok, "non-pem should fail");

  const wrongArtifact = await inspectPrivateKey("-----BEGIN PUBLIC KEY-----\nQQ==\n-----END PUBLIC KEY-----");
  expect(!wrongArtifact.ok && wrongArtifact.error.includes("PUBLIC KEY"), "public key should fail");

  const encrypted = await inspectPrivateKey("-----BEGIN ENCRYPTED PRIVATE KEY-----\nQQ==\n-----END ENCRYPTED PRIVATE KEY-----");
  expect(!encrypted.ok && encrypted.error.includes("ENCRYPTED PRIVATE KEY"), "encrypted should fail");

  const legacy = await inspectPrivateKey("-----BEGIN RSA PRIVATE KEY-----\nQQ==\n-----END RSA PRIVATE KEY-----");
  expect(!legacy.ok && legacy.error.includes("PKCS#8"), "legacy should fail");

  const multi = await inspectPrivateKey("-----BEGIN PRIVATE KEY-----\nQQ==\n-----END PRIVATE KEY-----\n-----BEGIN PRIVATE KEY-----\nQQ==\n-----END PRIVATE KEY-----");
  expect(!multi.ok && multi.error.includes("1개만"), "multi should fail");

  const malformed = await inspectPrivateKey("-----BEGIN PRIVATE KEY-----\n***\n-----END PRIVATE KEY-----");
  expect(!malformed.ok, "malformed should fail");

  const rsa = await inspectPrivateKey(VALID_RSA);
  expect(rsa.ok && rsa.summary.keyFamily === "RSA", "rsa should parse");

  const ec = await inspectPrivateKey(VALID_EC);
  expect(ec.ok && ec.summary.keyFamily === "EC", "ec should parse");

  console.log("private-key-tools tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
