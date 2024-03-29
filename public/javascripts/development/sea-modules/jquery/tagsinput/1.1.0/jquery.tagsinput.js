define(function(require, exports, module) { 
    //var $ = require("$");
    (function(n) {
        var r = [],
            t = [];
        n.fn.doAutosize = function(t) {
            var r = n(this).data("minwidth"),
                h = n(this).data("maxwidth"),
                u = "",
                f = n(this),
                e = n("#" + n(this).data("tester_id")),
                o;
            if (u !== (u = f.val())) {
                o = u.replace(/&/g, "&").replace(/\s/g, " ").replace(/</g, "<").replace(/>/g, ">"), e.html(o);
                var s = e.width(),
                    i = s + t.comfortZone >= r ? s + t.comfortZone : r,
                    c = f.width(),
                    l = i < c && i >= r || i > r && i < h;
                l && f.width(i)
            }
        }, n.fn.resetAutosize = function(t) {
            var u = n(this).data("minwidth") || t.minInputWidth || n(this).width(),
                e = n(this).data("maxwidth") || t.maxInputWidth || n(this).closest(".tagsinput").width() - t.inputPadding,
                o = "",
                i = n(this),
                f = n("<tester/>").css({
                    position: "absolute",
                    top: -9999,
                    left: -9999,
                    width: "auto",
                    fontSize: i.css("fontSize"),
                    fontFamily: i.css("fontFamily"),
                    fontWeight: i.css("fontWeight"),
                    letterSpacing: i.css("letterSpacing"),
                    whiteSpace: "nowrap"
                }),
                r = n(this).attr("id") + "_autosize_tester";
            !n("#" + r).length > 0 && (f.attr("id", r), f.appendTo("body")), i.data("minwidth", u), i.data("maxwidth", e), i.data("tester_id", r), i.css("width", u)
        }, n.fn.addTag = function(i, u) {
            return u = jQuery.extend({
                focus: !1,
                callback: !0
            }, u), this.each(function() {
                var f = n(this).attr("id"),
                    e = n(this).val().split(r[f]),
                    o, h, s;
                e[0] == "" && (e = []), i = jQuery.trim(i), u.unique ? (o = n(this).tagExist(i), o == !0 && (n("#" + f + "_tag").addClass("not_valid"), n("#" + f + "_tag").attr("title", "重复"))) : o = !1, i != "" && o != !0 && (n("<span>").addClass("tag").append(n("<span>").text(i).append("  "), n("<a>", {
                    href: "#",
                    title: "移除",
                    text: "x"
                }).click(function() {
                    return n("#" + f).removeTag(escape(i))
                })).insertBefore("#" + f + "_addTag"), e.push(i), n("#" + f + "_tag").val(""), u.focus ? n("#" + f + "_tag").focus() : n("#" + f + "_tag").blur(), n.fn.tagsInput.updateTagsField(this, e), u.callback && t[f] && t[f].onAddTag && (s = t[f].onAddTag, s.call(this, i)), t[f] && t[f].onChange && (h = e.length, s = t[f].onChange, s.call(this, n(this), e[h - 1])))
            }), n(this).valid(), !1
        }, n.fn.removeTag = function(u) {
            return u = unescape(u), this.each(function() {
                var f = n(this).attr("id"),
                    e = n(this).val().split(r[f]),
                    o;
                for (n("#" + f + "_tagsinput .tag").remove(), str = "", i = 0; i < e.length; i++) e[i] != u && (str = str + r[f] + e[i]);
                n.fn.tagsInput.importTags(this, str), t[f] && t[f].onRemoveTag && (o = t[f].onRemoveTag, o.call(this, u))
            }), !1
        }, n.fn.tagExist = function(t) {
            var i = n(this).attr("id"),
                u = n(this).val().split(r[i]);
            return jQuery.inArray(t, u) >= 0
        }, n.fn.importTags = function(t) {
            id = n(this).attr("id"), n("#" + id + "_tagsinput .tag").remove(), n.fn.tagsInput.importTags(this, t)
        }, n.fn.tagsInput = function(i) {
            var u = jQuery.extend({
                interactive: !0,
                defaultText: "add a tag",
                minChars: 0,
                maxChars: 0,
                width: "300px",
                height: "100px",
                autocomplete: {
                    selectFirst: !1
                },
                hide: !0,
                delimiter: ",",
                unique: !0,
                removeWithBackspace: !0,
                placeholderColor: "#666666",
                autosize: !0,
                comfortZone: 20,
                inputPadding: 12
            }, i);
            return this.each(function() {
                var f, i, e; 
                if (u.hide && n(this).addClass("dummy"), f = n(this).attr("id"), (!f || r[n(this).attr("id")]) && (f = n(this).attr("id", "tags" + (new Date).getTime()).attr("id")), i = jQuery.extend({
                    pid: f,
                    real_input: "#" + f,
                    holder: "#" + f + "_tagsinput",
                    input_wrapper: "#" + f + "_addTag",
                    fake_input: "#" + f + "_tag"
                }, u), r[f] = i.delimiter, (u.onAddTag || u.onRemoveTag || u.onChange) && (t[f] = [], t[f].onAddTag = u.onAddTag, t[f].onRemoveTag = u.onRemoveTag, t[f].onChange = u.onChange), e = '<div id="' + f + '_tagsinput" class="tagsinput"><div id="' + f + '_addTag">', u.interactive && (e = e + '<input id="' + f + '_tag" value="" data-default="' + u.defaultText + '"   style="height: 27px; "  />'), e = e + '<\/div><div class="tags_clear"><\/div><\/div>', n(e).insertBefore(this), n(i.holder).css("width", u.width), n(i.holder).css("min-height", u.height), n(i.holder).css("height", u.height), n(i.real_input).val() != "" && n.fn.tagsInput.importTags(n(i.real_input), n(i.real_input).val()), u.interactive) {
                    if (n(i.fake_input).val(n(i.fake_input).attr("data-default")), n(i.fake_input).css("color", u.placeholderColor), n(i.fake_input).resetAutosize(u), n(i.holder).bind("click", i, function(t) {
                        n(t.data.fake_input).focus()
                    }), n(i.fake_input).bind("focus", i, function(t) {
                        n(t.data.fake_input).val() == n(t.data.fake_input).attr("data-default") && n(t.data.fake_input).val(""), n(t.data.fake_input).css("color", "#000000")
                    }), u.autocomplete_url != undefined) {
                        autocomplete_options = {
                            source: u.autocomplete_url
                        };
                        for (attrname in u.autocomplete) autocomplete_options[attrname] = u.autocomplete[attrname];
                        jQuery.Autocompleter !== undefined ? (n(i.fake_input).autocomplete(u.autocomplete_url, u.autocomplete), n(i.fake_input).bind("result", i, function(t, i) {
                            i && n("#" + f).addTag(i[0] + "", {
                                focus: !0,
                                unique: u.unique
                            })
                        })) : jQuery.ui.autocomplete !== undefined && (n(i.fake_input).autocomplete(autocomplete_options), n(i.fake_input).bind("autocompleteselect", i, function(t, i) {
                            return n(t.data.real_input).addTag(i.item.value, {
                                focus: !0,
                                unique: u.unique
                            }), !1
                        }))
                    } else n(i.fake_input).bind("blur", i, function(t) {
                        var i = n(this).attr("data-default");
                        return n(t.data.fake_input).val() != "" && n(t.data.fake_input).val() != i ? t.data.minChars <= n(t.data.fake_input).val().length && (!t.data.maxChars || t.data.maxChars >= n(t.data.fake_input).val().length) ? n(t.data.real_input).addTag(n(t.data.fake_input).val(), {
                            focus: !0,
                            unique: u.unique
                        }) : (n(t.data.fake_input).addClass("not_valid"), n(t.data.fake_input).attr("title", "最大20字数")) : (n(t.data.fake_input).val(n(t.data.fake_input).attr("data-default")), n(t.data.fake_input).css("color", u.placeholderColor)), !1
                    });
                    n(i.fake_input).bind("keypress", i, function(t) {
                        if (t.which == t.data.delimiter.charCodeAt(0) || t.which == 13 || t.which == 32) return t.preventDefault(), t.data.minChars <= n(t.data.fake_input).val().length && (!t.data.maxChars || t.data.maxChars >= n(t.data.fake_input).val().length) && n(t.data.real_input).addTag(n(t.data.fake_input).val(), {
                            focus: !0,
                            unique: u.unique
                        }), n(t.data.fake_input).resetAutosize(u), !1;
                        t.data.autosize && n(t.data.fake_input).doAutosize(u)
                    }), i.removeWithBackspace && n(i.fake_input).bind("keydown", function(t) {
                        if (t.keyCode == 8 && n(this).val() == "") {
                            t.preventDefault();
                            var i = n(this).closest(".tagsinput").find(".tag:last").text(),
                                r = n(this).attr("id").replace(/_tag$/, "");
                            i = i.replace(/[\s]+x$/, ""), n("#" + r).removeTag(escape(i)), n(this).trigger("focus")
                        }
                    }), n(i.fake_input).blur(), i.unique && n(i.fake_input).keydown(function(t) {
                        (t.keyCode == 8 || String.fromCharCode(t.which).match(/\w+|[áéíóúÁÉÍÓÚñÑ,/]+/)) && n(this).removeClass("not_valid")
                    })
                }
            }), this
        }, n.fn.tagsInput.updateTagsField = function(t, i) {
            var u = n(t).attr("id");
            n(t).val(i.join(r[u]))
        }, n.fn.tagsInput.importTags = function(u, f) {
            var e, o, s;
            for (n(u).val(""), e = n(u).attr("id"), o = f.split(r[e]), i = 0; i < o.length; i++) n(u).addTag(o[i], {
                focus: !1,
                callback: !1
            });
            t[e] && t[e].onChange && (s = t[e].onChange, s.call(u, u, o[i]))
        }, n.fn.tagsremove = function() {
            n(this).prevAll(".tagsinput").remove()
        }, n.fn.tagsExist = function() {
            return n(this).prevAll(".tagsinput").length > 0
        }, n.fn.getTags = function() {
            var t = n(this).attr("id"),
                i = t.substring(0, t.lastIndexOf("_"));
            return n("#" + i).val()
        }
    })(jQuery)
})
