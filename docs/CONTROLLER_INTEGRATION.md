# Controller integration

## Runtime flow

1. Load bundled HTML, styles, icons, configuration, dropdown component and translations.
2. In a preview build without real client context, simulate the controller responses. Production builds have no simulator.
3. Request portal settings from the controller. Display the authentication method or enabled hotspot choices it returns.
4. Validate required fields and policy consent before submitting through the adapted template transport.
5. On successful controller authentication, show the success screen. Optionally count down, then follow a valid HTTP(S) landing URL; Continue now skips the delay.

The controller and gateway decide network access, session duration, quotas and isolation. This interface changes presentation and submission feedback; it is not a standalone authentication backend.

## Template contracts

| Endpoint | Purpose |
| --- | --- |
| `/portal/getPortalPageSetting` | Retrieve authentication and portal settings. |
| `/portal/auth` | Standard authentication submission. |
| `/portal/radius/auth` | RADIUS account authentication. |
| `/portal/ldap/auth` | LDAP authentication. |
| `/portal/sendSmsAuthCode` | Request an SMS verification code. |

The template carries client MAC, AP/gateway context, SSID, radio, VLAN and redirect parameters. Preserve these payloads when updating the integration. Do not replace them with invented controller API contracts.

The interface recognises No Authentication, Simple Password, Hotspot voucher/local user/SMS, RADIUS, LDAP and form authentication from the supplied template. Availability depends on controller settings and template compatibility. These paths have not been certified across all controller or gateway versions.

The adapter replaces transport and feedback handling, removes the template's password-widget behaviour in favour of the interface controls, restores the normal submit URL when methods change, and routes authorisation success to `portalAuthorized`. Survey styling and vendor survey resources come from the supplied template.

## Source layout

| File / directory | Responsibility |
| --- | --- |
| `src/index.html` | Layout, fields, neutral artwork, example policies and script loading order. |
| `src/portal-config.js` | Operator configuration defaults. |
| `src/portal.js` | Branding, connection badge, validation, dialogs, success and countdown. |
| `src/dropdown.js` | Shared accessible listbox interactions. |
| `src/languages.js` | Bundled translations, language preference and dynamic text updates. |
| `src/portal.css` | Responsive layout, typography, controls and menu stacking. |
| `src/preview.js` | Demonstration-only simulated responses. |
| `src/mark.svg` | Neutral favicon. |
| `scripts/build.mjs` | Template extraction, adaptation, optional private branding and ZIP packaging. |
| `scripts/prepare-controller.mjs` | Template-specific controller and survey CSS adapter. |
| `scripts/controller-transport.txt` | Original transport replacement and UI completion/error hooks. |
| `scripts/preview.mjs` | Loopback static preview server. |

`controller.js`, `survey.css`, `jquery.min.js` and vendor `img/` files exist only in generated builds. `build/`, `dist/`, `private/` and ZIP archives are ignored. The source history excludes the vendor template, official assets, network credentials and hosted-preview deployment metadata.

## Privacy and boundaries

The browser stores the selected language in localStorage and the demonstration method in sessionStorage. It does not store passwords or access codes. The network operator controls controller logging, retention and guest policy. Replace example notices with operator-approved text.

Custom image paths must be local relative resources or supported image data URLs. Branding and SSID use text rather than HTML insertion. Redirects accept HTTP and HTTPS. These measures do not replace controller access control or a deployment security review.

## Template updates

Keep a private copy of the original template. Compare changed endpoints, payloads, authentication branches, survey markup and redirect behaviour before updating the adapter. A successful marker match or JavaScript syntax check does not establish behavioural compatibility. Re-run preview checks and the controller verification list in [Build and deploy](BUILD_AND_DEPLOY.md).
