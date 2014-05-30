/*! store2 - v2.1.6 - 2014-03-10
 * Copyright (c) 2014 Nathan Bubna; Licensed MIT, GPL */
(function(t, e) {
    var n = {
        version: "2.1.6",
        areas: {},
        apis: {},
        inherit: function(t, e) {
            for (var n in t) e.hasOwnProperty(n) || (e[n] = t[n]);
            return e
        },
        stringify: function(t) {
            return void 0 === t || "function" == typeof t ? t + "" : JSON.stringify(t)
        },
        parse: function(t) {
            try {
                return JSON.parse(t)
            } catch (e) {
                return t
            }
        },
        fn: function(t, e) {
            n.storeAPI[t] = e;
            for (var i in n.apis) n.apis[i][t] = e
        },
        get: function(t, e) {
            return t.getItem(e)
        },
        set: function(t, e, n) {
            t.setItem(e, n)
        },
        remove: function(t, e) {
            t.removeItem(e)
        },
        key: function(t, e) {
            return t.key(e)
        },
        length: function(t) {
            return t.length
        },
        clear: function(t) {
            t.clear()
        },
        Store: function(t, e, i) {
            var r = n.inherit(n.storeAPI, function(t, e, n) {
                return 0 === arguments.length ? r.getAll() : void 0 !== e ? r.set(t, e, n) : "string" == typeof t ? r.get(t) : t ? r.setAll(t, e) : r.clear()
            });
            return r._id = t, r._area = e || n.inherit(n.storageAPI, {
                items: {},
                name: "fake"
            }), r._ns = i || "", n.areas[t] || (n.areas[t] = r._area), n.apis[r._ns + r._id] || (n.apis[r._ns + r._id] = r), r
        },
        storeAPI: {
            area: function(t, e) {
                var i = this[t];
                return i && i.area || (i = n.Store(t, e, this._ns), this[t] || (this[t] = i)), i
            },
            namespace: function(t, e) {
                if (!t) return this._ns ? this._ns.substring(0, this._ns.length - 1) : "";
                var i = t,
                    r = this[i];
                return r && r.namespace || (r = n.Store(this._id, this._area, this._ns + i + "."), this[i] || (this[i] = r), e || r.area("session", n.areas.session)), r
            },
            isFake: function() {
                return "fake" === this._area.name
            },
            toString: function() {
                return "store" + (this._ns ? "." + this.namespace() : "") + "[" + this._id + "]"
            },
            has: function(t) {
                return this._area.has ? this._area.has(this._in(t)) : !! (this._in(t) in this._area)
            },
            size: function() {
                return this.keys().length
            },
            each: function(t, e) {
                for (var i = 0, r = n.length(this._area); r > i; i++) {
                    var s = this._out(n.key(this._area, i));
                    if (void 0 !== s && t.call(this, s, e || this.get(s)) === !1) break;
                    r > n.length(this._area) && (r--, i--)
                }
                return e || this
            },
            keys: function() {
                return this.each(function(t, e) {
                    e.push(t)
                }, [])
            },
            get: function(t, e) {
                var i = n.get(this._area, this._in(t));
                return null !== i ? n.parse(i) : e || i
            },
            getAll: function() {
                return this.each(function(t, e) {
                    e[t] = this.get(t)
                }, {})
            },
            set: function(t, e, i) {
                var r = this.get(t);
                return null != r && i === !1 ? e : n.set(this._area, this._in(t), n.stringify(e), i) || r
            },
            setAll: function(t, e) {
                var n, i;
                for (var r in t) i = t[r], this.set(r, i, e) !== i && (n = !0);
                return n
            },
            remove: function(t) {
                var e = this.get(t);
                return n.remove(this._area, this._in(t)), e
            },
            clear: function() {
                return this._ns ? this.each(function(t) {
                    n.remove(this._area, this._in(t))
                }, 1) : n.clear(this._area), this
            },
            clearAll: function() {
                var t = this._area;
                for (var e in n.areas) n.areas.hasOwnProperty(e) && (this._area = n.areas[e], this.clear());
                return this._area = t, this
            },
            _in: function(t) {
                return "string" != typeof t && (t = n.stringify(t)), this._ns ? this._ns + t : t
            },
            _out: function(t) {
                return this._ns ? t && 0 === t.indexOf(this._ns) ? t.substring(this._ns.length) : void 0 : t
            }
        },
        storageAPI: {
            length: 0,
            has: function(t) {
                return this.items.hasOwnProperty(t)
            },
            key: function(t) {
                var e = 0;
                for (var n in this.items)
                    if (this.has(n) && t === e++) return n
            },
            setItem: function(t, e) {
                this.has(t) || this.length++, this.items[t] = e
            },
            removeItem: function(t) {
                this.has(t) && (delete this.items[t], this.length--)
            },
            getItem: function(t) {
                return this.has(t) ? this.items[t] : null
            },
            clear: function() {
                for (var t in this.list) this.removeItem(t)
            },
            toString: function() {
                return this.length + " items in " + this.name + "Storage"
            }
        }
    };
    t.store && (n.conflict = t.store);
    var i = n.Store("local", function() {
        try {
            return localStorage
        } catch (t) {}
    }());
    i.local = i, i._ = n, i.area("session", function() {
        try {
            return sessionStorage
        } catch (t) {}
    }()), "function" == typeof e && void 0 !== e.amd ? e(function() {
        return i
    }) : "undefined" != typeof module && module.exports ? module.exports = i : t.store = i
})(window, window.define);