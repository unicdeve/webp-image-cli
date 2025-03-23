#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import * as globModule from 'glob';
import {
	convertToWebP,
	formatFileSize,
	calculateSizeChange,
} from './converter';

const program = new Command();

// Configure CLI
program
	.name('webp-image-cli')
	.description('Convert images to WebP format from the command line')
	.version('1.0.0');

// Convert command
program
	.command('convert')
	.description('Convert image(s) to WebP format')
	.argument('<input>', 'Input file, directory, or glob pattern')
	.option(
		'-o, --output <dir>',
		'Output directory (defaults to same directory as input)'
	)
	.option('-q, --quality <number>', 'WebP quality (1-100)', '80')
	.option(
		'-w, --width <number>',
		'Output width (maintains aspect ratio if only width is specified)'
	)
	.option(
		'-h, --height <number>',
		'Output height (maintains aspect ratio if only height is specified)'
	)
	.option('--overwrite', 'Overwrite existing files', false)
	.option('-r, --recursive', 'Process directories recursively', false)
	.action(async (input, options) => {
		try {
			// Parse options
			const quality = parseInt(options.quality, 10);
			const width = options.width ? parseInt(options.width, 10) : undefined;
			const height = options.height ? parseInt(options.height, 10) : undefined;

			// Check if input is a directory
			let inputPattern = input;
			let isDirectory = false;
			try {
				const stats = await fs.stat(input);
				if (stats.isDirectory()) {
					isDirectory = true;
					// If input is a directory, set up pattern to match all images in that directory
					const recursiveOption = options.recursive ? '**/' : '';
					inputPattern = path.join(
						input,
						`${recursiveOption}*.{jpg,jpeg,png,gif,tiff,bmp,webp}`
					);
					console.log(`Input is a directory. Using pattern: ${inputPattern}`);

					// Show warning if options are used with directory input
					if (options.quality !== '80' || options.width || options.height) {
						console.warn(
							'\n⚠️  WARNING: You are applying the same conversion options to all images in the directory.'
						);
						console.warn('   Quality: ' + options.quality);
						if (options.width) console.warn('   Width: ' + options.width);
						if (options.height) console.warn('   Height: ' + options.height);
						console.warn(
							'   If this is not what you intended, you should convert images individually.\n'
						);
					}
				}
			} catch (error) {
				// If stat fails, assume input is a glob pattern
				console.log(`Using provided pattern: ${inputPattern}`);
			}

			// Find input files
			const inputFiles = globModule.sync(inputPattern);

			if (inputFiles.length === 0) {
				console.error(`No files found matching: ${input}`);
				process.exit(1);
			}

			console.log(`Found ${inputFiles.length} file(s) to convert`);

			// Process each file
			for (const inputFile of inputFiles) {
				// Skip non-images
				if (!inputFile.match(/\.(jpe?g|png|gif|tiff|bmp|webp)$/i)) {
					console.log(`Skipping non-image file: ${inputFile}`);
					continue;
				}

				// Determine output path
				let outputFile;
				if (options.output) {
					// Ensure output directory exists
					await fs.ensureDir(options.output);

					const fileName =
						path.basename(inputFile, path.extname(inputFile)) + '.webp';
					outputFile = path.join(options.output, fileName);
				} else {
					// Same directory as input
					outputFile = path.join(
						path.dirname(inputFile),
						path.basename(inputFile, path.extname(inputFile)) + '.webp'
					);
				}

				// Check if output file exists
				if ((await fs.pathExists(outputFile)) && !options.overwrite) {
					console.log(
						`Skipping existing file (use --overwrite to force): ${outputFile}`
					);
					continue;
				}

				console.log(`Converting ${inputFile} -> ${outputFile}`);

				// Get original file size
				const origStats = await fs.stat(inputFile);
				const originalSize = origStats.size;

				// Convert the file
				const result = await convertToWebP(inputFile, outputFile, {
					quality,
					width,
					height,
				});

				// Display results
				const sizeChange = calculateSizeChange(originalSize, result.size);
				const originalSizeFormatted = formatFileSize(originalSize);
				const convertedSizeFormatted = formatFileSize(result.size);

				console.log(
					`✓ Converted: ${originalSizeFormatted} → ${convertedSizeFormatted} (${sizeChange})`
				);
			}

			console.log('Conversion complete!');
		} catch (error: unknown) {
			console.error(
				'Error:',
				error instanceof Error ? error.message : String(error)
			);
			process.exit(1);
		}
	});

// Parse args
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
	program.outputHelp();
}
