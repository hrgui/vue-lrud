(() => {
  var t = {
      161: function (t) {
        t.exports = function () {
          let t;
          function e(t) {
            return !!t && ("object" == typeof t || "function" == typeof t);
          }
          function r(t) {
            if (null !== t && !e(t))
              throw TypeError("Object prototype may only be an Object or null: " + t);
          }
          let o = Object,
            n = !!o.create || !({ __proto__: null } instanceof o),
            i =
              o.create ||
              (n
                ? function (t) {
                    return r(t), { __proto__: t };
                  }
                : function (t) {
                    if ((r(t), null === t))
                      throw SyntaxError(
                        "Native Object.create is required to create objects with null prototype"
                      );
                    var e = function () {};
                    return (e.prototype = t), new e();
                  }),
            u = function () {
              return null;
            },
            c =
              o.getPrototypeOf ||
              ([].__proto__ === Array.prototype
                ? function (t) {
                    let r = t.__proto__;
                    return e(r) ? r : null;
                  }
                : u);
          function p(t, p, l) {
            let f;
            if (!e(t) || !e(p))
              throw TypeError("Cannot create proxy with a non-object as target or handler");
            let a = function (t) {},
              s = p;
            for (let t in ((p = { get: null, set: null, apply: null, construct: null }), s)) {
              if (!(t in p)) {
                console.warn(`Proxy polyfill does not support trap '${t}'`),
                  (p[t] = function () {});
                continue;
              }
              p[t] = s[t];
            }
            "function" == typeof s && (p.apply = s.apply.bind(s));
            let y = c(t),
              h = !1,
              b = !1;
            "function" == typeof t
              ? ((f = function () {
                  let e = this && this.constructor === f,
                    r = Array.prototype.slice.call(arguments);
                  return (a(e ? "construct" : "apply"), e && p.construct)
                    ? p.construct.call(this, t, r)
                    : !e && p.apply
                    ? p.apply(t, this, r)
                    : e
                    ? (r.unshift(t), new (t.bind.apply(t, r))())
                    : t.apply(this, r);
                }),
                (h = !0))
              : t instanceof Array
              ? ((f = []), (b = !0))
              : (f = n || null !== y ? i(y) : {});
            let _ = p.get
                ? function (t) {
                    return a("get"), p.get(this, t, f);
                  }
                : function (t) {
                    return a("get"), this[t];
                  },
              d = p.set
                ? function (t, e) {
                    a("set"), p.set(this, t, e, f);
                  }
                : function (t, e) {
                    a("set"), (this[t] = e);
                  },
              g = o.getOwnPropertyNames(t).map((e) => ({ name: e, source: t })),
              w = y;
            for (; w && w !== o.prototype; )
              (g = g.concat(o.getOwnPropertyNames(w).map((t) => ({ name: t, source: w })))),
                (w = o.getPrototypeOf(w));
            let v = {};
            g.forEach(function (e) {
              let r = e.name,
                n = e.source;
              if (((h || b) && r in f) || v[r]) return;
              let i = {
                enumerable: !!o.getOwnPropertyDescriptor(n, r).enumerable,
                get: _.bind(t, r),
                set: d.bind(t, r),
              };
              o.defineProperty(f, r, i), (v[r] = !0);
            });
            let x = !0;
            if (h || b) {
              let t =
                o.setPrototypeOf ||
                ([].__proto__ === Array.prototype
                  ? function (t, e) {
                      return r(e), (t.__proto__ = e), t;
                    }
                  : u);
              !(y && t(f, y)) && (x = !1);
            }
            if (p.get || !x)
              for (let e in t) {
                if (!v[e]) o.defineProperty(f, e, { get: _.bind(t, e) });
              }
            return (
              o.seal(t),
              o.seal(f),
              l
                ? {
                    proxy: f,
                    revoke: function () {
                      (t = null),
                        (a = function (t) {
                          throw TypeError(`Cannot perform '${t}' on a proxy that has been revoked`);
                        });
                    },
                  }
                : f
            );
          }
          return (
            ((t = function (e, r) {
              if (void 0 === (this && this instanceof t ? this.constructor : void 0))
                throw TypeError("Constructor Proxy requires 'new'");
              return p(e, r);
            }).revocable = function (t, e) {
              return p(t, e, !0);
            }),
            t
          );
        };
      },
    },
    e = {};
  function r(o) {
    var n = e[o];
    if (void 0 !== n) return n.exports;
    var i = (e[o] = { exports: {} });
    return t[o](i, i.exports, r), i.exports;
  }
  (r.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || Function("return this")();
    } catch (t) {
      if ("object" == typeof window) return window;
    }
  })()),
    (r.rv = function () {
      return "1.0.7";
    }),
    (r.ruid = "bundler=rspack@1.0.7"),
    (function (t) {
      if (!t.Proxy) (t.Proxy = r(161)()), (t.Proxy.revocable = t.Proxy.revocable);
    })(
      ("undefined" != typeof process && "[object process]" === {}.toString.call(process)) ||
        ("undefined" != typeof navigator && "ReactNative" === navigator.product)
        ? r.g
        : self
    );
})();
