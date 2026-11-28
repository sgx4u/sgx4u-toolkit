/** How a currency amount shows its currency. */
export type CurrencyDisplay = "symbol" | "narrowSymbol" | "code" | "name";

/** Which sign characters a formatted number includes. */
export type SignDisplay =
    "auto" | "always" | "exceptZero" | "negative" | "never";

/** Whether a formatted integer keeps trailing fraction zeros. */
export type TrailingZeroDisplay = "auto" | "stripIfInteger";

/** How compact notation spells its suffix. */
export type CompactDisplay = "short" | "long";

/** When digit grouping separators are inserted. */
export type UseGrouping = boolean | "always" | "min2" | "auto";

/** Scientific or compact display style for a formatted number. */
export type NumberNotation =
    "standard" | "scientific" | "engineering" | "compact";

/** How a currency sign is placed for negative amounts. */
export type CurrencySign = "standard" | "accounting";

/** How a unit name is spelled. */
export type UnitDisplay = "short" | "long" | "narrow";
