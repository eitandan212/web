/**
 * Security utilities for the Visionary AI application.
 *
 * IMPORTANT — API KEY EXPOSURE WARNING:
 * This app runs entirely in the browser. Any API key set via
 * `process.env.API_KEY` is embedded in the JavaScript bundle and
 * visible to every user. For production use you MUST proxy API
 * requests through a backend server that keeps the key secret.
 */

const PLACEHOLDER = 'PLACEHOLDER_API_KEY';

let _warned = false;

/**
 * Returns the Gemini API key after basic validation.
 * Logs a one-time console warning about client-side key exposure.
 */
export function getApiKey(): string {
  const key = process.env.API_KEY ?? '';

  if (!key || key === PLACEHOLDER) {
    throw new Error(
      'GEMINI_API_KEY is not configured. ' +
      'Set it in .env.local and restart the dev server.'
    );
  }

  if (!_warned) {
    _warned = true;
    console.warn(
      '[SECURITY] The Gemini API key is embedded in the client bundle. ' +
      'For production, proxy requests through a backend server.'
    );
  }

  return key;
}

// ── File-upload validation ──────────────────────────────────────────

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]);

const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
]);

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 50 MB.` };
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { valid: false, error: `Unsupported image type: ${file.type || 'unknown'}. Allowed: JPEG, PNG, GIF, WebP, SVG.` };
  }
  return { valid: true };
}

export function validateVideoFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 50 MB.` };
  }
  if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
    return { valid: false, error: `Unsupported video type: ${file.type || 'unknown'}. Allowed: MP4, WebM, OGG, QuickTime.` };
  }
  return { valid: true };
}

export function validateMediaFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 50 MB.` };
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type) && !ALLOWED_VIDEO_TYPES.has(file.type)) {
    return { valid: false, error: `Unsupported file type: ${file.type || 'unknown'}.` };
  }
  return { valid: true };
}
