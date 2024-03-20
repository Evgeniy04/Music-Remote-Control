export const secondsToHms = (d) => {
	d = Number(d); // преобразовать аргумент в число
	let h = Math.floor(d / 3600); // получить целое число часов
	let m = Math.floor((d % 3600) / 60); // получить целое число минут
	let s = Math.floor((d % 3600) % 60); // получить целое число секунд
	// форматировать вывод в виде строки HH:MM:SS
	let hDisplay = h > 0 ? h + ":" : "";
	let mDisplay = m > 0 ? (m < 10 ? "0" : "") + m + ":" : "00:";
	let sDisplay = s > 0 ? (s < 10 ? "0" : "") + s : "00";
	return hDisplay + mDisplay + sDisplay;
};
