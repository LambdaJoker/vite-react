"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallpaper_controller_1 = require("../controllers/wallpaper.controller");
const router = (0, express_1.Router)();
router.get('/random', wallpaper_controller_1.getRandom);
router.get('/all', wallpaper_controller_1.getAll);
exports.default = router;
