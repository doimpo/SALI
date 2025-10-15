#!/usr/bin/env node

/**
 * Component Build Script
 * Processes and optimizes HTML components
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  srcDir: './src/components/',
  distDir: './public/components/',
  variables: {
    siteName: 'South Asian Liver Institute',
    siteTagline: 'Think Liver, Think SALi. We provide the best liver care.',
    contactPhone: '+91-8070 670 670',
    contactEmail: 'info@southasianliverinstitute.com',
    address: 'Plot No. 8-2-269/4/B, 4th Floor, Road No. 2, Banjara Hills, Hyderabad, Telangana 500034'
  }
};

/**
 * Process template variables
 */
function processTemplate(template, variables) {
  let processed = template;
  
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, variables[key]);
  });

  return processed;
}

/**
 * Minify HTML
 */
function minifyHtml(html) {
  return html
    .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
    .replace(/>\s+</g, '><')        // Remove spaces between tags
    .replace(/\s+>/g, '>')          // Remove spaces before closing tags
    .replace(/>\s+/g, '>')          // Remove spaces after opening tags
    .trim();
}

/**
 * Build a single component
 */
function buildComponent(fileName) {
  const srcPath = path.join(config.srcDir, fileName);
  const distPath = path.join(config.distDir, fileName);
  
  try {
    // Read source file
    const content = fs.readFileSync(srcPath, 'utf8');
    
    // Process template variables
    const processed = processTemplate(content, config.variables);
    
    // Minify HTML
    const minified = minifyHtml(processed);
    
    // Ensure dist directory exists
    const distDir = path.dirname(distPath);
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Write processed file
    fs.writeFileSync(distPath, minified, 'utf8');
    
    console.log(`✅ Built component: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to build component ${fileName}:`, error.message);
    return false;
  }
}

/**
 * Build all components
 */
function buildAllComponents() {
  console.log('🚀 Building components...');
  
  try {
    // Ensure source directory exists
    if (!fs.existsSync(config.srcDir)) {
      console.error(`❌ Source directory not found: ${config.srcDir}`);
      process.exit(1);
    }
    
    // Get all HTML files in source directory
    const files = fs.readdirSync(config.srcDir)
      .filter(file => file.endsWith('.html'));
    
    if (files.length === 0) {
      console.log('⚠️ No HTML components found in source directory');
      return;
    }
    
    // Build each component
    let successCount = 0;
    files.forEach(file => {
      if (buildComponent(file)) {
        successCount++;
      }
    });
    
    console.log(`\n📦 Component build complete: ${successCount}/${files.length} components built successfully`);
    
  } catch (error) {
    console.error('❌ Component build failed:', error.message);
    process.exit(1);
  }
}

// Run the build process
if (require.main === module) {
  buildAllComponents();
}

module.exports = {
  buildComponent,
  buildAllComponents,
  config
};
