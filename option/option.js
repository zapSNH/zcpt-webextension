// do not look inside, you have been warned
// please, you will be scarred for life
// please make sure an emergency line is with you while ya look at this ok?
// p.s. this is NOT EDIBLE spaghetto code
// TODO: fix the pref logic
import { setOptions } from "../background.js";
let imgPath = "./images/light/";
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	imgPath = "./images/dark/";
}

document.querySelector("#clear").addEventListener("click", function () {
	document.querySelectorAll(".true:not(button)").forEach((e) => e.classList.remove("true"));
	document.querySelectorAll(".warning").forEach((e) => e.classList.remove("warning"));
});

function toggle() {
	let index = this.index; // potentially useful leftover
	let requires = this.requires;
	let provides = this.provides;
	let negates = this.negates;
	let replaces = this.replaces; // potentially useful leftover
	console.log(negates);

	//broken idk why
	if (!this.classList.contains("true")) {

		this.classList.add("true");

		if (this.classList.contains("warning")) this.classList.remove("warning");

		if (requires != 0) {
			document.querySelector(".pref:nth-child(" + requires + ")").classList.add("true");
			document.querySelector(".pref:nth-child(" + requires + ")").classList.remove("warning");
		}
		if (negates.length) {
			for (let i = 1; i <= provides.length; i++) {
				document.querySelector(".pref:nth-child(" + negates[i-1] + ")").classList.remove("true");

				refreshWarnings();
				document.querySelector(".pref:nth-child(" + negates[i-1] + ")").classList.add("warning");
			}
		}

		document.querySelector("#left").prepend(imgContainer);

	} else {
		this.classList.remove("true");

		if (provides.length) {
			for (let i = 1; i <= provides.length; i++) {
				document.querySelector(".pref:nth-child(" + provides[i-1] + ")").classList.remove("true");
				refreshWarnings();
			}
		}
		
		if (negates.length) refreshWarnings();

	}
}

function refreshWarnings() {
	// instead of doing this why not make this also handle the creation of warnings
	for (let e of document.querySelectorAll(".warning")) {
		let canBeRemoved = true;
		for (let f of document.querySelectorAll(".true:not(button)")) {
			if (e.negates.includes(f.index)) canBeRemoved = false;
		}
		if (canBeRemoved) e.classList.remove("warning");
	}
}

async function load() {
	const response = await fetch("prefs.json");
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
		if (localStorage.getItem(prefRow.innerHTML) == "true") {
			prefRow.classList.add("true");
		}
		document.querySelector("#pref-list").appendChild(prefRow);
	}
	document.querySelector("#export").addEventListener("click", function () {
		document.querySelectorAll(".pref").forEach(function (e) {
			if (e.classList.contains("true")) {
				setOptions(e.innerHTML, true);
				localStorage.setItem(e.innerHTML, true);
			} else {
				setOptions(e.innerHTML, false);
				localStorage.setItem(e.innerHTML, false);
			}
		});
	});
}
load();