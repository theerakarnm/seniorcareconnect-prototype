import { FileType } from "../core/database/db.enum";

// The file extension to MIME type mapping
export const extToMime: { [ext: string]: string } = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  avif: "image/avif",
  gif: "image/gif",
  pdf: "application/pdf",
  txt: "text/plain",
  html: "text/html",
  htm: "text/html",
  doc: "application/msword",
  docx: "application/msword",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.ms-excel",
  zip: "application/zip",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
  json: "application/json",
  xml: "application/xml",
  csv: "text/csv",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.ms-powerpoint",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  sql: "application/sql",
  yaml: "application/x-yaml",
  yml: "application/x-yaml",
  tar: "application/x-tar",
  "7z": "application/x-7z-compressed",
  exe: "application/x-msdownload",
  bin: "application/octet-stream",
  apk: "application/vnd.android.package-archive",
  ipa: "application/octet-stream",
  jar: "application/java-archive",
  woff: "font/woff",
  php: "application/x-httpd-php",
  avi: "video/x-msvideo"
};

// A helper function to categorize a MIME type.
export function getCategory(mime: string): FileType {
  if (mime.startsWith("image/")) {
    return "IMAGE";
  } else if (mime.startsWith("video/")) {
    return "VIDEO";
  } else if (mime.startsWith("audio/")) {
    return "AUDIO";
  } else if (mime === "application/pdf") {
    return "DOCUMENT";
  } else if (mime === "application/msword") {
    return "DOCUMENT";
  } else if (mime === "application/vnd.ms-excel" || mime === 'text/csv') {
    return "SHEET";
  } else if (mime === "application/vnd.ms-powerpoint") {
    return "PRESENTATION";
  } else if (
    mime === "text/plain"
  ) {
    return "TEXT";
  } else if (
    mime === "application/json" ||
    mime === "application/xml" ||
    mime === "application/sql" ||
    mime === "application/x-yaml" ||
    mime === "application/x-httpd-php" ||
    mime === "text/html"
  ) {
    return "CODE";
  }
  // For all other MIME types we return "OTHER"
  return "OTHER";
}

// This function transforms the extToMime mapping into a mapping
// of MIME type to the desired category. If multiple extensions map to
// the same MIME type, they will yield the same category.
export function categorizeMimeTypes(): { [mime: string]: FileType } {
  const result: { [mime: string]: FileType } = {};
  for (const ext in extToMime) {
    const mime = extToMime[ext];
    // Only assign once per mime if needed.
    // You can also mix multiple categories if your logic changes.
    result[mime] = getCategory(mime);
  }
  return result;
}

export const convertSize = {
  fromBytes: (bytes: number | bigint) => {
    return {
      toHumanReadable: () => {
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        let index = 0;
        let size: number | bigint = bytes;

        // Use bigint division if input is bigint
        while (
          (typeof size === "bigint" ? size >= 1024n : size >= 1024) &&
          index < sizes.length - 1
        ) {
          size =
            typeof size === "bigint"
              ? size / 1024n
              : (size as number) / 1024;
          index++;
        }

        // For human-readable, convert to number if possible
        let displaySize: number;
        if (typeof size === "bigint") {
          // If still too big, use Number safely
          displaySize = Number(size);
        } else {
          displaySize = size;
        }

        return `${displaySize.toFixed(2)} ${sizes[index]}`;
      },
      toKB: () => {
        return divide(bytes, 1024);
      }
    };
  }
};

// Helper function to divide number or bigint
function divide(value: number | bigint, divisor: number): number | bigint {
  if (typeof value === "bigint") {
    return value / BigInt(divisor);
  }
  return value / divisor;
}