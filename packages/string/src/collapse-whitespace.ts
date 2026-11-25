const repeatedWhitespace = /\s+/g;

/** Trim the string and collapse each internal whitespace run to one space. */
export function collapseWhitespace(value: string): string {
    return value.trim().replace(repeatedWhitespace, " ");
}
