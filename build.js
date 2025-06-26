#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  Building Sustainability Analytics Dashboard...');

try {
  // Clean dist directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('✅ Cleaned dist directory');
  }

  // Build frontend with Vite
  console.log('🔨 Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Ensure index.html exists in dist
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html not found in dist directory');
    process.exit(1);
  }

  // Create a simple health check file
  const healthCheck = `<!DOCTYPE html>
<html>
<head>
    <title>Sustainability Analytics - Health Check</title>
</head>
<body>
    <h1>Sustainability Analytics Dashboard</h1>
    <p>Application is running correctly!</p>
    <script>
        // Redirect to main app after 2 seconds
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'dist', 'health.html'), healthCheck);

  console.log('✅ Build completed successfully!');
  console.log('📁 Files created:');
  
  // List key files in dist
  const distFiles = fs.readdirSync('dist');
  distFiles.forEach(file => {
    console.log(`   - ${file}`);
  });

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}