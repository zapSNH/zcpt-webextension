function startup() {
  loadSheet('chrome/userChrome.css', 'USER_SHEET');
  loadSheet('chrome/userContent.css', 'USER_SHEET');
}
function loadSheet(name, type) {
  if (browser.runtime.getURL(name)) {
    browser.stylesheet.load(browser.runtime.getURL(name), type);
  } else {
    return;
  }
}
function unloadSheet(name, type) {
  browser.stylesheet.unload(browser.runtime.getURL(name), type);
}

export function setOptions(option, name) {
  browser.aboutconfig.setPref(option, name);
}
startup();