import sanitizeHtml from "sanitize-html";

const sanitizeOptions = {
    allowedTags: [],
    allowedAttributes: {},
};

/**
 * Sanitizes a single string to prevent XSS attacks.
 * @param text The input string to sanitize.
 * @returns The sanitized string, or null if the input was null or undefined, or an empty string after trimming.
 */
export function sanitizeText(text: string | null | undefined): string | null {
    if (text === null || text === undefined) {
        return null;
    }
    const trimmed = String(text).trim();
    if (trimmed === "") {
        return null;
    }
    const sanitized = sanitizeHtml(trimmed, sanitizeOptions);
    // sanitize-html can return an empty string if the whole string was malicious
    return sanitized === "" ? null : sanitized;
}

/**
 * Sanitizes an array of strings.
 * @param arr The array of strings to sanitize.
 * @returns A new array with each string sanitized, or null if the input array was null/undefined.
 * Empty strings or strings that become empty after sanitization are filtered out.
 */
export function sanitizeTextArray(arr: string[] | null | undefined): string[] | null {
    if (arr === null || arr === undefined) {
        return null;
    }
    return arr
        .map((text) => {
            const trimmed = String(text).trim();
            if (trimmed === "") return null;
            return sanitizeHtml(trimmed, sanitizeOptions);
        })
        .filter((text): text is string => text !== null && text !== "");
}