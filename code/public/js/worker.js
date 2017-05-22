
self.addEventListener('message', function(e) {
	let response = {
		response	: false,
		data		: e.data,
		error		: "nope"
	};
	if (e.data.uri){
		response.success = true;

		get(e.data.uri).then(function(res){
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

function get(uri){
	return new Promise(function(resolve, reject){
		let xhr = new XMLHttpRequest();
		xhr.open('GET', uri);
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
