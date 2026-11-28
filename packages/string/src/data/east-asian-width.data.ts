/**
 * Inclusive code-point ranges whose East Asian Width is Wide or Fullwidth.
 *
 * Neutral, narrow, halfwidth, and ambiguous characters are absent on
 * purpose. Ambiguous characters then take width 1, which is the usual
 * modern terminal default. The ranges follow Unicode Standard Annex #11
 * for the blocks this package treats as two columns.
 */
export const wideCodePointRanges: readonly (readonly [number, number])[] = [
    [0x1100, 0x115f],
    [0x2329, 0x232a],
    [0x2e80, 0x303e],
    [0x3040, 0xa4cf],
    [0xa960, 0xa97f],
    [0xac00, 0xd7a3],
    [0xf900, 0xfaff],
    [0xfe10, 0xfe19],
    [0xfe30, 0xfe6f],
    [0xff01, 0xff60],
    [0xffe0, 0xffe6],
    [0x16fe0, 0x18d08],
    [0x1b000, 0x1b2fb],
    [0x1f200, 0x1f265],
    [0x20000, 0x3fffd],
];

/**
 * Inclusive ranges whose East Asian Width is Halfwidth.
 */
export const halfWidthCodePointRanges: readonly (readonly [number, number])[] =
    [
        [0xff61, 0xffdc],
        [0xffe8, 0xffee],
    ];
