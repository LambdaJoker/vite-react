import { RequestHandler } from 'express';
import { getRandomWallpaper, getAllWallpapers } from '../services/wallpaper.service';

export const getRandom: RequestHandler = async (req, res) => {
  try {
    // 禁用此接口的浏览器缓存，确保每次请求都能获取到随机壁纸
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const isMobile = req.query.isMobile === 'true';
    const url = await getRandomWallpaper(isMobile);
    res.json({ success: true, data: { url } });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取壁纸失败' });
  }
};

export const getAll: RequestHandler = async (req, res) => {
  try {
    const urls = await getAllWallpapers();
    res.json({ success: true, data: urls });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取壁纸失败' });
  }
};
