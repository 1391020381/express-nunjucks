# ishare 文档说明



#### 基本环境

> 网络wi-fi   
>
>  账号 : iask  ，密码：IS_@403.C o m

> 配置本地Hosts   
>
> 下载安装[SwitchHosts ](https://github.com/oldj/SwitchHosts)  配置启用以下内容
>
> 192.168.1.79 configlist.appleframework.com 
>
> 192.168.1.79 configinfo.appleframework.com
>
> 192.168.1.79 aiwen.gitlab.com

#### 项目相关

> 项目地址
>
> [http://aiwen.gitlab.com](http://aiwen.gitlab.com/)
>
> 需要先用爱问公司提供的个人邮箱 如：san.zhang@iask.c n  开通权限，并且配置好hosts 才能进入gitlab
>
> 
>
> 项目一 ：ishare  移动端
>
> [http://aiwen.gitlab.com/chengwei/node-web](http://aiwen.gitlab.com/chengwei/node-web)
>
> 
>
> 项目二：ishare  pc端
>
> [http://aiwen.gitlab.com/yulele/node-pc](http://aiwen.gitlab.com/yulele/node-pc)
>
> 
>
> 主要技术点 ：node+express+nunjucks…. 服务端渲染
>
> node（v11.13.0）express(v4.16.3)  seajs(v2.2.0)  grunt(v1.3.2)
> jquery(v1.8.3)  nunjucks(v2.2.0)  lessart-template
>
> 
>
> 相关资料
>
> https://nodejs.org/en/
>
> http://www.expressjs.com.cn/ 
> https://www.gruntjs.net/
> https://nunjucks.bootcss.com/



> cd  node-web 
>
>  npm install
>
>
>  npm run dev  
>
>  访问 http:// m.ishare.iask.sina.com.cn  或 http://localhost:3003  

#### 全局环境变量

process.env.NODE_ENV
dev 本地开发环境 ，uat 测试 、预发环境 prd  生产环境

#### 项目配置

├── api // 存放项目接口

├── bin // 项目启动

├── build // 存放项目打包工具文件

├── common // 项目公用函数

├── controller // 控制层

├── lib // 公用类，组件库

├── mock //临时模拟数据

├── models //数据层

├── view //视图层

├── routes//路由层 

├── config // 项目配置文件

├── helper // nunjucks 公用函数

├── app.js // 项目入口文件

├── package.json // 项目配置文件

├── public // 静态资源

│ ├── images // 图片资源

│ ├── javascripts // js 资源

│ ├── stylesheets // css 资源

│ ├── Gruntfile.js // 打包配置文件 

│ └── package.json // 安装包依赖配置文件


#### 前端开发规范

 node项目

1、同步、异步接口请求规范,node服务端 ,客服端 ：ajax请求都通过node 封装一个组件

2、打包grunt 优化 去掉多余 文件

3、日志 大小 ，打印规范 ：测试的时候可以打印各种日志，上线时 要去掉多余的日志

4、接口重复调用, 功能模块封装成函数

5、文件目录 统一命名规范 html 文件：- ，css文件：- ,js文件:- ;

6、注释 函数规范化了 ， 面向对象编程

7、 git 管理 gitflow 规范 ，分支命名规范 。

8、开发时间评估要更合理

#### 埋点开发规范-待完善















 



