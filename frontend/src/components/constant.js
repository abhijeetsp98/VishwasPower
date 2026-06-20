export const BACKEND_API_BASE_URL = 'https://vishwaspower.in';
// export const BACKEND_API_BASE_URL = 'http://localhost:8000';

export const BACKEND_IMG_API_BASE_URL = 'https://vishwaspower.in/uploads/';

export const additionalLogging = true;

// Feature flag: set to true to show Testing departments, false to hide them
export const TESTING_DEPARTMENT = false;

// Image compression feature flag
// Set to true to compress images before uploading (recommended for VPS storage)
// Set to false to upload original images as-is
export const ENABLE_IMAGE_COMPRESSION = true;
export const IMAGE_COMPRESSION_MAX_WIDTH = 1920; // Max width in pixels (maintains aspect ratio)
export const IMAGE_COMPRESSION_QUALITY = 0.8;    // JPEG quality 0.0–1.0 (0.8 = 80%, visually lossless)