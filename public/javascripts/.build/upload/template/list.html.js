define("dist/upload/template/list.html", [], '{{each uploadFiles as value i}}\n<li class="doc-li" index="{{i}}">\n    <span class="doc-unit">{{i+1}}</span>\n    <div class="operation">\n        <div class="doc-info succ {{value.uploadStatus ==1?\'\':\'displayNone\'}}" ><i class="icon-info icon-ok"></i>上传成功</div>\n        <div class="doc-info uploading {{value.uploadStatus ==1?\'displayNone\':value.uploadStatus ==2?\'displayNone\':\'\'}}" ><p class="doc-info-wait">上传中...</p></div>\n        <div class="doc-info fail {{value.uploadStatus ==2?\'\':\'displayNone\'}}" ><i class="icon-info icon-wrong"></i><p class="wrong-text">上传失败<!-- <a class="wrong-link">重试</a> --></p></div>\n        <a href="javascript:;" class="doc-delete js-delete" title="删除" index="{{i}}"></a>\n    </div>\n    <div class="doc-top-tt cf">\n        <div class="doc-mid cf">\n            <i class="data-checked {{value.checked?\'checked-active\':\'\'}}"></i>\n            <div class="fl" style="width:492px">\n                <div class="data-must">\n                    <span class="stars-txt">*</span>\n                    <span class="lable-name">标题:</span>\n                    <div class="data-name">\n                        <i class="ico-data ico-{{value.ext}}"></i>\n                        <input type="text" maxlength="64" class="data-input" name="fileName" value="{{value.fileName}}" index="{{i}}" >\n                    </div>\n                    <div class="warn-tip">\n                        <span>标题字数不能超过36个字</span>\n                    </div>\n                </div>\n                <div class="mt22">\n                    <div class="data-must  select-w89 select-type fl ">\n                        <span class="stars-txt">*</span>\n                        <span class="lable-name js-type">类型:</span>\n                        <div class="date-btn categoryLength js-type">\n                            <em></em>\n                            <p class="choose-text"><i>{{value.userFileType==1?\'免费资料\':\'付费资料\'}}</i></p>\n                        </div>\n                        <!-- <span class="selected-text">\n                            <em>公开资料</em>\n                            <i></i>\n                        </span> -->\n                        <ul class="select-list permin">\n                            <li>\n                                <a class="selected" permin="1">免费资料</a>\n                                <a  permin="5">付费资料</a>\n                            </li>\n                        </ul>\n                        \n                        <p class="sell-item-info">什么是 <a target="_blank" class="sell-link" href="https://iask.sina.com.cn/helpCenter/5d2837610cf2b0a59eac33a3.html">优享资料</a>?</p>\n                    </div>\n                    <div class="data-must  select-monney {{value.userFileType==1?\'displayNone\':\'\'}} js-need-money fl ml18" style="">\n                        <span class="stars-txt">*</span>\n                        <span class="lable-name">定价:</span>\n                        <div class="date-btn definePrice js-price">\n                            <em></em>\n                            <p class="choose-text moneyTitle"><i>{{value.definePrice?\'自定义\':value.userFilePrice?\'¥\'+value.userFilePrice:\'选择售价\'}}</i></p>\n                        </div>\n                        <ul class="select-list money" style="">\n                            <li>\n                                <a aval="4.9">¥4.9</a>\n                                <a aval="9.9">¥9.9</a>\n                                <a aval="14.9">¥14.9</a>\n                                <a aval="24.9">¥24.9</a>\n                                <a aval="29.9">¥29.9</a>\n                                <a aval="39.9">¥39.9</a>\n                                <a aval="49.9">¥49.9</a>\n                                <a aval="0" class="money-price_select-ele" >自定义</a>\n                            </li>\n                        </ul>\n                        <!--未选择提示 -->\n                        <span class="price-error" style="display: none;">请选择售价</span>\n                        <span class="momey-wanning {{value.definePrice?\'\':\'displayNone\'}}" name="money-wanning" >*使用自定义价格需<br>要审核通过后才生效</span>\n                        <a class="pay-item-info {{value.definePrice?\'displayNone\':\'\'}}"  target="_blank"   href="{{cdnUrl}}/help/%E7%88%B1%E9%97%AE%E4%BB%B7%E6%A0%BC%E8%A7%84%E8%8C%83%E5%8F%82%E8%80%83.pdf" ><i class="icon-wen"></i>定价参考</a>\n                    </div>\n                    <div class="doc-pay-input fl ml18  js-input-money {{value.userFileType==1?\'displayNone\':value.definePrice?\'\':\'displayNone\'}}" style="">\n                        <input type="number" autocomplete="off" class="data-input "  autocomplete="off" placeholder="输入金额" name="moneyPrice"  value="{{value.userFilePrice==\'0\'?\'\':value.userFilePrice}}">\n                        <div class="select-item-info" class="moneyPriceTips">请输入售价</div>\n                    </div>\n\n                    <div class="trial-input fl js-need-money {{value.userFileType==1?\'displayNone\':\'\'}} ml18" style="">\n                        <input type="number" autocomplete="off" class="data-input" placeholder="试读页数" maxlength="4" name="preRead" value="{{value.preRead}}">\n                    </div>\n                </div>\n            </div>\n            <div class="fl rightPart">\n                <div class="clearBoth">\n                    <div class="data-must fl">\n                        <span class="stars-txt">*</span>\n                        <span class="lable-name">分类:</span>\n                        <div class="date-btn js-fenlei" style="width:210px;">\n                            <em></em>\n                            <p class="choose-text fenleiTtile"><i>{{value.fenlei?value.fenlei:\'选择分类\'}}</i></p>\n                        </div>\n                        <div class="date-con fenlei">\n                            <div class="date-con-in" >\n                                <ul class="date-con-first">\n                                    {{each Allcategory as item index}}\n                                    <li>\n                                        <a href="javascript:;" cid="{{item.id}}" last="{{item.last}}" name ="{{item.name}}">{{item.name}}</a>\n                                        <ul class="date-con-sec"  style="display: none;">\n                                            {{if item.categoryList}}\n                                            {{each item.categoryList as ctn num}}\n                                            <li >\n                                                    <a href="javascript:;" cid="{{ctn.id}}" last="{{ctn.last}}" name ="{{ctn.name}}">{{ctn.name}}</a>\n                                                    <ul class="date-con-third" style="display: none;">\n                                                        {{if ctn.categoryList}}\n                                                        {{each ctn.categoryList as item3 index3}}\n                                                        <li  ><a href="javascript:;" last="{{item3.last}}" cid="{{item3.id}}" name ="{{item3.name}}">{{item3.name}}</a></li>\n                                                        {{/each}}\n                                                        {{/if}}\n                                                    </ul>\n                                            </li>\n                                            {{/each}}\n                                            {{/if}}\n                                        </ul>\n                                    </li>\n                                    {{/each}}\n                                </ul>\n                            </div>\n                        </div>\n                        <!--未选择提示 -->\n                        <span class="must-error" style="display: none;">请选择分类</span>\n                    </div>\n                    <div class="data-must fl ml18">\n                        <span class="stars-txt">*</span>\n                        <span class="lable-name">保存到:</span>\n                        <span style="margin-left: 50px;width: 100px;" class="selected-text date-btn  js-folder-hook">\n                            <em></em>\n                            <p>{{value.folderName?value.folderName:\'选择保存至\'}}</p>\n                        </span>\n                        <ul class="select-list folder">\n                            <li>\n                                <span class="new-built js-folder-new" title="新建文件夹">新建文件夹</span>\n                                {{each folders as foldItem foldIndex}}\n                                    <span class="new-built js-folder-item" id =\'{{foldItem.id}}\' name =\'{{foldItem.name}}\'   title="新建文件夹">{{foldItem.name}}</span>\n                                {{/each}}\n                                <!-- <jsp:include page="folderTree.jsp"></jsp:include> -->\n                            </li>\n                        </ul>\n                        <span class="folder-error" style="display: none;">请选择保存文件夹</span>\n                    </div>\n                </div>\n                <div class="doc-down-con mt22">\n                    <div class="data-must">\n                        <!-- <span class="stars-txt">*</span> -->\n                        <span class="lable-name">简介:</span>\n                        <div class="down-inter cf">\n                            <div class="doc-describe fl">\n                                <textarea class="doc-text-area js-text-area" placeholder="请填写资料简介、概况或使用方法，有助提升资料的曝光率、购买率" maxlength="200">{{value.description}}</textarea>\n                                <p class="num-con"><em>0</em>/200</p>\n                            </div>\n                            <!-- <div class="doc-trial-con">\n                                <div class="doc-trial-input fl"><input type="text" class="data-input" placeholder="设置试读页数" name="preRead" maxlength="4" value=""></div>\n                            </div> -->\n                        </div>\n                    </div>\n                   \n                </div>\n            </div>\n            \n            <!-- <div class="select-item select-w89 select-pay fl ml10">\n                <span class="selected-text">\n                    <em>选择售价</em>\n                    <i></i>\n                </span>\n                <ul class="select-list score">\n                    <li>\n                        <a aval="0">免积分</a>\n                        <a aval="1">1积分</a>\n                        <a aval="5">5积分</a>\n                        <a aval="9">9积分</a>\n                        <a aval="13">13积分</a>\n                        <a aval="17">17积分</a>\n                        <a aval="21">21积分</a>\n                    </li>\n                </ul>\n                <p class="select-item-info">请选择售价</p>\n            </div> -->\n        </div>\n        <div class="doc-info err" style="display:none;"><i class="icon-info icon-error"></i><span>建议您结合文档正文完善资料标题信息<span></div>\n    </div>\n</li>\n{{/each}}');