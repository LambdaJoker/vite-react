"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readOnlyMiddleware = void 0;
/**
 * Middleware to enforce a read-only mode based on an environment variable.
 * It blocks all state-changing HTTP methods (POST, PUT, PATCH, DELETE)
 * if the application is not in 'development' mode.
 */
const readOnlyMiddleware = (req, res, next) => {
    // Allow all GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }
    // Check for development mode for state-changing methods
    if (process.env.APP_MODE !== 'development') {
        res.status(403).json({
            message: 'Forbidden: The application is currently in read-only mode. Modifications are not allowed.',
        });
    }
    else {
        // If in development mode, proceed with the request
        next();
    }
};
exports.readOnlyMiddleware = readOnlyMiddleware;
