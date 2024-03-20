// Получаем ссылку

const id = window.sessionStorage.getItem("id");
if (id) {
	main(id);
} else {
	(async () => {
		const [tab] = await chrome.tabs.query({
			active: true,
			lastFocusedWindow: true,
		});
		const response = await chrome.tabs.sendMessage(tab.id, { action: "getId" });

		if (response.id) {
			main(response.id);
		}
	})();
}

const main = (id) => {
	link = document.querySelector("a");
	link.href = `https://avradev.ru?player_id=${id}`;

	// Добавляем обработчик события клика
	link.addEventListener("click", function (event) {
		// Отменяем действие по умолчанию (открытие ссылки в текущей вкладке)
		event.preventDefault();
		// Получаем адрес ссылки
		let url = link.href;
		// Открываем новую вкладку с этим адресом
		chrome.tabs.create({ url: url });
	});

	// Создаем элемент img для отображения QR Code
	var img = document.createElement("img");
	// Используем сервис Google Charts для генерации QR Code
	img.src =
		"https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=" + link.href;
	// Добавляем элемент img в контейнер
	var container = document.getElementById("container");
	container.appendChild(img);
};
