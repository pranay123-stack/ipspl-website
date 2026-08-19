/**
 * Attachment limits, shared by the client form and the server handler.
 *
 * Kept separate from files.ts so the client can import the numbers without
 * pulling Buffer-dependent parsing code into the browser bundle.
 *
 * Vercel Functions reject request bodies over 4.5 MB before the handler runs,
 * so these sit under that with headroom for multipart overhead and the rest
 * of the form body.
 */
export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 3 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
export const PLATFORM_BODY_LIMIT = 4.5 * 1024 * 1024;

export const ACCEPTED_EXTENSIONS = [
  ".pdf", ".dwg", ".dxf", ".doc", ".docx", ".xls", ".xlsx", ".png", ".jpg", ".jpeg",
] as const;

export const mb = (bytes: number) => Math.round((bytes / 1024 / 1024) * 10) / 10;
