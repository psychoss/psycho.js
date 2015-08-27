
; (function () {

    'use strict';
    var factory = function (psycho) {
        function j(settings) {
            var url = settings = settings.url || '';
            if (!url) {
                throw new Error('请设置正确的URL.');
            }
            var method = settings.method || 'GET';
            var isUploadFile = settings.isUploadFile;
            var timeout = settings.timeout || 10000;
            var data;
            var _data = settings.data || '';
            var promise = new Promise(function (resolve, reject) {
                var req = new XMLHttpRequest();
                req.open(method, url);
                if (data) {
                    if (isUploadFile) {
                        data = new FormData();
                        Object.keys(_data).forEach(function (key) {
                            if (key === 'file') {
                                var files = _data[key];
                                var n = files.length;
                                while (n--) {
                                    data.append(key + n, files[n]);
                                }
                            }
                            else {
                                data.append(key, _data[key]);
                            }
                        })

                    }
                    else {
                        Object.keys(_data).forEach(function (key) {
                            data[key] = _data[key];
                        });
                    }
                }
                if (!isUploadFile)
                    req.setRequestHeader("Content-type", "application/json");

                req.timeout = timeout;
                req.send(data);

                req.onerror = function () {
                    reject(`请求${url}错误`);
                }
                req.ontimeout = function () {
                    reject(`请求${url}超时`);
                }
                if (settings.onprogress) {
                    req.onprogress = settings.onprogress;
                }
                req.onreadystatechange = function () {
                    if (req.readyState === 4) {
                        resolve({
                            response: req.response,
                            responseText: req.responseText,
                            status: req.status,
                            statusText: req.statusText
                        })
                    }
                }
            })

            return promise;
        }

        psycho.j = j;

    }
    if (typeof window === 'undefined') {
        throw new Error('仅支持浏览器');
    } else {
        factory(window.psycho);
    }
})();

