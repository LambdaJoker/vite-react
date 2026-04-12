import { RequestHandler } from 'express';
import { getRandomWallpaper, getAllWallpapers } from '../services/wallpaper.service';

export const getRandom: RequestHandler = async (req, res) => {
  try {
    const url = await getRandomWallpaper();
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
