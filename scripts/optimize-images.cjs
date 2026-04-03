/**
 * Image Optimization Script for Landing Page Icons
 * 
 * Run: node scripts/optimize-images.js
 * 
 * This script compresses the large PNG icons to reduce load time.
 * Requires: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');
const outputDir = path.join(__dirname, '../public/icons-optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const iconFiles = [
  'career-path.png',
  'community.png',
  'dashboard.png',
  'learner-request.png',
  'my-profile.png',
  'skill-matrix.png',
  'skilling.png',
  'tenant-admin.png',
];

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');
  
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of iconFiles) {
    const inputPath = path.join(iconsDir, file);
    const outputPath = path.join(outputDir, file);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${file} - not found`);
      continue;
    }

    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    try {
      await sharp(inputPath)
        .resize(300, 300, { // Resize to max needed size
          fit: 'inside',
          withoutEnlargement: true
        })
        .png({
          quality: 80,
          compressionLevel: 9,
          palette: true // Use palette-based PNG for smaller size
        })
        .toFile(outputPath);

      const optimizedSize = fs.statSync(outputPath).size;
      totalOptimized += optimizedSize;
      
      const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
      console.log(`✅ ${file}: ${(originalSize/1024).toFixed(0)}KB → ${(optimizedSize/1024).toFixed(0)}KB (${savings}% smaller)`);
    } catch (err) {
      console.error(`❌ Error optimizing ${file}:`, err.message);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Original total: ${(totalOriginal/1024/1024).toFixed(2)} MB`);
  console.log(`   Optimized total: ${(totalOptimized/1024/1024).toFixed(2)} MB`);
  console.log(`   Total savings: ${((1 - totalOptimized/totalOriginal) * 100).toFixed(1)}%`);
  console.log('\n💡 To use optimized images, copy them from public/icons-optimized/ to public/icons/');
}

optimizeImages().catch(console.error);
