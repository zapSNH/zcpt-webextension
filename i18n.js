// Internationalization

let i18n = browser.i18n;

document.querySelectorAll(".i18n-target").forEach(function (e) {
	let message = i18n.getMessage(e.id);
	if (message) {
		e.innerHTML = message;
	}
});

document.querySelectorAll(".i18n-target-title").forEach(function (e) {
	let message = i18n.getMessage(e.id);
	if (message) {
		e.title = message;
	}
});