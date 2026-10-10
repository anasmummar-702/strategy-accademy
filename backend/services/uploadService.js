import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm'
];

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit

export const validateAndSaveFile = async (fileBuffer, originalFilename, mimeType, uploadDir = './public/uploads') => {
  // 1. Validate MIME Type
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`File type '${mimeType}' is not allowed. Supported types: JPG, PNG, WEBP, SVG, MP4, WEBM`);
  }

  // 2. Validate File Size
  if (fileBuffer.length > MAX_SIZE_BYTES) {
    throw new Error(`File size exceeds maximum allowed limit of ${MAX_SIZE_BYTES / (1024 * 1024)} MB`);
  }

  // 3. Ensure Upload Directory Exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 4. Generate Safe Unique Filename
  const extension = path.extname(originalFilename) || (mimeType.includes('png') ? '.png' : mimeType.includes('webp') ? '.webp' : '.jpg');
  const uniqueId = crypto.randomBytes(8).toString('hex');
  const safeFilename = `${Date.now()}_${uniqueId}${extension.toLowerCase()}`;
  const targetPath = path.join(uploadDir, safeFilename);

  // 5. Write File to Disk / Bucket
  fs.writeFileSync(targetPath, fileBuffer);

  const publicUrl = `/uploads/${safeFilename}`;

  return {
    filename: safeFilename,
    originalName: originalFilename,
    filePath: targetPath,
    url: publicUrl,
    mimeType,
    sizeBytes: fileBuffer.length,
    uploadedAt: new Date().toISOString()
  };
};
