define("dist/personalCenter/template/vipTable.html", [], '<div class="my-vip-bottom">\n          <ul class="myvip-tabs" >\n           <li class="{{vipTableType == \'0\'?\'tab tab-active\':\'tab\'}}"><a href="/node/personalCenter/vip.html?vipTableType=0">我的下载特权</a></li>\n           <li  class="{{vipTableType == \'1\'?\'tab tab-active\':\'tab\'}}"><a href="/node/personalCenter/vip.html?vipTableType=1">会员充值记录</a></li>\n        </ul>  \n\n\n\n    \n        {{if vipTableType == \'0\'}}\n         <table class="privilege-table table">\n                 <tr class="privilege-table-title table-head">\n                         <th style="width:150px;">获取渠道</th>\n                         <th style="width:100px;">状态</th>\n                         <th style="width:100px;">未使用</th>\n                        <th style="width:100px;">已使用</th>\n                        <th style="width:200px;">有效期</th>\n                        <th style="width:100px;">使用范围</th>\n                 </tr>\n                 {{each list}}\n                     <tr>\n                               <td>\n                                {{if list[$index].voluChannel == \'5\'}}\n                                    <span class="td-head-text">系统赠送</span>\n                                {{/if }}\n                                 {{if list[$index].voluChannel == \'17\'}}\n                                    <span class="td-head-text">直接购买</span>\n                                {{/if }}\n                                 {{if list[$index].voluChannel == \'18\'}}\n                                    <span class="td-head-text">购买VIP套餐赠送</span>\n                                {{/if }}\n                                </td>\n\n                                <td>\n                                {{if list[$index].status == \'0\'}}\n                                        <span class="td-status-color">可使用</span>\n                                {{/if}}\n\n                                 {{if list[$index].status == \'1\'}}\n                                        <span>已过期</span>\n                                {{/if}}\n                                 {{if list[$index].status == \'3\'}}\n                                        <span>冻结中</span>\n                                {{/if}}\n\n                                {{if list[$index].status ==\'4\'}}\n                                        <span>已失效</span>\n                                {{/if}}\n                             {{if list[$index].status ==\'5\'}}\n                                        <span>未生效</span>\n                                {{/if}}\n                                {{if list[$index].status ==\'6\'}}\n                                        <span>已失效</span>\n                                {{/if}}\n                               </td>\n                          \n                              <td class="td-text">{{list[$index].downVouNoUseNum}}</td>\n                              <td class="td-text">{{list[$index].downVouUsedNum}}</td>\n                              <td class="td-text">{{list[$index].effectiveStartDate}}至{{list[$index].effectiveEndDate}}</td> \n\n\n                               <td class="td-text">\n                                {{if list[$index].site  == \'0\'}}\n                                        <span>爱问办公</span>                                        \n                                {{/if}}\n\n                                {{if list[$index].site ==\'3\'}}\n                                        <span>爱问办公;爱问共享资料</span>\n                                {{/if}}\n\n                                {{if list[$index].site == \'4\'}}\n                                        <span>爱问共享资料</span>\n                                {{/if}}\n                               </td> \n                     </tr> \n                 {{/each}}\n          </table>\n          {{/if}}\n\n\n\n\n           {{if vipTableType == \'1\'}}\n                <table class="vip-table table">\n                       <tr class="vip-table-head table-head">\n                           <th>会员名称</th>\n                           <th style="width:100px;">状态</th>\n                            <th style="width:200px;">有效期</th>\n                            <th style="width:200px;">使用范围</th>\n                            <th>权益</th>\n                        </tr>\n                      {{each list}}\n                                   <tr>\n                                     <td class="td-head-text">{{list[$index].vipName}}</td>\n                                     <td>\n                                         {{if list[$index].status == \'1\'}}\n                                               <span>未生效</span>\n                                         {{/if}}\n                                         {{if list[$index].status == \'2\'}}\n                                               <span class="td-status-color">可使用</span>\n                                         {{/if}}\n                                         {{if list[$index].status == \'3\'}}\n                                               <span>已过期</span>\n                                         {{/if}}\n                                         {{if list[$index].status == \'4\'}}\n                                               <span>已失效</span>\n                                         {{/if}}\n                                         {{if list[$index].status == \'5\'}}\n                                               <span>冻结</span>\n                                         {{/if}}\n                                     </td>\n                                     <td class="td-text">{{list[$index].beginDate}}至{{list[$index].endDate}}</td>\n                                    <td class="td-text">\n                                        {{if list[$index].site  == \'0\'}}\n                                        <span>爱问办公</span>                                        \n                                       {{/if}}\n                                        {{if list[$index].site ==\'3\'}}\n                                        <span>爱问办公;爱问共享资料</span>\n                                      {{/if}}\n                                       {{if list[$index].site == \'4\'}}\n                                        <span>爱问共享资料</span>\n                                      {{/if}} \n                                    </td>\n                                    <td class="td-text">{{list[$index].memberContent}}</td>\n                                   </tr>\n                      {{/each}}\n              </table>\n         {{/if}}\n         \n \n</div>');