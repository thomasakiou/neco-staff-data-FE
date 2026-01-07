/**
 * Converts yymmdd string to dd/mm/yy format
 * @param dateStr string in yymmdd format
 * @returns string in dd/mm/yy format
 */
export const formatDOB = (dateStr: string | null | undefined): string => {
    if (!dateStr || dateStr.length !== 6) return dateStr || '';

    const yy = dateStr.substring(0, 2);
    const mm = dateStr.substring(2, 4);
    const dd = dateStr.substring(4, 6);

    return `${dd}/${mm}/${yy}`;
};

/**
 * Converts dd/mm/yy back to yymmdd (if needed for API)
 * @param dateStr string in dd/mm/yy format
 * @returns string in yymmdd format
 */
export const parseDOB = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;

    const dd = parts[0].padStart(2, '0');
    const mm = parts[1].padStart(2, '0');
    const yy = parts[2].padStart(2, '0');

    return `${yy}${mm}${dd}`;
};

/**
 * Converts standard date string (e.g. 1998-08-11 00:00:00) to dd/mm/yyyy
 * @param dateStr date string
 * @returns formatted date string
 */
export const formatGeneralDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '';
    try {
        // Handle cases like "1998-08-11 00:00:00"
        const onlyDate = dateStr.split(' ')[0];
        const parts = onlyDate.split('-');
        if (parts.length === 3) {
            const [y, m, d] = parts;
            return `${d}/${m}/${y}`;
        }

        // Fallback for native Date parsing if needed
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    } catch (e) {
        return dateStr;
    }
};
