module.exports = (error, req, res , next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'เกิดข้อผิดพลาดในระบบ';
    const validation = error.validation; 

    return res.status(statusCode).json({
        error: {
            status_code: statusCode,
            message: message,
            validation: validation
        }
    });
}