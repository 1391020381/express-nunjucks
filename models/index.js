var request = require('request');

module.exports = {
    get: function (url, callback, req, append) {
        var opt = this.getPaymentType(req, url, '', append);
        request(opt, (error, response, body) => {
            console.log(body,'body')
            if (body) {
                try {
                    var data = body;
                    if (typeof body == 'string') {
                        data = JSON.parse(body);
                    }
                    if (data) {
                        callback(null, data);
                    } else {
                        callback(null, null);
                    }
                } catch (err) {
                    console.error(err);
                    // callback(null , null);
                }
            } else {
                callback(null, null);
            }
        })
    },
    post: function (url, callback, req) {
        var opt = this.postPaymentType(req, url, '');
        // console.log(opt, 'opt=================')
        request(opt, (error, response, body) => {
            if (body) {
                try {
                    var data = body;
                    if (typeof body == 'string') {
                        data = JSON.parse(body);
                    }
                    if (data) {
                        callback(null, data);
                    } else {
                        callback(null, null);
                    }
                } catch (err) {
                    console.error(err);
                    // callback(null , null);
                }
            } else {
                callback(null, null);
            }
        })
    },
    getPaymentType: function (req, url, id, append) {
        if (id) {
            url = url.replace(/\$id/, id);
        } else if (req.url.indexOf('?') > 0 && !append) {
            url = url + req.url.substring(req.url.indexOf('?'));
        }
        // console.log(url,'urlurlurlurlurlurlurlurl=======')
        return {
            url: url,
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Service-Info': 'Nodejs-request',
                'User-Agent': req.headers['user-agent'],
                'Cookie': 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID,
            }
        };
    },
    postPaymentType: function (req, url, id) {
        var body = JSON.stringify(req.body);
        return {
            url: id ? url.replace(/\$id/, id) : url,
            method: "POST",
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Service-Info': 'Nodejs-request',
                'User-Agent': req.headers['user-agent'],
                // 'Content-Length': body.length,
                'Cookie': 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID,
            },
            body: req.body
        };
    },
    testEs6:function(){
        return new Promise((resolve,reject)=>{
            resolve({
                test:'123'
            })
        })
    },
    $http: function (url,method, req, append) {
        return new Promise((resolve,reject)=>{
            var opt = '';
            method === 'get' ? opt = this.getPaymentType(req, url, '', append) : opt = this.postPaymentType(req, url, '');
            request(opt, (error, response, body) => {
                console.log(body,'body')
                if (body) {
                    try {
                        var data = body;
                        if (typeof body == 'string') {
                            data = JSON.parse(body);
                        }
                        if (data) {
                            resolve(data)
                        } 
                    } catch (err) {
                        console.error(err);
                        reject(err)
                        // callback(null , null);
                    }
                } else {
                    reject(err);
                }
            })
        })
    },
};