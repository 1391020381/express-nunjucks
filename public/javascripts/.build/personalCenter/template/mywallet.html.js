define("dist/personalCenter/template/mywallet.html", [], '<div class="mywallet">\n    <div class="mywallet-summary">\n        <p class="mywallet-title">我的钱包</p>\n        <ul class="mywallet-tabs tabs" >\n            <li  class="{{ mywalletType == \'1\' ? \'tab-active tab\':\'tab\'}}">\n                <a href="/node/personalCenter/mywallet.html?mywalletType=1">概况</a>\n            </li>\n            <li class="{{ mywalletType == \'2\' ? \'tab-active tab\' :\'tab\'}}">\n                <a href="/node/personalCenter/mywallet.html?mywalletType=2">提现记录</a>\n            </li>\n            <li class="{{ mywalletType == \'3\' ? \'tab-active tab\' :\'tab\'}}">\n                <a href="/node/personalCenter/mywallet.html?mywalletType=3">财务信息</a>\n            </li>\n        </ul>\n        {{if mywalletType == \'1\'}}\n            <div class="mywallet-balance">\n                <div class="balance-summary">\n                   <span class="balance-title">钱包余额</span>\n                   <span class="balance-icon"></span>\n                   <span class="balance-sum"></span>\n                \n                <div class="balance-summary-tip">\n                                    <div class="balance-summary-tip-con">\n                                        <i class="before"></i>\n                                        <i class="after"></i>\n                                        <p class="balance-summary-tip-txt">钱包余额需大于100元才能发起提现</p>\n                                    </div>\n                  </div>  \n                </div>\n               <span class="balance-unit">元</span>\n                        \n                    </div>\n        {{/if}}\n\n        {{if mywalletType == \'2\'}}\n                    <p class="mywallet-withdrawal-record">\n                        <span class="withdrawal-record-icon"></span>\n                        <a class="withdrawal-record-desc" href="https://iask.sina.com.cn/helpCenter/5f4476a5474e31015362e167.html" target="_blank">结算规则须知></a>\n                    </p>\n        {{/if}}\n\n         {{if mywalletType == \'3\'}}\n                    <p class="mywallet-financial-records">\n                        <span class="financial-records-icon"></span>\n                        <span class="financial-records-desc">如有疑问，联系上传用户客服QQ：<span class="qq">3463748482</span></span>\n                    </p>\n        {{/if}}\n            </div>\n\n            {{if mywalletType == \'1\'}}\n                <div class="mywallet-dividing-line"></div>\n                <div class="survey-content">\n                    <p class="survey-tip">\n                        <span class="survey-tip-icon"></span>\n                        <span class="survey-tip-desc">收入明细 </span>\n                        <span class="survey-tip-subdesc">可查询近半年内明细，每天可导出4次订单明细，导出后未收到邮件，请先查询垃圾邮件或联系上传用户客服<i class="qq">QQ:346374</i></span>\n                    </p>\n                    <p class="survey-content-select">\n                        <span class="start-time">开始时间</span>\n                        <input class="start-time-input" type="text" id="date-input"/>\n                        <span class="end-time">结束时间</span>\n                        <input class="end-time-input" type="text" id="date-input"/>\n                        <span class="select-btn">搜索</span>\n                    </p>\n                    <table class="suervery-table-list">\n                        <tr class="suervery-table-title">\n                            <th style="width:200px;">\n                                <span>结算批次号</span>\n                                 <span style="display:block;text-indent: 18px;color: #fff;">（元）</span>\n                            </th>\n                            <th style="width:150px;">\n                                <span>实收总金额</span>\n                                <span style="display:block;text-indent: 18px;">（元）</span></th>\n                            <th style="width:300px;">\n                               <span>结算周期</span>\n                               <span style="display:block;text-indent: 18px;color: #fff;">（元）</span>\n                               </th>\n                            <th style="width:150px;">\n                                <span>状态</span>\n                                <span style="display:block;text-indent: 18px;color: #fff;">（元）</span>\n                            </th>\n                            <th style="width:100px;">\n                                <span>操作</span>\n                                <span style="display:block;text-indent: 18px;color: #fff;">（元）</span>\n                            </th>\n                        </tr>\n                        {{ if list&&list.length>0}}\n                            {{ each list}}\n                            <tr class="suervery-table-item">\n                                <td>{{list[$index].batchNo}}</td>\n                                <td>{{list[$index].sellerTotalRevenue }}</td>\n                                <td>{{list[$index].settleStartDate}}至{{list[$index].settleEndDate}}</td>\n                                <td>{{list[$index].statusDesc}}</td>\n                                <td>\n                                   {{if list[$index].status != \'0\'}}\n                                       <span class="export-details-btn" data-id={{list[$index].batchNo}}>导出明细</span></td>\n                                   {{/if}}\n                                   \n                            </tr>\n                        {{/each}}\n                    {{else}}\n                        <tr>\n                            <td>\n                                <div class="empty-data">\n                                    <img class="empty-img" src="{{cdnUrl}}/images/personalCenter/mycollection-empty-data.png"/>\n                                    <p class="empty-desc">近期暂无收入，尝试上传更多优质资料吧~~</p>\n                                    <a class="go2upload" href="/node/upload.html" target="_blank">上传资料</a>\n                                </div>\n                            </td>\n                        </tr>\n                    {{/if}}\n                </table>\n\n                <div class="pagination-wrapper"></div>\n            </div>\n           {{/if}}\n\n        {{if mywalletType == \'2\'}}\n            <table class="withdrawal-record-table-list">\n                <tr class="withdrawal-record-table-title">\n                    <th style="width:300px;">\n                      <span>提现流水号</span>\n                       <span style="display:block;text-indent: 18px;color: #fff;">（元）</span>\n                      </th>\n                    <th style="width:200px;">\n                      <span>提现时间<span>\n                       <span style="display:block;text-indent: 18px;color: #fff;">（元）</span>\n                      </th>\n                    <th style="width:200px;">\n                        <span>税前收入</span>\n                        <span style="display:block;text-indent: 5px;">（元）</span></th>\n                    <th style="width:200px;">\n                        <span>代扣税</span>\n                        <span style="display:block;text-indent: 3px;">（元）</span></th>\n                    <th style="width:200px;">\n                        <span>流转税</span>\n                        <span style="display:block;text-indent:3px;">（元）</span></th>\n                    <th style="width:300px;">\n                        <span>状态</span>\n                        <span style="display:block;text-indent: -5px;">（元）</span></th>\n                    <th style="width:200px;">\n                        <span>税后收入</span>\n                        <span style="display:block;text-indent: 5px;">（元）</span></th>\n                </tr>\n\n                {{ if list&&list.length>0}}\n                    {{each list}}\n                    <tr class="withdrawal-record-table-item">\n                        <td>{{list[$index].withdrawId}}</td>\n                        <td>{{list[$index].withdrawTime}}</td>\n                        <td>{{list[$index].withdrawPrice}}</td>\n                        <td>{{list[$index].holdingTaxPrice}}</td>\n                        <td>{{list[$index].transferTax}}</td>\n                        <td>\n                            {{if list[$index].auditStatus != 2}}\n                                <span>{{list[$index].auditStatusDesc}}</span>\n                            {{else}}\n                                <div class="audit-failed">\n                                <span class="audit-failed-desc">{{list[$index].auditStatusDesc}}</span>\n                                <span class="audit-failed-icon"></span>\n                                    <p class="audit-failed-reason">\n                                         <span class="before"></span>\n                                         <span class="after"></span>\n                                         <span class="audit-failed-reasondesc">{{list[$index].msg}}</span>\n                                    </p>\n                                </div>\n                            {{/if}}\n                        </td>\n                        <td>{{list[$index].finalPrice}}</td>\n                    </tr>\n                {{/each}}\n            {{else}}\n\n                <tr>\n                    <td>\n                        <div class="empty-data">\n                            <img class="empty-img" src="{{cdnUrl}}/images/personalCenter/mycollection-empty-data.png"/>\n                            <p class="empty-desc">暂无提现记录～</p>\n                            \n                        </div>\n                    </td>\n                </tr>\n\n            {{/if}}\n        </table>\n        <div class="pagination-wrapper"></div>\n      {{/if}}\n\n\n      {{if mywalletType == \'3\'}}\n      <div class="mywallet-dividing-line"></div>\n        <div class="financial-records-content">\n            <p class="label-item certification-type">\n                <span class="item-desc">认证类型 :</span> <span class="item-content">{{financeAccountInfo.userTypeName}}</span>\n            </p>\n            <p class="label-item account-name">\n                  <span class="item-desc required"><em>*</em>开户名:</span> <input class="{{financeAccountInfo.isEdit?\'item-account-name\':\'item-account-name item-disabled\'}}" value="{{financeAccountInfo.bankAccountName}}" placeholder="请输入开户名" {{financeAccountInfo.isEdit?\'\':\'disabled\'}}/>\n            </p>\n             <p class="label-item placeof-account-opening">\n                <span class="item-desc required"><em>*</em>开户地 :</span> \n                <select  class="{{financeAccountInfo.isEdit?\'item-province\':\'item-province item-disabled\'}}" placeholder="请选择" value="{{financeAccountInfo.province}}" {{financeAccountInfo.isEdit?\'\':\'disabled\'}}>\n                       {{ if financeAccountInfo.province}}\n                   {{each provinceList}}\n                    <option value="{{provinceList[$index]}}">{{provinceList[$index]}}</option>\n                 {{/each}}\n                {{else}}\n                    <option value="">省份</option>\n                      {{each provinceList}}\n                       <option value="{{provinceList[$index]}}">{{provinceList[$index]}}</option>\n                     {{/each}}\n                {{/if}}\n                </select>\n                <select   class="{{financeAccountInfo.isEdit?\'item-city\':\'item-city item-disabled\'}}"  placeholder="请选择" value="{{financeAccountInfo.city}}" {{financeAccountInfo.isEdit?\'\':\'disabled\'}}>\n                         {{ if financeAccountInfo.city}}\n                   {{each cityList}}\n                    <option value="{{cityList[$index]}}">{{cityList[$index]}}</option>\n                 {{/each}}\n                {{else}}\n                    <option value="">城市</option>\n                      {{each cityList}}\n                       <option value="{{cityList[$index]}}">{{cityList[$index]}}</option>\n                     {{/each}}\n                {{/if}}\n                \n                </select>\n            </p>\n           <p class="label-item receiving-bank">\n                <span class="item-desc required"><em>*</em>收款银行 :</span> \n                <select  class="{{financeAccountInfo.isEdit?\'item-bank\':\'item-bank item-disabled\'}}" {{financeAccountInfo.isEdit?\'\':\'disabled\'}}>\n                    <option>\n                         {{each bankList}}\n                            <option value="{{bankList[$index].value}}">{{bankList[$index].value}}</option>\n                         {{/each}}\n                    </option>\n                </select>\n                <input   class="{{financeAccountInfo.isEdit?\'item-bank-name\':\'item-bank-name item-disabled\'}}"  placeholder="请输入收款银行名称" {{financeAccountInfo.isEdit?\'\':\'disabled\'}}  />\n            </p>\n             <div class="label-item fullnameof-opening-bank">\n                <span class="item-desc required"><em>*</em>开户行全称 :</span> \n                <input  class="{{financeAccountInfo.isEdit?\'item-openingbank-name\':\'item-openingbank-name item-disabled\'}}" value="{{financeAccountInfo.bankBranchName}}" {{financeAccountInfo.isEdit?\'\':\'disabled\'}}/>\n                <p class="openingbank-name-tip">\n                    <span>格式：银行+省+市+分行全名</span>\n                    <span>示例：招商银行广东深圳软件园支行</span>\n                </p>\n            </div>\n             <p class="label-item receiving-bank-card-number">\n                <span class="item-desc required"><em>*</em>收款银行卡号 :</span> \n                <input    class="{{financeAccountInfo.isEdit?\'item-openingbank-num\':\'item-openingbank-num item-disabled\'}}" placeholder="请输入银行卡卡号" value="{{financeAccountInfo.bankAccountNo}}" {{financeAccountInfo.isEdit?\'\':\'disabled\'}}/>\n            </p>\n\n            <p class="label-item financial-records-btn">\n            <span class="item-desc"><em></em></span> \n             <span class="submit-btn" data-isedit="0">\n                {{if financeAccountInfo.isEdit}}\n                        保存\n                {{else}}\n                    修改\n                {{/if}}\n             </span>\n            </p>\n        </div>\n      {{/if}}\n\n</div>');