import assert from "node:assert/strict";
import { test } from "node:test";
import prettierConfig from "./index.js";

test("pins the repository format, including the four-space indent", () => {
    assert.deepEqual(prettierConfig, {
        semi: true,
        singleQuote: false,
        trailingComma: "all",
        printWidth: 80,
        arrowParens: "always",
        tabWidth: 4,
    });
});
