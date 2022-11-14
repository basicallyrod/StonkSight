const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode);
    res.json({
        error: statusCode,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        // body: req.body.text,
    })
}

module.exports ={
    errorHandler,
}