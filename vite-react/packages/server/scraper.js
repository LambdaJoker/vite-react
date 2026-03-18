const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Define where to save the scraped data
const outputDir = path.join(__dirname, 'public', 'uploads', 'wallpapers');
const dataFile = path.join(__dirname, 'wallpapers-data.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function scrapeWallpapers(pageUrl = 'https://haowallpaper.com/') {
  console.log(`🚀 Starting scrape from: ${pageUrl}`);
  
  try {
    const response = await axios.get(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      }
    });
    
    const html = response.data;
    console.log(`✅ Successfully fetched HTML (${html.length} bytes)`);
    
    const $ = cheerio.load(html);
    let imageUrls = [];

    // Approach 1: Try to find standard img tags
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original');
      if (src && (src.includes('haowallpaper.com') || src.includes('http'))) {
         // Filter out small icons or SVGs
         if (!src.endsWith('.svg') && !src.includes('logo')) {
            imageUrls.push(src);
         }
      }
    });

    // Approach 2: If Nuxt/Vue, look inside the window.__NUXT__ state
    const scriptTags = $('script').text();
    const imgRegex = /https:\/\/[\w.-]+\.haowallpaper\.com\/[a-zA-Z0-9_/.-]+\.(jpg|jpeg|png|webp)/gi;
    const scriptMatches = scriptTags.match(imgRegex);
    if (scriptMatches) {
        imageUrls.push(...scriptMatches);
    }

    // Approach 3: Just brute force the entire HTML for any haowallpaper image link
    const bruteRegex = /(https?:\/\/[^"'\\]+\.haowallpaper\.com\/[^"'\\]+\.(?:jpg|jpeg|png|webp))/gi;
    const bruteMatches = html.match(bruteRegex);
    if(bruteMatches) {
       imageUrls.push(...bruteMatches);
    }

    // Deduplicate and filter
    const validUrls = [...new Set(imageUrls)].filter(url => {
      return !url.includes('logo') && !url.includes('icon') && !url.includes('avatar');
    });
    
    console.log(`🔍 Found ${validUrls.length} unique image URLs`);
    
    if (validUrls.length === 0) {
      console.log('❌ No images found. The site might be heavily CSR (Client-Side Rendered) or using complex API requests.');
      console.log('💡 Tip: We might need to use Puppeteer or intercept their JSON API directly.');
      return;
    }
    
    // Save the raw URLs to a JSON file
    fs.writeFileSync(dataFile, JSON.stringify(validUrls, null, 2));
    console.log(`💾 Saved ${validUrls.length} URLs to ${dataFile}`);
    
    console.log('\n🌟 Sample of found wallpapers:');
    validUrls.slice(0, 5).forEach((url, i) => console.log(`  ${i+1}. ${url}`));
    
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
  }
}

scrapeWallpapers();
