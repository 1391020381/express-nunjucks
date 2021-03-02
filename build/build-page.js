/**
 * @Description: 一些读取文件，写入的方法
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/page-config');
const stat=fs.stat;
console.log('config.version:', config.version);
if(!config.version) return;
const directoryArr = ['node_modules', 'data', 'test', config.version];
const fileArr = ['Gruntfile.js', 'package-lock.json', 'package.json', 'yarn.lock'];


const copy = (src, dst) => {
    // 读取目录
    fs.readdir(src, (err, paths) => {
        if(err){
            throw err;
        }
        paths.forEach((path) => {
            const _src = src + '/' + path;
            const _dst = dst + '/' + path;
            let readable;
            let writable;
            stat(_src, (err, st) => {
                if(err){
                    throw err;
                }
                // 如果是文件
                if(st.isFile()){
                    console.log(path+'文件是否需要复制'+!fileArr.includes(path));
                    if(!fileArr.includes(path)){
                        // 创建读取流
                        readable = fs.createReadStream(_src);
                        // 创建写入流
                        writable = fs.createWriteStream(_dst);
                        readable.pipe(writable);
                    }
                }else if(st.isDirectory()){
                    // 递归调用 这几个文件不需要读取复制
                    if(!directoryArr.includes(path)){
                        exists( _src, _dst, copy);
                    }
                }
            });
        });
    });
};

const exists = (src, dst, fn) => {
    fs.exists(dst, (exists) => {
        // 存在
        if(exists){
            fn(src, dst);
        }else{
            // 不存在创建目录
            fs.mkdir(dst, () => {
                fn(src, dst);
            });
        }
    });
};


exists(path.resolve(__dirname, '../public'), path.resolve(__dirname, '../static/'+config.version), copy);