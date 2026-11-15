export function validateRequiredText(value, minLength = 1, maxLength = 3000) {
    const text = String(value || "").trim();
    return {
        valid: text.length >= minLength && text.length <= maxLength,
        value: text
    };
}