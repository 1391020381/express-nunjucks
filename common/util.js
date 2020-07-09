module.exports = {
    pageIds:{  //推荐位id
        index:{ //首页
            ub:'PC_M_H_banner', //顶部banner
            zt:'PC_M_H_zhuanti', //专题推荐
            viprelevant:'PC_M_H_vipzhuanqu',//首页VIP专区
            recfile1:'PC_M_H_bjtj1',//首页精选资料-编辑推荐1
            recfile2:'PC_M_H_bjtj2',//首页精选资料-编辑推荐2
            recfile3:'PC_M_H_bjtj3',//首页精选资料-编辑推荐3
            recfile4:'PC_M_H_bjtj4',//首页精选资料-编辑推荐4
            recfile5:'PC_M_H_bjtj5',//首页精选资料-编辑推荐5
            organize:'PC_M_H_qwjg', // 首页权威机构
            hotSearchWord:'PC_M_H_rmss', //热门搜索词
            friendLink:'PC_M_H_yqlj' //友情链接
        },
        categoryPage:{ //分类页
            topbanner_1816:'PC_M_FC_all_1816_topbanner',//顶部banner图
            topbanner_1820:'PC_M_FC_all_1820_topbanner',//顶部banner图
            topbanner_1821:'PC_M_FC_all_1821_topbanner',//顶部banner图
            topbanner_1818:'PC_M_FC_all_1818_topbanner',//顶部banner图
            topbanner_1819:'PC_M_FC_all_1819_topbanner',//顶部banner图
            rightbanner_1816:'PC_M_FC_all_1816_rightbanner',//分类页-右侧banner
            rightbanner_1820:'PC_M_FC_all_1820_rightbanner',//分类页-右侧banner
            rightbanner_1821:'PC_M_FC_all_1821_rightbanner',//分类页-右侧banner
            rightbanner_1818:'PC_M_FC_all_1818_rightbanner',//分类页-右侧banner
            rightbanner_1819:'PC_M_FC_all_1819_rightbanner',//分类页-右侧banner
            zhuanti_1816:'PC_M_FC_all_1816_zhuanti',//分类页-右侧专题
            zhuanti_1820:'PC_M_FC_all_1820_zhuanti',//分类页-右侧专题
            zhuanti_1821:'PC_M_FC_all_1821_zhuanti',//分类页-右侧专题
            zhuanti_1818:'PC_M_FC_all_1818_zhuanti',//分类页-右侧专题
            zhuanti_1819:'PC_M_FC_all_1819_zhuanti',//分类页-右侧专题
            friendLink:'PC_M_FC_yqlj' //友情链接
        },
        special:{
            friendLink:'PC_M_SS_ZT_yqlj'
        }
    },
    paradigm4Relevant:function(fid,uid,title,sceneID,callback){  //第四范式
        var requestID = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
        // 办公频道 非私密
        let userID = uid.slice(0, 10) || ''; //来标注用户的ID，
        var opt = {
            url: `https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=${requestID}&sceneID=${sceneID}&userID=${userID}`,
            method: 'POST',
            body: JSON.stringify({ "itemID": fid, "itemTitle": title })
        }
        request(opt, function (err, res, body) {
            if (body) {
                try {
                    var data = JSON.parse(body);
                    data.requestId = requestID;
                    data.userId = userID;
                    callback(null, data);
                } catch (err) {
                    callback(null, null);
                    console.log("err=---------------", err)
                }
            } else {
                callback(null, null);
            }
        })
    },
    dealParam:function(format,firstCage,secondCage){//处理详情推荐位参数
        let obj={
            ub:['PC_O_H_'+format+'_'+secondCage+'_ub','PC_O_H_'+format+'_'+firstCage+'_ub','PC_O_H_all_'+secondCage+'_ub','PC_O_H_all_'+firstCage+'_ub'],
            rb:['PC_O_H_'+format+'_'+secondCage+'_rb','PC_O_H_'+format+'_'+firstCage+'_rb','PC_O_H_all_'+secondCage+'_rb','PC_O_H_all_'+firstCage+'_rb'],
            xfb:['PC_O_H_'+format+'_'+secondCage+'_xfb','PC_O_H_'+format+'_'+firstCage+'_xfb','PC_O_H_all_'+secondCage+'_xfb','PC_O_H_all_'+firstCage+'_xfb'],
        }
        return obj    
    },
    dealHref:function(item){  //处理推荐位的链接
        item.list.map(res=>{
            if(res.type==1){  //资料
                res.linkUrl='/f/'+res.tprId + '.html';
            }else if(res.type==2){ //链接
            }else if(res.type==3){ //专题
                res.linkUrl='/node/s/'+res.tprId +'.html';
            }
        })
        return item
    },
    isIe9:function(useragent){
        if(parseInt(useragent.source.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<9){
            return true
        }else{
            return false 
        }
    },
    browserVersion: function (userAgent) {
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        var isIE = userAgent.indexOf("compatible") > -1
            && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
        var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
        var isSafari = userAgent.indexOf("Safari") > -1
            && userAgent.indexOf("Chrome") === -1; //判断是否Safari浏览器
        var isChrome = userAgent.indexOf("Chrome") > -1
            && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion === 7) {
                return "IE7";
            } else if (fIEVersion === 8) {
                return "IE8";
            } else if (fIEVersion === 9) {
                return "IE9";
            } else if (fIEVersion === 10) {
                return "IE10";
            } else if (fIEVersion === 11) {
                return "IE11";
            } else if (fIEVersion === 12) {
                return "IE12";
            } else {
                return "IE";
            }
        }
        if (isOpera) {
            return "Opera";
        }
        if (isEdge) {
            return "Edge";
        }
        if (isFF) {
            return "Firefox";
        }
        if (isSafari) {
            return "Safari";
        }
        if (isChrome) {
            return "Chrome";
        }
        return 'unKnow'
    },
    timeFormat: function (style, time) {
        if (!time) return '';
        var d = new Date(time);
        var year = d.getFullYear();       //年
        var month = d.getMonth() + 1;     //月
        var day = d.getDate();            //日
        var hh = d.getHours();            //时
        var mm = d.getMinutes();          //分
        var ss = d.getSeconds();          //秒
        var clock = year + "-";
        if (month < 10) {
            month += '0';
        }
        if (day < 10) {
            day += '0';
        }
        if (hh < 10) {
            hh += '0';
        }
        if (mm < 10) {
            mm += '0';
        }

        if (ss < 10) {
            ss += '0';
        }
        if (style === 'yyyy-mm-dd') {
            return year + '-' + month + '-' + day;
        }
        // yyyy-mm-dd HH:mm:ss
        return year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' + ss;
    },
    getCategoryId: function (pathname) {
        var regExp = /(?<=(\/c\/)).+(?=(.html))/;
        var matchResult = pathname.match(regExp);
        if (matchResult && matchResult.length > 0) {
            var splitArr = matchResult[0].split('_');
            return splitArr[0];
        }
        return '';
    },
    getCategoryParam: function (pathname) {
        var res = null;
        var regExp = /(?<=(\/c\/)).+(?=(.html))/;
        var matchResult = pathname.match(regExp);
        if (matchResult && matchResult.length > 0) {
            var partArr = matchResult[0].split('-');
            if (partArr.length > 1) {
                var subArr = partArr[0];
                res = {
                    cid: subArr.split('_')[0],
                    order: partArr[1] || 'all',
                    page: subArr.split('_')[1],
                    specifics: [],
                    subUrl: matchResult[0]
                };
                if (partArr.length > 2) {
                    for (var t = 2; t < partArr.length; t++) {
                        var as = partArr[t];
                        res.specifics.push(as);
                    }
                }
            } else {
                res = {
                    cid: partArr[0],
                    order: 'all',
                    page: 1,
                    specifics: []
                }
            }
        }
        return res;
    },
    getSpecialParams:function(pathname){ //专题id_页码_排序-维度-xx_xx-xx_xx    格式
        var item = null;
        var url=pathname.split('.')[0];
        var index=url.lastIndexOf("\/");
        var matchResult=url.substring(index + 1,url.length);
        var paramsArr=matchResult.split('-');
        var firstSpilt=paramsArr[0].split('_');
        item={
            specialTopicId: firstSpilt[0],//专题id
            dimensionId: paramsArr[1],//维度id
            topicPropertyQueryDTOList: [],
            sortFlag: firstSpilt[2] || 0,//排序,0-综合排序,1-最新上传
            currentPage: firstSpilt[1] || 1,
        }

        if(paramsArr.length>2){ //是否有属性分类筛选
            var arr=[];
            for (var i = 2; i < paramsArr.length; i++) {
                arr.push(paramsArr[i]);
            }
            item.topicPropertyQueryDTOList=arr;
        }
        return item
    },
    getPropertyParams:function(list,properList){

        var arr=[],result=[];
      //  console.log(list,'list------------')
     //   console.log(properList,'properList------------')
        properList.map(item=>{
           item.specialTopicPropertyDOList.map(res=>{
               res.ids=item.propertyGroupId+"_"+res.propertyId;
               res.propertyGroupName=item.propertyGroupName;
               res.propertyGroupId=item.propertyGroupId;
               res.propertyType=item.propertyType;
               arr.push(res)
           })
        })
        arr.map(res=>{
            if(list.includes(res.ids)){
                result.push({
                    propertyGroupName:res.propertyGroupName,
                    propertyGroupId:res.propertyGroupId,
                    propertyType:res.propertyType,
                    propertyId:res.propertyId,
                    propertyName:res.propertyName
                })
            }
        })
        return result
    },
    handleRecommendData:function(list=[]){
        let arr = []
        list.forEach(item=>{
            let temp = {}
            if(item.type == 1){ // 资料 
                temp = Object.assign({},item,{linkUrl:`/f/${item.tprId}.html`})
            }
            if(item.type == 2){ // 链接
                temp = Object.assign({},item)
            }
            if(item.type == 3){ // 专题页
                temp = Object.assign({},item,{linkUrl:`/node/s/${item.tprId}.html`})
            }
            arr.push(temp)
        })
        return {list:arr}
    }
   
};