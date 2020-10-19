var request = require('request');

module.exports = {
    get: function (url, callback, req, append) {
        var opt = this.getPaymentType(req, url, '', append);
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
                    console.log('请求地址get-------------------:',opt.url)
                    console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
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
                    console.log('请求地址post-------------------:',opt.url)
                    console.log('请求参数-------------------:',req.body)
                    console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
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
        return {
            url: url,
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Service-Info': 'Nodejs-request',
                'User-Agent': req.headers['user-agent'],
                'Authrization':req.cookies.cuk
            }
        };
    },
    postPaymentType: function (req, url, id) {
        return {
            url: id ? url.replace(/\$id/, id) : url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
                'Service-Info': 'Nodejs-request',
                'User-Agent': req.headers['user-agent'],
                'Authrization':req.cookies.cuk
            },
            body: req.body
        };
    },
    $http: function (url,method, req,res,append) {
        return new Promise((resolve,reject)=>{
            var opt = '';
            method === 'get' ? opt = this.getPaymentType(req, url, '', append) : opt = this.postPaymentType(req, url, '');
            request(opt, (error, response, body) => {
                // console.log('$http---------:',opt.url,error,body)
                let is4paradigm = opt.url.includes('https://nbrecsys.4paradigm.com/')
                if (body) {
                    try {
                        var data = body;
                        if (typeof body == 'string') {
                            data = JSON.parse(body);
                        }
                        if(data.code!='0'&&!is4paradigm){
                            console.log('$http---------:',opt.url,error,body)
                            reject(body)
                        }else{
                            resolve(data)   
                        }
                    } catch (err) {
                        console.log('$http---------:',opt.url,err,body)
                        reject(err)
                    }
                } else {
                    reject(body)
                }
            })
        })
    },
};