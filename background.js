function startup() {
  loadSheet('chrome/userChrome.css', 'USER_SHEET');
  loadSheet('chrome/userContent.css', 'USER_SHEET');
  loadSheet('custom/custom.css', 'USER_SHEET');
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
export function getOption(option) {
  return browser.aboutconfig.getPref(option);
}

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason == "install") {
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
  }
});
browser.runtime.onStartup.addListener(startup);

startup();