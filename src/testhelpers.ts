export const html = (data: string) =>
  data.trim().replace(/\s+/g, " ").replace(/\s+</g, "<").replace(/>\s+/g, ">");
