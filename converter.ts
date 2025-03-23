import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';

interface ConversionOptions {
	quality: number;
	width?: number;
	height?: number;
}

/**
 * Converts an image file to WebP format
 *
 * @param inputPath Path to the input image file
 * @param outputPath Path where the WebP file should be saved (optional, defaults to same directory with .webp extension)
 * @param options Conversion options (quality, width, height)
 * @returns Object containing the output path and file size
 */
export async function convertToWebP(
	inputPath: string,
	outputPath?: string,
	options: ConversionOptions = { quality: 80 },
): Promise<{ outputPath: string; size: number }> {
	try {
		// Validate input file exists
		if (!(await fs.pathExists(inputPath))) {
			throw new Error(`Input file not found: ${inputPath}`);
		}

		// If no output path is provided, create one in the same directory with .webp extension
		if (!outputPath) {
			const parsedPath = path.parse(inputPath);
			outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
		}

		// Read the input file
		const buffer = await fs.readFile(inputPath);

		// Initialize Sharp instance
		const sharpInstance = sharp(buffer);

		// Apply resizing if width or height is provided
		if (options.width || options.height) {
			sharpInstance.resize(options.width, options.height, {
				fit: 'inside',
				withoutEnlargement: true,
			});
		}

		// Convert to WebP
		const webpBuffer = await sharpInstance
			.webp({ quality: options.quality })
			.toBuffer();

		// Write output file
		await fs.writeFile(outputPath, webpBuffer);

		// Get file size
		const stats = await fs.stat(outputPath);

		return {
			outputPath,
			size: stats.size,
		};
	} catch (error) {
		console.error('Error converting image:', error);
		throw error;
	}
}

/**
 * Calculates the percentage change between two file sizes
 *
 * @param originalSize Original file size in bytes
 * @param convertedSize Converted file size in bytes
 * @returns Formatted string showing size change percentage with +/- sign
 */
export function calculateSizeChange(
	originalSize: number,
	convertedSize: number,
): string {
	const percentageChange =
		((convertedSize - originalSize) / originalSize) * 100;
	const isReduction = percentageChange < 0;

	return `${isReduction ? '-' : '+'}${Math.abs(percentageChange).toFixed(1)}%`;
}

/**
 * Formats file size to human-readable format
 *
 * @param bytes File size in bytes
 * @returns Formatted file size string (e.g., "1.5 KB")
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
