export default function formatSegment(segment: string) {
  if (!segment) return "";
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
