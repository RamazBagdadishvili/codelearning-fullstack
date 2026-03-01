export const KA_MAP: Record<string, string> = {
    'a': 'ა', 'b': 'ბ', 'c': 'კ', 'd': 'დ', 'e': 'ე', 'f': 'ფ', 'g': 'გ',
    'h': 'ჰ', 'i': 'ი', 'j': 'ჟ', 'k': 'კ', 'l': 'ლ', 'm': 'მ', 'n': 'ნ',
    'o': 'ო', 'p': 'პ', 'q': 'ქ', 'r': 'რ', 's': 'ს', 't': 'ტ', 'u': 'უ',
    'v': 'ვ', 'w': 'წ', 'x': 'ხ', 'y': 'ყ', 'z': 'ზ'
};

/**
 * Fixes common typos in Georgian text by mapping Latin characters to their Georgian counterparts.
 * Skips content within backticks (code blocks and inline code).
 */
export function fixTypos(text: any): string {
    if (typeof text !== 'string') return '';
    return text.replace(/(`[^`]*`)|([a-zA-Z])/g, (match, code, char) => {
        if (code) return code;
        return KA_MAP[char.toLowerCase()] || char;
    });
}
