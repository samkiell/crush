# PWA Icon Assets

This directory contains icon assets for the Progressive Web App (PWA) configuration.

## Required Icons

The following icon sizes are needed for the PWA manifest:
- 72x72px
- 96x96px
- 128x128px
- 144x144px
- 152x152px
- 192x192px (required for Android)
- 384x384px
- 512x512px (required for Android)

## How to Generate Icons

### Option 1: Using Online Tools
1. Visit https://realfavicongenerator.net/
2. Upload your logo (preferably 512x512px or larger)
3. Download the generated icon package
4. Extract all PNG files to this directory

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Then run these commands from your logo file:

convert logo.png -resize 72x72 icon-72x72.png
convert logo.png -resize 96x96 icon-96x96.png
convert logo.png -resize 128x128 icon-128x128.png
convert logo.png -resize 144x144 icon-144x144.png
convert logo.png -resize 152x152 icon-152x152.png
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 384x384 icon-384x384.png
convert logo.png -resize 512x512 icon-512x512.png
```

### Option 3: Using Sharp (Node.js)
```javascript
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  sharp('logo.png')
    .resize(size, size)
    .toFile(`icon-${size}x${size}.png`);
});
```

## Current Status

⚠️ **Action Required**: Please add your icon files to this directory according to the sizes listed above.

For now, you can use placeholder icons or copy your existing logo.png in different sizes.

## Testing

After adding icons:
1. Build your Next.js app: `npm run build`
2. Serve it: `npm start`
3. Open Chrome DevTools > Application > Manifest
4. Verify all icons are loaded correctly
