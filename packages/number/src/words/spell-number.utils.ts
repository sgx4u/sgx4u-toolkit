/** One named power in a number-word scale. */
export interface WordScale {
    value: bigint;
    name: string;
    ordinal: string;
}

/** Major and minor names for one currency. */
export interface CurrencyUnitNames {
    major: string;
    majorPlural: string;
    minor: string;
    minorPlural: string;
}

/** Word lists and grouping for one number-word locale. */
export interface WordLanguage {
    ones: readonly string[];
    ordinalOnes: readonly string[];
    tens: readonly string[];
    ordinalTens: readonly string[];
    hundred: string;
    hundredOrdinal: string;
    scales: readonly WordScale[];
    grouping: "international" | "indian";
    currencies: Readonly<Record<string, CurrencyUnitNames>>;
    chequeMajor: Readonly<Record<string, string>>;
}

const maximumFractionDigits = 2;

/**
 * Spells an integer or a value with at most two decimal places.
 * Out-of-range and non-finite values return `undefined`.
 */
export function spellCardinal(
    value: number | bigint,
    language: WordLanguage,
    ordinal: boolean,
): string | undefined {
    if (typeof value === "bigint") {
        return spellBigInteger(value, language, ordinal);
    }
    if (!Number.isFinite(value)) {
        return undefined;
    }
    const negative = value < 0;
    const absolute = Math.abs(value);
    const text = absolute.toString();
    if (text.includes("e")) {
        return undefined;
    }
    const [wholeText, fractionText] = text.split(".");
    if (wholeText === undefined) {
        return undefined;
    }
    if (
        fractionText !== undefined &&
        (ordinal || fractionText.length > maximumFractionDigits)
    ) {
        return undefined;
    }
    const whole = spellBigInteger(
        BigInt(wholeText),
        language,
        ordinal && fractionText === undefined,
    );
    if (whole === undefined) {
        return undefined;
    }
    const body =
        fractionText === undefined
            ? whole
            : `${spellBigInteger(BigInt(wholeText), language, false)} point ${fractionText
                  .split("")
                  .map((digit) => language.ones[Number(digit)])
                  .join(" ")}`;
    if (body.includes("undefined")) {
        return undefined;
    }
    return negative ? `minus ${body}` : body;
}

/**
 * Parses cardinal or ordinal words from the same language.
 */
export function parseCardinal(
    value: string,
    language: WordLanguage,
): number | undefined {
    const tokens = value
        .trim()
        .toLowerCase()
        .split(/[\s-]+/)
        .filter((token) => token.length > 0 && token !== "and");
    if (tokens.length === 0) {
        return undefined;
    }
    let index = 0;
    let negative = false;
    if (tokens[0] === "minus") {
        negative = true;
        index += 1;
    }
    const pointIndex = tokens.indexOf("point", index);
    const wholeTokens =
        pointIndex === -1
            ? tokens.slice(index)
            : tokens.slice(index, pointIndex);
    const fractionTokens =
        pointIndex === -1 ? [] : tokens.slice(pointIndex + 1);
    const whole =
        wholeTokens.length === 0 ? 0 : readGroups(wholeTokens, language);
    if (whole === undefined) {
        return undefined;
    }
    if (fractionTokens.length === 0) {
        return negative ? -whole : whole;
    }
    if (fractionTokens.length > maximumFractionDigits) {
        return undefined;
    }
    let fraction = "";
    for (const token of fractionTokens) {
        const digit = language.ones.indexOf(token);
        if (digit < 0 || digit > 9) {
            return undefined;
        }
        fraction += String(digit);
    }
    const parsed = Number(`${negative ? "-" : ""}${String(whole)}.${fraction}`);
    return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Currency words. Unknown three-letter codes use the code as the major name
 * and `"minor"` for the hundredth. Any other code throws `RangeError`.
 */
export function spellCurrency(
    value: number,
    currency: string,
    style: "plain" | "cheque",
    language: WordLanguage,
): string | undefined {
    if (!Number.isFinite(value)) {
        return undefined;
    }
    if (style === "cheque" && value < 0) {
        return undefined;
    }
    const names = currencyNames(currency, language);
    const negative = value < 0;
    const absolute = Math.abs(value);
    const roundedText = absolute.toFixed(2);
    if (roundedText.includes("e")) {
        return undefined;
    }
    const [majorText, fractionText = ""] = roundedText.split(".");
    if (majorText === undefined) {
        return undefined;
    }
    const scaled =
        Number(majorText) * 100 +
        Number(fractionText.padEnd(2, "0").slice(0, 2));
    if (!Number.isSafeInteger(scaled)) {
        return undefined;
    }
    const major = Math.floor(scaled / 100);
    const minor = scaled % 100;
    const majorWords = spellBigInteger(BigInt(major), language, false);
    const minorWords =
        minor === 0
            ? undefined
            : spellBigInteger(BigInt(minor), language, false);
    if (majorWords === undefined || (minor !== 0 && minorWords === undefined)) {
        return undefined;
    }
    if (style === "cheque") {
        const label =
            language.chequeMajor[currency] ?? titleCase(names.majorPlural);
        const minorLabel = titleCase(
            minor === 1 ? names.minor : names.minorPlural,
        );
        const amount =
            minor === 0
                ? titleCase(majorWords)
                : `${titleCase(majorWords)} and ${titleCase(minorWords ?? "")} ${minorLabel}`;
        return `${label} ${amount} Only`;
    }
    const majorLabel = major === 1 ? names.major : names.majorPlural;
    const minorLabel = minor === 1 ? names.minor : names.minorPlural;
    const body =
        minor === 0
            ? `${majorWords} ${majorLabel}`
            : `${majorWords} ${majorLabel} and ${minorWords} ${minorLabel}`;
    return negative ? `minus ${body}` : body;
}

function currencyNames(
    currency: string,
    language: WordLanguage,
): CurrencyUnitNames {
    const known = language.currencies[currency];
    if (known !== undefined) {
        return known;
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
        throw new RangeError(
            `currency must be a known currency code. Received ${JSON.stringify(currency)}.`,
        );
    }
    return {
        major: currency,
        majorPlural: currency,
        minor: "minor",
        minorPlural: "minors",
    };
}

function spellBigInteger(
    value: bigint,
    language: WordLanguage,
    ordinal: boolean,
): string | undefined {
    const negative = value < 0n;
    let remaining = negative ? -value : value;
    if (remaining === 0n) {
        return ordinal ? language.ordinalOnes[0] : language.ones[0];
    }
    const parts: string[] = [];
    const scales = [...language.scales].sort((left, right) =>
        left.value < right.value ? 1 : -1,
    );
    for (const scale of scales) {
        if (remaining < scale.value) {
            continue;
        }
        const count = remaining / scale.value;
        remaining %= scale.value;
        const countWords = spellBelowScale(count, language, false);
        if (countWords === undefined) {
            return undefined;
        }
        parts.push(`${countWords} ${scale.name}`);
    }
    if (remaining > 0n) {
        const tail = spellBelowScale(remaining, language, false);
        if (tail === undefined) {
            return undefined;
        }
        parts.push(tail);
    }
    if (parts.length === 0) {
        return undefined;
    }
    let text = parts.join(" ");
    if (ordinal) {
        text = ordinalizeLast(text, language);
    }
    return negative ? `minus ${text}` : text;
}

function spellBelowScale(
    value: bigint,
    language: WordLanguage,
    ordinal: boolean,
): string | undefined {
    if (value >= 1000n) {
        return undefined;
    }
    const number = Number(value);
    const hundreds = Math.floor(number / 100);
    const rest = number % 100;
    const parts: string[] = [];
    if (hundreds > 0) {
        const hundredName =
            ordinal && rest === 0 ? language.hundredOrdinal : language.hundred;
        parts.push(`${language.ones[hundreds]} ${hundredName}`);
    }
    if (rest > 0 || parts.length === 0) {
        parts.push(
            spellBelowHundred(rest, language, ordinal && hundreds === 0),
        );
    }
    return parts.join(" ");
}

function spellBelowHundred(
    value: number,
    language: WordLanguage,
    ordinal: boolean,
): string {
    const ones = ordinal ? language.ordinalOnes : language.ones;
    const tens = ordinal ? language.ordinalTens : language.tens;
    if (value < 20) {
        return ones[value] ?? language.ones[0] ?? "zero";
    }
    const ten = Math.floor(value / 10);
    const one = value % 10;
    const tenName = tens[ten] ?? language.tens[ten] ?? "";
    if (one === 0) {
        return tenName;
    }
    const oneName = (ordinal ? language.ordinalOnes : language.ones)[one] ?? "";
    return `${language.tens[ten]}-${oneName}`;
}

function ordinalizeLast(text: string, language: WordLanguage): string {
    const words = text.split(" ");
    const last = words[words.length - 1];
    if (last === undefined) {
        return text;
    }
    words[words.length - 1] = ordinalToken(last, language);
    return words.join(" ");
}

function ordinalToken(token: string, language: WordLanguage): string {
    if (token.includes("-")) {
        const [ten, one] = token.split("-");
        if (ten === undefined || one === undefined) {
            return token;
        }
        return `${ten}-${ordinalToken(one, language)}`;
    }
    const oneIndex = language.ones.indexOf(token);
    if (oneIndex >= 0) {
        return language.ordinalOnes[oneIndex] ?? token;
    }
    const tenIndex = language.tens.indexOf(token);
    if (tenIndex >= 0) {
        return language.ordinalTens[tenIndex] ?? token;
    }
    if (token === language.hundred) {
        return language.hundredOrdinal;
    }
    const scale = language.scales.find((entry) => entry.name === token);
    return scale?.ordinal ?? `${token}th`;
}

function readGroups(
    tokens: readonly string[],
    language: WordLanguage,
): number | undefined {
    let total = 0;
    let current = 0;
    for (const token of tokens) {
        const value = tokenValue(token, language);
        if (value === undefined) {
            return undefined;
        }
        if (value.kind === "scale") {
            current = (current === 0 ? 1 : current) * value.amount;
            total += current;
            current = 0;
            continue;
        }
        if (value.kind === "hundred") {
            current = (current === 0 ? 1 : current) * 100;
            continue;
        }
        current += value.amount;
    }
    const sum = total + current;
    return Number.isSafeInteger(sum) ? sum : undefined;
}

function tokenValue(
    token: string,
    language: WordLanguage,
): { kind: "unit" | "hundred" | "scale"; amount: number } | undefined {
    const ordinalOne = language.ordinalOnes.indexOf(token);
    if (ordinalOne >= 0) {
        return { kind: "unit", amount: ordinalOne };
    }
    const one = language.ones.indexOf(token);
    if (one >= 0) {
        return { kind: "unit", amount: one };
    }
    const ordinalTen = language.ordinalTens.indexOf(token);
    if (ordinalTen >= 0) {
        return { kind: "unit", amount: ordinalTen * 10 };
    }
    const ten = language.tens.indexOf(token);
    if (ten >= 0) {
        return { kind: "unit", amount: ten * 10 };
    }
    if (token === language.hundred || token === language.hundredOrdinal) {
        return { kind: "hundred", amount: 100 };
    }
    const scale = language.scales.find(
        (entry) => entry.name === token || entry.ordinal === token,
    );
    if (scale !== undefined) {
        return { kind: "scale", amount: Number(scale.value) };
    }
    return undefined;
}

function titleCase(text: string): string {
    return text.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}
