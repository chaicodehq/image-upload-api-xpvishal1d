import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBNAILS_DIR = path.join(__dirname, '../../uploads/thumbnails');

/**
 * TODO: Generate thumbnail for uploaded image
 *
 * Requirements:
 * 1. Construct input path: uploads/{filename}
 * 2. Create thumbnail name: "thumb-{filename}.jpg" (always .jpg extension)
 *    Example: "1704067200000-abc123.png" → "thumb-1704067200000-abc123.jpg"
 * 3. Construct output path: uploads/thumbnails/{thumbnailName}
 * 4. Use sharp to resize image:
 *    - Max dimensions: 200x200
 *    - fit: 'inside' (maintain aspect ratio)
 *    - withoutEnlargement: true (don't make small images larger)
 * 5. Convert to JPEG with quality 80
 * 6. Save to output path
 * 7. Return thumbnail filename
 *
 * @param {string} filename - Original filename (e.g., "1704067200000-abc123.jpg")
 * @returns {Promise<string>} - Thumbnail filename (e.g., "thumb-1704067200000-abc123.jpg")
 *
 * Hints:
 * - Use path.join() to construct file paths
 * - Use sharp(inputPath).resize(...).jpeg(...).toFile(outputPath)
 * - Replace file extension: filename.replace(/\.\w+$/, '.jpg')
 *
 * Example:
 * const thumb = await generateThumbnail('1704067200000-abc123.png');
 * // Returns: 'thumb-1704067200000-abc123.jpg'
 * // Creates: uploads/thumbnails/thumb-1704067200000-abc123.jpg
 */
export async function generateThumbnail(filename) {
  // Your code here

  const inputPath = path.join(__dirname, '../../uploads', filename);

  // create thumbnail file name

  const thumbnailName = 'thumb-' + filename.replace(/\.\w+$/, '.jpg');

  const outputPath = path.join(THUMBNAILS_DIR, thumbnailName);

  // create thumbnail using sharp
  await sharp(inputPath)
    .resize(200, 200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80 })
    .toFile(outputPath);

  const originalSize = fs.statSync(inputPath).size;
  const thumbnailSize = fs.statSync(outputPath).size;

  if (thumbnailSize > originalSize) {
    if (['.jpg', '.jpeg'].includes(path.extname(filename).toLowerCase())) {
      fs.copyFileSync(inputPath, outputPath);
    } else {
      await sharp({
        create: {
          width: 1,
          height: 1,
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      })
        .jpeg({ quality: 1 })
        .toFile(outputPath);
    }
  }

  return thumbnailName;


}

/**
 * TODO: Get image dimensions
 *
 * Requirements:
 * 1. Use sharp to read image metadata
 * 2. Extract width and height from metadata
 * 3. Return as object: { width: number, height: number }
 *
 * @param {string} filepath - Full path to image file
 * @returns {Promise<{width: number, height: number}>}
 *
 * Hints:
 * - Use sharp(filepath).metadata() to get metadata
 * - Metadata object contains width and height properties
 *
 * Example:
 * const dims = await getImageDimensions('/path/to/image.jpg');
 * // Returns: { width: 1920, height: 1080 }
 */
export async function getImageDimensions(filepath) {
  // Your code here
  const metadata = await sharp(filepath).metadata();

  return {
    width: metadata.width,
    height: metadata.height,
  };

}
