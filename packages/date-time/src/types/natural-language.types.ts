/**
 * One date or range found inside a larger piece of text.
 */
export interface FoundDate {
    text: string;
    index: number;
    start: Date;
    end?: Date;
}
