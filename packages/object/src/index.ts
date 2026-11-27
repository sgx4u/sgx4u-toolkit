/**
 * Public entry for `@sgx4u/object`.
 *
 * JSON Patch and canonical hashing stay on `@sgx4u/object/json-patch` and
 * `@sgx4u/object/hash`. This module does not import them.
 */
export { applyObjectPatch } from "./apply-object-patch/apply-object-patch.js";
export type { ApplyObjectPatchParams } from "./apply-object-patch/apply-object-patch.types.js";
export { applyPathUpdates } from "./apply-path-updates/apply-path-updates.js";
export type {
    ApplyPathUpdatesParams,
    PathUpdate,
} from "./apply-path-updates/apply-path-updates.types.js";
export { assign } from "./assign/assign.js";
export type { AssignParams } from "./assign/assign.types.js";
export { clone } from "./clone/clone.js";
export { cloneDeep } from "./clone-deep/clone-deep.js";
export type { CloneDeepParams } from "./clone-deep/clone-deep.types.js";
export {
    cloneContinue,
    cloneDeepWith,
} from "./clone-deep-with/clone-deep-with.js";
export type { CloneDeepWithParams } from "./clone-deep-with/clone-deep-with.types.js";
export { convertKeys } from "./convert-keys/convert-keys.js";
export type { ConvertKeysParams } from "./convert-keys/convert-keys.types.js";
export { createEmptyObject } from "./create-empty-object/create-empty-object.js";
export type { CreateEmptyObjectParams } from "./create-empty-object/create-empty-object.types.js";
export { createObject } from "./create-object/create-object.js";
export type { ObjectInstance } from "./create-object/create-object.types.js";
export { defaults } from "./defaults/defaults.js";
export type { DefaultsParams } from "./defaults/defaults.types.js";
export { defaultsDeep } from "./defaults-deep/defaults-deep.js";
export type { DefaultsDeepParams } from "./defaults-deep/defaults-deep.types.js";
export { diffObjects } from "./diff-objects/diff-objects.js";
export type { DiffObjectsParams } from "./diff-objects/diff-objects.types.js";
export { evolve } from "./evolve/evolve.js";
export type { EvolveParams, EvolveRule } from "./evolve/evolve.types.js";
export { findKey } from "./find-key/find-key.js";
export type { FindKeyParams } from "./find-key/find-key.types.js";
export { findLastKey } from "./find-last-key/find-last-key.js";
export type { FindLastKeyParams } from "./find-last-key/find-last-key.types.js";
export { findPath } from "./find-path/find-path.js";
export type { FindPathParams } from "./find-path/find-path.types.js";
export { findValue } from "./find-value/find-value.js";
export type { FindValueParams } from "./find-value/find-value.types.js";
export { flattenObject } from "./flatten-object/flatten-object.js";
export type {
    FlattenArrays,
    FlattenObjectParams,
} from "./flatten-object/flatten-object.types.js";
export { formatObjectPath } from "./format-object-path/format-object-path.js";
export type { FormatObjectPathParams } from "./format-object-path/format-object-path.types.js";
export { freezeDeep } from "./freeze-deep/freeze-deep.js";
export type { FreezeDeepParams } from "./freeze-deep/freeze-deep.types.js";
export { fromMap } from "./from-map/from-map.js";
export { fromObjectEntries } from "./from-object-entries/from-object-entries.js";
export { getObjectEntries } from "./get-object-entries/get-object-entries.js";
export { getObjectKeys } from "./get-object-keys/get-object-keys.js";
export type { ObjectKeyListParams } from "./get-object-keys/get-object-keys.types.js";
export { getObjectSize } from "./get-object-size/get-object-size.js";
export type { GetObjectSizeParams } from "./get-object-size/get-object-size.types.js";
export { getObjectValues } from "./get-object-values/get-object-values.js";
export { getPath } from "./get-path/get-path.js";
export type {
    GetPathParams,
    GetPathResult,
} from "./get-path/get-path.types.js";
export { getPaths } from "./get-paths/get-paths.js";
export type { GetPathsParams } from "./get-paths/get-paths.types.js";
export { hasCircularReference } from "./has-circular-reference/has-circular-reference.js";
export { hasKey } from "./has-key/has-key.js";
export type { HasKeyParams } from "./has-key/has-key.types.js";
export { hasOwnKey } from "./has-own-key/has-own-key.js";
export type { HasOwnKeyParams } from "./has-own-key/has-own-key.types.js";
export { hasPath } from "./has-path/has-path.js";
export type { HasPathParams } from "./has-path/has-path.types.js";
export { invert } from "./invert/invert.js";
export type {
    DuplicateValues,
    InvertParams,
    InvertResult,
} from "./invert/invert.types.js";
export { invertBy } from "./invert-by/invert-by.js";
export type { InvertByParams } from "./invert-by/invert-by.types.js";
export { isDeepFrozen } from "./is-deep-frozen/is-deep-frozen.js";
export { isEmptyObject } from "./is-empty-object/is-empty-object.js";
export { isEqual } from "./is-equal/is-equal.js";
export type { IsEqualParams } from "./is-equal/is-equal.types.js";
export { isEqualWith } from "./is-equal-with/is-equal-with.js";
export type { IsEqualWithParams } from "./is-equal-with/is-equal-with.types.js";
export { isFrozenObject } from "./is-frozen-object/is-frozen-object.js";
export { isJSONArray } from "./is-json-array/is-json-array.js";
export { isJSONObject } from "./is-json-object/is-json-object.js";
export { isJSONValue } from "./is-json-value/is-json-value.js";
export { isMap } from "./is-map/is-map.js";
export { isMatch } from "./is-match/is-match.js";
export type { IsMatchParams } from "./is-match/is-match.types.js";
export { isMatchWith } from "./is-match-with/is-match-with.js";
export type { IsMatchWithParams } from "./is-match-with/is-match-with.types.js";
export { isNullPrototypeObject } from "./is-null-prototype-object/is-null-prototype-object.js";
export { isObjectLike } from "./is-object-like/is-object-like.js";
export { isPlainObject } from "./is-plain-object/is-plain-object.js";
export { isSet } from "./is-set/is-set.js";
export { isShallowEqual } from "./is-shallow-equal/is-shallow-equal.js";
export type { IsShallowEqualParams } from "./is-shallow-equal/is-shallow-equal.types.js";
export { isValidJSON } from "./is-valid-json/is-valid-json.js";
export { isWeakMap } from "./is-weak-map/is-weak-map.js";
export { isWeakSet } from "./is-weak-set/is-weak-set.js";
export { listCircularPaths } from "./list-circular-paths/list-circular-paths.js";
export type { ListCircularPathsParams } from "./list-circular-paths/list-circular-paths.types.js";
export { mapEntries, mapSkip } from "./map-entries/map-entries.js";
export type {
    EntryMapper,
    MapEntriesParams,
    MapSkip,
} from "./map-entries/map-entries.types.js";
export { mapKeys } from "./map-keys/map-keys.js";
export type { KeyMapper, MapKeysParams } from "./map-keys/map-keys.types.js";
export { mapValues } from "./map-values/map-values.js";
export type {
    MapValuesParams,
    ValueMapper,
} from "./map-values/map-values.types.js";
export { maskValues } from "./mask-values/mask-values.js";
export type { MaskValuesParams } from "./mask-values/mask-values.types.js";
export { mergeDeep } from "./merge-deep/merge-deep.js";
export type { MergeDeepParams } from "./merge-deep/merge-deep.types.js";
export { omit } from "./omit/omit.js";
export type { OmitParams } from "./omit/omit.types.js";
export { omitBy } from "./omit-by/omit-by.js";
export type { OmitByParams } from "./omit-by/omit-by.types.js";
export { omitPaths } from "./omit-paths/omit-paths.js";
export type { OmitPathsParams } from "./omit-paths/omit-paths.types.js";
export { parseJSON } from "./parse-json/parse-json.js";
export type {
    JSONReviver,
    ParseJSONParams,
} from "./parse-json/parse-json.types.js";
export { parseObjectPath } from "./parse-object-path/parse-object-path.js";
export type { ParseObjectPathParams } from "./parse-object-path/parse-object-path.types.js";
export { pick } from "./pick/pick.js";
export type { PickParams } from "./pick/pick.types.js";
export { pickBy } from "./pick-by/pick-by.js";
export type { PickByParams } from "./pick-by/pick-by.types.js";
export { pickPaths } from "./pick-paths/pick-paths.js";
export type { PickPathsParams } from "./pick-paths/pick-paths.types.js";
export { preventExtensionsDeep } from "./prevent-extensions-deep/prevent-extensions-deep.js";
export type { PreventExtensionsDeepParams } from "./prevent-extensions-deep/prevent-extensions-deep.types.js";
export { removeEmptyValues } from "./remove-empty-values/remove-empty-values.js";
export type { RemoveEmptyValuesParams } from "./remove-empty-values/remove-empty-values.types.js";
export { renameKeys } from "./rename-keys/rename-keys.js";
export type {
    RenameKeysParams,
    RenameMapping,
} from "./rename-keys/rename-keys.types.js";
export { revertObjectPatch } from "./revert-object-patch/revert-object-patch.js";
export type { RevertObjectPatchParams } from "./revert-object-patch/revert-object-patch.types.js";
export { sanitizeObject } from "./sanitize-object/sanitize-object.js";
export type { SanitizeObjectParams } from "./sanitize-object/sanitize-object.types.js";
export { sealDeep } from "./seal-deep/seal-deep.js";
export type { SealDeepParams } from "./seal-deep/seal-deep.types.js";
export { setPath } from "./set-path/set-path.js";
export type { SetPathParams } from "./set-path/set-path.types.js";
export { sortKeys } from "./sort-keys/sort-keys.js";
export type {
    KeyCompare,
    SortKeysParams,
    SortOrder,
} from "./sort-keys/sort-keys.types.js";
export { splitObject } from "./split-object/split-object.js";
export type {
    SplitObjectParams,
    SplitObjectResult,
} from "./split-object/split-object.types.js";
export { stringifyJSON } from "./stringify-json/stringify-json.js";
export type {
    StringifyCircular,
    StringifyJSONParams,
} from "./stringify-json/stringify-json.types.js";
export { toMap } from "./to-map/to-map.js";
export { transformObject } from "./transform-object/transform-object.js";
export type { TransformObjectParams } from "./transform-object/transform-object.types.js";
export { unflattenObject } from "./unflatten-object/unflatten-object.js";
export type {
    UnflattenArrays,
    UnflattenObjectParams,
} from "./unflatten-object/unflatten-object.types.js";
export { unsetPath } from "./unset-path/unset-path.js";
export type { UnsetPathParams } from "./unset-path/unset-path.types.js";
export { updatePath } from "./update-path/update-path.js";
export type { UpdatePathParams } from "./update-path/update-path.types.js";
export { walkObject } from "./walk-object/walk-object.js";
export type {
    WalkObjectParams,
    WalkObjectVisit,
    WalkObjectVisitor,
} from "./walk-object/walk-object.types.js";
export { zipObject } from "./zip-object/zip-object.js";
export type { ZipObjectParams } from "./zip-object/zip-object.types.js";
export type {
    MergeDeep,
    ObjectEntries,
    ObjectKeys,
    ObjectValues,
    OmitDeep,
    PartialDeep,
    PathValue,
    Paths,
    PickDeep,
    ReadonlyDeep,
    RequiredDeep,
    WritableDeep,
} from "./types/deep.types.js";
export type {
    JSONArray,
    JSONObject,
    JSONValue,
} from "./types/json-value.types.js";
export type {
    ArrayMerge,
    CircularPolicy,
    EmptyValue,
    KeyCase,
    ObjectConfig,
    PrototypeKeys,
    PrototypePolicy,
} from "./types/object-config.types.js";
export type { ObjectDiff } from "./types/object-diff.types.js";
export type { ObjectPath, PathSegment, PathStyle } from "./types/path.types.js";
export type { PlainObject } from "./types/plain-object.types.js";
