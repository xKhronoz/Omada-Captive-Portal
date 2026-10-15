# Customisable Omada Captive Portal

A modern, responsive guest Wi-Fi portal designed to be imported into an Omada controller. Configure the branding, connection name, languages and post-authorisation countdown without changing the interface code.

The repository uses neutral **Your Brand** placeholders. Official vendor logos and the controller template are supplied separately; see [Attribution and third-party material](THIRD_PARTY_NOTICES.md).

## Features

- Independent header logo and name visibility; keep Guest Wi-Fi visible without a divider when both are hidden.
- Custom header text, logo, connection icon, favicon, independent browser tab title and powered-by attribution.
- Compact globe language button and one-row mobile header; long branding text truncates only when needed.
- Network badge uses the controller-provided SSID, with a configurable fallback.
- English, Simplified Chinese, Bahasa Melayu and Tamil; enable several languages and let guests switch without losing their entered details.
- Styled language and preview menus with keyboard navigation and consistent arrow spacing.
- Optional redirection countdown after successful authorisation, plus **Continue now**.
- Local assets, system fonts and no CDN requests.
- Interactive preview with simulated sign-in; production builds remove the simulator.

## Quick start

Requirements: **Node.js 20+**, **Python 3**, and a compatible controller template ZIP obtained from your controller. There are no npm packages to install.

```sh
git clone https://github.com/xKhronoz/omada-captive-portal.git
cd omada-captive-portal
npm run check
npm run build -- --template /absolute/path/demo.zip
```

Import **`build/guest-portal.zip`** using the controller's **Import Customized Page** option. Configure authentication and the landing-page destination in the controller. The archive has `index.html` at its root.

This is a controller-imported page. The preview URL is a demonstration, not an external authentication server.

## Customise

Edit [`src/portal-config.js`](src/portal-config.js) before building. For example:

```js
showBrandLogo: false,
showBrandName: false,
headerSubtitle: "Guest Wi-Fi",
connectionName: "My Guest Network",
languages: ["en", "zh"],
showRedirectionCountdownAfterAuthorization: true,
redirectionCountdownSeconds: 5
```

These are properties inside the existing `window.PORTAL_CONFIG` object. The connection name is a fallback: a controller-supplied `ssidName` takes precedence.

For operator-specific overrides, copy [`examples/brand.example.json`](examples/brand.example.json) to the ignored `private/` directory and use `--brand-config`. Keep private images there and bundle them with `--brand-assets`.

## Interactive preview

```sh
npm run build -- --template /absolute/path/demo.zip --preview --output build/preview --zip build/preview.zip
npm run preview -- build/preview
```

Open **http://127.0.0.1:5173/**. The portal-type dropdown switches between the demonstration methods. Use any non-empty credentials, or voucher code `expired` to see a rejection. The preview grants no network access.

Production builds omit the simulator. Test the resulting import on your controller before making it available to guests.

## Documentation

| Guide | Contents |
| --- | --- |
| [Build and deploy](docs/BUILD_AND_DEPLOY.md) | Template requirements, build options, private branding, import, verification and troubleshooting. |
| [Configuration](docs/CONFIGURATION.md) | Every configuration key, defaults, independent visibility, images, languages and countdown behaviour. |
| [Controller integration](docs/CONTROLLER_INTEGRATION.md) | Runtime flow, endpoints, authentication methods, compatibility limits and source layout. |
| [Contributing](CONTRIBUTING.md) | Development workflow, checks, translation changes and what belongs in Git. |

## Compatibility and validation

The adapter targets the operator-supplied template used during development. It does not certify every Omada controller or firmware version. The build checks expected template markers; a different template may need an adapter update.

Local syntax checks, packaging checks and browser preview flows have been exercised. Real authentication, SMS delivery, network access, survey submission and landing-page redirects must be validated on the target controller. Replace the example Terms of Use, Privacy Notice and host contact details before deployment.

## Licence and attribution

Original interface code, translations, neutral artwork and build tooling are covered by the [MIT licence](LICENSE). Vendor templates, their jQuery build, survey assets and official brand assets are excluded from this repository and are not covered by that licence.

Omada and TP-Link marks belong to their respective owners. This project is independent and does not imply vendor endorsement. Read [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) before distributing a compiled bundle.
