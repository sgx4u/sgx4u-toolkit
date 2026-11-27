import { describeReceived } from "../utils/describe-received.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import type { CreateEmptyObjectParams } from "./create-empty-object.types.js";

const emptyFields = ["prototype"] as const;

/**
 * Creates an object with `Object.create`.
 *
 * Called with no argument, the prototype is `null`. Pass
 * `{ prototype }` to choose another prototype. The options object is
 * recognized when it is plain, owns `prototype`, and owns no other string key.
 *
 * @param params - Omitted, or the prototype option.
 * @returns An empty object.
 * @throws {TypeError} When an argument is not `{ prototype }`, or when `prototype` is not `null` or an object.
 * @example
 * createEmptyObject();
 */
export function createEmptyObject(): object;
/**
 * @param params - The prototype option.
 */
export function createEmptyObject(params: CreateEmptyObjectParams): object;
/**
 * @param params - Omitted, or the prototype option.
 */
export function createEmptyObject(params?: CreateEmptyObjectParams): object {
    if (params === undefined) {
        return Object.create(null);
    }
    if (!isParameterRecord(params, "prototype", emptyFields)) {
        throw new TypeError(
            `\`createEmptyObject\` expected \`{ prototype }\`; received ${describeReceived(params)}.`,
        );
    }
    const prototype = params.prototype;
    if (!isPrototype(prototype)) {
        throw new TypeError(
            `\`prototype\` must be an object or null; received ${describeReceived(prototype)}.`,
        );
    }
    return Object.create(prototype);
}

/**
 * Whether `value` can be passed to `Object.create`.
 *
 * @param value - The prototype option.
 * @returns `true` for `null`, an object, or a function.
 */
function isPrototype(value: unknown): value is object | null {
    if (value === null) {
        return true;
    }
    return typeof value === "object" || typeof value === "function";
}
