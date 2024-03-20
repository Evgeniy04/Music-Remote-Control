let id = window.sessionStorage.getItem("id");
if (!id) {
	id = crypto.randomUUID();
	window.sessionStorage.setItem("id", id);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "getId") sendResponse({ id: id });
});

const url_socket = "wss://avradev.ru/socket/";
const base_url = chrome.runtime.getURL("scripts/");
const url_next = base_url + "next.js";
const url_prev = base_url + "prev.js";
const url_togglePause = base_url + "togglePause.js";
const url_toggleShuffle = base_url + "toggleShuffle.js";
const url_toggleRepeat = base_url + "toggleRepeat.js";
const url_toggleLike = base_url + "toggleLike.js";
const url_downVolume = base_url + "downVolume.js";
const url_upVolume = base_url + "upVolume.js";
const url_getCurrentTrack = base_url + "getCurrentTrack.js";
const url_eventListenner = base_url + "eventListenner.js";

let shuffle;
let repeat;
let playing;
let script_eventListenner;
let socket = new WebSocket(url_socket);

const onopen = (event) => {
	// Регистрируемся как расширение
	socket.send(
		JSON.stringify({
			action: "reg",
			player_id: id,
		})
	);
};
const onerror = (event) => {
	console.log("WebSocket error:", event);
};
const onclose = (event) => {
	socket = new WebSocket(url_socket);
	socket.onopen = onopen;
	socket.onerror = onerror;
	socket.onclose = onclose;
};
socket.onopen = onopen;
socket.onerror = onerror;
socket.onclose = onclose;

// Отправляем обновлённые данные клиенту удалённого плеера
window.addEventListener("message", (message) => {
	switch (message.data.action) {
		case "currentTrack":
			socket.send(
				JSON.stringify({
					action: "currentTrack",
					player_id: id,
					data: message.data,
				})
			);
			break;
		case "progress":
			socket.send(
				JSON.stringify({
					action: "progress",
					player_id: id,
					progress: message.data.progress,
				})
			);
			break;
	}
});

if (document.readyState !== "loading") {
	appendScript();
} else {
	document.addEventListener("DOMContentLoaded", appendScript);
}

let script = document.querySelector(`script[data-mrc-id='${id}']`);
socket.onmessage = (message) => {
	let url;
	const data = JSON.parse(message.data);
	switch (data.action) {
		case "next":
			url = url_next;
			break;
		case "prev":
			url = url_prev;
			break;
		case "togglePause":
			url = url_togglePause;
			break;
		case "shuffle":
			url = url_toggleShuffle;
			break;
		case "repeat":
			url = url_toggleRepeat;
			break;
		case "like":
			url = url_toggleLike;
			break;
		case "downVolume":
			url = url_downVolume;
			break;
		case "upVolume":
			url = url_upVolume;
			break;
		case "handleProgressPosition":
			window.postMessage(data, "*");
			return;
		case "getCurrentTrack":
			url = url_getCurrentTrack;
			break;
	}
	const head = document.querySelector("head");
	if (script) {
		head.removeChild(script);
	}
	script = document.createElement("script");
	script.src = url;
	script.setAttribute("data-mrc-id", id);
	script.setAttribute("type", "text/javascript");
	head.appendChild(script);
};

function appendScript() {
	script_eventListenner = document.createElement("script");
	script_eventListenner.src = url_eventListenner;
	script_eventListenner.setAttribute("event-mrc-id", id);
	script_eventListenner.setAttribute("type", "text/javascript");
	document.querySelector("head").appendChild(script_eventListenner);
}

navigator.wakeLock.request("screen");
