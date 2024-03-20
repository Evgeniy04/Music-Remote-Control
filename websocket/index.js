import { WebSocketServer } from "ws";
import fetch from "node-fetch";
const server = new WebSocketServer({ port: 8443 });

var clients = {};
server.on("connection", (ws) => {
	ws.on("message", (message) => {
		message = JSON.parse(message);
		// Проверяем подключение сервиса прослушивания музыки
		if (message.action !== "reg" && !clients[message.player_id]) {
			clients["remote_" + message.player_id]?.send(
				JSON.stringify({
					action: "musicServerNotConnected",
					player_id: message.player_id,
				})
			);
		}

		switch (message.action) {
			case "reg":
				clients[message.player_id] = ws;

				ws.on("close", function () {
					delete clients[message.player_id];
				});
				break;
			case "reg_remote":
				if (clients["remote_" + message.player_id]) {
					clients["remote_" + message.player_id]?.send(
						JSON.stringify({
							action: "moreThanOneConnection",
							player_id: message.player_id,
						})
					);
				}
				clients["remote_" + message.player_id] = ws;

				ws.on("close", function () {
					delete clients["remote_" + message.player_id];
				});
				break;
			case "next":
			case "prev":
			case "togglePause":
			case "shuffle":
			case "repeat":
			case "like":
			case "downVolume":
			case "upVolume":
			case "handleProgressPosition":
			case "getCurrentTrack":
				clients[message.player_id]?.send(JSON.stringify(message));
				break;
			case "currentTrack":
			case "progress":
				clients["remote_" + message.player_id]?.send(JSON.stringify(message));
				break;
			case "getExplicit":
				getExplicit(message);
				break;
		}
	});
});

const getExplicit = async (message) => {
	let url_response = `https://api.music.yandex.net/tracks/${message.track_id}`;
	let response = await fetch(url_response);

	message = {
		action: "explicit",
		explicit: false,
		player_id: message.player_id,
	};
	if (response.ok) {
		let json = await response.json();
		if (
			json.result[0].contentWarning &&
			json.result[0].contentWarning === "explicit"
		) {
			message.explicit = true;
		}
		clients["remote_" + message.player_id]?.send(JSON.stringify(message));
	} else {
		clients["remote_" + message.player_id]?.send(JSON.stringify(message));
	}
};
