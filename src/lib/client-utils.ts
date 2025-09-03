
'use client';

/**
 * Triggers a file download in the browser.
 * @param filename The desired name of the file.
 * @param data The file content. For text-based files like CSV, this is a string. For binary files like XLSX, this is a Base64 encoded string.
 * @param mimeType The MIME type of the file.
 */
export function downloadFile(filename: string, data: string, mimeType: string) {
    const isBase64 = mimeType !== 'text/csv';
    const blob = isBase64
        ? new Blob([Buffer.from(data, 'base64')], { type: mimeType })
        : new Blob([data], { type: `${mimeType};charset=utf-8;` });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
