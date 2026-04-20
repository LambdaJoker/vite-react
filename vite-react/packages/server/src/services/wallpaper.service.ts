import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const isVercel = process.env.VERCEL === '1';
const tempFile = '/tmp/wallpapers-data.json';
const localFile = path.join(__dirname, '../../public/uploads/wallpapers-data.json');
let currentWallpapers: string[] = [];

// Helper function to read data
const readWallpapersData = () => {
  if (isVercel && fs.existsSync(tempFile)) {
    return fs.readFileSync(tempFile, 'utf8');
  } else if (fs.existsSync(localFile)) {
    return fs.readFileSync(localFile, 'utf8');
  }
  return null;
};

// Initialize data from file if exists
const initialData = readWallpapersData();
if (initialData) {
  try {
    currentWallpapers = JSON.parse(initialData);
    console.log(`[WallpaperService] Loaded ${currentWallpapers.length} wallpapers from cache.`);
  } catch (err) {
    console.error('[WallpaperService] Failed to parse cache:', err);
  }
}

// [保留代码] 以下是实时获取模式 (Scrape Mode) 的核心逻辑
// 现已通过 WALLPAPER_MODE 环境变量进行控制，不再强制每次启动执行
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
      try {
        const targetFile = isVercel ? tempFile : localFile;
        fs.writeFileSync(targetFile, JSON.stringify(currentWallpapers, null, 2));
      } catch (err) {
        console.error('[WallpaperService] Failed to write cache:', err);
      }
      console.log(`[WallpaperService] ✅ Successfully updated wallpapers. Added ${validUrls.length} new ones. Total: ${currentWallpapers.length}`);
    } else {
      console.log('[WallpaperService] ⚠️ No new wallpapers found on this page.');
    }
  } catch (error: any) {
    console.error('[WallpaperService] ❌ Scraping failed:', error.message);
  }
};

export const getRandomWallpaper = async () => {
  const mode = process.env.WALLPAPER_MODE || 'local'; // 可选值: 'scrape' | 'local' | 'video'

  // 1. Video 模式 (vedio模式)
  if (mode === 'video' || mode === 'vedio') { // 兼容拼写错误
    // 视频文件已放置在前端 public 目录下，以避开 Vercel Serverless 的体积限制
    return '/bg-video.mp4'; 
  }

  // 2. 实时获取模式 (实时抓取模式)
  if (mode === 'scrape') {
    if (currentWallpapers.length === 0) {
      if (isVercel) {
        await scrapeWallpapers();
      }
    }
  }

  // 3. 本地随机模式 (local模式) 或是 scrape 获取失败的兜底
  if (currentWallpapers.length === 0 || mode === 'local') {
    // 每次请求随机前重新读取一次文件，这样用户在外部修改 wallpapers-data.json 后会立即生效
    const data = readWallpapersData();
    if (data) {
      try {
        currentWallpapers = JSON.parse(data);
      } catch (err) {
        console.error('[WallpaperService] Failed to parse cache:', err);
      }
    }
  }

  if (currentWallpapers.length === 0) {
    // Default fallback - Use previewFileImg for higher quality
    return 'https://haowallpaper.com/link/common/file/previewFileImg/18347080643104128';
  }
  const randomIndex = Math.floor(Math.random() * currentWallpapers.length);
  return currentWallpapers[randomIndex];
};

export const getAllWallpapers = async () => {
  const mode = process.env.WALLPAPER_MODE || 'local';
  if (mode === 'scrape' && currentWallpapers.length === 0 && isVercel) {
    await scrapeWallpapers();
  }
  if (currentWallpapers.length === 0) {
    const data = readWallpapersData();
    if (data) {
      try {
        currentWallpapers = JSON.parse(data);
      } catch (err) {
        console.error('[WallpaperService] Failed to parse cache:', err);
      }
    }
  }
  return currentWallpapers;
};
