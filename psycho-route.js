/**
 * 客户端路由
 */
;
(function () {

    var factory = function (psycho) {
        var location = window.location;
        var routes = [],
            other;

        var router = {
            init: function () {
                window.addEventListener('hashchange', this.handleRequest);

                var hash = location.hash;
                if (hash.length < 1) {
                    location.hash = '#/';
                }
            },
            handleRequest: function () {
                var hash = location.hash.substring(1);
                var resolved = false, routeParams = {};
                for (var i = 0; i < routes.length; i++) {

                    var current = routes[i];
                    if (psycho.isRegExp(current.m)) {
                        if (current.m.test(hash)) {
                            resolved = true;

                        } else {
                            continue;
                        }
                    } else {
                        if (router.lexer(current.m, hash, routeParams)) {

                            resolved = true;

                        } else {
                            continue;
                        }
                    }
                    if (resolved) {
                        return current.c(routeParams);
                    } else {
                        location.hash = other;
                    }
                }
            },
            otherWise: function () {
                other = value || '#/';
            },
            when: function (matchPattern, callback) {
                var r = {
                    m: matchPattern,
                    c: callback
                }

                if (psycho._indexOf(r) === -1) {
                    routes.push(r);
                }
            },
            lexer: function (a, b, routeParams) {
                if (a === b && a === '/') return true;
                if (a === '/') return false;
                var ap = a.substring(1).split('/');
                var bp = b.substring(1).split('/');


                for (var i = 0, ii = ap.length; i < ii; i++) {
                    if (ap[i].substring(0, 1) == ':') {
                        routeParams[ap[i].substring(1)]= bp[i];
                    } else {
                        if (ap[i] === bp[i]) continue;
                        else {
                            routeParams = {};
                            return false;
                        }
                    }
                }
                return true;

            }
        }


        router.init();
        psycho.router = router;

    }
    if (typeof window === void 0) {
        throw new Error('此路由仅支持浏览器');
    } else {
        factory(window.psycho);
    }
})();

