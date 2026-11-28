/**
 * Public entry for `@sgx4u/string/html-entities`.
 *
 * Re-exports only. The root entry does not import this module.
 */
export { createHTMLEntities } from "./create-html-entities/create-html-entities.js";
export { escapeHTMLEntities } from "./escape-html-entities/escape-html-entities.js";
export type { EscapeHTMLEntitiesOptions } from "./escape-html-entities/escape-html-entities.types.js";
export { unescapeHTMLEntities } from "./unescape-html-entities/unescape-html-entities.js";
