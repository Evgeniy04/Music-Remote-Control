import { useEffect, useState } from "react";
import Head from "next/head";
import Desktop from "../components/screens/desktop";
import Mobile from "../components/screens/mobile";
import mainStyles from "../styles/Main.module.css";
import { url_socket } from "@component/constants/socket";

export async function getServerSideProps(context) {
	if (context.query.player_id) {
		const player_id = context.query.player_id;
		return {
			props: { player_id },
		};
	}
	return { notFound: true };
}
let socket;
export default function Home({ player_id }) {
	const [currentTrackInfo, setCurrentTrackInfo] = useState(false);
	const [changeProgress, setChangeProgress] = useState(false);
	const [progress, setProgress] = useState(false);
	const [explicit, setExplicit] = useState(false);
	const [windowSize, setWindowSize] = useState({
		width: undefined,
		height: undefined,
	});

	const onopen = () => {
		if (socket.readyState === WebSocket.OPEN) {
			// Регистрируем клиента как удаленный контроллер
			socket.send(
				JSON.stringify({
					action: "reg_remote",
					player_id: player_id,
				})
			);
			socket.send(
				JSON.stringify({
					action: "getCurrentTrack",
					player_id: player_id,
				})
			);
		}
	};
	const onmessage = (message) => {
		let data = JSON.parse(message.data);
		switch (data.action) {
			case "explicit":
				setExplicit(data.explicit);
				break;
			case "currentTrack":
				setCurrentTrackInfo(data.data);
				setProgress(data.data.progress);

				let track_id = data.data.link.split("/").pop();
				socket.send(
					JSON.stringify({
						action: "getExplicit",
						player_id: player_id,
						track_id: track_id,
					})
				);
				break;
			case "progress":
				setProgress(data.progress);
				break;
			case "musicServerNotConnected":
				setCurrentTrackInfo({ error: "musicServerNotConnected" });
				break;
			case "moreThanOneConnection":
				setCurrentTrackInfo({ error: "moreThanOneConnection" });
				break;
		}
	};
	const onerror = (event) => {
		console.log("WebSocket error:", event);
		socket = new WebSocket(url_socket);
		socket.onopen = onopen;
		socket.onmessage = onmessage;
		socket.onerror = onerror;
		socket.onclose = onclose;
	};
	const onclose = () => {
		socket = new WebSocket(url_socket);
		socket.onopen = onopen;
		socket.onmessage = onmessage;
		socket.onerror = onerror;
		socket.onclose = onclose;
	};

	useEffect(() => {
		socket = new WebSocket(url_socket);
		socket.onopen = onopen;
		socket.onmessage = onmessage;
		socket.onerror = onerror;
		socket.onclose = onclose;
	}, [player_id]);

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleNext = () => {
		socket.send(
			JSON.stringify({
				action: "next",
				player_id: player_id,
			})
		);
	};

	const handlePrev = () => {
		socket.send(
			JSON.stringify({
				action: "prev",
				player_id: player_id,
			})
		);
	};

	const handlePlayPause = () => {
		socket.send(
			JSON.stringify({
				action: "togglePause",
				player_id: player_id,
			})
		);
	};

	const handleShuffle = () => {
		socket.send(
			JSON.stringify({
				action: "shuffle",
				player_id: player_id,
			})
		);
	};

	const handleRepeat = () => {
		socket.send(
			JSON.stringify({
				action: "repeat",
				player_id: player_id,
			})
		);
	};

	const handleLike = () => {
		socket.send(
			JSON.stringify({
				action: "like",
				player_id: player_id,
			})
		);
	};

	const downVolume = () => {
		socket.send(
			JSON.stringify({
				action: "downVolume",
				player_id: player_id,
			})
		);
	};
	const upVolume = () => {
		socket.send(
			JSON.stringify({
				action: "upVolume",
				player_id: player_id,
			})
		);
	};

	function handleProgressPosition(changeProgress) {
		setProgress({ position: changeProgress.position });
		socket.send(
			JSON.stringify({
				action: "handleProgressPosition",
				player_id: player_id,
				position: changeProgress.position,
			})
		);
	}

	if (!currentTrackInfo) {
		return (
			<>
				<Head>
					<title>Remote Music Control [Loading...]</title>
					<meta name="description" content="Control Panel" />
				</Head>
				<div className={mainStyles.lds__roller}>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</>
		);
	}

	switch (currentTrackInfo?.error) {
		case "musicServerNotConnected":
			return (
				<>
					<Head>
						<title>Remote Music Control [Error]</title>
						<meta name="description" content="Error" />
					</Head>
					<div className={mainStyles.message_error}>
						<p>Ошибка соединения с сервисом источника музыки.</p>
					</div>
				</>
			);
		case "moreThanOneConnection":
			return (
				<>
					<Head>
						<title>Remote Music Control [Error]</title>
						<meta name="description" content="Error" />
					</Head>
					<div className={mainStyles.message_error}>
						<p>
							Этот плеер был закрыт, так как вы открыли другой. Если у вас
							открыты несколько плееров, они будут работать некорректно.
						</p>
					</div>
				</>
			);
	}

	return (
		<div>
			<Head>
				<title>Remote Music Control</title>
				<meta name="description" content="Control Panel" />
			</Head>
			{windowSize.width <= 1500 ? (
				<Mobile
					currentTrackInfo={currentTrackInfo}
					progress={progress}
					changeProgress={changeProgress}
					handleNext={handleNext}
					handlePrev={handlePrev}
					handlePlayPause={handlePlayPause}
					handleShuffle={handleShuffle}
					handleRepeat={handleRepeat}
					handleLike={handleLike}
					downVolume={downVolume}
					upVolume={upVolume}
					handleProgressPosition={handleProgressPosition}
					setChangeProgress={setChangeProgress}
					explicit={explicit}
					width={windowSize.width}
				/>
			) : (
				<Desktop
					currentTrackInfo={currentTrackInfo}
					progress={progress}
					changeProgress={changeProgress}
					handleNext={handleNext}
					handlePrev={handlePrev}
					handlePlayPause={handlePlayPause}
					handleShuffle={handleShuffle}
					handleRepeat={handleRepeat}
					handleLike={handleLike}
					downVolume={downVolume}
					upVolume={upVolume}
					handleProgressPosition={handleProgressPosition}
					setChangeProgress={setChangeProgress}
					explicit={explicit}
				/>
			)}
		</div>
	);
}
