
self.addEventListener('message', function(e) {
	let response = {
		response	: false,
		data:		e.data
	};
	if (e.data.url){
		response.success = true;

		get(e.data.url).then(function(res){
			response.image = res;
			self.postMessage(response);
		}, function(error){
			response.error = error;
			self.postMessage(response);
		});

	} else {
		self.postMessage(response);
	}
});

function get(url){
	return new Promise(function(resolve, reject){
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.onload = function(){
			if(xhr.status = 200){
				let file = new FileReader();
				file.onloadend = function() {
					resolve(file.result);
				};
				file.readAsDataURL(xhr.response);
				//let blob = new Blob([xhr.response], {type: "image/png"});
				//resolve(btoa(xhr.response));
				//resolve(xhr.responseText);
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
