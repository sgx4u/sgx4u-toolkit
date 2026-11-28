/**
 * Reports whether `value` is a CSS Color Level 4 `rgb()` or `rgba()` color.
 *
 * Channels may be comma-separated or space-separated. Alpha may be a
 * fourth comma-separated component or a slash component. A channel is a
 * number from 0 through 255 or a percentage from 0% through 100%, and all
 * three channels use the same kind. Alpha is a number from 0 through 1 or
 * a percentage. The keyword `none` is not accepted. Surrounding whitespace
 * is ignored. A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is an `rgb()` or `rgba()` color.
 * @example
 * isRGBColor("rgb(255 0 0 / 0.5)");
 */
export function isRGBColor(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    const parts = readColorFunction(value, ["rgb", "rgba"]);
    if (parts === undefined) {
        return false;
    }
    const kinds = parts.channels.map((channel) => channelKind(channel));
    if (kinds.some((kind) => kind === undefined)) {
        return false;
    }
    if (new Set(kinds).size !== 1) {
        return false;
    }
    return parts.alpha === undefined || isAlphaComponent(parts.alpha);
}

/**
 * The pieces inside a CSS color function.
 */
interface ColorFunctionParts {
    /** The three channel texts. */
    channels: readonly string[];
    /** The alpha text, when the function included one. */
    alpha: string | undefined;
}

/**
 * Splits a CSS color function into channels and an optional alpha.
 *
 * Comma syntax and slash syntax cannot be mixed.
 *
 * @param value - The full function text.
 * @param names - Function names, compared without case.
 * @returns The parts, or `undefined` when the shape does not match.
 */
function readColorFunction(
    value: string,
    names: readonly string[],
): ColorFunctionParts | undefined {
    const match = /^([A-Za-z]+)\((.*)\)$/u.exec(value.trim());
    if (match === null) {
        return undefined;
    }
    const name = (match[1] ?? "").toLowerCase();
    if (!names.includes(name)) {
        return undefined;
    }
    const body = (match[2] ?? "").trim();
    if (body.length === 0) {
        return undefined;
    }
    if (body.includes(",")) {
        if (body.includes("/")) {
            return undefined;
        }
        const pieces = body.split(",").map((piece) => piece.trim());
        if (
            (pieces.length !== 3 && pieces.length !== 4) ||
            pieces.some((piece) => piece.length === 0 || /\s/u.test(piece))
        ) {
            return undefined;
        }
        return {
            channels: [pieces[0] ?? "", pieces[1] ?? "", pieces[2] ?? ""],
            alpha: pieces[3],
        };
    }
    const slashPieces = body.split("/");
    if (slashPieces.length > 2) {
        return undefined;
    }
    const channels = (slashPieces[0] ?? "")
        .trim()
        .split(/\s+/u)
        .filter((channel) => channel.length > 0);
    if (channels.length !== 3) {
        return undefined;
    }
    if (slashPieces.length === 1) {
        return { channels, alpha: undefined };
    }
    const alpha = (slashPieces[1] ?? "").trim();
    if (alpha.length === 0 || /\s/u.test(alpha)) {
        return undefined;
    }
    return { channels, alpha };
}

/**
 * Classifies one RGB channel.
 *
 * @param channel - One channel token.
 * @returns `"number"`, `"percent"`, or `undefined` when it is out of range.
 */
function channelKind(channel: string): "number" | "percent" | undefined {
    if (channel.endsWith("%")) {
        const amount = readDecimal(channel.slice(0, -1));
        if (amount === undefined || amount < 0 || amount > 100) {
            return undefined;
        }
        return "percent";
    }
    const amount = readDecimal(channel);
    if (amount === undefined || amount < 0 || amount > 255) {
        return undefined;
    }
    return "number";
}

/**
 * Whether `alpha` is a number from 0 through 1 or a percentage.
 *
 * @param alpha - The alpha token.
 * @returns `true` when it is in range.
 */
function isAlphaComponent(alpha: string): boolean {
    if (alpha.endsWith("%")) {
        const amount = readDecimal(alpha.slice(0, -1));
        return amount !== undefined && amount >= 0 && amount <= 100;
    }
    const amount = readDecimal(alpha);
    return amount !== undefined && amount >= 0 && amount <= 1;
}

/**
 * Parses a plain decimal, with an optional sign and fraction.
 *
 * @param text - The number text, without a unit.
 * @returns The number, or `undefined` when the text is not a plain decimal.
 */
function readDecimal(text: string): number | undefined {
    if (!/^[+-]?\d+(?:\.\d+)?$/u.test(text)) {
        return undefined;
    }
    const amount = Number(text);
    return Number.isFinite(amount) ? amount : undefined;
}
