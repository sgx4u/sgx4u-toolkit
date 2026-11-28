/**
 * Reports whether `value` is a CSS Color Level 4 `hsl()` or `hsla()` color.
 *
 * Channels may be comma-separated or space-separated. Alpha may be a
 * fourth comma-separated component or a slash component. The hue is a
 * number with an optional `deg`, `rad`, `grad`, or `turn` unit. Saturation
 * and lightness are percentages from 0% through 100%. Alpha is a number
 * from 0 through 1 or a percentage. The keyword `none` is not accepted.
 * Surrounding whitespace is ignored. A non-string returns `false`. The
 * input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is an `hsl()` or `hsla()` color.
 * @example
 * isHSLColor("hsl(120 100% 50% / 0.5)");
 */
export function isHSLColor(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    const parts = readColorFunction(value, ["hsl", "hsla"]);
    if (parts === undefined) {
        return false;
    }
    const [hue, saturation, lightness] = parts.channels;
    if (
        hue === undefined ||
        saturation === undefined ||
        lightness === undefined
    ) {
        return false;
    }
    return (
        isHue(hue) &&
        isPercentage(saturation) &&
        isPercentage(lightness) &&
        (parts.alpha === undefined || isAlphaComponent(parts.alpha))
    );
}

/**
 * The pieces inside a CSS color function.
 */
interface ColorFunctionParts {
    /** Hue, saturation, and lightness text. */
    channels: readonly string[];
    /** The alpha text, when the function included one. */
    alpha: string | undefined;
}

/**
 * Splits a CSS color function into channels and an optional alpha.
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
 * Whether `hue` is a number with an optional angle unit.
 *
 * @param hue - The hue token.
 * @returns `true` for a plain decimal or one with `deg`, `rad`, `grad`, or `turn`.
 */
function isHue(hue: string): boolean {
    return /^[+-]?\d+(?:\.\d+)?(?:deg|rad|grad|turn)?$/iu.test(hue);
}

/**
 * Whether `text` is a percentage from 0% through 100%.
 *
 * @param text - A channel token.
 * @returns `true` when it is in range.
 */
function isPercentage(text: string): boolean {
    if (!text.endsWith("%")) {
        return false;
    }
    const amount = readDecimal(text.slice(0, -1));
    return amount !== undefined && amount >= 0 && amount <= 100;
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
