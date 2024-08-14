import { setOption, getOption, setBackground } from "../background.js";

// versioning
document.querySelector("#version").textContent = "v" + browser.runtime.getManifest().version;

// two letter (or hyphenated) language list
const LANG_LIST = ["en", "tl"];
const ESR_VERSION = "115";

let imgPath = "./images/light/";
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	imgPath = "./images/dark/";
	document.querySelector(".favicon").href = "./images/icon-dark.svg";
}

let locale = browser.i18n.getUILanguage();
let optionValues;

// buttons
document.querySelector("#export").addEventListener("click", async function () {
	document.querySelectorAll(".pref").forEach(async function (e) {
		if (e.classList.contains("true")) {
			setOption(e.innerHTML, true);
		} else {
			setOption(e.innerHTML, false);
		}
		await getOption("uc.newtab.background").then(val => {
			if (val == true) {
				document.querySelector("#newtab-notice").style = "display: none";
				browser.runtime.reload()
			} else {
				document.querySelector("#newtab-notice").style = "";
			}
		});
	})
	
	await browser.runtime.getBrowserInfo().then((info) => {
		if (info.version.includes(ESR_VERSION)) {
			browser.runtime.reload();
		}
	});
});

document.querySelector("#clear").addEventListener("click", function () {
	if (confirm(i18n.getMessage("clear-prefs"))) {
		document.querySelectorAll(".true:not(button)").forEach((e) => e.classList.remove("true"));
		document.querySelectorAll(".warning").forEach((e) => e.classList.remove("warning"));
	}
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

document.querySelector("#apply-css-button").addEventListener("click", async function () {
	await browser.storage.local.set({
		customcss: document.querySelector("#css-textarea").value,
		customcsstext: document.querySelector("#css-textarea").value
	});
	browser.runtime.reload();
});

document.querySelector("#test-css-button").addEventListener("click", async function () {
	await browser.storage.local.set({
		customcsstemp: document.querySelector("#css-textarea").value,
		customcsstext: document.querySelector("#css-textarea").value
	});
	browser.runtime.reload();
});

document.querySelector("#css-textarea").addEventListener("keydown", async function (e) {
	let elem = e.target;

	switch (e.keyCode) {
		// auto tab
		// https://www.eddymens.com/blog/how-to-allow-the-use-of-tabs-in-a-textarea
		case 9:
			elem.setRangeText(
				'\t',
				elem.selectionStart,
				elem.selectionStart,
				'end'
			);
			e.preventDefault();
			break;
		case 222: // auto-close quotes
			elem.setRangeText(
				e.key,
				elem.selectionStart,
				elem.selectionEnd
			);
			break;
		case 219: // auto-close brackets
		case 57:
			let closingChar = "";
			if (e.key === "9") break;
			if (e.key === "{") closingChar = "}";
			if (e.key === "[") closingChar = "]";
			if (e.key === "(") closingChar = ")";
			elem.setRangeText(
				closingChar,
				elem.selectionStart,
				elem.selectionEnd
			);
			break;
		case 83: // prevents ctrl+s from saving the entire page
			if (e.ctrlKey) {
				e.preventDefault();
			}
		default:
	}

	// unsaved notice
	await browser.storage.local.get("customcsstext").then((val) => {
		if (document.querySelector("#css-textarea").value != val.customcsstext) {
			document.querySelector("#css-unsaved").classList.add("unsaved");
		} else {
			document.querySelector("#css-unsaved").classList.remove("unsaved");
		}
	});
});

document.querySelector('#browser-fork-dropdown').addEventListener("change", async function () {
	let value = document.querySelector('#browser-fork-dropdown').value;
	
	optionValues.forEach(async (e) => {
		if (e != "firefox" && e != value) {
			setOption("uc." + e, false);
		}
	});
	if (value != "firefox") {
		setOption("uc." + value, true);
	}
	await browser.runtime.getBrowserInfo().then((info) => {
		if (info.version.includes(ESR_VERSION)) {
			browser.runtime.reload();
		}
	});
});

// https://stackoverflow.com/a/43321596
document.addEventListener('mousedown', function(event) {
	if (event.detail > 1) {
		event.preventDefault();
	}
}, false);
// toggle pref
function toggle() {
	let requires = this.requires; // what this pref requires (activates required prefs on toggle) (the required prefs should also mark this pref as its provider)
	let provides = this.provides; // what this pref provides (when this pref gets toggled off, also disable its providees)
	let negates = this.negates;   // what this pref negates  (disables incompatible prefs on toggle)

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

// dims prefs that are incompatible with the current preferences
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

// load on start
async function load() {
	let response;
	if (LANG_LIST.includes(locale)) {
		response = await fetch("./locale/" + locale + "/prefs.json");
	} else {
		response = await fetch("./locale/en/prefs.json");
	}
	const data = await response.json();

	// create rows for prefs
	for (let e of data.prefs) {
		let prefRow = document.createElement("div");
		prefRow.classList.add("pref");

		prefRow.innerHTML = e[0];

		prefRow.index = e[1][0]; // unused
		prefRow.requires = e[1][1];
		prefRow.provides = e[1][2];
		prefRow.negates = e[1][3];
		prefRow.replaces = e[1][4]; // unused

		prefRow.desc = e[2];
		prefRow.title = e[2];

		prefRow.addEventListener("click", toggle);

		// display info on hover
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

	refreshWarnings();

	// browser forks dropdown
	// https://stackoverflow.com/questions/18113495/how-can-i-get-a-list-of-all-values-in-select-box
	let selectElement = document.querySelector('#browser-fork-dropdown');
	optionValues = [...selectElement.options].map(o => o.value);
	
	optionValues.forEach(async (e) => {
		if (e != "firefox") {
			await getOption("uc." + e).then((val) => {
				if (val == undefined) {
					setOption("uc." + e, false);
				} else if (val == true) {
					selectElement.value = e;
				}
			});
		}
	});

	// new tab background notice
	await getOption("uc.newtab.background").then(val => {
		if (val == true) {
			document.querySelector("#newtab-notice").style = "display: none";
		} else {
			document.querySelector("#newtab-notice").style = "";
		}
	});

	// new tab background image 
	await browser.storage.local.get("newtabbackground").then((val) => {
		if (val.newtabbackground) {
			document.querySelector("#preview").src = val.newtabbackground;
			document.querySelector("#preview-container").href = val.newtabbackground;
			document.querySelector("#preview").classList.add("loaded");
		}
	});

	// new tab background image name 
	await browser.storage.local.get("newtabbackgroundname").then((val) => {
		if (val.newtabbackgroundname) {
			document.querySelector("#img-name").innerHTML = val.newtabbackgroundname;
		} else {
			document.querySelector("#img-name").innerHTML = i18n.getMessage("no-image-text");
		}
	});

	// custom css
	await browser.storage.local.get("customcsstext").then((val) => {
		if (val.customcsstext) {
			document.querySelector("#css-textarea").value = val.customcsstext;
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