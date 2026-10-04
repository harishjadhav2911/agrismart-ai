import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = 'public/icons';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate base trimmed logo
const inputLogo = 'public/logo-transparent.png';

async function generateIcons() {
  const image = sharp(inputLogo);
  
  // Trim transparent edges
  const trimmedBuffer = await image.trim().toBuffer();
  const trimmedMeta = await sharp(trimmedBuffer).metadata();
  console.log('Trimmed size:', trimmedMeta.width, trimmedMeta.height);

  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  for (const size of sizes) {
    // Normal icon with dark modern agri background or transparent
    const iconPadding = Math.round(size * 0.12);
    const innerSize = size - iconPadding * 2;
    
    const resizedInner = await sharp(trimmedBuffer)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    // Standard Icon (green background circle/rounded or modern rounded green gradient)
    const svgBg = Buffer.from(`
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#052e16" />
            <stop offset="50%" stop-color="#064e3b" />
            <stop offset="100%" stop-color="#16a34a" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="${size * 0.03}" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#grad)" />
      </svg>
    `);

    await sharp(svgBg)
      .composite([{
        input: resizedInner,
        gravity: 'center'
      }])
      .png()
      .toFile(path.join(outDir, `icon-${size}x${size}.png`));
    
    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Maskable icon 512x512 with safe area (padded inside 80% circle)
  const maskableSize = 512;
  const maskableInnerSize = Math.round(maskableSize * 0.65);
  const maskableInner = await sharp(trimmedBuffer)
    .resize(maskableInnerSize, maskableInnerSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  const maskableBg = Buffer.from(`
    <svg width="${maskableSize}" height="${maskableSize}" viewBox="0 0 ${maskableSize} ${maskableSize}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#052e16" />
          <stop offset="50%" stop-color="#064e3b" />
          <stop offset="100%" stop-color="#16a34a" />
        </linearGradient>
      </defs>
      <rect width="${maskableSize}" height="${maskableSize}" fill="url(#grad)" />
    </svg>
  `);

  await sharp(maskableBg)
    .composite([{
      input: maskableInner,
      gravity: 'center'
    }])
    .png()
    .toFile(path.join(outDir, 'icon-maskable-512x512.png'));
  console.log('Generated icon-maskable-512x512.png');

  // Apple touch icon 180x180
  const appleSize = 180;
  const appleInnerSize = Math.round(appleSize * 0.76);
  const appleInner = await sharp(trimmedBuffer)
    .resize(appleInnerSize, appleInnerSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  const appleBg = Buffer.from(`
    <svg width="${appleSize}" height="${appleSize}" viewBox="0 0 ${appleSize} ${appleSize}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#052e16" />
          <stop offset="50%" stop-color="#064e3b" />
          <stop offset="100%" stop-color="#16a34a" />
        </linearGradient>
      </defs>
      <rect width="${appleSize}" height="${appleSize}" rx="40" fill="url(#grad)" />
    </svg>
  `);

  await sharp(appleBg)
    .composite([{
      input: appleInner,
      gravity: 'center'
    }])
    .png()
    .toFile(path.join(outDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Favicon 32x32 & 16x16
  await sharp(path.join(outDir, 'icon-72x72.png'))
    .resize(32, 32)
    .png()
    .toFile(path.join(outDir, 'favicon-32x32.png'));
  await sharp(path.join(outDir, 'icon-72x72.png'))
    .resize(16, 16)
    .png()
    .toFile(path.join(outDir, 'favicon-16x16.png'));
    
  console.log('PWA Icons generation complete!');
}

generateIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
