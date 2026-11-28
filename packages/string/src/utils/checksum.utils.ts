/**
 * Whether `digits` satisfies the Luhn check.
 *
 * @param digits - ASCII digits only, at least one.
 * @returns `true` when the Luhn sum is divisible by 10.
 */
export function passesLuhn(digits: string): boolean {
    if (!/^\d+$/u.test(digits)) {
        return false;
    }
    let sum = 0;
    let alternate = false;
    for (let index = digits.length - 1; index >= 0; index -= 1) {
        let digit = Number(digits[index]);
        if (alternate) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        alternate = !alternate;
    }
    return sum % 10 === 0;
}

/**
 * ISO 7064 Mod 97-10 remainder used by IBAN.
 *
 * Letters expand to two digits, A = 10 through Z = 35. The walk stays in
 * integer range by reducing modulo 97 as it goes.
 *
 * @param value - The rearranged IBAN body.
 * @returns The remainder from 0 through 96.
 */
export function mod97(value: string): number {
    let remainder = 0;
    for (const character of value) {
        const code = character.charCodeAt(0);
        const expanded =
            code >= 65 && code <= 90
                ? String(code - 55)
                : code >= 97 && code <= 122
                  ? String(code - 87)
                  : character;
        for (const digit of expanded) {
            remainder = (remainder * 10 + Number(digit)) % 97;
        }
    }
    return remainder;
}
