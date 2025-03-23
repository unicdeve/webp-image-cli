# WebP CLI

A command-line interface for converting images to WebP format. Easily convert
your JPG, PNG, GIF, and other images to the more efficient WebP format.

## Features

- Convert single images or batches using glob patterns
- Convert all images in a directory (with optional recursive scanning)
- Adjust quality level (1-100)
- Resize images while maintaining aspect ratio
- Output file size comparison
- Easy to use interface

## Installation

### Using npx (no installation required)

You can run the CLI directly without installing it using npx:

```bash
npx webp-image-cli convert <options>
```

### Global Installation

To install the CLI globally:

```bash
# Install globally from npm
npm install -g webp-image-cli

# Now you can use it anywhere
webp-image-cli convert <options>
```

### Local Development

To build and use the CLI during development:

```bash
# Clone the repository
git clone git@github.com:unicdeve/webp-image-cli.git
cd webp-image-cli

# Install dependencies
npm install

# Build the CLI
npm run cli:build

# Run the CLI
npm run cli:start convert <options>

# Or use the combined command
npm run cli convert <options>
```

## Usage

```bash
# Basic usage - convert a single file
webp-image-cli convert input.jpg

# Convert all images in a directory
webp-image-cli convert images/

# Convert all images in a directory and its subdirectories
webp-image-cli convert images/ -r

# Convert with custom quality
webp-image-cli convert input.jpg -q 90

# Resize image
webp-image-cli convert input.jpg -w 800 -h 600

# Convert multiple files with a glob pattern
webp-image-cli convert "images/*.jpg"

# Output to a different directory
webp-image-cli convert "images/*.jpg" -o converted/

# Force overwriting existing files
webp-image-cli convert input.jpg --overwrite
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
webp-image-cli convert cat.jpg
```

This will create `cat.webp` in the same directory.

### Convert all images in a directory

```bash
webp-image-cli convert photos/
```

This will convert all image files in the `photos` directory to WebP format and
save them in the same directory.

### Convert all images in a directory and its subdirectories

```bash
webp-image-cli convert photos/ -r
```

This will recursively find and convert all images in the `photos` directory and
all of its subdirectories.

### Convert multiple images

```bash
webp-image-cli convert "photos/*.jpg" -o webp-photos/
```

This will convert all JPG files in the `photos` directory and save them to the
`webp-photos` directory.

### Resize images during conversion

```bash
webp-image-cli convert image.png -w 1200
```

This will convert `image.png` to WebP and resize it to 1200px width while
maintaining the aspect ratio.

### Using with npx

```bash
npx webp-image-cli convert "images/*.jpg" -q 85 -o webp/
```

This runs the CLI directly using npx without requiring installation.

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

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate.

## License

This project is licensed under the ISC License - see the LICENSE file for
details.

## Acknowledgements

- [sharp](https://sharp.pixelplumbing.com/) - High performance Node.js image
  processing
- [commander](https://github.com/tj/commander.js/) - The complete solution for
  Node.js command-line interfaces
