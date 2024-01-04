A webextension version of [zapsCoolPhotonTheme](https://github.com/zapsnh/zapsCoolPhotonTheme). Based on Paxmod.

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

If you're worried that your Firefox will flash every time the extension updates multiple times a day (which it won't since firefox only checks for updates once a day), then you can disable auto updating in the addon settings.
