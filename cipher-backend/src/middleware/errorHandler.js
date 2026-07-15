// This is the Global Error Handler
export const errorHandler = (err, req, res, next) => {
    console.error("Error caught by Global Handler:", err);

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    
    res.status(statusCode).json({
        error: err.message || "Internal Server Error",
        // Only show detailed error stacks when you are in development mode, hide them in production!
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// This is a magic wrapper that removes the need for try/catch blocks!
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};