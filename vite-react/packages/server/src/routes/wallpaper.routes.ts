import { Router } from 'express';
import { getRandom, getAll } from '../controllers/wallpaper.controller';

const router = Router();

router.get('/random', getRandom);
router.get('/all', getAll);

export default router;
