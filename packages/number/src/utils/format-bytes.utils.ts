import type { ByteStandard } from "../types/byte-standard.types.js";
import { formatFiniteNumber } from "./format-number.utils.js";
import { getNumberFormatter } from "./intl-locale.utils.js";

const siNames = [
    "byte",
    "kilobyte",
    "megabyte",
    "gigabyte",
    "terabyte",
    "petabyte",
    "exabyte",
] as const;
const iecNames = [
    "byte",
    "kibibyte",
    "mebibyte",
    "gibibyte",
    "tebibyte",
    "pebibyte",
    "exbibyte",
] as const;
const siBitNames = [
    "bit",
    "kilobit",
    "megabit",
    "gigabit",
    "terabit",
    "petabit",
    "exabit",
] as const;
const siSymbols = ["B", "kB", "MB", "GB", "TB", "PB", "EB"] as const;
const iecSymbols = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB"] as const;
const siBitSymbols = [
    "bit",
    "kbit",
    "Mbit",
    "Gbit",
    "Tbit",
    "Pbit",
    "Ebit",
] as const;
const iecBitSymbols = [
    "bit",
    "Kibit",
    "Mibit",
    "Gibit",
    "Tibit",
    "Pibit",
    "Eibit",
] as const;

/**
 * Localized byte or bit size. `value` is bytes when `bits` is false and bits
 * when `bits` is true. A missing `Intl` unit falls back to the English symbol.
 */
export function formatByteSize(parameters: {
    value: number;
    locale?: string | readonly string[];
    standard: ByteStandard;
    bits: boolean;
    signed: boolean;
    maximumFractionDigits?: number;
}): string | undefined {
    const { value, locale, standard, bits, signed, maximumFractionDigits } =
        parameters;
    if (!Number.isFinite(value)) {
        return undefined;
    }
    const base = standard === "IEC" ? 1024 : 1000;
    let scaled = Math.abs(value);
    let index = 0;
    while (index < siSymbols.length - 1 && scaled >= base) {
        scaled /= base;
        index += 1;
    }
    const signedScaled = value < 0 ? -scaled : scaled;
    const unitName = bits
        ? siBitNames[index]
        : standard === "IEC"
          ? iecNames[index]
          : siNames[index];
    const symbol = bits
        ? standard === "IEC"
            ? iecBitSymbols[index]
            : siBitSymbols[index]
        : standard === "IEC"
          ? iecSymbols[index]
          : siSymbols[index];
    if (unitName !== undefined) {
        const localized = tryUnitFormat({
            value: signedScaled,
            unit: unitName,
            signed,
            ...(locale === undefined ? {} : { locale }),
            ...(maximumFractionDigits === undefined
                ? {}
                : { maximumFractionDigits }),
        });
        if (localized !== undefined) {
            return localized;
        }
    }
    const numberText = formatFiniteNumber(Math.abs(signedScaled), {
        maximumFractionDigits: maximumFractionDigits ?? 2,
        useGrouping: true,
        ...(locale === undefined ? {} : { locale }),
    });
    if (numberText === undefined || symbol === undefined) {
        return undefined;
    }
    const sign = value < 0 ? "-" : signed && value > 0 ? "+" : "";
    return `${sign}${numberText} ${symbol}`;
}

function tryUnitFormat(parameters: {
    value: number;
    locale?: string | readonly string[];
    unit: string;
    signed: boolean;
    maximumFractionDigits?: number;
}): string | undefined {
    try {
        const formatter = getNumberFormatter(parameters.locale, {
            style: "unit",
            unit: parameters.unit,
            unitDisplay: "short",
            maximumFractionDigits: parameters.maximumFractionDigits ?? 2,
            signDisplay: parameters.signed ? "exceptZero" : "auto",
        });
        return formatter.format(parameters.value);
    } catch {
        return undefined;
    }
}
