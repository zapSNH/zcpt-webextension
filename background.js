async function startup() {
  if (!('aboutconfig' in browser && 'stylesheet' in browser)) {
    browser.tabs.create({url: browser.runtime.getURL('apierror.html')});
  }

  loadSheet('chrome/userChrome.css', 'USER_SHEET');
  loadSheet('custom/custom.css', 'USER_SHEET');

  await loadSheet('chrome/userContent.css', 'USER_SHEET')
  .then(() => {
    return browser.aboutconfig.getPref("uc.newtab.background");
  }).then((background) => {
    if (background == true) {
      loadBackground();
    }
  }).catch((error) => {
    console.log(error);
  })
}

async function loadSheet(name, type) {
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

export async function setBackground(value) {
  await browser.storage.local.set({
    newtabbackground: value
  });
}

async function loadBackground() {
  await browser.storage.local.get("newtabbackground").then((val) => {
    if (val.newtabbackground) {
      let dataString = '@-moz-document url("about:newtab"), url("about:home"){ @media (-moz-bool-pref: "uc.newtab.background") { body { background-image: url(' + val.newtabbackground + ') !important;}}}';
      loadSheet('data:text/css;charset=UTF-8,' + encodeURIComponent(dataString), 'USER_SHEET');
    }
  });
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