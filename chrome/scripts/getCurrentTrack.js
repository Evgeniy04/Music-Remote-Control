data = externalAPI.getCurrentTrack();
data.action = "currentTrack";
data.shuffle = externalAPI.getShuffle();
data.repeat = externalAPI.getRepeat();
data.playing = externalAPI.isPlaying();
data.progress = externalAPI.getProgress();
window.postMessage(data, "*");
