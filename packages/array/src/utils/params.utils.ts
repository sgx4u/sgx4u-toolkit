/**
 * Reads a flat params object.
 *
 * `null`, `undefined`, arrays, and other non-objects return `undefined` so
 * the caller can treat them as invalid input.
 *
 * @param input - The argument the caller passed.
 * @returns The params object, or `undefined`.
 */
export function readParams<Params extends object>(
    input: unknown,
): Params | undefined {
    if (input === null || input === undefined) {
        return undefined;
    }
    if (typeof input !== "object" || Array.isArray(input)) {
        return undefined;
    }
    return input as Params;
}

/**
 * Reads either a bare array or a params object.
 *
 * A bare array becomes `{ array }`. Any other non-object returns
 * `undefined`.
 *
 * @param input - A bare array or a params object.
 * @returns Params including `array`, or `undefined`.
 */
export function readArrayParams<Params extends { array: readonly unknown[] }>(
    input: unknown,
): Params | undefined {
    if (Array.isArray(input)) {
        return { array: input } as unknown as Params;
    }
    return readParams<Params>(input);
}

/**
 * Reads `array` from params.
 *
 * @param array - The candidate array.
 * @returns The same array, or `undefined` when it is not an array.
 */
export function readArray<Item>(array: unknown): readonly Item[] | undefined {
    if (!Array.isArray(array)) {
        return undefined;
    }
    return array as readonly Item[];
}

/**
 * Reads a list of arrays.
 *
 * A non-array list, or any slot that is not an array, returns `undefined`.
 *
 * @param arrays - The candidate list.
 * @returns The list, or `undefined`.
 */
export function readArrayList<Item>(
    arrays: unknown,
): readonly (readonly Item[])[] | undefined {
    if (!Array.isArray(arrays)) {
        return undefined;
    }
    for (const array of arrays) {
        if (!Array.isArray(array)) {
            return undefined;
        }
    }
    return arrays as readonly (readonly Item[])[];
}
