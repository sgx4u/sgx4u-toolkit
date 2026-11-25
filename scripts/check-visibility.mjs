import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

const skippedDirectoryNames = new Set([
  "node_modules",
  "dist",
  ".git",
  ".turbo",
  "coverage",
]);

const scannedExtensions = new Set([
  ".json",
  ".jsonc",
  ".yaml",
  ".yml",
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".cts",
  ".mts",
  ".toml",
]);

const skippedRelativePaths = new Set([
  // These files name the forbidden scopes in order to reject them.
  "scripts/check-visibility.mjs",
  "scripts/check-visibility.test.mjs",
  "scripts/check-links.test.mjs",
  "domains/platform/eslint-config/index.js",
]);

const forbiddenReferences = [
  {
    name: "private-scope",
    expression: /@sgx4u-private\b/,
    message:
      "Public toolkit files cannot reference @sgx4u-private. Private packages live in a separate repository.",
  },
  {
    name: "ui-scope",
    expression: /@sgx4u\/ui(?:[\s"'`/]|$|-)/,
    message:
      "Toolkit files cannot reference @sgx4u/ui or @sgx4u/ui-*. UI packages live in sgx4u-ui.",
  },
];

/**
 * @param {string} rootDirectory
 * @returns {{ relativePath: string, lineNumber: number, name: string, message: string }[]}
 */
export function findForbiddenReferences(rootDirectory) {
  /** @type {{ relativePath: string, lineNumber: number, name: string, message: string }[]} */
  const findings = [];

  /**
   * @param {string} directory
   */
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (skippedDirectoryNames.has(entry.name)) {
        continue;
      }
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }
      const extension = path.extname(entry.name);
      if (!scannedExtensions.has(extension)) {
        continue;
      }
      const relativePath = path.relative(rootDirectory, absolutePath);
      if (skippedRelativePaths.has(relativePath)) {
        continue;
      }
      const contents = readFileSync(absolutePath, "utf8");
      const lines = contents.split(/\r?\n/);
      for (const [index, line] of lines.entries()) {
        for (const forbiddenReference of forbiddenReferences) {
          if (forbiddenReference.expression.test(line)) {
            findings.push({
              relativePath,
              lineNumber: index + 1,
              name: forbiddenReference.name,
              message: forbiddenReference.message,
            });
          }
          forbiddenReference.expression.lastIndex = 0;
        }
      }
    }
  }

  if (statSync(rootDirectory).isDirectory()) {
    walk(rootDirectory);
  }
  return findings;
}

function main() {
  const findings = findForbiddenReferences(repositoryRoot);
  if (findings.length === 0) {
    return;
  }
  for (const finding of findings) {
    console.error(
      `${finding.relativePath}:${finding.lineNumber} ${finding.message}`,
    );
  }
  process.exitCode = 1;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}
