let progress = false;
externalAPI.on(externalAPI.EVENT_TRACK, sendCurrentTrack);
externalAPI.on(externalAPI.EVENT_CONTROLS, sendCurrentTrack);
externalAPI.on(externalAPI.EVENT_STATE, sendCurrentTrack);
externalAPI.on(externalAPI.EVENT_PROGRESS, sendProgress);
window.addEventListener("message", (message) => {
	switch (message.data.action) {
		case "handleProgressPosition":
			externalAPI.setPosition(message.data.position);
			break;
	}
});

function sendProgress() {
	let current_progress = externalAPI.getProgress();
	progress || (progress = current_progress);
	if (Math.trunc(progress.position) != Math.trunc(current_progress.position)) {
		progress = current_progress;
		window.postMessage({ action: "progress", progress: progress }, "*");
	}
}

function sendCurrentTrack() {
	data = externalAPI.getCurrentTrack();
	if (data) {
		data.action = "currentTrack";
		data.shuffle = externalAPI.getShuffle();
		data.repeat = externalAPI.getRepeat();
		data.playing = externalAPI.isPlaying();
		data.progress = externalAPI.getProgress();
		window.postMessage(data, "*");
	}
}
