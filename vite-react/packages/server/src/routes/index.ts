import { Router } from 'express';
import articleRoutes from './article.routes';
import skillRoutes from './skill.routes';
import wallpaperRoutes from './wallpaper.routes';

const router = Router();

router.use('/articles', articleRoutes);
router.use('/skills', skillRoutes);
router.use('/wallpapers', wallpaperRoutes);

export default router; 