import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const lefthookExecutable =
  process.platform === "win32"
    ? path.join(repositoryRoot, "node_modules", ".bin", "lefthook.cmd")
    : "lefthook";

const lefthook = spawnSync(lefthookExecutable, ["install"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (lefthook.status === 0) {
  process.exit(0);
}

const hooksPath = spawnSync("git", ["config", "--get", "core.hooksPath"], {
  encoding: "utf8",
});
if ((hooksPath.stdout ?? "").trim().length > 0) {
  console.log(
    "core.hooksPath is already set, so lefthook did not replace it. Commit hooks stay with the existing hook path.",
  );
  process.exit(0);
}

process.exit(lefthook.status ?? 1);
