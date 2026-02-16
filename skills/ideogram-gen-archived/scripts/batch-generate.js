#!/usr/bin/env node
/**
 * Batch Ideogram Image Generation for Etsy Pipeline
 * Usage: node batch-generate.js prompts.json --output DIR
 * 
 * Prompts JSON format:
 * [
 *   {"prompt": "...", "aspect": "3x4", "style": "REALISTIC", "tags": ["temple", "lds"]},
 *   ...
 * ]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load API key
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

// Parse args
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    promptsFile: null,
    output: './batch-output',
    delay: 5000  // 5 second delay between generations
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i+1]) {
      result.output = args[++i];
    } else if (args[i] === '--delay' && args[i+1]) {
      result.delay = parseInt(args[++i]) * 1000;
    } else if (!args[i].startsWith('--')) {
      result.promptsFile = args[i];
    }
  }
  
  return result;
}

// Generate single image
async function generateImage(prompt, aspect, style, apiKey) {
  const payload = JSON.stringify({
    prompt: prompt,
    aspect_ratio: aspect || '3x4',
    style_type: style || 'REALISTIC',
    magic_prompt: 'AUTO',
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
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`API Error ${res.statusCode}: ${data}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Download image
async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    const download = (downloadUrl) => {
      https.get(downloadUrl, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          download(response.headers.location);
        } else {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(outputPath);
          });
        }
      }).on('error', reject);
    };
    
    download(url);
  });
}

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main
async function main() {
  const config = parseArgs();
  
  if (!config.promptsFile) {
    console.log('Usage: node batch-generate.js prompts.json [--output DIR] [--delay SECONDS]');
    console.log('\nPrompts JSON format:');
    console.log('[{"prompt": "...", "aspect": "3x4", "style": "REALISTIC", "tags": ["tag1"]}]');
    process.exit(1);
  }
  
  // Load prompts
  const prompts = JSON.parse(fs.readFileSync(config.promptsFile, 'utf8'));
  console.log(`📦 Loaded ${prompts.length} prompts from ${config.promptsFile}`);
  
  const apiKey = getApiKey();
  fs.mkdirSync(config.output, { recursive: true });
  
  const results = [];
  
  for (let i = 0; i < prompts.length; i++) {
    const item = prompts[i];
    console.log(`\n🎨 [${i+1}/${prompts.length}] Generating: "${item.prompt.slice(0, 50)}..."`);
    
    try {
      const result = await generateImage(item.prompt, item.aspect, item.style, apiKey);
      
      if (result.data && result.data.length > 0) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `batch_${timestamp}_${i}.png`;
        const outputPath = path.join(config.output, filename);
        
        await downloadImage(result.data[0].url, outputPath);
        console.log(`   ✅ Saved: ${filename}`);
        
        results.push({
          index: i,
          filename,
          prompt: item.prompt,
          tags: item.tags || [],
          magicPrompt: result.data[0].prompt,
          success: true
        });
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      results.push({
        index: i,
        prompt: item.prompt,
        error: error.message,
        success: false
      });
    }
    
    // Rate limit delay (except for last item)
    if (i < prompts.length - 1) {
      console.log(`   ⏳ Waiting ${config.delay/1000}s before next generation...`);
      await sleep(config.delay);
    }
  }
  
  // Save results manifest
  const manifestPath = path.join(config.output, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));
  
  const successful = results.filter(r => r.success).length;
  console.log(`\n🎉 Batch complete: ${successful}/${prompts.length} successful`);
  console.log(`📋 Manifest saved: ${manifestPath}`);
}

main().catch(console.error);
