define("dist/personalCenter/template/personalinformation-debug.html", [], '<div class="personalinformation">\n    <p class="personalinformation-title">个人信息</p>\n    <ul class="form-list">\n        <li class="item">\n            <span class="item-title">用户ID : </span>\n            <span class="item-desc">{{userInfo.id}}</span>\n            <span class="item-btn">复制</span>\n        </li>\n        <li class="item">\n            <span class="item-title">昵称 : </span>\n            <input class="item-input" placeholder="请输入用户昵称" disabled value="{{userInfo.nickName}}"/>\n        </li>\n        <li class="item">\n            <span class="item-title">所在地区 : </span>\n                <select class="item-province-select active-input" value="{{userInfo.prov}}" {{editUser?\'\':\'disabled\'}}>\n                  {{ if userInfo.prov}}\n                   {{each provinceList}}\n                    <option value="{{provinceList[$index]}}">{{provinceList[$index]}}</option>\n                 {{/each}}\n                {{else}}\n                    <option value="">请选择你所在的省</option>\n                      {{each provinceList}}\n                       <option value="{{provinceList[$index]}}">{{provinceList[$index]}}</option>\n                     {{/each}}\n                {{/if}}\n           </select>\n           \n          \n            <select class="item-city-select" value="{{userInfo.city}}" {{editUser?\'\':\'disabled\'}}>\n                {{ if userInfo.city}}\n                   {{each cityList}}\n                    <option value="{{cityList[$index]}}">{{cityList[$index]}}</option>\n                 {{/each}}\n                {{else}}\n                    <option value="">请选择你所在的市</option>\n                      {{each cityList}}\n                       <option value="{{cityList[$index]}}">{{cityList[$index]}}</option>\n                     {{/each}}\n                {{/if}}\n           </select>\n        </li>\n        <li class="item">\n            <span class="item-title">性别 : </span>\n            <select class="item-sex-select" value="{{userInfo.gender == \'M\'?\'男\':\'女\'}}" {{editUser?\'\':\'disabled\'}}>\n                 <option value="男">男</option>\n                 <option value="女">女</option>\n           </select>\n        </li>\n        <li class="item">\n            <span class="item-title">生日 : </span>\n            <input class="item-date-input" type="text" id="date-input" {{editUser?\'\':\'disabled\'}}>\n        </li>\n        <li class="item">\n            <span class="item-title">常用邮箱 : </span>\n            <input class="item-email-input " placeholder="请输入邮箱地址" value="{{userInfo.email}}" {{editUser?\'\':\'disabled\'}}/>\n        </li>\n        {{ if editUser}}\n            <li class="item">\n             <span class="item-title">常用邮箱 : </span>\n              <span class="item-btn item-cancel-btn edit-information" data-edit=\'cancel\'>取消</span>\n             <span class="item-btn edit-information" data-edit=\'save\'>保存</span>\n        </li>\n        {{else}}\n         <li class="item">\n             <span class="item-title">常用邮箱 : </span>\n             <span class="item-btn  edit-information" data-edit=\'edit\'>编辑信息</span>\n        </li>\n        {{/if}}\n    </ul>\n</div>');