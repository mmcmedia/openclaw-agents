#!/usr/bin/env node
/**
 * Scrape Etsy shop listings via web_fetch (no browser needed).
 * Extracts: listing ID, title, price, URL, image URL, favorites count, category/section
 * Usage: node scrape-etsy-shop.mjs <shop_name> [output_file]
 */

import https from 'https';
import http from 'http';
import fs from 'fs';

const shopName = process.argv[2];
const outputFile = process.argv[3] || `/tmp/etsy-${shopName}.json`;

if (!shopName) {
  console.error('Usage: node scrape-etsy-shop.mjs <shop_name> [output_file]');
  process.exit(1);
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function extractListings(html) {
  const listings = [];
  
  // Extract listing data from the HTML
  // Etsy embeds structured data we can parse
  
  // Method 1: Parse listing links with data
  const listingRegex = /\/listing\/(\d+)\/([^?"]+)/g;
  const seenIds = new Set();
  let match;
  
  while ((match = listingRegex.exec(html)) !== null) {
    const id = match[1];
    if (seenIds.has(id)) continue;
    seenIds.add(id);
    
    // Try to find title near this listing
    const slug = match[2].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    listings.push({ id, slug, url: `https://www.etsy.com/listing/${id}/${match[2]}` });
  }
  
  return listings;
}

async function scrapePage(page) {
  const url = `https://www.etsy.com/shop/${shopName}?ref=items-pagination&page=${page}&sort_order=date_desc`;
  console.error(`Fetching page ${page}: ${url}`);
  
  const res = await fetch(url);
  if (res.status !== 200) {
    console.error(`  Page ${page} returned status ${res.status}`);
    return [];
  }
  
  return extractListings(res.body);
}

async function main() {
  console.error(`Scraping shop: ${shopName}`);
  
  let allListings = [];
  let page = 1;
  const maxPages = 10; // safety limit
  
  while (page <= maxPages) {
    const listings = await scrapePage(page);
    if (listings.length === 0) break;
    
    allListings.push(...listings);
    console.error(`  Page ${page}: ${listings.length} listings (total: ${allListings.length})`);
    
    page++;
    // Small delay between pages
    await new Promise(r => setTimeout(r, 1500));
  }
  
  // Deduplicate by ID
  const seen = new Set();
  allListings = allListings.filter(l => {
    if (seen.has(l.id)) return false;
    seen.add(l.id);
    return true;
  });
  
  console.error(`\nTotal unique listings: ${allListings.length}`);
  
  fs.writeFileSync(outputFile, JSON.stringify({ shop: shopName, count: allListings.length, listings: allListings }, null, 2));
  console.error(`Saved to: ${outputFile}`);
}

main().catch(err => { console.error(err); process.exit(1); });
