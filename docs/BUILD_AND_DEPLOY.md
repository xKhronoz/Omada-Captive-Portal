# Build and deploy

## Requirements and template

- Node.js 20 or later, npm and Python 3 available on PATH.
- The controller template ZIP used with this portal, supplied separately.
- Access to a compatible Omada controller for import and real authentication testing.

There are no npm dependencies to install. You may set `PYTHON` to another Python 3 executable.

The build expects template-root `index.js`, `index.css`, `jquery.min.js` and optional `img/` assets. It extracts only those inputs and rejects absolute or parent-traversal archive paths. The JavaScript adapter checks for expected integration markers and the survey stylesheet boundaries. These checks are not a firmware compatibility guarantee.

Obtain the customised-page template through your controller's portal customisation workflow where available. If its layout or implementation differs, review `scripts/prepare-controller.mjs` against that template before use. Do not substitute an arbitrary download or claim a controller version based solely on a successful build.

## Production build

From the repository root:

```sh
npm run check
npm run build -- --template /absolute/path/demo.zip
```

Output:

| Path | Purpose |
| --- | --- |
| `build/portal/` | Unpacked production portal. |
| `build/guest-portal.zip` | Controller-import archive, with `index.html` at the root. |

The build copies original UI source, creates the adapted controller and survey CSS, copies the supplied jQuery and images, and includes licence/attribution notices. Production `preview.js` is inert: it never simulates successful authentication, including with `?preview=1`.

The output directory must be empty. For another build, use a different output directory or remove only your previous generated output. The ZIP path can be overwritten by a subsequent successful build.

## Build options

| Option | Purpose |
| --- | --- |
| `--template PATH` | Required controller template ZIP. |
| `--output PATH` | Empty output directory; default `build/portal`. |
| `--zip PATH` | ZIP output; default `build/guest-portal.zip`. |
| `--preview` | Include the interactive simulator; demonstrations only. |
| `--brand-config PATH` | JSON configuration overrides. |
| `--brand-assets PATH` | Directory copied to output `assets/`. |

Relative template, output and override paths resolve against the current working directory. Default build paths resolve within this project. Quote paths containing spaces.

## Private branding

Keep operator-specific overrides and images in the ignored `private/` directory:

```sh
mkdir -p private/assets
cp examples/brand.example.json private/brand.json
```

Edit `private/brand.json`. Put images such as `logo.svg` and `icon.ico` in `private/assets/`, then reference them as `assets/logo.svg` and `assets/icon.ico` in the JSON.

```sh
npm run build -- --template /absolute/path/demo.zip --brand-config private/brand.json --brand-assets private/assets --output build/venue --zip build/venue-portal.zip
```

The repository uses generic placeholders. It does not download or embed official vendor marks. Supply authorised assets yourself, retain their provenance and applicable notices, and keep them outside the source history. See `THIRD_PARTY_NOTICES.md`.

## Interactive preview

```sh
npm run build -- --template /absolute/path/demo.zip --preview --output build/preview --zip build/preview.zip
npm run preview -- build/preview
```

Open http://127.0.0.1:5173/. The server binds only to loopback and serves local files without caching. The preview method is stored in sessionStorage. Credentials are not stored. Try a non-empty credential for success or voucher `expired` for rejection. No SMS is sent and no network access is granted.

Keep preview builds separate from production imports. A plain browser opening a production build cannot reach the controller endpoints and should show a connection error rather than simulated success.

## Controller import

1. Configure the guest network and portal authentication in the controller.
2. Select the customised/imported page option and upload the production ZIP. The exact UI labels vary by controller release; look for **Import Customized Page**.
3. Configure the controller's landing-page / post-authorisation destination if redirection is required.
4. Replace the example terms, privacy text and host contact details in `src/index.html`, then rebuild. When changing policy copy, also update its local translations.
5. Test from a guest client attached to the intended network, not only from an ordinary browser on your management network.

This page uses the controller's own authentication endpoints. Hosting it on a general-purpose website does not turn that site into an external portal authentication service.

Vendor import reference: https://support.omadanetworks.com/uk/document/13086/

## Deployment verification

Check each method you enable: valid/invalid credentials, expired vouchers, SMS delivery and code expiry, form submission, controller errors, landing URL, countdown on/off and Continue now. Confirm configured session limits and access policy on the controller. Test iOS and Android captive browsers, desktop browsers, mobile layouts and every enabled language.

Browser preview checks establish UI behaviour only. Real authentication, authorisation and redirects require a controller test.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Unsupported controller template | Confirm the ZIP root layout and expected template implementation; inspect the adapter before changing its markers. |
| Output directory must be empty | Use another `--output` directory or remove the previous generated output. |
| Python executable not found | Install Python 3 or set `PYTHON` to its executable. |
| Controller connection error in a normal browser | Expected for production outside controller context; use a preview build for UI demonstrations. |
| Real guest client cannot connect | Check guest network attachment, controller/gateway compatibility, portal configuration and authentication settings. |
| Logo falls back | Check the relative path, copied `assets/` contents and filename case. |
| Network badge differs from fallback | A supplied `ssidName` takes precedence; this is intentional. |
| Countdown does not redirect | Confirm successful controller authentication and a valid HTTP(S) landing URL. Preview never redirects. |
| Language selector is hidden | Enable more than one supported language. |
| Old styles appear | Rebuild and re-import the ZIP; reload the captive browser so its local asset cache refreshes. |
