import { readFileSync } from 'node:fs';

// Adapt only the controller template supplied by the operator. No vendor source
// is bundled here; the small replacement transport is original project code.
export function prepareController(source) {
  for (const marker of ['var Ajax = {', 'var data = {};', 'function setPasswordComponent(id) {', 'function setNormalButton()', 'window.location.href = landingUrl;']) {
    if (!source.includes(marker)) throw new Error('Unsupported controller template: missing ' + marker + '. Use the template supplied with this portal, or review the adapter for your controller version.');
  }
  source = source.replaceAll('\r\n', '\n');
  let start = source.indexOf('function setPasswordComponent(id) {');
  let end = source.indexOf('if (isMobile()) {', start);
  if (end < 0) throw new Error('Unsupported controller template: password component boundary.');
  source = source.slice(0, start) + 'function setPasswordComponent(id) {}\n' + source.slice(end);
  start = source.indexOf('var Ajax = {'); end = source.indexOf('var data = {};', start);
  source = source.slice(0, start) + readFileSync(new URL('./controller-transport.txt', import.meta.url), 'utf8') + source.slice(end);
  source = source.replace('operHint.innerHTML = msg;', 'operHint.textContent = msg;');
  source = source.replace('  operHintAutoHideTimer = window.setTimeout(function () {\n    hideOperHint();\n  }, 2000);', '');
  source = source.replace('window.location.href = landingUrl;\n                            showOperHint(data.errorCode);', 'window.portalAuthorized(landingUrl);');
  source = source.replace('$("#button-login").html(globalConfig.buttonText);', '$("#button-login").html(\'Connect to Wi-Fi <svg class="icon"><use href="#arrow"/></svg>\');');
  source = source.replace('                if(window.authType == 2 || window.authType == 8 || window.authType === 15){', "                submitUrl = '/portal/auth';\n                if(window.authType == 2 || window.authType == 8 || window.authType === 15){");
  return source;
}

export function prepareSurveyStyles(source) {
  const start = source.indexOf('#form-auth-msg{');
  const end = source.indexOf('#voucherCode {', start);
  if (start < 0 || end < 0) throw new Error('Unsupported controller survey stylesheet.');
  return source.slice(start, end);
}
