import mainStyles from "../../styles/MainMobile.module.css";
import btnsStylesMobile from "../../styles/BtnsMobile.module.css";
import btnsStylesDesktop from "../../styles/BtnsDesktop.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBackwardFast,
	faE,
	faForwardFast,
	faHeart,
	faMinus,
	faPause,
	faPlay,
	faPlus,
	faRotateLeft,
	faShuffle,
} from "@fortawesome/free-solid-svg-icons";
import bebas_neue from "../UI/fonts";
import {
	likeActived,
	noneActived,
	repeat1Actived,
	repeatActived,
	shuffleActived,
} from "@component/constants/colors";
import { CoverImage } from "@component/components/UI/CoverImage";
import { secondsToHms } from "@component/components/Logic/secondsToHms";

const Mobile = ({
	currentTrackInfo,
	progress,
	changeProgress,
	handleNext,
	handlePrev,
	handlePlayPause,
	handleShuffle,
	handleRepeat,
	handleLike,
	downVolume,
	upVolume,
	handleProgressPosition,
	setChangeProgress,
	explicit,
	width,
}) => {
	const devices = new RegExp(
		"Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini",
		"i"
	);
	const btnsStyles = devices.test(navigator.userAgent)
		? btnsStylesMobile
		: btnsStylesDesktop;

	const openLink = (link) => {
		window.open(`https://music.yandex.ru${link}`, "_blank");
	};
	let btns = [];
	width > 230 &&
		(btns.push(
			<>
				<div className={mainStyles.controls__btn}>
					<FontAwesomeIcon
						onClick={handleRepeat}
						icon={faRotateLeft}
						className={`${mainStyles.controls__btn_icons} ${mainStyles.rotate} ${btnsStyles.rotate}`}
						style={{
							fontSize: currentTrackInfo.repeat ? 25 : 20,
							color: currentTrackInfo.repeat
								? currentTrackInfo.repeat === true
									? repeatActived
									: repeat1Actived
								: noneActived,
						}}
					/>
				</div>
				<div className={mainStyles.controls__btn}>
					<FontAwesomeIcon
						role={"button"}
						onClick={handleLike}
						icon={faHeart}
						style={{
							color: currentTrackInfo.liked ? likeActived : noneActived,
						}}
						className={`${mainStyles.controls__btn_icons} ${mainStyles.heart} ${btnsStyles.heart}`}
					/>
				</div>
			</>
		),
		btns.push(
			<div className={mainStyles.controls__btn}>
				<FontAwesomeIcon
					onClick={handleShuffle}
					icon={faShuffle}
					className={`${mainStyles.controls__btn_icons} ${mainStyles.shuffle} ${btnsStyles.shuffle}`}
					style={{
						fontSize: currentTrackInfo.shuffle ? 25 : 20,
						color: currentTrackInfo.shuffle ? shuffleActived : noneActived,
					}}
				/>
			</div>
		));

	return (
		<main className={mainStyles.container}>
			<div
				style={{
					textAlign: "center",
				}}
			>
				<p
					style={{
						fontFamily: bebas_neue.style.fontFamily,
						fontSize: 20,
					}}
				>
					Music Remote Control
				</p>
			</div>
			<div className={mainStyles.main__panel}>
				<div className={mainStyles.info}>
					<CoverImage
						src={"https://" + currentTrackInfo.cover.replace("%%", "m400x400")}
						className={mainStyles.cover}
						style={{
							borderRadius: 40,
							boxShadow: "4px 4px 6px 4px rgba(0, 0, 0, 0.2)",
						}}
					/>
					<div className={mainStyles.text__info}>
						<p>
							<span
								onClick={() => openLink(currentTrackInfo.link)}
								className={`${mainStyles.current__info} ${mainStyles.title} ${btnsStyles.title}`}
							>
								{currentTrackInfo.title}
							</span>
							{explicit && (
								<FontAwesomeIcon
									icon={faE}
									className={`${mainStyles.explicit}`}
								/>
							)}
						</p>
						<p>
							{currentTrackInfo.artists.map((artist, i) => (
								<span
									key={artist.link}
									onClick={() => openLink(artist.link)}
									className={`${mainStyles.current__info} ${mainStyles.authors} ${btnsStyles.authors}`}
								>
									{artist.title}
									{i !== currentTrackInfo.artists.length - 1 && <>,&nbsp;</>}
								</span>
							))}
						</p>
					</div>
				</div>
				<div className={mainStyles.control}>
					<div className={mainStyles.progress__bar}>
						<input
							className={`${mainStyles.range} ${btnsStyles.range}`}
							type="range"
							min="0"
							max={currentTrackInfo.duration}
							step="1"
							value={Math.floor(
								changeProgress === false
									? progress.position
									: changeProgress.position
							)}
							onChange={(e) => {
								setChangeProgress({ position: e.target.value });
							}}
							onTouchEnd={() => {
								handleProgressPosition(changeProgress);
								setChangeProgress(false);
							}}
							onMouseUp={() => {
								handleProgressPosition(changeProgress);
								setChangeProgress(false);
							}}
						/>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<div>
								<FontAwesomeIcon
									onClick={downVolume}
									icon={faMinus}
									className={`${mainStyles.controls__btn_icons} ${mainStyles.volume} ${btnsStyles.volume}`}
								/>
								<FontAwesomeIcon
									onClick={upVolume}
									icon={faPlus}
									className={`${mainStyles.controls__btn_icons} ${mainStyles.volume} ${btnsStyles.volume}`}
								/>
							</div>
							<p
								className={mainStyles.time}
								style={{
									fontFamily: bebas_neue.style.fontFamily,
									fontSize: 16,
								}}
							>
								{secondsToHms(
									Math.floor(
										changeProgress === false
											? progress.position
											: changeProgress.position
									)
								)}{" "}
								/ {secondsToHms(currentTrackInfo.duration)}
							</p>
						</div>
					</div>
					<div className={mainStyles.controls__btn__container}>
						{btns && btns[0]}
						<div className={mainStyles.controls__btn}>
							<FontAwesomeIcon
								onClick={handlePrev}
								icon={faBackwardFast}
								className={`${mainStyles.controls__btn_icons} ${mainStyles.backward} ${btnsStyles.backward}`}
							/>
						</div>
						<div>
							<div className={mainStyles.controls__btn}>
								{currentTrackInfo.playing ? (
									<FontAwesomeIcon
										onClick={handlePlayPause}
										icon={faPause}
										className={`${mainStyles.controls__btn_icons} ${mainStyles.pause} ${btnsStyles.pause}`}
									/>
								) : (
									<FontAwesomeIcon
										onClick={handlePlayPause}
										icon={faPlay}
										className={`${mainStyles.controls__btn_icons} ${mainStyles.play} ${btnsStyles.play}`}
									/>
								)}
							</div>
						</div>
						<div className={mainStyles.controls__btn}>
							<FontAwesomeIcon
								onClick={handleNext}
								icon={faForwardFast}
								className={`${mainStyles.controls__btn_icons} ${mainStyles.forward} ${btnsStyles.forward}`}
							/>
						</div>
						{btns && btns[1]}
					</div>
				</div>
			</div>
		</main>
	);
};
export default Mobile;
