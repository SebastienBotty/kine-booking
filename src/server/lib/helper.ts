import sanitizeHtml from "sanitize-html";

export function cleanHtml(input: string | undefined) {
  if (!input) return "";
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}
