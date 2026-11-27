import type {
    CircularPolicy,
    PrototypePolicy,
} from "../types/object-config.types.js";
import type { CloneVisit } from "../utils/clone.utils.js";

export type { CloneVisit } from "../utils/clone.utils.js";

/**
 * Arguments for `cloneDeepWith`.
 */
export interface CloneDeepWithParams {
    /** The value to copy. */
    value: unknown;

    /**
     * Called before the default clone of each value.
     *
     * Return `cloneContinue` to keep the default clone. Return `undefined`
     * to store `undefined`. Any other return value is used as-is and is not
     * cloned further.
     */
    customizer: (details: CloneVisit) => unknown;

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
}
