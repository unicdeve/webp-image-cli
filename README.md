# WebP Converter CLI

A command-line interface for converting images to WebP format.

## Features

- Convert single images or batches using glob patterns
- Convert all images in a directory (with optional recursive scanning)
- Adjust quality level (1-100)
- Resize images while maintaining aspect ratio
- Output file size comparison
- Easy to use interface

## Installation

### Local Development

To build and use the CLI during development:

```bash
# Build the CLI
npm run cli:build

# Run the CLI
npm run cli:start convert <options>

# Or use the combined command
npm run cli convert <options>
```

### Global Installation

To install the CLI globally:

```bash
# Install globally from the project directory
npm install -g .

# Now you can use it anywhere
webp-converter convert <options>
```

## Usage

```bash
# Basic usage - convert a single file
webp-converter convert input.jpg

# Convert all images in a directory
webp-converter convert images/

# Convert all images in a directory and its subdirectories
webp-converter convert images/ -r

# Convert with custom quality
webp-converter convert input.jpg -q 90

# Resize image
webp-converter convert input.jpg -w 800 -h 600

# Convert multiple files with a glob pattern
webp-converter convert "images/*.jpg"

# Output to a different directory
webp-converter convert "images/*.jpg" -o converted/

# Force overwriting existing files
webp-converter convert input.jpg --overwrite
```

## Options

- `-o, --output <dir>` - Output directory
- `-q, --quality <number>` - WebP quality (1-100, default: 80)
- `-w, --width <number>` - Output width
- `-h, --height <number>` - Output height
- `--overwrite` - Overwrite existing files
- `-r, --recursive` - Process directories recursively (when input is a
  directory)

## Examples

### Convert a single image

```bash
webp-converter convert cat.jpg
```

This will create `cat.webp` in the same directory.

### Convert all images in a directory

```bash
webp-converter convert photos/
```

This will convert all image files in the `photos` directory to WebP format and
save them in the same directory.

### Convert all images in a directory and its subdirectories

```bash
webp-converter convert photos/ -r
```

This will recursively find and convert all images in the `photos` directory and
all of its subdirectories.

### Convert multiple images

```bash
webp-converter convert "photos/*.jpg" -o webp-photos/
```

This will convert all JPG files in the `photos` directory and save them to the
`webp-photos` directory.

### Resize images during conversion

```bash
webp-converter convert image.png -w 1200
```

This will convert `image.png` to WebP and resize it to 1200px width while
maintaining the aspect ratio.

## Notes

When converting an entire directory with quality, width, or height options, the
same settings will be applied to all images. You'll see a warning when doing
this:

```
⚠️  WARNING: You are applying the same conversion options to all images in the directory.
   Quality: 90
   Width: 800
   Height: 600
   If this is not what you intended, you should convert images individually.
```

If you need different settings for different images, convert them individually
or use more specific glob patterns.
