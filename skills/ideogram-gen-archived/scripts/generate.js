#!/usr/bin/env node
/**
 * Ideogram Image Generation Script
 * Usage: node generate.js "prompt" [--aspect ASPECT_RATIO] [--style STYLE_TYPE] [--output DIR]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load API key from environment or .env file
function getApiKey() {
  if (process.env.IDEOGRAM_API_KEY) return process.env.IDEOGRAM_API_KEY;
  
  try {
    const envPath = path.join(process.env.HOME, '.clawdbot', '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/IDEOGRAM_API_KEY=(.+)/);
    if (match) return match[1].trim();
  } catch (e) {}
  
  throw new Error('IDEOGRAM_API_KEY not found');
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    prompt: '',
    aspect: 'ASPECT_4_5',  // Default for prints
    style: 'REALISTIC',
    output: './generated',
    model: 'V_3'
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--aspect' && args[i+1]) {
      result.aspect = args[++i];
    } else if (args[i] === '--style' && args[i+1]) {
      result.style = args[++i];
    } else if (args[i] === '--output' && args[i+1]) {
      result.output = args[++i];
    } else if (args[i] === '--model' && args[i+1]) {
      result.model = args[++i];
    } else if (!args[i].startsWith('--')) {
      result.prompt = args[i];
    }
  }
  
  return result;
}

// Generate image
async function generateImage(config) {
  const apiKey = getApiKey();
  
  const payload = JSON.stringify({
    prompt: config.prompt,
    aspect_ratio: config.aspect,
    style_type: config.style,
    magic_prompt: "AUTO",
    num_images: 1
  });
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.ideogram.ai',
      path: '/v1/ideogram-v3/generate',
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    
    console.log('🎨 Generating image with Ideogram...');
    console.log(`   Prompt: "${config.prompt.slice(0, 60)}..."`);
    console.log(`   Aspect: ${config.aspect}, Style: ${config.style}`);
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`API Error ${res.statusCode}: ${data}`));
          return;
        }
        
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Download image from URL
async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(outputPath);
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(outputPath);
        });
      }
    }).on('error', reject);
  });
}

// Main
async function main() {
  const config = parseArgs();
  
  if (!config.prompt) {
    console.log('Usage: node generate.js "prompt" [--aspect ASPECT_RATIO] [--style STYLE_TYPE] [--output DIR]');
    console.log('\nAspect ratios: ASPECT_1_1, ASPECT_4_5, ASPECT_2_3, ASPECT_16_9, ASPECT_3_1');
    console.log('Styles: REALISTIC, DESIGN, RENDER_3D, ANIME, GENERAL');
    process.exit(1);
  }
  
  try {
    const result = await generateImage(config);
    
    if (result.data && result.data.length > 0) {
      // Create output directory
      fs.mkdirSync(config.output, { recursive: true });
      
      console.log(`\n✅ Generated ${result.data.length} image(s):`);
      
      for (let i = 0; i < result.data.length; i++) {
        const img = result.data[i];
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `ideogram_${timestamp}_${i}.png`;
        const outputPath = path.join(config.output, filename);
        
        console.log(`   Downloading: ${filename}`);
        await downloadImage(img.url, outputPath);
        console.log(`   ✅ Saved: ${outputPath}`);
        
        // Also log the prompt used (for tracking)
        if (img.prompt) {
          console.log(`   Magic prompt: "${img.prompt.slice(0, 100)}..."`);
        }
      }
      
      console.log('\n🎉 Done!');
    } else {
      console.error('No images returned');
      console.log('Response:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
