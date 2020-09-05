/**
 * @Description: 404
 */
var async = require("async");
var render = require("../common/render");
var request = require('request');
var server = require("../models/index");
var api = require("../api/api");
var appConfig = require("../config/app-config");
var moment = require('moment');
var util = require('../common/util');
const { file } = require("../api/api");

module.exports = {
    index: function (req, res) {
        return async.series({
            userInfo:function(callback){
            //    console.log('req.cookies:',req.cookies)
               var opt = {
                method: 'GET',
                url: appConfig.apiNewBaselPath + api.user.getUserInfo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authrization':req.cookies.cuk
                },
            };
            request(opt, function (err, res1, body) {
                if (body) {
                    var data = JSON.parse(body);
                    console.log('请求地址get-------------------:',opt.url)
                    console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                    if (data.code == 0 && data.data) {
                        callback(null, data); 
                    } else {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            })
            },
            rightsVipMemberDetail:function(callback){
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + api.coupon.getVipAllMemberDetail,
                    body:JSON.stringify({}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authrization':req.cookies.cuk
                    },
                };
                request(opt, function (err, res1, body) {
                    if (body) {
                        var data = JSON.parse(body);
                        console.log('请求地址post-------------------:',opt.url)
                        console.log('请求参数-------------------:', opt.body)
                        console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                        if (data.code == 0 && data.data) {
                            callback(null, data); 
                        } else {
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                })
            }
        } , function(err, results){
            // console.log('results-------------:',results)
            var userInfo = {}
            var rightsVipMemberDetail = {}
            var userInfoCode = '0'
            var rightsVipMemberDetailCode = '0'

            var masterRightsVipMemberDetail = {}

            var officeRightsVipMemberDetail = {}

            if(results.userInfo&&results.userInfo.code == '0'){
                userInfo = results.userInfo&&results.userInfo.data
            }else{
                userInfoCode = results.userInfo&&results.userInfo.code
            }

            if(results.rightsVipMemberDetail&&results.rightsVipMemberDetail.code == '0'){ // 在前端页面
              //  console.log('rightsVipMemberDetail:',results.rightsVipMemberDetail)

              results.rightsVipMemberDetail&&results.rightsVipMemberDetail.data.forEach(item=>{  // site 使用范围 0-办公,1-教育,2-建筑,3-超级会员,4-主站       fileDiscount   PAY_DISCOUNT的特权
                  if(item.site == '4'){  // 主站
                      var fileDiscount = ''
                      var expireTime =  expireTime = item.endDate?moment(item.endDate).format('YYYY-MM-DD'):''
                      
                       if(item.memberPointList){
                           item.memberPointList.forEach(memberPoint=>{
                                if(memberPoint.code == 'PAY_DISCOUNT'){ // 下载特权
                                    fileDiscount  = memberPoint.value  
                                }
                               
                           })
                       }
                       masterRightsVipMemberDetail = Object.assign({},item,{fileDiscount:fileDiscount,isMasterVip:item.vipStatus,isVip:item.vipStatus,expireTime: expireTime})
                  }
                  if(item.site == '0'){   // 办公
                    var fileDiscount = ''
                    var expireTime =  expireTime = item.endDate?moment(item.endDate).format('YYYY-MM-DD'):''

                    if(item.memberPointList){
                        item.memberPointList.forEach(memberPoint=>{
                             if(memberPoint.code == 'PAY_DISCOUNT'){ // 下载特权
                                 fileDiscount  = memberPoint.value
                                 
                             }
                            
                        })
                    }

                    officeRightsVipMemberDetail = Object.assign({},item,{fileDiscount:fileDiscount,isVip:item.vipStatus,expireTime: expireTime})
                  }
              })
                // var fileDiscount = results.rightsVipMemberDetail.data.memberPoint&&results.rightsVipMemberDetail.data.memberPoint.value,
                // rightsVipMemberDetail = Object.assign({},results.rightsVipMemberDetail.data,{isVip:results.rightsVipMemberDetail.data.vipStatus,expireTime: results.rightsVipMemberDetail.data.endDate?moment(results.rightsVipMemberDetail.data.endDate).format('YYYY-MM-DD'):'',fileDiscount:fileDiscount})



                rightsVipMemberDetail = Object.assign({},masterRightsVipMemberDetail,{isOfficeVip:officeRightsVipMemberDetail.isVip,officeVipExpireTime:officeRightsVipMemberDetail.expireTime})
            }else{
                rightsVipMemberDetailCode = results.rightsVipMemberDetail&&results.rightsVipMemberDetail.code
            }

            var code = userInfoCode == 0 && rightsVipMemberDetailCode == 0?'0':1
            // console.log('userInfo:',JSON.stringify(userInfo),'rightsVipMemberDetail:',JSON.stringify(rightsVipMemberDetail))
            var data = Object.assign({},userInfo,rightsVipMemberDetail)
            res.json(Object.assign({},results,{data:data,code:code}))
        })
    }
};