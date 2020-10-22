/**
 * @Description: 一些读取文件，写入的方法
 */

var fs = require("fs");
var path = require("path");
var config = require("../config/page-config");
var stat=fs.stat;
console.log('config.version:',config.version)
if(!config.version) return;
var directoryArr = ["node_modules","data","test",config.version];
var fileArr = ["Gruntfile.js","package-lock.json","package.json","yarn.lock"];


var copy = (src , dst) =>{
    //读取目录
    fs.readdir(src , (err,paths) =>{
        if(err){
            throw err;
        }
        paths.forEach((path) =>{
            var _src = src + '/' + path;
            var _dst = dst + '/' + path;
            var readable;
            var writable;
            stat(_src ,(err , st) =>{
                if(err){
                    throw err;
                }
                //如果是文件
                if(st.isFile()){
                    console.log(path+"文件是否需要复制"+!fileArr.includes(path))
                    if(!fileArr.includes(path)){
                        //创建读取流
                        readable = fs.createReadStream(_src);
                        //创建写入流
                        writable = fs.createWriteStream(_dst);
                        readable.pipe(writable);
                    }
                }else if(st.isDirectory()){
                    //递归调用 这几个文件不需要读取复制
                    if(!directoryArr.includes(path)){
                        exists( _src, _dst, copy)
                    }
                }
            })
        })
    })
}

var exists = (src , dst , fn) =>{
    fs.exists(dst,(exists) =>{
        //存在
        if(exists){     
            fn(src , dst);
        }else{
            //不存在创建目录
            fs.mkdir(dst,() =>{
                fn(src , dst);
            })
        }
    })
}



exists(path.resolve(__dirname,'../public'),path.resolve(__dirname,'../static/'+config.version),copy)