define("dist/pay/payRestult-debug.html", [], '<div class="payment-title">\n    {{ if orderInfo.orderStatus == 2}}\n    <span class="payment-title-icon success"></span>\n    <span class="payment-title-desc">支付成功</span>\n    <span class="payment-title-info">请在电脑网站完成后续操作</span>\n    {{/if}}\n    {{ if orderInfo.orderStatus == 3}}\n    <span class="payment-title-icon error"></span>\n    <span class="payment-title-desc">支付失败</span>\n    {{/if}}\n\n</div>\n<ul class="order-list">\n    <li class="list-item">\n        <span class="item-title">支付方式:</span>\n        {{ if orderInfo.payType == \'wechat\'}}\n            <span class="item-desc">微信支付</span>\n        {{/if}}\n            {{ if orderInfo.payType == \'alipay\'}}\n            <span class="item-desc">支付宝支付</span>\n        {{/if}}\n    </li>\n    <li class="list-item">\n        <span class="item-title">订单金额:</span>\n        <span class="item-desc">¥ {{orderInfo.payPrice}}</span>\n    </li>\n    <li class="list-item orderTime">\n        <span class="item-title">创建时间:</span>\n        <span class="item-desc">{{orderInfo.orderTime}}</span>\n    </li>\n    <li class="list-item">\n        <span class="item-title">商户单号:</span>\n        <span class="item-desc">{{orderInfo.payNo}}</span>\n    </li>\n    <li class="list-item">\n        <span class="item-title">商品名称:</span>\n        <span class="item-desc">{{orderInfo.goodsName}}</span>\n    </li>\n</ul> \n<div class="payment-info">\n    请截图保存订单详情，以便查询使用\n</div>\n{{ if orderInfo.orderStatus == 3 }}\n    <div class="btn-wrap">\n        <div class="payment-btn">重新支付</div>\n    </div>\n{{ /if }}\n\n\n');