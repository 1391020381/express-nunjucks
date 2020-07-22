define("dist/personalCenter/template/userPage/index.html", [], '<div class="personal-header">\n    <div class="person-info">\n        <img src="{{data.photoPicURL}}" alt="">\n        <div class="person-info-left">\n            <p>{{data.nickName}} {{ if data.isAuth==1 }}<i></i>{{/if}}</p>\n            <p>{{ data.userTypeId==1 ? \'普通\' : data.userTypeId==2 ? \'个人\' : \'机构\'}}认证</p>\n        </div>\n    </div>\n    <div class="decrition">个人简介：{{data.cfcDescribe ? data.cfcDescribe : \'暂无简介\'}}</div>    \n</div>\n<div class="personal-container cf">\n    <div class="left fl">\n      \n    </div>\n    <div class="right fl">\n       <div class="right-top">\n           <div class="right-top-item">\n               <p>{{data.readSum}}</p>\n               <p>浏览量</p>\n           </div>\n           <div class="right-top-item">\n               <p>{{data.downSum}}</p>\n               <p>下载量</p>\n           </div>\n           <div class="right-top-item">\n               <p>{{data.fileSize}}</p>\n               <p>资料数</p>\n           </div>\n       </div>\n       <div class="hot-file">\n           <div class="title">热门资料</div>\n           <ul>\n           \n           </ul>\n       </div>\n   </div>\n</div>\n');