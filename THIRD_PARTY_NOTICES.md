# Attribution and third-party material

## Original project files

The interface, local translations, neutral Wi-Fi placeholder icon, signal
illustration and build tooling are original project material covered by LICENSE.
The placeholder is not an official vendor logo. System fonts are used; no font
files or third-party icon library are distributed in the source package.

## Controller template (supplied separately)

The build consumes the controller's `demo.zip`, supplied by the operator. The
template's authentication implementation and survey resources originate from
TP-Link / Omada. `scripts/prepare-controller.mjs` adapts that template's transport,
feedback, controls and redirect handling to this UI while retaining its endpoint
and payload contracts. The template, adapted controller code, jQuery and vendor
survey images are **not included in the GitHub source archive**.

No standalone redistribution license was supplied with the template used to
prepare this project. The project MIT license does not apply to that material.
Keep the original template and resulting vendor-containing builds outside the
public repository. Obtain the applicable vendor terms before redistributing
them as public releases. This is a provenance statement, not a claim that the
template has an open-source license.

Template integration documentation:
https://support.omadanetworks.com/uk/document/13086/

## jQuery

The operator-supplied template includes a minified jQuery build whose embedded
version string is `unknown`, and whose supplied file has no copyright banner.
The build copies that file unchanged from the template; it does not identify it
as a specific upstream release or replace it with an untested release.

jQuery is a project of the OpenJS Foundation and jQuery contributors. Upstream
license information: https://jquery.com/license/

Do not treat the upstream license page as proof that the vendor's modified,
unversioned file has a particular upstream provenance. If publishing a
vendor-containing bundle, obtain the matching copyright/license notices from
the template distributor first. No jQuery bytes are included in this source ZIP.

## Official brand assets (private compiled build only)

The separately supplied Omada-branded build uses unmodified files obtained from
the official vendor website:

- Logo: https://static.tp-link.com/assets/images/omada/logo.svg
- Icon: https://static.tp-link.com/assets/images/icon/favicon-omada.ico
- Brand reference: https://www.omadanetworks.com/fr/landing/new-omada/

Omada, TP-Link and their logos are trademarks of their respective owners. These
assets are not covered by this project's MIT license, are not presented as
original project artwork, and are excluded from the GitHub source archive.
Brand asset use does not imply vendor sponsorship or endorsement.

The compiled asset manifest records each asset's source URL and SHA-256 hash.
