// 统一异常处理
module.exports = (req, res, next) => {
    res.send({
        rsp_code : 'fail',
        error_code : 'system_error',
        error_msg : '系统错误'
    });
};
