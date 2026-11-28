import type {
    CircularPolicy,
    PrototypeKeys,
    PrototypePolicy,
} from "../types/object-config.types.js";

/**
 * Arguments for the options form of `cloneDeep`.
 *
 * A plain object is read as these arguments when it owns `value` and every
 * own string key is one of `value`, `circular`, `prototypes`, or
 * `prototypeKeys`. An object that also owns some other key is cloned as data.
 */
export interface CloneDeepParams {
    /** The value to copy. */
    value: unknown;

    /**
     * What to do when a nested value points at an ancestor.
     *
     * @defaultValue `"preserve"`
     */
    circular?: CircularPolicy;

    /**
     * How a class instance is copied.
     *
     * @defaultValue `"strip"`
     */
    prototypes?: PrototypePolicy;

    /**
     * How `__proto__`, `prototype`, and `constructor` are copied.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;
}
