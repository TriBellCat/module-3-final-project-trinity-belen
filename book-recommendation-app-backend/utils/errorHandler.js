const handleAsyncError = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error("Error in handler:", err);
        next(err);
    });
};

const errorHandler = (err, req, res, next) => {
    console.error("Global error handler caught:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message,
        error: err
    });
};

module.exports = { handleAsyncError, errorHandler };
