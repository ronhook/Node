self.addEventListener('message', function(e) {
	let response = {
		response	: false,
		data		: e.data,
		error		: "nope"
	};
	if (e.data.action){
		response.success = true;
		post('/profile/' + e.data.action, e.data.values).then(function(res){
			response = JSON.parse(res);
			response.success = true;
			self.postMessage(response);
		}, function(error){
			response.error = error;
			self.postMessage(response);
		});
	} else {
		self.postMessage(response);
	}
});

function post(url, data){
	console.log('data:', data);
	return new Promise(function(resolve, reject){
		let xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.onload = function(){
			if(xhr.status = 200){
				resolve(xhr.response);
			} else {
				reject(Error(xhr.statusText));
			}
		};
		xhr.onerror = function(){
			reject(Error('Unable to connect'));
		}
		xhr.send(JSON.stringify(data));
	});
}

function get(url){
	return new Promise(function(resolve, reject){
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onload = function(){
			if(xhr.status = 200){
				resolve(xhr.response);
			} else {
				reject(Error(xhr.statusText));
			}
		};
		xhr.onerror = function(){
			reject(Error('Unable to connect'));
		}
		xhr.send();
	});
}
