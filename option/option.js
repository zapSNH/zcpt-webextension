// do not look inside, you have been warned
// please, you will be scarred for life
// please make sure an emergency line is with you while ya look at this ok?
// p.s. this is NOT EDIBLE spaghetto code

import { setOptions, getOption, setBackground } from "../background.js";

// two letter (or hyphenated) language list
const langList = ["en", "tl"];
let imgPath = "./images/light/";
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	imgPath = "./images/dark/";
}
let locale = browser.i18n.getUILanguage();

document.querySelector("#clear").addEventListener("click", function () {
	document.querySelectorAll(".true:not(button)").forEach((e) => e.classList.remove("true"));
	document.querySelectorAll(".warning").forEach((e) => e.classList.remove("warning"));
});

document.querySelector("#settings").addEventListener("click", function (e) {
	if (e.target.classList.contains("open")) {
		e.target.classList.remove("open")
		document.body.classList.remove("open");
		document.querySelector("#title-text").innerHTML = i18n.getMessage("extensionOptions");
	} else {
		e.target.classList.add("open");
		document.body.classList.add("open");
		document.querySelector("#title-text").innerHTML = i18n.getMessage("extensionSettings");
	}
});

document.querySelector("#reload").addEventListener("click", function () {
	browser.runtime.reload();
});

function toggle() {
	let index = this.index; // potentially useful leftover
	let requires = this.requires;
	let provides = this.provides;
	let negates = this.negates;
	let replaces = this.replaces; // potentially useful leftover

	if (!this.classList.contains("true")) {

		this.classList.add("true");

		if (this.classList.contains("warning")) this.classList.remove("warning");


		if (requires != 0) {
			document.querySelector(".pref:nth-child(" + requires + ")").classList.add("true");
			document.querySelector(".pref:nth-child(" + requires + ")").classList.remove("warning");
		}
		if (negates.length) {
			for (let i = 1; i <= negates.length; i++) {
				document.querySelector(".pref:nth-child(" + negates[i-1] + ")").classList.remove("true");
				document.querySelector(".pref:nth-child(" + negates[i-1] + ")").classList.add("warning");
			}
		}

	} else {
		this.classList.remove("true");

		if (provides.length) {
			for (let i = 1; i <= provides.length; i++) {
				document.querySelector(".pref:nth-child(" + provides[i-1] + ")").classList.remove("true");
			}
		}
	}
	refreshWarnings();
}

function refreshWarnings() {
	for (let e of document.querySelectorAll(".pref")) {
		let hasWarning = false;
		for (let f of document.querySelectorAll(".true:not(button)")) {
			if (f.negates.includes(e.index)) hasWarning = true;
		}
		if (hasWarning) e.classList.add("warning");
		if (!hasWarning) e.classList.remove("warning");
	}
}

async function load() {
	let response;
	if (langList.includes(locale)) {
		response = await fetch("./locale/" + locale + "/prefs.json");
	} else {
		response = await fetch("./locale/en/prefs.json");
	}
	const data = await response.json();

	for (let e of data.prefs) {
		let prefRow = document.createElement("div");
		prefRow.classList.add("pref");
		prefRow.innerHTML = e[0];
		prefRow.index = e[1][0];
		prefRow.requires = e[1][1];
		prefRow.provides = e[1][2];
		prefRow.negates = e[1][3];
		prefRow.replaces = e[1][4];
		prefRow.desc = e[2];
		prefRow.title = e[2];
		prefRow.addEventListener("click", toggle);
		prefRow.addEventListener("mouseover", function () {
			document.querySelector("#img-box").innerHTML = "<img src=\"" + imgPath + this.innerHTML + ".png" + "\">";
			document.querySelector("#desc-name").innerHTML = this.innerHTML;
			document.querySelector("#desc-box").innerHTML = this.desc;
			let incompatibilities = "";
			this.negates.forEach((e) => incompatibilities += document.querySelector(".pref:nth-child(" + e + ")").innerHTML + "<br>");
			if (incompatibilities == "") {
				document.querySelector("#incompat-box div").innerHTML = "N/A";
				document.querySelector("#incompat-box").classList.add("empty");
			} else {
				document.querySelector("#incompat-box div").innerHTML = incompatibilities;
				document.querySelector("#incompat-box").classList.remove("empty");
			}
		});
		await getOption(prefRow.innerHTML).then(val => {
			if (val == true) {
				prefRow.classList.add("true");
			}
		});
		document.querySelector("#pref-list").appendChild(prefRow);
	}

	await getOption("uc.newtab.background").then(val => {
		if (val == true) {
			document.querySelector("#newtab-notice").style = "display: none";
		} else {
			document.querySelector("#newtab-notice").style = "";
		}
	});

	refreshWarnings();

	document.querySelector("#export").addEventListener("click", function () {
		document.querySelectorAll(".pref").forEach(async function (e) {
			if (e.classList.contains("true")) {
				setOptions(e.innerHTML, true);
			} else {
				setOptions(e.innerHTML, false);
			}
			await getOption("uc.newtab.background").then(val => {
				if (val == true) {
					document.querySelector("#newtab-notice").style = "display: none";
				} else {
					document.querySelector("#newtab-notice").style = "";
				}
			});
		});
	});

	await browser.storage.local.get("newtabbackground").then((val) => {
		if (val.newtabbackground) {
			document.querySelector("#preview").src = val.newtabbackground;
			document.querySelector("#preview-container").href = val.newtabbackground;
			document.querySelector("#preview").classList.add("loaded");
		}
	});

	await browser.storage.local.get("newtabbackgroundname").then((val) => {
		if (val.newtabbackgroundname) {
			document.querySelector("#img-name").innerHTML = val.newtabbackgroundname;
		} else {
			document.querySelector("#img-name").innerHTML = i18n.getMessage("no-image-text");
		}
	});
}


// Image Picker
document.querySelector("#imagepicker").addEventListener("change", function () {
	const reader = new FileReader();

	if (document.querySelector("#imagepicker").files[0]) {
		reader.readAsDataURL(document.querySelector("#imagepicker").files[0]);
	}

	reader.addEventListener("load", async () => {
		await browser.storage.local.set({
			newtabbackground: reader.result
		}).then( async () =>
			await browser.storage.local.get("newtabbackground").then((val) => {
				document.querySelector("#preview").src = val.newtabbackground;
				document.querySelector("#preview-container").href = val.newtabbackground;
			})
		);

		await browser.storage.local.set({
			newtabbackgroundname: document.querySelector("#imagepicker").files[0].name
		}).then( async () =>
			await browser.storage.local.get("newtabbackgroundname").then((val) => {
				document.querySelector("#img-name").innerHTML = val.newtabbackgroundname;
			})
		);

		if (!document.querySelector("#preview").classList.contains("loaded")) {
			document.querySelector("#preview").classList.add("loaded");
		}

		await setBackground(reader.result).then(browser.runtime.reload());
	});
});

load();