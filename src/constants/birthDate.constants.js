const CURRENT_YEAR = new Date().getFullYear();

export const YEARS = Array.from({ length: 80 }, (_, i) => CURRENT_YEAR - i);
export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
export const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
