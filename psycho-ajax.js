;
(function () {

	'use strict';
	var factory = function (psycho) {
		function j(settings) {
			var url = settings.url || '';
			if (!url) {
				throw new Error('请设置正确的URL.');
			}
			var method = settings.method || 'GET';
			var isUploadFile = settings.isUploadFile;
			var timeout = settings.timeout || 10000;
			var data = {};
			var _data = settings.data || '';
			var promise = new Promise(function (resolve, reject) {
				var req = new XMLHttpRequest();
				req.open(method, url);

				if (_data) {
					if (isUploadFile) {
						data = new FormData();
						Object.keys(_data).forEach(function (key) {
							if (key === 'file') {
								var files = _data[key];
								var n = files.length;
								while (n--) {
									data.append(key + n, files[n]);
								}
							} else {
								data.append(key, _data[key]);
							}
						})

					} else {
						Object.keys(_data).forEach(function (key) {
							data[key] = _data[key];
						});
					}
				}

				console.log(data);

				req.timeout = timeout;
				if (!isUploadFile)
					req.setRequestHeader("Content-type", "application/json");
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
						var status = req.status;
						/**
						 * 0 服务器拒绝(Chrome)
						 * https://en.wikipedia.org/wiki/List_of_HTTP_status_codes						 
						 * 2xx Success 3xx Redirection 4xx Client Error
						 * 						 
						 * 400 Bad Request
						 * 401 Unauthorized						 
						 * 402 Payment Required
						 * 403 Forbidden	
						 * 404 Not Found	
						 * 498 Token expired/invalid (Esri)						 
						 * 499 Token required 
						 */

						if (status >= 200 && status <= 308) {
							resolve({
								response: req.response,
								responseText: req.responseText,
								status: req.status,
								statusText: req.statusText
							})
						} else {
							reject(req.status);
						}

					} else if (req.readyState === 0) {
						console.log(req, 'red');
						reject('');

					}
				}
				req.send(data);
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
