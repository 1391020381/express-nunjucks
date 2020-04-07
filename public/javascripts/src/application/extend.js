define(function(require, exports, module) {
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match
            })
        }

    }
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s*/, "").replace(/\s*$/, "");
        }
    }
    if (!String.prototype.stripTags) {
        //移除html
        String.prototype.stripTags = function() {
            return this.replace(/<\/?[^>]+>/gi, '');
        }

    }
});