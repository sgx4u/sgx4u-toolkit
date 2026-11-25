import { defineLibraryConfig } from "@sgx4u/tsdown-config";
import type { UserConfig } from "tsdown";

// Annotate the binding so isolatedDeclarations can type the default export.
const libraryConfig: UserConfig = defineLibraryConfig();

export default libraryConfig;
