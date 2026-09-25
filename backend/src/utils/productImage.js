const uploadPrefix = "/uploads/products/";
const filenamePattern = /^[a-zA-Z0-9._-]+$/;
const localHosts = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

function parseHttpUrl(value) {
  if (value.startsWith("//")) return new URL(`https:${value}`);
  if (/^https?:\/\//i.test(value)) return new URL(value);
  return null;
}

function isLocalUploadUrl(parsed) {
  if (localHosts.has(parsed.hostname)) return true;
  for (const value of [process.env.API_ORIGIN, process.env.BACKEND_URL, process.env.PUBLIC_API_URL]) {
    if (!value) continue;
    try {
      if (new URL(value).origin === parsed.origin) return true;
    } catch {}
  }
  return false;
}

function normalizeLocalPath(value) {
  let text = String(value || "").trim();
  if (!text) return null;

  const absolute = parseHttpUrl(text);
  if (absolute) {
    if (!isLocalUploadUrl(absolute)) return null;
    text = absolute.pathname;
  }

  if (text.startsWith("/api/uploads/products/")) {
    text = text.slice(4);
  }

  if (text.startsWith("uploads/products/")) {
    text = `/${text}`;
  }

  if (!text.startsWith(uploadPrefix)) return null;

  const filename = text.slice(uploadPrefix.length);
  if (!filename || filename.includes("/") || !filenamePattern.test(filename)) {
    return null;
  }

  return `${uploadPrefix}${filename}`;
}

export function normalizeProductImage(value) {
  const text = String(value || "").trim();
  if (!text) return null;

  const localPath = normalizeLocalPath(text);
  if (localPath) return localPath;

  const absolute = parseHttpUrl(text);
  if (absolute && ["http:", "https:"].includes(absolute.protocol)) return absolute.toString();
  return null;
}

export function normalizeProductImages(values) {
  const result = [];
  for (const value of Array.isArray(values) ? values : []) {
    const normalized = normalizeProductImage(value);
    if (normalized && !result.includes(normalized)) result.push(normalized);
  }
  return result;
}

export function combineProductImages(productImage, mediaImages) {
  const images = normalizeProductImages(mediaImages);
  const fallback = normalizeProductImage(productImage);
  if (!images.length) return fallback ? [fallback] : [];
  if (fallback && !images.includes(fallback)) images.push(fallback);
  return images.slice(0, 8);
}

export function prepareProductImages(data = {}) {
  const images = normalizeProductImages(data.images);
  const primary = normalizeProductImage(data.product_image ?? data.image);
  if (primary && !images.includes(primary)) images.unshift(primary);
  return {
    ...data,
    product_image: images[0] || null,
    images: images.slice(0, 8),
  };
}

export function isProductUploadPath(value) {
  return Boolean(normalizeLocalPath(value));
}

export function productImageFilename(value) {
  const normalized = normalizeLocalPath(value);
  return normalized ? normalized.slice(uploadPrefix.length) : null;
}
