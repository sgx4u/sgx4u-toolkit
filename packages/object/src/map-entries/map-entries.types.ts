import type { mapSkip } from "./map-entries.js";

/**
 * The sentinel returned by a `mapEntries` mapper to drop an entry.
 */
export type MapSkip = typeof mapSkip;

/**
 * Returns the replacement entry, or `mapSkip` to drop it.
 *
 * Called as `mapper(key, value, object)`. When `deep` is true, `value` is the
 * nested container after its own entries have been mapped. `object` is the
 * plain object that owns the key.
 */
export type EntryMapper = (
    key: string,
    value: unknown,
    object: Readonly<Record<string, unknown>>,
) => readonly [PropertyKey, unknown] | MapSkip;

/**
 * Arguments for `mapEntries`.
 */
export interface MapEntriesParams {
    /**
     * The dictionary whose entries are replaced.
     *
     * `null`, primitives, and arrays return `undefined`.
     */
    object: unknown;

    /**
     * Builds the new entry. Return `mapSkip` to drop the entry. A dangerous
     * key is skipped. A later duplicate key wins.
     */
    mapper: EntryMapper;

    /**
     * When true, also map entries of nested plain objects and of objects inside arrays.
     *
     * @defaultValue `false`
     */
    deep?: boolean;
}
