import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes a single string to prevent XSS attacks.
 * @param text The input string to sanitize.
 * @returns The sanitized string, or null if the input was null or undefined.
 */
export function sanitizeText(text: string | null | undefined): string | null {
    if (text === null || text === undefined) {
        return null;
    }
    const trimmed = String(text).trim();
    if (trimmed === "") return null;
    return DOMPurify.sanitize(trimmed);
}

/**
 * Sanitizes an array of strings.
 * @param arr The array of strings to sanitize.
 * @returns A new array with each string sanitized, or null.
 */
export function sanitizeTextArray(arr: string[] | null | undefined): string[] | null {
    if (arr === null || arr === undefined) {
        return null;
    }
    return arr.map((text) => DOMPurify.sanitize(String(text).trim())).filter(Boolean);
}
