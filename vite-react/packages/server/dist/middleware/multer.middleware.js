"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const isVercel = process.env.VERCEL === '1';
// 确保上传目录存在
// 我们将图片存储在 server/public/uploads 目录下
const uploadDir = path_1.default.join(__dirname, '../../public/uploads');
if (!isVercel && !fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// 定义文件的存储方式
// 不管是不是 Vercel，统一使用内存存储，然后由 controller 上传到 Vercel Blob
const storage = multer_1.default.memoryStorage();
// 文件类型过滤器
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('只允许上传图片文件!'), false);
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 限制文件大小为 5MB
    }
});
