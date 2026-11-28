import {
    escapeHTMLCall,
    readHtmlEntityLevel,
    unescapeHTMLCall,
} from "../escape-html-entities/html-entity-codec.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { isOptionsRecord } from "../utils/assertions.utils.js";
import type {
    HTMLEntitiesConfig,
    HTMLEntitiesToolkit,
} from "./create-html-entities.types.js";

export type {
    HTMLEntitiesConfig,
    HTMLEntitiesToolkit,
} from "./create-html-entities.types.js";

const stringConfigKeys = new Set<string>([
    "locale",
    "unit",
    "keepConsecutiveUppercase",
    "mergeAmbiguousCharacters",
    "titleCaseStyle",
    "smallWords",
    "slugifySeparator",
    "slugifyLowerCase",
    "truncationOmission",
    "truncationLocation",
    "maskCharacter",
    "unmaskedStartLength",
    "unmaskedEndLength",
    "collatorSensitivity",
    "numericCollation",
    "normalizeForm",
    "wordsPerMinute",
    "templatePattern",
]);

/**
 * Returns escape and unescape functions bound to one entity level.
 *
 * A call can still pass `level` and override the bound value. The two
 * functions do not share mutable maps with another instance beyond the
 * module's lazy name tables. Known `StringConfig` keys are accepted and
 * ignored. Any other key throws `RangeError`.
 *
 * @param config - Optional `level`. Omitted means `"html5"`.
 * @returns Functions that escape and unescape at that level.
 * @throws {@link TypeError} When `config` is not an object, or `level` is not a string.
 * @throws {@link RangeError} When `level` is unknown or a key is not recognized.
 * @example
 * createHTMLEntities({ level: "html5" });
 */
export function createHTMLEntities(
    config: HTMLEntitiesConfig = {},
): HTMLEntitiesToolkit {
    if (!isOptionsRecord(config)) {
        throw new TypeError(
            `config must be an object. Received ${describeReceived(config)}.`,
        );
    }
    for (const key of Object.keys(config)) {
        if (key !== "level" && !stringConfigKeys.has(key)) {
            throw new RangeError(
                `Unknown HTML entity config key ${JSON.stringify(key)}.`,
            );
        }
    }
    const level = readHtmlEntityLevel(config.level, "html5");
    const toolkit: HTMLEntitiesToolkit = {
        escapeHTMLEntities(valueOrOptions: unknown): string | undefined {
            return escapeHTMLCall(valueOrOptions, level);
        },
        unescapeHTMLEntities(valueOrOptions: unknown): string | undefined {
            return unescapeHTMLCall(valueOrOptions, level);
        },
    };
    return toolkit;
}
