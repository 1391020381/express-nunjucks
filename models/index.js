
const request = require('request');
const Api = require('../api/api');
module.exports = {
    get: function (url, callback, req, append) {
        const opt = this.getPaymentType(req, url, '', append);
        request(opt, (error, response, body) => {
            if (body) {
                try {
                    let data = body;
                    if (typeof body == 'string') {
                        data = JSON.parse(body);
                    }
                    if (data) {
                        callback(null, data);
                    } else {
                        callback(null, null);
                    }
                    console.log('请求地址get-------------------:', opt.url);
                    console.log('返回code------:' + data.code, '返回message-------:' + data.message);
                } catch (err) {
                    console.error(err);
                    // callback(null , null);
                }
            } else {
                callback(null, null);
            }
        });
    },

    post: function (url, callback, req) {
        const opt = this.postPaymentType(req, url, '');
        request(opt, (error, response, body) => {
            if (body) {
                try {
                    let data = body;
                    if (typeof body == 'string') {
                        data = JSON.parse(body);
                    }
                    if (data) {
                        callback(null, data);
                    } else {
                        callback(null, null);
                    }
                    console.log('请求地址post-------------------:', opt.url);
                    console.log('请求参数-------------------:', req.body);
                    console.log('返回code------:' + data.code, '返回message-------:' + data.message);
                } catch (err) {
                    console.error(err);
                    // callback(null , null);
                }
            } else {
                callback(null, null);
            }
        });
    },

    getPaymentType: function (req, url, id, append) {
        if (id) {
            url = url.replace(/\$id/, id);
        } else if (req.url.indexOf('?') > 0 && !append) {
            url = url + req.url.substring(req.url.indexOf('?'));
        }
        return {
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Service-Info': 'Nodejs-request',
                'User-Agent': req.headers['user-agent'],
                'Authrization': req.cookies.cuk
            }
        };
    },

    postPaymentType: function (req, url, id) {
        return {
            url: id ? url.replace(/\$id/, id) : url,
            method: 'POST',
            json: true,
            headers: {
                'content-type': 'application/json',
                'Service-Info': 'Nodejs-request',
                'User-Agent': req.headers['user-agent'],
                'Authrization': req.cookies.cuk
            },
            body: req.body
        };
    },

    // 获取txt文本信息
    $httpTxt: function (url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (!error && response.statusCode == 200 || response.statusCode == 206) {
                    resolve(response.body); // Print the google web page.
                } else {
                    console.log('$httpTxt---------:', body);
                    reject(body);
                }
            });
        });
    },

    $http: function (url, method, req, res, append) {
        return new Promise((resolve, reject) => {
            let opt = '';
            method === 'get' ? opt = this.getPaymentType(req, url, '', append) : opt = this.postPaymentType(req, url, '');
            request(opt, (error, response, body) => {
                // console.log('$http---------:',opt.url,error,body)
                const is4paradigm = opt.url.includes('4paradigm.com');
                // const isGetFileDetailNoTdk = opt.url.includes('/content/getFileDetailNoTdk');
                const isGetFileDetailNoTdk = opt.url.includes(Api.file.getFileDetailNoTdk);
                if (body) {
                    try {
                        let data = body;
                        if (typeof body == 'string') {
                            data = JSON.parse(body);

                        }
                        if (isGetFileDetailNoTdk && data.code == 'G-404' || is4paradigm) { // 非标准判断
                            resolve(data);
                        } else {
                            if (data.code == 0) {
                                resolve(data);
                            } else {
                                console.log('$http---------:', JSON.stringify(opt), data);
                                reject(data);
                            }
                        }
                    } catch (err) {
                        console.log('$http---------:', opt, body);
                        reject(err);
                    }
                } else {
                    reject(body);
                }
            });
        });
    }
};
