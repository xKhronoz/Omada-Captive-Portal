# Configuration reference

Edit `src/portal-config.js` before building. A compiled portal also contains `portal-config.js`, which may be edited before rezipping. Keep `index.html` at the ZIP root.

JSON overrides passed with `--brand-config` are merged over these defaults during the build. JSON uses quoted keys and does not support comments. See `examples/brand.example.json`.

## Header, network badge and footer

| Key | Default | Behaviour |
| --- | --- | --- |
| `showBrandLogo` | `true` | Show the header logo independently of the name. |
| `showBrandName` | `true` | Show the header name independently of the logo. |
| `showHeaderSubtitle` | `true` | Show the subtitle when its text is non-empty. |
| `headerText` | `"Your Brand"` | Header name. Blank or invalid values fall back to the default. |
| `headerSubtitle` | `"Guest Wi-Fi"` | Header subtitle. An empty string hides it. |
| `pageTitle` | `""` | Browser tab title. Blank uses Welcome · followed by the configured header name and subtitle, regardless of their visibility toggles. |
| `connectionName` | `"Guest Wi-Fi"` | Network badge fallback; the controller-supplied `ssidName` takes precedence. |
| `logoImage` | `""` | Header image. Blank uses the neutral Wi-Fi mark. |
| `connectionIconImage` | `""` | Image in the connection card. Blank uses the Wi-Fi icon. |
| `faviconImage` | `"mark.svg"` | Browser tab icon. |
| `footerText` | `"Your Brand"` | Name beside the powered-by text. |
| `footerLogoImage` | `""` | Optional footer image in place of the footer name. |

The mobile header stays on one row. The branding link fits its visible logo and text; unused header space is not clickable. The header contains only branding and language selection. Language selection uses a compact globe button at every screen size. The menu lists full language names and marks the current selection. Long brand names and subtitles truncate only when needed; accessible names retain their full text.

### Browser tab title

`showBrandName`, `showBrandLogo` and `showHeaderSubtitle` affect only the page header. They never change the browser tab title. Set `pageTitle` to a fixed title, for example `"My Venue · Guest Wi-Fi"`, to also keep it independent of changes to the configured branding text.

### Divider visibility

The divider appears only when the subtitle is visible and either the logo or name is visible.

| Logo | Name | Subtitle | Divider |
| --- | --- | --- | --- |
| Visible | Visible | Visible | Visible |
| Visible | Hidden | Visible | Visible |
| Hidden | Visible | Visible | Visible |
| Hidden | Hidden | Visible | Hidden |
| Either | Either | Hidden | Hidden |

For a minimal Guest Wi-Fi header:

```js
showBrandLogo: false,
showBrandName: false,
showHeaderSubtitle: true,
headerSubtitle: "Guest Wi-Fi"
```

The language selector and help control remain available. For compatibility, the legacy `showHeaderBranding: false` hides both logo and name. Use `showHeaderSubtitle: false` as well if the entire header brand group should be hidden. Footer attribution has separate settings.

### Image files

Use bundled relative paths such as `assets/logo.svg`, or supported image data URLs. Relative PNG, JPEG, WebP, GIF, SVG and ICO files may be used where supported by the browser. Data URLs support PNG, JPEG, GIF, WebP and SVG. Remote URLs and absolute paths are ignored, so the page does not depend on internet access before sign-in.

With `--brand-assets private/assets`, the contents of that directory are copied to `assets/` in the output. Missing header, card and footer images fall back to the built-in image or footer name. Choose a favicon file that exists; favicons do not have the same image-load fallback handler. Use transparent or padded artwork that fits the existing header and card dimensions.

Changing `connectionName` changes the displayed fallback name; it does not configure or rename a Wi-Fi SSID. For a preview example, append `?ssidName=My%20Guest%20Network` to the URL.

## Languages

| Key | Default | Behaviour |
| --- | --- | --- |
| `languages` | `["en", "zh", "ms", "ta"]` | Enabled display languages. Unsupported and duplicate codes are filtered out. An empty valid set falls back to English. |
| `defaultLanguage` | `"en"` | Fallback language; must be enabled, otherwise the first enabled language is used. |
| `detectBrowserLanguage` | `true` | Match a supported browser language on the first visit. A valid saved guest choice takes precedence. |

Codes: English `en`, Simplified Chinese `zh`, Bahasa Melayu `ms`, Tamil `ta`. A single enabled language hides the selector. A guest selects one display language at a time.

Only the language code is stored in localStorage. Switching preserves entered credentials, accepted terms and sign-in method. UI labels, feedback, help, example policies and countdown labels are translated locally. Operator branding, SSID, guest input and controller-authored survey questions remain unchanged.

To add a language, extend the names, column mapping and all translated entries in `src/languages.js`, then enable its code in the configuration. Review the entire sign-in flow and policy dialogs with a fluent speaker.

## Show Redirection Countdown After Authorization

| Key | Default | Behaviour |
| --- | --- | --- |
| `showRedirectionCountdownAfterAuthorization` | `true` | Show the success countdown and Continue now before following the landing URL. |
| `redirectionCountdownSeconds` | `5` | Whole seconds from 0 to 60. Invalid values fall back to 5; 0 redirects immediately. |

Set the flag to `false` for immediate redirection. The destination must come from the controller and use HTTP or HTTPS; this configuration does not set the destination. Without a valid landing URL, the production success screen remains open. The preview demonstrates the countdown but never navigates away.

These are page configuration options; they do not automatically synchronise with a similarly named checkbox in the controller UI. Configure the destination and authentication policy in your controller and validate both together.
