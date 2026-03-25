const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const img1Path = path.join(__dirname, 'AB_AI/assets/images-optimized/img1.webp');
const img2Path = path.join(__dirname, 'AB_AI/assets/images-optimized/DSC08858.webp');

async function processImages() {
  try {
    // Read files
    const img1Buffer = fs.readFileSync(img1Path);
    const img2Buffer = fs.readFileSync(img2Path);

    // img1.webp (head pointing right) -> rotate -90 (270)
    console.log('Rotating img1.webp 270 degrees...');
    await sharp(img1Buffer)
      .rotate(270)
      .toFile(img1Path);
    console.log('img1.webp updated.');

    // DSC08858.webp (head pointing left) -> rotate 90
    console.log('Rotating DSC08858.webp 90 degrees...');
    await sharp(img2Buffer)
      .rotate(90)
      .toFile(img2Path);
    console.log('DSC08858.webp updated.');

    console.log('All images rotated successfully!');
  } catch (err) {
    console.error('Error processing images:', err);
  }
}

processImages();
