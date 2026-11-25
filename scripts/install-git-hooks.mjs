import { spawnSync } from "node:child_process";

const lefthook = spawnSync("lefthook", ["install"], { stdio: "inherit" });
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
