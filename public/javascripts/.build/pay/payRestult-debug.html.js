define("dist/pay/payRestult-debug.html", [], ' <div class="payment-title">\n       {{ if orderInfo.orderStatus == 2}}\n        <span class="payment-title-icon success"></span>\n        <span class="payment-title-desc">支付成功</span>\n        {{/if}}\n        {{ if orderInfo.orderStatus == 3}}\n        <span class="payment-title-icon error"></span>\n        <span class="payment-title-desc">支付成功</span>\n        {{/if}}\n    </div>\n    <ul class="order-list">\n        <li class="list-item">\n            <span class="item-title">支付方式:</span>\n            {{ if orderInfo.payType == \'wechat\'}}\n                <span class="item-desc">微信支付</span>\n            {{/if}}\n             {{ if orderInfo.payType == \'alipay\'}}\n                <span class="item-desc">支付宝支付</span>\n            {{/if}}\n        </li>\n        <li class="list-item">\n            <span class="item-title">订单金额:</span>\n            <span class="item-desc">¥ {{orderInfo.payPrice}}</span>\n        </li>\n        <li class="list-item">\n            <span class="item-title">创建时间:</span>\n            <span class="item-desc">{{orderInfo.orderTime}}</span>\n        </li>\n         <li class="list-item">\n            <span class="item-title">交易订单号:</span>\n            <span class="item-desc">{{orderInfo.orderNo}}</span>\n        </li>\n          <li class="list-item">\n            <span class="item-title">商户订单号:</span>\n            <span class="item-desc">{{orderInfo.orderNo}}</span>\n        </li>\n         <li class="list-item">\n            <span class="item-title">商品名称:</span>\n            <span class="item-desc">{{orderInfo.goodsName}}</span>\n        </li>\n</ul> ');