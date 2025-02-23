const errorHandler = (err, req, res, next) => {
    try {
        let error = {
            message: err.message || 'Server Error',
            statusCode: err.statusCode || 500,
        };
        console.error(err);
        // Mongoose Validation Error (400)
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors)
                .map((val) => val.message)
                .join(', ');
            error = { message, statusCode: 400 };
        }
        // Mongoose Bad ObjectId (CastError)
        if (err.name === 'CastError') {
            error = {
                message: 'Resource not found',
                statusCode: 404,
            };
        }
        // Mongoose Duplicate Key (11000)
        if (err.code === 11000) {
            error = {
                message: 'Duplicate field value entered',
                statusCode: 400,
            };
        }
        res.status(error.statusCode).json({
            success: false,
            error: error.message,
        });
    }
    catch (internalError) {
        next(internalError);
    }
};
export default errorHandler;
