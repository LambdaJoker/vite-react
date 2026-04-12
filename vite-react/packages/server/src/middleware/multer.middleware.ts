import multer from 'multer';
import path from 'path';
import fs from 'fs';

const isVercel = process.env.VERCEL === '1';

// 确保上传目录存在
// 我们将图片存储在 server/public/uploads 目录下
const uploadDir = path.join(__dirname, '../../public/uploads');

if (!isVercel && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 定义文件的存储方式
// 不管是不是 Vercel，统一使用内存存储，然后由 controller 上传到 Vercel Blob
const storage = multer.memoryStorage();

// 文件类型过滤器
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件!'), false);
  }
}

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 限制文件大小为 5MB
  }
}); 