import type {
  ValidationConfig,
  ValidationResult,
  ValidationRule,
} from "@/shared/types/common.types";

export const normalize = (s: unknown) =>
  String(s ?? "")
    .trim()
    .toLowerCase();

export const normalizeClrfNl = (v: unknown) => {
  if (v === null || v === undefined) return "";
  let s = String(v);
  // normalize CRLF -> LF, remove trailing/leading spaces on each line
  s = s.replace(/\r\n?/g, "\n");
  s = s
    .split("\n")
    .map((l) => l.trim())
    .join("\n");
  // also remove accidental space before newline (e.g., "String \nMANDATORY")
  s = s.replace(/ \n/g, "\n");
  return s;
};

export const validateFileData = (
  rows: Record<string, unknown>[] | null,
  config: ValidationConfig
): ValidationResult => {
  const errors: string[] = [];
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    errors.push("File is empty or could not be parsed.");
    return { valid: false, errors };
  }

  const headerSet = new Set<string>();
  rows.forEach((row) => {
    Object.keys(row || {}).forEach((k) => headerSet.add(normalize(k)));
  });

  const normalizedConfig: [string, string, ValidationRule][] = Object.entries(
    config
  ).map(([key, rule]) => [normalize(key), key, rule]);

  normalizedConfig.forEach(([nKey, origKey, rule]) => {
    if (rule.required && !headerSet.has(nKey)) {
      errors.push(`Missing required column: "${origKey}".`);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }
  // Annotate each row with per-field errors in an `_errors` object
  const annotatedRows = rows.map((row, rowIndex) => {
    const annotated = { ...(row || {}) } as Record<string, unknown> & {
      _errors?: Record<string, string | boolean>;
    };
    const rowErrors: Record<string, string | boolean> = {};

    normalizedConfig.forEach(([nKey, origKey, rule]) => {
      if (!rule.required) return;
      const matchingKey = Object.keys(row || {}).find(
        (k) => normalize(k) === nKey
      );
      const value = matchingKey ? row[matchingKey] : undefined;
      const isEmpty =
        value === undefined || value === null || String(value).trim() === "";
      if (isEmpty) {
        rowErrors[origKey] = `${origKey} is mandatory`;
        errors.push(`Row ${rowIndex + 1}: "${origKey}" is mandatory.`);
      }
    });

    if (Object.keys(rowErrors).length > 0) {
      annotated._errors = rowErrors;
    }
    return annotated;
  });

  return { valid: errors.length === 0, errors, rows: annotatedRows };
};

export const createAndDownload = async (
  data: Blob,
  headers: Record<string, string>
) => {
  const url = window.URL.createObjectURL(data);
  const disposition = headers["content-disposition"];
  const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);
  const filename = filenameMatch
    ? filenameMatch[1]
    : "organization-units-template.xlsx";
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
