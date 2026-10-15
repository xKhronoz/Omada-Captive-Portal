/* Customise this file before importing the ZIP into your network controller.
   Images must be bundled relative paths (for example "my-logo.png") or image
   data URLs. Remote image URLs are not used because guests are not online yet. */
window.PORTAL_CONFIG = {
  // Logo and name are independent. The subtitle stays visible; the divider
  // shows only when the subtitle and at least one branding element are visible.
  showBrandLogo: true,
  showBrandName: true,
  showHeaderSubtitle: true,
  headerText: "Your Brand",
  headerSubtitle: "Guest Wi-Fi",
  // Blank derives the tab title from the configured text, independent of visibility.
  pageTitle: "",
  // Fallback for wired clients or when the controller omits ssidName.
  // The connected Wi-Fi SSID takes precedence whenever it is available.
  connectionName: "Guest Wi-Fi",
  // Leave blank to use the built-in logo and Wi-Fi icon.
  logoImage: "",
  connectionIconImage: "",
  faviconImage: "mark.svg",
  footerText: "Your Brand",
  footerLogoImage: "",
  languages: ["en", "zh", "ms", "ta"],
  defaultLanguage: "en",
  detectBrowserLanguage: true,
  showRedirectionCountdownAfterAuthorization: true,
  redirectionCountdownSeconds: 5
};
