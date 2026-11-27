/**
 * A dictionary created by `Object`, `Object.create(null)`, or the equivalent
 * constructor in another realm.
 *
 * Arrays, dates, maps, and class instances are not plain objects.
 */
export type PlainObject = Record<string, unknown>;
