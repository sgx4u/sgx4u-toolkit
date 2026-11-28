import { defineLibraryConfig } from "@sgx4u/tsdown-config";
import type { UserConfig } from "tsdown";

/**
 * tsdown config for this package.
 *
 * The binding is annotated so `isolatedDeclarations` can type the default
 * export. Each entry emits ESM, CommonJS, and both declaration files.
 * `validators/locale` is a nested entry so the subpath keeps that folder.
 */
const libraryConfig: UserConfig = defineLibraryConfig({
    entry: {
        index: "src/index.ts",
        transliterate: "src/transliterate.ts",
        "html-entities": "src/html-entities.ts",
        "validators/locale": "src/validators/locale.ts",
    },
});

export default libraryConfig;
