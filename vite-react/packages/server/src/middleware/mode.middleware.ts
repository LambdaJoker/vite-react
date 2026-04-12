import { RequestHandler } from 'express';

/**
 * Middleware to enforce a read-only mode based on an environment variable.
 * It blocks all state-changing HTTP methods (POST, PUT, PATCH, DELETE)
 * if the application is not in 'development' mode.
 */
export const readOnlyMiddleware: RequestHandler = (req, res, next) => {
  // Allow all GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // 允许所有用户（即使在只读模式下）进行评论和点赞操作
  const path = req.originalUrl || req.path;
  const isCommentOrLike = path.includes('/comments') || path.includes('/like');
  
  // 只允许 POST 请求（点赞和发表评论），删除操作（DELETE）仍受只读模式保护
  if (isCommentOrLike && req.method === 'POST') {
    return next();
  }

  // 检查请求头中的管理员密钥
  const adminPwd = req.headers['x-admin-pwd'];
  const expectedPwd = process.env.ADMIN_PWD;

  // 如果提供了正确的密钥，允许操作
  if (expectedPwd && adminPwd === expectedPwd) {
    return next();
  }

  // Check for development mode for state-changing methods
  if (process.env.APP_MODE !== 'development') {
    res.status(403).json({
      message: 'Forbidden: The application is currently in read-only mode. Modifications are not allowed.',
    });
  } else {
    // If in development mode, proceed with the request
    next();
  }
}; 