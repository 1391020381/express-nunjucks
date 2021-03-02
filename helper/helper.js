/**
 * @Description: nunjucks 添加全局方法
 */
const appConfig = require('../config/app-config');
const express = require('express');
const xssFilters = require('xss-filters');
module.exports = function(env){
    env.addGlobal('subStringFn', (str, len) => {
        // 截取文本
        if(!str){
            return '';
        }
        str = str
            .replace(/&nbsp;/g, '')
            .replace(/&rdquo;/g, '”')
            .replace(/&ldquo;/g, '“')
            .replace(/&mdash;/g, '—');
        const s = str.replace(/<(?:.|\n)*?>/gm, '').trim();
        if(s.length > len){
            return s.substring(0, len) + '...';
        }
        return s;
    })
        // 日期格式化
        .addGlobal('formatDate', (style, time) => {
            if (typeof style !== 'string' || time === 'undefined') {
                return time;
            }

            time = getDateValue(time);
            console.log(time);
            const date = new Date(time);
            const attr = {};

            if (isNaN(date.getTime())) {
                return time;
            }

            attr.YYYY = date.getFullYear();
            attr.YY = attr.YYYY.toString(10).slice(-2);
            attr.M = date.getMonth() + 1;
            attr.MM = attr.M < 10 ? '0' + attr.M : attr.M;
            attr.D = date.getDate();
            attr.DD = attr.D < 10 ? '0' + attr.D : attr.D;

            attr.H = date.getHours();
            attr.HH = attr.H < 10 ? '0' + attr.H : attr.H;
            attr.h = attr.H > 12 ? attr.H - 12 : attr.H;
            attr.hh = attr.h < 10 ? '0' + attr.h : attr.h;
            attr.m = date.getMinutes();
            attr.mm = attr.m < 10 ? '0' + attr.m : attr.m;
            attr.s = date.getSeconds();
            attr.ss = attr.s < 10 ? '0' + attr.s : attr.s;

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
        // 判断货币标识
        .addFilter('isMoneyString', (value) => {
            if(value){
                return /[￥]/.test(value);
            }
            return false;
        })
        // 数字字符串转数字
        .addFilter('number', (value) => {
            if(value){
                return Number(value);
            }
            return value;
        })
        // 判空
        .addFilter('empty', (value) => {
            if(value=='undefined'||value==''||value==null||value=='null'){
                return true;
            }
            return false;
        })
        // 小数加法保留两位小数
        .addFilter('toFixed', (value) => {
            if(value){
                return value.toFixed(2);
            }
            return value;
        })
        // 字符串截取 以...结尾
        .addFilter('cutStr', (value, param) => {
            if(value&&param.len&&value.length-param.len>3){
                return value.substr(0, param.len)+'...';
            }
            return value;
        })
        // 去掉标题格式
        .addFilter('delType', (value) => {
            const typeList = ['.doc', '.docx', '.docm', '.dotx', '.dotm', '.xls', '.xlsx', '.xlsm', '.xltx', '.xltm', '.xlsb', '.xlamppt', '.pptx', '.pptm', '.ppsx', '.potm', '.ppam', '.ppsm', '.ppsx', '.txt', '.pdf'];
            let temp = value;
            if(temp){
                for(let i=0; i<=typeList.length; i++){
                    const flag = value.endsWith(typeList[i]);
                    if(flag){
                        const index = value.lastIndexOf(typeList[i]);
                        if(index!=-1){
                            temp = value.substr(0, index);
                        }
                        break;
                    }else{
                        temp = value;
                    }
                }
            }
            return temp;

        })
        // 过滤字符串中的html标签
        .addFilter('replaceHtml', (value) => {
            const reg = /<[^<>]+>/g;// 1、全局匹配g肯定忘记写,2、<>标签中不能包含标签实现过滤HTML标签
            value = value.replace(reg, '');// 替换HTML标签
            value = value.replace(/&nbsp;/ig, '');// 替换HTML空格
            value = xssFilters.inHTMLData(value);
            return value;
        });

};

// 转换日期值类型
const getDateValue = function(value) {
    if (/^\d{4}$/.test(value)) {
        value = value + '/1/1';
    } else if (typeof value === 'number' && isFinite(value)) {
        value = parseInt(value, 10);
    } else if (typeof value === 'string') {
        value = value.replace(/[\.\-]/g, '/');
    }

    return value;
};
