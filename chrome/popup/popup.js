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
	// Добавляем элемент img в контейнер
	var container = document.getElementById("container");
	container.href = `https://avradev.ru?player_id=${id}`;

	// Добавляем обработчик события клика
	container.addEventListener("click", function (event) {
		// Отменяем действие по умолчанию (открытие ссылки в текущей вкладке)
		event.preventDefault();
		// Получаем адрес ссылки
		let url = container.href;
		// Открываем новую вкладку с этим адресом
		chrome.tabs.create({ url: url });
	});

	// Создаем элемент img для отображения QR Code
	var img = document.createElement("img");
	// Используем стороннее API для генерации QR Code
	img.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + container.href;

	container.appendChild(img);
};
