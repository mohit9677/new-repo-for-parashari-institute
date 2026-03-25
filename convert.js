const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'AB_AI/assets/images-optimized');

async function convertJpgToWebp() {
  const filesToProcess = [
    { in: 'img5.jpg', out: 'img5.webp' },
    { in: 'DSC08858.jpg', out: 'DSC08858.webp' }
  ];

  for (const file of filesToProcess) {
    const inputPath = path.join(imgDir, file.in);
    const outputPath = path.join(imgDir, file.out);

    if (fs.existsSync(inputPath)) {
      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        console.log(`Successfully converted ${file.in} -> ${file.out}`);
      } catch (err) {
        console.error(`Error converting ${file.in}:`, err);
      }
    } else {
      console.error(`Input file not found: ${inputPath}`);
    }
  }
}

convertJpgToWebp();
