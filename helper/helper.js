/**
 * @Description: nunjucks 添加全局方法
 */
var appConfig = require("../config/app-config");
var express = require("express");

module.exports = function(env){
    env.addGlobal('subStringFn' , function(str , len){
            //截取文本
            if(!str){
                return ""
            }
            var str = str 
                .replace(/&nbsp;/g, '')
                .replace(/&rdquo;/g, '”')
                .replace(/&ldquo;/g, '“')
                .replace(/&mdash;/g, '—');
            var s = str.replace(/<(?:.|\n)*?>/gm, '').trim();
            if(s.length > len){
                return s.substring(0 , len) + '...';
            }
            return s;
        })
        //日期格式化
        .addGlobal('formatDate' , function(style, time){
            if (typeof style !== 'string' || time === 'undefined') {
                return time;
            };

            time = getDateValue(time);
            console.log(time)
            var date = new Date(time);
            var attr = {};

            if (isNaN(date.getTime())) {
                return time;
            };

            attr.YYYY = date.getFullYear();
            attr.YY = attr.YYYY.toString(10).slice(-2);
            attr.M = date.getMonth() + 1;
            attr.MM = (attr.M < 10) ? '0' + attr.M : attr.M;
            attr.D = date.getDate();
            attr.DD = (attr.D < 10) ? '0' + attr.D : attr.D;

            attr.H = date.getHours();
            attr.HH = (attr.H < 10) ? '0' + attr.H : attr.H;
            attr.h = (attr.H > 12) ? attr.H - 12 : attr.H;
            attr.hh = (attr.h < 10) ? '0' + attr.h : attr.h;
            attr.m = date.getMinutes();
            attr.mm = (attr.m < 10) ? '0' + attr.m : attr.m;
            attr.s = date.getSeconds();
            attr.ss = (attr.s < 10) ? '0' + attr.s : attr.s;

            attr.time = date.getTime();
            attr.string = date.toDateString();

            style = style.replace(/TIME/g, attr.time);
            style = style.replace(/YYYY/g, attr.YYYY);
            style = style.replace(/YY/g, attr.YY);
            style = style.replace(/MM/g, attr.MM);
            style = style.replace(/M/g, attr.M);
            style = style.replace(/DD/g, attr.DD);
            style = style.replace(/D/g, attr.D);
            style = style.replace(/HH/g, attr.HH);
            style = style.replace(/H/g, attr.H);
            style = style.replace(/hh/g, attr.hh);
            style = style.replace(/h/g, attr.h);
            style = style.replace(/mm/g, attr.mm);
            style = style.replace(/m/g, attr.m);
            style = style.replace(/ss/g, attr.ss);
            style = style.replace(/s/g, attr.s);
            style = style.replace(/STRING/g, attr.string);

            return style;
        })
        //判断货币标识
        .addFilter('isMoneyString' , function(value){
            if(value){
                return /[￥]/.test(value);
            }
            return false;
        })
        //数字字符串转数字
        .addFilter('number' , function(value){
            if(value){
                return Number(value);
            }
            return value;
        })
        //判空
        .addFilter('empty' , function(value){
            if(value=='undefined'||value==''||value==null||value=='null'){
                return true;
            }
            return false;
        })
        //小数加法保留两位小数
        .addFilter('toFixed' , function(value){
            if(value){
                return value.toFixed(2);
            }
            return value;
        })
        //字符串截取 以...结尾
        .addFilter('cutStr' , function(value,param){
            if(value&&param.len&&(value.length-param.len)>3){
                return value.substr(0,param.len)+"...";
            }
            return value;
        })
        //去掉标题格式
        .addFilter('delType',function(value){
            if(value){
                var index = value.lastIndexOf(".");
                if(index !=-1) {
                    return value.substr(0,index)
                }else{
                    return value
                } 
            }else{
                return value
            }
            
        })
        // 过滤字符串中的html标签
        .addFilter('replaceHtml',function(value){
            var reg = /<[^<>]+>/g;//1、全局匹配g肯定忘记写,2、<>标签中不能包含标签实现过滤HTML标签
            value = value.replace(reg, '');//替换HTML标签
            value = value.replace(/&nbsp;/ig, '');//替换HTML空格
                return value;
        })

}

// 转换日期值类型
var getDateValue = function(value) {
    if (/^\d{4}$/.test(value)) {
        value = value + '/1/1';
    } else if (typeof value === 'number' && isFinite(value)) {
        value = parseInt(value, 10);
    } else if (typeof value === 'string') {
        value = value.replace(/[\.\-]/g, '/');
    };

    return value;
};
