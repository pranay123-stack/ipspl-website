/**
 * ATTACHMENT RULES
 * ================
 * Vercel Functions reject request bodies over 4.5 MB before the handler runs,
 * so these caps sit under that with headroom for multipart overhead and the
 * rest of the form body. The client-side check is the primary defence; the
 * Content-Length precheck in the route only catches the 4–4.5 MB band.
 */

import {
  ACCEPTED_EXTENSIONS,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
} from "./fileRules";

export * from "./fileRules";

/**
 * Declared MIME types we accept. Deliberately permissive on octet-stream:
 * DWG and DXF have no registered type, so browsers send octet-stream or
 * nothing. Extension and size are the real gates — declared type is trivially
 * spoofable and is checked only to catch honest mistakes.
 */
const ACCEPTED_MIME_PREFIXES = [
  "application/pdf",
  "application/octet-stream",
  "application/acad",
  "image/vnd.dwg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument",
  "application/vnd.ms-excel",
  "image/png",
  "image/jpeg",
];

export function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
}

/**
 * An attachment filename is attacker-controlled string data on its way into a
 * mail header. Strip anything that could break out of one.
 */
export function sanitiseFilename(raw: string): string {
  const ext = extensionOf(raw);
  const cleaned = raw
    // Control characters, including CR/LF header injection.
    .replace(/[\u0000-\u001f\u007f]/g, "")
    // Path separators.
    .replace(/[\\/]/g, "_")
    // Directory traversal.
    .replace(/\.{2,}/g, ".")
    // Leading dots or whitespace.
    .replace(/^[.\s]+/, "")
    .trim();

  const safe = cleaned.length > 0 ? cleaned : "attachment";
  return safe.length > 120 ? safe.slice(0, 100) + ext : safe;
}

export interface FileRejection {
  filename: string;
  reason: string;
}

export interface FileCheckResult {
  accepted: { filename: string; bytes: Buffer; contentType: string }[];
  rejections: FileRejection[];
}

/**
 * Validates a parsed file list. Returns rejections rather than throwing, so a
 * single bad drawing never costs the whole enquiry.
 */
export async function checkFiles(files: File[]): Promise<FileCheckResult> {
  const accepted: FileCheckResult["accepted"] = [];
  const rejections: FileRejection[] = [];
  let total = 0;

  for (const [i, file] of files.entries()) {
    const name = sanitiseFilename(file.name);

    if (i >= MAX_FILES) {
      rejections.push({ filename: name, reason: `Only ${MAX_FILES} files can be attached` });
      continue;
    }

    const ext = extensionOf(name) as (typeof ACCEPTED_EXTENSIONS)[number];
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      rejections.push({ filename: name, reason: "File type not accepted" });
      continue;
    }

    const declared = (file.type || "").toLowerCase();
    if (declared && !ACCEPTED_MIME_PREFIXES.some((p) => declared.startsWith(p))) {
      rejections.push({ filename: name, reason: "File type not accepted" });
      continue;
    }

    if (file.size > MAX_FILE_BYTES) {
      rejections.push({
        filename: name,
        reason: `Over ${Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB`,
      });
      continue;
    }

    if (total + file.size > MAX_TOTAL_BYTES) {
      rejections.push({ filename: name, reason: "Would exceed the total attachment limit" });
      continue;
    }

    total += file.size;
    accepted.push({
      filename: name,
      bytes: Buffer.from(await file.arrayBuffer()),
      contentType: declared || "application/octet-stream",
    });
  }

  return { accepted, rejections };
}
