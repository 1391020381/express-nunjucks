define("dist/detail-b/template/pay_btn_tmp-debug.html", [], '<div class="bottom-fix qwe">\n        {{if data.productType == "3"}}\n            <!--仅在线阅读-->\n            {{if data.isVip == 1}}\n               \n                <div class="integral-con ">\n                    <a id="searchRes" class="btn-fix-vip btn-fix-bottom" ><i class="icon-detail"></i>寻找资料</a>\n                </div>\n\n            {{else}}\n               \n                <div class="integral-con ">\n                    <a class="btn-fix-vip js-buy-open btn-fix-bottom pc_click" pcTrackContent="joinVip-2" bilogContent="fileDetailBottomOpenVip8" data-type="vip">开通VIP，享更多特权</a>\n                </div>\n            {{/if}}\n        {{else}}\n            <!--VIP免费-->\n            {{if data.productType == 4}}\n          \n                <div class="integral-con ">\n                    <a class="btn-fix-bottom  pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                </div>\n            {{else}}\n                {{if data.productType == "5" }}\n                    <!--现金文档 -->\n                    <!--专享8折 加入vip8折购买 立即下载 立即购买-->\n                      {{if data.isVip == 1 && data.vipDiscountFlag == 1 }}\n                      \n                        <div class="integral-con ">\n                            {{if data.status!=2}}\n                                <div class="price-con price-more ">\n                                    <span class="price-desc">VIP价:</span>\n                                     <p class="price vip-price">¥{{data.productPrice}}</p>\n                                    <p class="origin-price">&yen; {{data.productPrice}}</p>\n                                </div>\n                                 <a class="btn-fix-bottom js-buy-open  pc_click" pcTrackContent="buyBtn-3" bilogContent="fileDetailBottomBuy" data-type="file">立即下载</a>\n                            {{else}}\n                                 <a class="btn-fix-bottom  pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                        <!--&& data.ownVipDiscountFlag== 1-->\n                      {{else if data.isVip != 1 && data.vipDiscountFlag == 1 }}\n                        \n                        <div class="integral-con ">\n                            {{if data.status!=2}}\n                                <div class="price-con price-more ">\n                                    <!--现金文档价格 -->\n                                     <span class="price-desc">售价:</span>\n                                    <p class="price" style="">&yen;{{data.productPrice}}</p>\n                                    <!--现金文档 有折扣 非vip会员 -->\n                                  \n                                      <p class="vip-sale-price">VIP价&yen;<span class="js-original-price">{{data.productPrice}}</span></p>\n                                </div>\n                                <a class="btn-fix-bottom btn-fix-border js-buy-open  pc_click" pcTrackContent="buyBtn-3" bilogContent="fileDetailBottomBuy" data-type="file">立即下载</a>\n                            {{else}}\n                                 <a class="btn-fix-bottom  pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                      {{else}}\n                       \n\n                        <div class="integral-con ">\n                            {{if data.status!=2}}\n                                <div class="price-con ">\n                                    <!--现金文档价格 -->\n                                    <span class="price-desc">售价:</span>\n                                     <p class="price" style="">¥{{data.productPrice}}</p>\n                                </div>\n                                <a class="btn-fix-bottom js-buy-open   pc_click" pcTrackContent="buyBtn-3" bilogContent="fileDetailBottomBuy" loginOffer="buyBtn-2" data-type="file">立即下载</a>\n                            {{else}}\n                                <a class="btn-fix-bottom  pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                    {{/if}}\n                {{else}}\n                    <!--vip-->\n                    {{if data.isVip == 1}}\n                           \n                            <div class="integral-con ">\n                                {{if data.volume > 0}}\n                                    <div class="price-con ">\n                                        <p class="price">{{data.volume}}下载券</p>\n                                    </div>\n                                {{/if}}\n                                <a class="btn-fix-bottom   pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            </div>\n                    {{else}}\n                        {{if data.volume > 0}}\n\n                            \n\n                            <div class="integral-con ">\n                                <div class="price-con ">\n                                    <p class="price" style="">{{data.volume}}下载券</p>\n                                </div>\n                                <a class="btn-fix-bottom   pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download" >立即下载</a>\n                            </div>\n                        {{else}}\n                            \n\n                            <div class="integral-con ">\n                                <a class="btn-fix-bottom   pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download" >立即下载</a>\n                            </div>\n                        {{/if}}\n                    {{/if}}\n                {{/if}}\n            {{/if}}\n        {{/if}}\n</div>\n');