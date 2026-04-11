import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const dataFile = path.join(__dirname, '../../public/uploads/wallpapers-data.json');
let currentWallpapers: string[] = [];

// Initialize data from file if exists
if (fs.existsSync(dataFile)) {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    currentWallpapers = JSON.parse(data);
    console.log(`[WallpaperService] Loaded ${currentWallpapers.length} wallpapers from cache.`);
  } catch (err) {
    console.error('[WallpaperService] Failed to read cache:', err);
  }
}

export const scrapeWallpapers = async () => {
  // Generate a random page number between 1 and 100 to get diverse wallpapers
  // haowallpaper.com/search 页面是 CSR 渲染的，直接请求 HTML 拿不到图片，我们需要修改一下策略
  // 为了过滤露骨内容，我们改为去抓取某些特定的安全分类页面，或者通过其 API 请求
  const randomPage = Math.floor(Math.random() * 50) + 1;
  const pageUrl = `https://haowallpaper.com/?page=${randomPage}`;
  
  console.log(`[WallpaperService] 🚀 Starting scrape from: ${pageUrl} (Page ${randomPage})`);
  
  try {
    const response = await axios.get(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      }
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    let imageUrls: string[] = [];

    // Approach 1
    $('img').each((i, el) => {
      let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original');
      
      if (src && (src.includes('haowallpaper.com') || src.includes('http'))) {
         // Skip logos and SVGs
         if (src.endsWith('.svg') || src.includes('logo')) {
             return;
         }

         // Enhance quality: Replace 'getCroppingImg' (thumbnail) with 'previewFileImg' (higher res preview)
         if (src.includes('getCroppingImg')) {
             src = src.replace('getCroppingImg', 'previewFileImg');
         }

         imageUrls.push(src);
      }
    });

    // Approach 2
    const scriptTags = $('script').text();
    const imgRegex = /https:\/\/[\w.-]+\.haowallpaper\.com\/[a-zA-Z0-9_/.-]+\.(jpg|jpeg|png|webp)/gi;
    const scriptMatches = scriptTags.match(imgRegex);
    if (scriptMatches) {
        // 将略缩图替换为高清图
        const highResScriptMatches = scriptMatches.map((url: string) => url.replace('getCroppingImg', 'previewFileImg'));
        imageUrls.push(...highResScriptMatches);
    }

    // Approach 3
    const bruteRegex = /(https?:\/\/[^"'\\]+\.haowallpaper\.com\/[^"'\\]+\.(?:jpg|jpeg|png|webp))/gi;
    const bruteMatches = html.match(bruteRegex);
    if(bruteMatches) {
       // 将略缩图替换为高清图
       const highResMatches = bruteMatches.map((url: string) => url.replace('getCroppingImg', 'previewFileImg'));
       imageUrls.push(...highResMatches);
    }

    const validUrls = [...new Set(imageUrls)].filter((url: string) => {
      // 过滤掉头像、logo、图标，同时可以根据 URL 关键词过滤不需要的分类（如需要）
      return !url.includes('logo') && 
             !url.includes('icon') && 
             !url.includes('avatar') && 
             !url.includes('user') &&
             !url.includes('vip') &&
             !url.includes('wx') &&
             !url.includes('alipay') &&
             !url.includes('pixabay');
    });
    
    if (validUrls.length > 0) {
      // 将新抓取的壁纸追加到现有的列表中，并去重
      const mergedWallpapers = [...new Set([...currentWallpapers, ...validUrls])];
      currentWallpapers = mergedWallpapers;
      fs.writeFileSync(dataFile, JSON.stringify(currentWallpapers, null, 2));
      console.log(`[WallpaperService] ✅ Successfully updated wallpapers. Added ${validUrls.length} new ones. Total: ${currentWallpapers.length}`);
    } else {
      console.log('[WallpaperService] ⚠️ No new wallpapers found on this page.');
    }
  } catch (error: any) {
    console.error('[WallpaperService] ❌ Scraping failed:', error.message);
  }
};

export const getRandomWallpaper = () => {
  if (currentWallpapers.length === 0) {
    // Default fallback - Use previewFileImg for higher quality
    return 'https://haowallpaper.com/link/common/file/previewFileImg/18347080643104128';
  }
  const randomIndex = Math.floor(Math.random() * currentWallpapers.length);
  return currentWallpapers[randomIndex];
};

export const getAllWallpapers = () => currentWallpapers;
