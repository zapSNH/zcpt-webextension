function startup() {
  loadSheet('chrome/userChrome.css', 'USER_SHEET');
  loadSheet('chrome/userContent.css', 'USER_SHEET');

  if (!localStorage.getItem("initialized")) {

    fetch("defaultPrefs.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (let pref of data.defaultPrefs) {
        let prefName = pref.match(/(?<=user_pref\(\").*(?=\")/g);
        let prefVal = pref.match(/(?<=\", ).*?(?=\))/g);
        browser.aboutconfig.setPref(prefName[0], (prefVal[0] == "true") ? true : false);
      }
    })
    .catch((error) => {
      console.log(error);
    });

    localStorage.setItem("initialized", "true");
  }
}
function loadSheet(name, type) {
  if (browser.runtime.getURL(name)) {
    browser.stylesheet.load(browser.runtime.getURL(name), type);
  } else {
    return;
  }
}
export function setOptions(option, name) {
  browser.aboutconfig.setPref(option, name);
}
startup();