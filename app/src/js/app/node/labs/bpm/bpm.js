function BPM() {
	var MIN_MILLI = 60 * 1000;
	var previousTap;
	var currentTap;
	var counterEl;
	var socket = io('http://localhost');

	function _onTap(e) {
		currentTap = new Date().getTime();
		var difference = currentTap - previousTap;
		var bpm = Math.round(MIN_MILLI / difference);
		if (!isNaN(bpm)) {
			counterEl.innerHTML = bpm;
		}
		previousTap = new Date().getTime();
	}

	function init() {
		var screenEl = document.getElementById('bpm');
		counterEl = document.getElementById('counter');
		screenEl.addEventListener('click', _onTap);
	}

	socket.on('handshake', function(data) {
		console.log(data);
	});

	window.addEventListener("load", init);
}



var bpm = new BPM();