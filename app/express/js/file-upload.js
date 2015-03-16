function FileUpload() {
	var inputEl;
	var socket = io('http://localhost');
	var socketId = "user_"+Math.floor(Math.random() * 1000);
	var uploadCount = 0;

	function _onTap(e) {
		inputEl.click();
	}

	function _fileSelected(e) {
		var file = inputEl.files[0];

		var filename = file.name.substring(0, file.name.length - 4);
		var ext = file.name.substring(file.name.length - 4, file.name.length).toLowerCase();
		var formData = new FormData();
		formData.append('photos[]', file, socketId.substring(0, 5)+"_"+uploadCount + ext);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/fileupload', true);
		xhr.addEventListener('readystatechange', function(e) {
			if (this.readyState === 4) {
				uploadCount++;
				console.log("BOOYA!");
			}
		});

		xhr.send(formData);
	}

	function init() {
		var screenEl = document.getElementById('fileUpload');
		inputEl = document.getElementById('fileInput');
		inputEl.addEventListener('change', _fileSelected);
		screenEl.addEventListener('click', _onTap);
	}

	socket.on('handshake', function(data) {
		socketId = data.id;
		console.log(socketId);
	});

	window.addEventListener("load", init);
}



var bpm = new FileUpload();