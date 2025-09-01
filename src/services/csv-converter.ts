
/**
 * Converts a 2D array into a CSV-formatted string.
 * Each inner array represents a row.
 * 
 * @param data The 2D array to convert. Each element can be a string, number, or boolean.
 * @returns A string representing the data in CSV format.
 */
export function convertArrayToCsv(data: any[][]): string {
    return data.map(row => 
        row.map(cell => {
            let cellString = String(cell);
            // Escape quotes by doubling them
            cellString = cellString.replace(/"/g, '""');
            // If the cell contains a comma, newline, or quote, enclose it in double quotes
            if (cellString.includes(',') || cellString.includes('\n') || cellString.includes('"')) {
                cellString = `"${cellString}"`;
            }
            return cellString;
        }).join(',')
    ).join('\n');
}
