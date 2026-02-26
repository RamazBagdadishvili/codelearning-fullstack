export const formatXP = (xp: number): string => {
    if (xp >= 10000) {
        return Math.floor(xp / 1000) + 'k';
    }
    if (xp >= 1000) {
        // აჩვენებს ერთ ათწილადს 1000-დან 9999-მდე (მაგ: 1.2k)
        const formatted = (xp / 1000).toFixed(1);
        return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'k' : formatted + 'k';
    }
    return xp.toString();
};
