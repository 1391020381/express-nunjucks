define(function(require, exports, module) {
    template.helper('encodeValue', function (value) {
        return encodeURIComponent(encodeURIComponent(value));
    });
});