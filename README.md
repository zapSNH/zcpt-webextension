A webextension version of [zapsCoolPhotonTheme](https://github.com/zapsnh/zapsCoolPhotonTheme). Loosely based on Paxmod.

Requirements:
- Firefox Developer Edition, Nightly, or ESR.
- `extensions.experiments.enabled` set to `true`
- `xpinstall.signatures.required` set to `false` [(why?)](https://github.com/numirias/paxmod#why-cant-i-install-paxmod-as-a-verified-extension-through-mozilla)

### The releases page had v0.XX.Y but I got v0.XX.Y.1. What's up with that?
This is just a simple way of differentiating the ESR versions and the Nightly/Dev versions.

ex.
- `v0.18.2` - Firefox ESR
- `v0.18.2.1` - Firefox Developer and Nightly

### Why are there so many updates??
This version acts like the rolling release, (almost) every commit that gets pushed to the [main repo](https://github.com/zapsnh/zapsCoolPhotonTheme) is also another new version of the extension.

To prevent the theme from flickering randomly (due to updates), v0.23.0 and later won't update mid-session and will only update on launch of the browser.
<!-- If you're worried that your Firefox will flash every time the extension updates multiple times a day (which it won't since firefox only checks for updates once a day), then you can disable auto updating in the addon settings. -->

### Misc.
The Fira Code, Fira Sans, and Zilla Slab fonts are all under the license linked below:
https://github.com/zapSNH/zcpt-webextension/blob/main/option/fonts/OFL.txt
