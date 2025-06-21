const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying EcoSwap build...\n');

const buildDir = path.join(__dirname, 'build');
const requiredFiles = [
  'index.html',
  'static/css',
  'static/js'
];

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.log('❌ Build directory not found. Run "npm run build" first.');
  process.exit(1);
}

console.log('✅ Build directory exists');

// Check required files
let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(buildDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check index.html content
const indexPath = path.join(buildDir, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  if (indexContent.includes('EcoSwap')) {
    console.log('✅ index.html contains EcoSwap title');
  } else {
    console.log('⚠️  index.html might not be properly built');
  }
}

// Get build size
const buildStats = fs.statSync(buildDir);
console.log(`\n📊 Build directory size: ${(buildStats.size / 1024).toFixed(2)} KB`);

if (allFilesExist) {
  console.log('\n🎉 Build verification successful!');
  console.log('\n🚀 Ready to deploy:');
  console.log('   • Netlify: Drag build folder to netlify.com');
  console.log('   • Vercel: Run "npx vercel"');
  console.log('   • GitHub Pages: Run "npm run deploy"');
} else {
  console.log('\n❌ Build verification failed. Please check the build process.');
  process.exit(1);
}
