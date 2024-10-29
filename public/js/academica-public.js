document.addEventListener('DOMContentLoaded', () => {
	'use sctrict';

	function apiRequest(method, endpoint, data=null) {
		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.open(method, `${academicaApiconfig.apiUrl}${endpoint}`, true);
			if (request == 'POST' || request == 'PUT') {
				xhr.setRequestHeader('Content-Type', 'application/json'); }
			xhr.setRequestHeader('X-ACADEMICA-API-KEY', academicaApiconfig.apiKey);

			xhr.onload = function () {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(JSON.parse(xhr.responseText));
				} else {
					reject({
						status: xhr.status,
						statusText: xhr.statusText
					});
				}
			};

			xhr.onerror = function() {
				reject({
					status: xhr.status,
					statusText: xhr.statusText
				});
			};

			if(data) {
				xhr.send(JSON.stringify(data));
			} else {
				xhr.send();
			}
		});
	}
});