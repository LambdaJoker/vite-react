import express from 'express';
import articleRoutes from './article.routes';
import skillRoutes from './skill.routes';

const router = express.Router();

router.use('/articles', articleRoutes);
router.use('/skills', skillRoutes);

export default router; 