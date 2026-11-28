import { defineLibraryConfig } from "@sgx4u/tsdown-config";
import type { UserConfig } from "tsdown";

/**
 * tsdown config for this package.
 *
 * The binding is annotated so `isolatedDeclarations` can type the default
 * export. Universal and edge libraries keep the neutral platform. A Node
 * library sets `platform` to `"node"`.
 */
const libraryConfig: UserConfig = defineLibraryConfig({
    entry: {
        index: "src/index.ts",
        recurrence: "src/recurrence.ts",
        cron: "src/cron.ts",
        "natural-language": "src/natural-language.ts",
        astronomy: "src/astronomy.ts",
        "holidays/india": "src/holidays/india.ts",
        "holidays/united-states": "src/holidays/united-states.ts",
        "holidays/united-kingdom": "src/holidays/united-kingdom.ts",
    },
});

export default libraryConfig;
