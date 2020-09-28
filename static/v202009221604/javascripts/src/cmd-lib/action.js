/**
 * @Description: 筛选
 */
define(function(require , exports , module){
    //var jQuery = require("$");
    (function($ , win , doc){
        function Actions(options){
            this.options = {
                title : '选择操作',
                mask : '<div class="screen-mask" data-page="mask"></div>' ,
                actions : null,
                confirmlText:"确定",
                cannelText:"重置",
                cannelBtn : true, //关闭按钮
                confirmlBtn : true,//确认按钮
                showFooter:true,
                actionsWrap:null,
                onConfirm:false,//callback
                onReset:false, //callback
                onSelect:false,//callback
                body:'body'
            };
            //默认参数扩展
            if(options && $.isPlainObject(options)){
                $.extend(true ,this.options , options);
            };
            
            this.init();
        }
        Actions.prototype = {
            init : function(){
                var that = this;
                this._create(that.options.html);
                this._bindEvents();
            },
            _create : function(html){
                var that = this;
                var _html ,cfBtn = '', clBtn='' , footer = '' , bodyContent = '';
                if(html){
                    _html = html === 'default' ? '' : html;
                }else{
                    
                    if(that.options.confirmlBtn){
                        cfBtn = '<a href="javascript:;" class="cell confirm">'+this.options.confirmlText+'</a>';
                    }

                    if(that.options.cannelBtn){
                        clBtn = '<a href="javascript:;" class="cell reset">' + this.options.cannelText + '</a>';
                    }

                    if(that.options.showFooter){
                        footer = '<div class="screen-btn-con mui-flex">\
                                        '+ clBtn +'\
                                        '+ cfBtn+'\
                                    </div>';
                    }

                    if(that.options.actions){
                        bodyContent=that._creactActions(that.options.actions,$("<div class='screen-more-list'></div>"))
                    }

                   that.options.actionsWrap = '<div class="office-screen-more">\
                                            '+ bodyContent +'\
                                            '+ footer +'\
                                        </div>';

                    _html = that.options.actionsWrap;
                    
                    if(!$(document).find('[data-page="mask"]').length){
                        $('body').append(this.options.mask);
                    }
                    $(that.options.body).append(_html);
                }
            },
            _bindEvents:function(){
                var that = this;
                $(document).delegate(".screen-mask","click",function(e){
                    e && e.preventDefault();
                    that.hide(false);
                })

                //重置
                $(that.options.body).delegate('.reset','click',function(e){
                    e && e.preventDefault();
                    that._reset(that.options.onReset,that.options.body);
                })

                //列表点击
                $(that.options.body).delegate('.ui-action-sheet-item,.screen-ele','click',function(e){
                    e && e.preventDefault();
                    that._select(that.options.onSelect,$(this));
                })

                $(that.options.body).delegate('.confirm','click',function(e){
                    that._confirm(that.options.onConfirm);
                })
            },
            _creactActions:function(actions){
                var _html = '';
                $(actions).each(function(index){
                    var text = this.text ? this.text : '列表' + index++,
                        action = '<a href="javascript:;" class="ui-action-sheet-item ui-border-b">' + text + '</a>';
                        _html += action;
                });
                return _html;
                
            },
            open:function(cb){
                this._callback(cb);
                $(this.options.body).find(".office-screen-more").show();
                $('[data-page="mask"]').show();
            },
            hide:function(cb){
                $(this.options.body).find(".office-screen-more").hide();
                $('[data-page="mask"]').hide();
                if(cb && (typeof cb === 'function')){
                    this._callback(cb)
                }
            },
            _confirm:function(cb){
                if(!this.options.callback){
                    this.hide(cb);
                }else{
                    return cb();
                }
            },
            _reset:function(cb,body){
                if(cb){
                    return cb(body);
                }
            },
            _select:function(cb,$this){
                if(cb){
                    return cb($this);
                }
            },
            _callback:function(cb){
                if(cb && (typeof(cb) === 'function')){
                    cb.call(this);
                }
            },
            getElement:function(){
                return $(this.options.body);
            }
        }
        
        $.action = function(options){
            return new Actions(options)
        }
        
    })(jQuery , window , document)
})