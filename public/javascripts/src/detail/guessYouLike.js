

define(function (require, exports, module){
   var pageConfig = window.pageConfig&&window.pageConfig
    var isConvert = pageConfig&&pageConfig.page.isConvert
    var method = require("../application/method");
    var api = require('../application/api');
    var guessYouLike = require('./template/guessYouLike.html')
   var userId = method.getCookie('userId')?method.getCookie('userId'):method.getCookie('visitor_id')
   var requestId = Math.random().toString().slice(-10);// requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
   window.recommendConfig = {}   // 第四范式参数 在上报时需要
   var params = {
    request:{ "userId": userId, "requestId": requestId }
 }
 list = {
    "code": 200,
    "info": "ok",
    "data": [
      {
        "categoryLevel1": "1818",
        "publishTime": "2020-05-07 17:22:04",
        "country": "country",
        "categoryLevel5": "doc",
        "categoryLevel4": "categoryLevel4",
        "city": "city",
        "categoryLevel3": "1853",
        "categoryLevel2": "9011",
        "title": "幼儿园员工守则",
        "type": 3,
        "content": "content",
        "url": "/oy9Zx34lbF.html",
        "coverUrl": "http://pic.iask.com.cn/p0eKDaFEZV.jpg",
        "itemId": "oy9Zx34lbF",
        "score": 3,
        "publisherId": "4fd555fb0cf25307861855d9",
        "province": "",
        "context": "Yvskj/ZWV+v/KurZEOCNllPqTPfu5jNUpkJJdvddRjBL7Afp/jrxmTuCBjWPRlsPWW9vLTraKNhElVJRRJDz4QXUZKcBjRvBfHWsOc3beeUUxSnUQZpqKwyIavX8xje2I5spP5t/sObQ4fQXX/NsSvCOXv1uD4KoHbby4rUw7eht09q55EycF9XSdz6fmPhOr8JHzypFYDAEqi98syQUY+ewlcLxnVqkb9jdAUefO6yXB/FQ0D21RL3+xWuErfsyXx3Qctgz0q4ETQ==",
        "tag": "tag"
      },
      {
        "categoryLevel1": "1818",
        "publishTime": "2020-05-07 17:22:04",
        "country": "country",
        "categoryLevel5": "doc",
        "categoryLevel4": "categoryLevel4",
        "city": "city",
        "categoryLevel3": "1853",
        "categoryLevel2": "9011",
        "title": "水果店员工守则",
        "type": 3,
        "content": "content",
        "url": "/op01zFd6vR.html",
        "coverUrl": "http://pic.iask.com.cn/oMXnRJdx2f.jpg",
        "itemId": "op01zFd6vR",
        "score": 3,
        "publisherId": "5142f1ffe4b0237552752ca3",
        "province": "",
        "context": "6fKTr+NTvuFdLhzFedbxxnB6w/Ei1skxiV0OiCujO+rzIQroDh5uMTODs+PUXjPtUlg/MEm9Tp2xaFng99ky8EyzENjEOtKEWncbyH0Nq2Ccv0KyK1fsLxysjDHceT+QP6lJ9rQxKWI1EUQkw74qepm6wfL2dT4+O8+0x1sE50Mmsfaun5V4EK6+Kw15FEjRJXvOqBI1YpDT5G6WCoUwiPPydxFWZfpEvj8pFkqK71km3xh5bp/Irmg7O6zyDW4DwFVLdxglVVKQeg==",
        "tag": "tag"
      },
      {
        "categoryLevel1": "1818",
        "publishTime": "2020-05-07 17:22:04",
        "country": "country",
        "categoryLevel5": "doc",
        "categoryLevel4": "categoryLevel4",
        "city": "city",
        "categoryLevel3": "1853",
        "categoryLevel2": "9011",
        "title": "建筑公司管理规章制度",
        "type": 3,
        "content": "content",
        "url": "/oUBiVUBIAT.html",
        "coverUrl": "http://pic.iask.com.cn/oWzEcsrxDV.jpg",
        "itemId": "oUBiVUBIAT",
        "score": 3,
        "publisherId": "4fbdd6290cf2ebcd4753e0f5",
        "province": "",
        "context": "NrwRT/bSxEp7nBDpuzLzlxyvRhUqcEeIo6g3ZR7BBlnpufFwHTXGPDSKoGqIBmaigl/9sPGqqnRbIdi+FpWr57Ku/2pZ20McT+1oW2ZgCLJGLO9Djs1HT1tOqVGhEYXxiD6Lw2qMRg1aJFjT3abzYdn6ysVBgZM1/2e8TW4pIq27yfX8HBKDYd/CZRHw/agWmQ3KudeGVHnoQsMI1jd9NbgzuP+tI9BMPov3oYXG1nug928rrEA3Hcvb0hn4bdRuN6sOFPFFo/otDg==",
        "tag": "tag"
      },
      {
        "categoryLevel1": "1818",
        "publishTime": "2020-05-07 17:22:04",
        "country": "country",
        "categoryLevel5": "doc",
        "categoryLevel4": "categoryLevel4",
        "city": "city",
        "categoryLevel3": "1853",
        "categoryLevel2": "9011",
        "title": "公司员工守则规章制度范文",
        "type": 3,
        "content": "content",
        "url": "/oGRng2MXFt.html",
        "coverUrl": "http://pic.iask.com.cn/oNS3ViFaLl.jpg",
        "itemId": "oGRng2MXFt",
        "score": 3,
        "publisherId": "4fc32a230cf2e8006922c754",
        "province": "",
        "context": "lj0I04vEnhTS+7UAmDOgTzz5eQrFq0FYMSvRKE02nMJkLenEUr1HA/wbDeT4frUMfiikLgFI8vfMyF98Eo4JpzC2vEhzWToQ3dyuByha7+f88cEzWqloDBuKG784iTII2Uscef1xPc/0daLmxxHI1akorKP8rHD/5F3IqHB9y6xzsG3xed7S4Zw6kFPb5ulYOrQ20kjURqx6JAKP2WBQeolx/Zea3bZWF4A62z0eDtO4nTnO+py73ytFtN+x4hmPeW+wFDDlnwPanQ==",
        "tag": "tag"
      },
      {
        "categoryLevel1": "1818",
        "publishTime": "2020-05-07 17:22:04",
        "country": "country",
        "categoryLevel5": "doc",
        "categoryLevel4": "categoryLevel4",
        "city": "city",
        "categoryLevel3": "1853",
        "categoryLevel2": "9011",
        "title": "公司员工手册范本范文",
        "type": 3,
        "content": "content",
        "url": "/oYIKaPFGx9.html",
        "coverUrl": "http://pic.iask.com.cn/oSUzZudNQz.jpg",
        "itemId": "oYIKaPFGx9",
        "score": 3,
        "publisherId": "5147db3be4b0237552755ee1",
        "province": "",
        "context": "usfb5bgyzUdp2U5qE7HQ028P5i+49tmNoqcPL8mhCGK9hmEV7z46M74Ti6cEvZgSPa0T5rZW9TaIAH/90YpLgY6XoMrdW0u9ZpAmZEVhqVbrlmdsSMtkQym3zJLsnVnseaAXKw8Gk/6wgBCFcAa83gYeIDOZdefwHGbiFmv8T1q+1spKFJhRUoIKx2v8zcv0ldbk/R2Oqxs3wtmWWsQNSLNVfF0/12S/0iGn/jIwOYcK48D/n+mia5gUZjY44+SXzQtKY7PSlQKPAg==",
        "tag": "tag"
      },
      {
        "categoryLevel1": "1818",
        "publishTime": "2020-05-07 17:22:04",
        "country": "country",
        "categoryLevel5": "doc",
        "categoryLevel4": "categoryLevel4",
        "city": "city",
        "categoryLevel3": "1853",
        "categoryLevel2": "9011",
        "title": "美容院员工管理规章制度",
        "type": 3,
        "content": "content",
        "url": "/p3LlDU9QJ9.html",
        "coverUrl": "http://pic.iask.com.cn/ozFYDstIc7.jpg",
        "itemId": "p3LlDU9QJ9",
        "score": 3,
        "publisherId": "4fc85b8c0cf2f1229d661dcc",
        "province": "",
        "context": "10SgLV7LHRXmcFx7ragdBXWU1b/SB+quuh+kMCnanFT15SmSAhIoeDCfm8KP0L6XEKEJ/wBUCgSnNCFk3ms5F0E1DaKPOYr87fRkksK8hPirY6ASdRNBjTeqQUd/8Oao4CcvIe60frqV2l50pd//dUPlC0GRmxDAqTXCxsj4OiF2xBpc7yc2Ko7+yWCJy8R+BC162VqVcvW7FDzZ6BuqsIOC/i2Pe0V2vbSIp6d1cJzEMzb/9erjADA3/AIO7XQnHnXSXJMhA59GfQ==",
        "tag": "tag"
      },
      {
        "categoryLevel1": "1821",
        "publishTime": "2018-05-06 15:15:27",
        "country": "country",
        "categoryLevel5": "ppt",
        "categoryLevel4": "categoryLevel4",
        "city": "",
        "categoryLevel3": "categoryLevel3",
        "categoryLevel2": "1906",
        "title": "动脉粥样硬化的治疗与展望.ppt",
        "type": 3,
        "content": "content",
        "url": "/7E9r0CD0gst.html",
        "coverUrl": "http://pic.iask.com.cn/piq3s5KPXF5_small1.jpg",
        "itemId": "7E9r0CD0gst",
        "score": 2,
        "publisherId": "5667cfa77e4a5e16343d24d2",
        "province": "",
        "context": "hsGGkH43KL8buywxSst2NRfQqyVa1ff795EvogxaD4rTsyjWkOrU1a1Ugtz6bMif+LY0MP4/lqli++L9vrG5nLhyz1sqjd2g4hVT0VyMwN9N/DUaptBqfJT/n3PAK9mjEMouGJ7jR97f/p7+/v7VuYDtRNM2Od575YePAQ3y1UFv27WHfDOdxb5WC87mMY+hj6rejS7bs2Vn6IGynptjTxIcevSD7LE+FNhQlQgMFLgWbbwvivMOcXyG5gkxaIjFq0ekW0DkQTHe",
        "tag": ""
      },
      {
        "categoryLevel1": "1818",
        "publishTime": "2020-05-07 17:22:03",
        "country": "country",
        "categoryLevel5": "doc",
        "categoryLevel4": "categoryLevel4",
        "city": "city",
        "categoryLevel3": "1853",
        "categoryLevel2": "9011",
        "title": "标准企业员工手册范本标准模板",
        "type": 3,
        "content": "content",
        "url": "/oBPcy7tTtJ.html",
        "coverUrl": "http://pic.iask.com.cn/oKcYG2l2jZ.jpg",
        "itemId": "oBPcy7tTtJ",
        "score": 3,
        "publisherId": "4fcc31de0cf23ca33132c3dc",
        "province": "",
        "context": "w43A+0QXk5rxC/k3X1eZ+g9ISIpyDpJWndaKSBQAM+nya93wYNEZw24qS0E7uIuJXzlBVkGYoddJYOZ1ti3ITP/KVzK2on/I3QcO3HjgAjDg+G26uGbokr+X2OR9HhzWV0mZfdmphY1RJk9qzMxbsoWsi5Bx0jE7COwgrBmyF3DAEkjZMH0x2IB8qQiL8z0zgJu+C9YTakHrOJHS+qXwwMpuVdIGUfbnzjvj/fJ/F9vYPZ3OoOHjKFXNSnIqb+Q3S8RTsrY2eqENTA==",
        "tag": "tag"
      }
    ]
  } 
 
 $ajax(api.recommend.recommendConfigInfo,'post',['ishare_personality']).then(function(recommendConfig){
     var sceneID = recommendConfig.data[0].useId 
     window.recommendConfig =  recommendConfig.data
    $ajax(api.tianshu['4paradigm'].replace(/\$sceneID/, sceneID),'POST',params).then(function(res){
        if(res.code == '200'){
            var guessYouLikeTemplate =  template.compile(guessYouLike)({paradigm4GuessData:res.data});
            console.log('guessYouLikeTemplate:',guessYouLikeTemplate)
            $('.guess-you-like-warpper').html(guessYouLikeTemplate)
        }
        
    })
    window.paradigm4 = {
      paradigm4Guess:list
    } 
    var paradigm4GuessData = []
    $.each(list.data,function(index,item){
        paradigm4GuessData.push({
            id: item.itemId || '',
            format: item.categoryLevel5 ||'',
            name: item.title || '',
            cover_url: item.coverUrl || '',
            url: item.url || '',
            item_read_cnt: item.item_read_cnt
        })
    })
    var guessYouLikeTemplate =  template.compile(guessYouLike)({paradigm4GuessData:paradigm4GuessData,isConvert:isConvert});
    
    $('.guess-you-like-warpper').html(guessYouLikeTemplate)

    var guessYouLikeHeight = $('.guess-you-like-warpper').outerHeight(true) || 0
    var userEvaluation = $('.user-comments-container').outerHeight(true) || 0
    var currentPage = $('.detail-con').length
    var temp = guessYouLikeHeight + userEvaluation +30
    var bottomHeight =  (currentPage == 1||currentPage == 2)?temp+123:temp
  
    $('.detail-footer').css({
      'position': 'absolute',
      'left':'0px',
      'right':'0px',
      'bottom':(bottomHeight) + 'px',
      'width': '890px'
  })

 }) 
 
    
})