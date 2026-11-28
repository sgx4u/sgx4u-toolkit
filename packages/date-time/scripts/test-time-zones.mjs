/* global process */
import { spawnSync } from "node:child_process";

const timeZones = [
    "UTC",
    "Asia/Kolkata",
    "America/New_York",
    "Europe/London",
    "America/Santiago",
    "Australia/Lord_Howe",
    "Pacific/Chatham",
];

for (const timeZone of timeZones) {
    process.stdout.write(`\n${timeZone}\n`);
    const result = spawnSync("pnpm", ["exec", "vitest", "run"], {
        env: { ...process.env, TZ: timeZone },
        stdio: "inherit",
    });
    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}
