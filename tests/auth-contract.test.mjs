import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const source = await readFile(
  fileURLToPath(new URL("../src/lib/auth-contract.ts", import.meta.url)),
  "utf8",
);
const { outputText, diagnostics = [] } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
  reportDiagnostics: true,
});
assert.equal(diagnostics.some((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error), false);

const authContract = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const {
  createGooglePayload,
  createLoginPayload,
  createRegisterPayload,
  getApiBaseUrl,
  getApiOrigin,
  isUnauthorizedStatus,
} = authContract;

test("API proxy accepts an origin with or without a trailing API path", () => {
  assert.equal(getApiOrigin("https://api.example.test"), "https://api.example.test");
  assert.equal(getApiOrigin("https://api.example.test/api/"), "https://api.example.test");
});

test("API client uses same-origin requests in browsers and an absolute URL on the server", () => {
  assert.equal(getApiBaseUrl("https://api.example.test", true), "/api");
  assert.equal(
    getApiBaseUrl("https://api.example.test", false),
    "https://api.example.test/api",
  );
});

test("registration and login normalize email but preserve the exact password", () => {
  const password = "  Exact Password  ";

  assert.deepEqual(
    createRegisterPayload({
      name: "  Example User  ",
      email: "  USER@Example.test ",
      password,
      photoURL: "  https://example.test/photo.png  ",
    }),
    {
      name: "Example User",
      email: "user@example.test",
      password,
      photoURL: "https://example.test/photo.png",
    },
  );
  assert.deepEqual(createLoginPayload(" USER@Example.test ", password), {
    email: "user@example.test",
    password,
  });
});

test("Google authentication sends the ID token under the credential key", () => {
  assert.deepEqual(createGooglePayload("google-id-token"), {
    credential: "google-id-token",
  });
});

test("only an unauthorized response is treated as a logged-out session", () => {
  assert.equal(isUnauthorizedStatus(401), true);
  assert.equal(isUnauthorizedStatus(500), false);
  assert.equal(isUnauthorizedStatus(undefined), false);
});
