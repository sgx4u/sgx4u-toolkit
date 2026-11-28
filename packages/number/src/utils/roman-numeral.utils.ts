const standardRomanPattern =
    /^M{0,3}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})$/i;

const romanValues: readonly { symbol: string; value: number }[] = [
    { symbol: "M", value: 1000 },
    { symbol: "CM", value: 900 },
    { symbol: "D", value: 500 },
    { symbol: "CD", value: 400 },
    { symbol: "C", value: 100 },
    { symbol: "XC", value: 90 },
    { symbol: "L", value: 50 },
    { symbol: "XL", value: 40 },
    { symbol: "X", value: 10 },
    { symbol: "IX", value: 9 },
    { symbol: "V", value: 5 },
    { symbol: "IV", value: 4 },
    { symbol: "I", value: 1 },
];

/**
 * Standard Roman numerals from 1 to 3999, or the parenthetical thousands
 * form through 3999999 when `style` is `"extended"`.
 *
 * `4000` in the extended style is `(IV)`. `3999999` is `(MMMCMXCIX)CMXCIX`.
 */
export function romanFromInteger(
    value: number,
    style: "standard" | "extended",
): string | undefined {
    if (!Number.isInteger(value) || value < 1) {
        return undefined;
    }
    const limit = style === "extended" ? 3_999_999 : 3999;
    if (value > limit) {
        return undefined;
    }
    if (value < 4000) {
        return standardRoman(value);
    }
    const thousands = Math.floor(value / 1000);
    const remainder = value % 1000;
    const high = standardRoman(thousands);
    const low = remainder === 0 ? "" : standardRoman(remainder);
    return `(${high})${low}`;
}

/**
 * Parses a standard Roman numeral, or one parenthetical thousands group.
 * The match is case-insensitive. Invalid text returns `undefined`.
 */
export function integerFromRoman(value: string): number | undefined {
    const text = value.trim();
    if (text.length === 0) {
        return undefined;
    }
    const upper = text.toUpperCase();
    const extended = /^\(([IVXLCDM]+)\)([IVXLCDM]*)$/.exec(upper);
    if (extended !== null) {
        const highText = extended[1];
        const lowText = extended[2] ?? "";
        if (highText === undefined) {
            return undefined;
        }
        const high = standardValue(highText);
        const low = lowText.length === 0 ? 0 : standardValue(lowText);
        if (high === undefined || low === undefined) {
            return undefined;
        }
        return high * 1000 + low;
    }
    return standardValue(upper);
}

function standardRoman(value: number): string {
    let remaining = value;
    let text = "";
    for (const entry of romanValues) {
        while (remaining >= entry.value) {
            text += entry.symbol;
            remaining -= entry.value;
        }
    }
    return text;
}

function standardValue(text: string): number | undefined {
    if (!standardRomanPattern.test(text) || text.length === 0) {
        return undefined;
    }
    let total = 0;
    let index = 0;
    while (index < text.length) {
        const pair = text.slice(index, index + 2);
        const pairEntry = romanValues.find((entry) => entry.symbol === pair);
        if (pairEntry !== undefined && pair.length === 2) {
            total += pairEntry.value;
            index += 2;
            continue;
        }
        const one = text[index];
        const oneEntry = romanValues.find((entry) => entry.symbol === one);
        if (oneEntry === undefined) {
            return undefined;
        }
        total += oneEntry.value;
        index += 1;
    }
    return total;
}
