(function () {
  'use strict';
  var $id = function (id) { return document.getElementById(id); };
  var ready = false, busy = false, activeDialog;
  var button = $id('button-login');
  var config = window.PORTAL_CONFIG || {};
  function configuredText(value, fallback) {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  }
  function localImage(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    var source = value.trim();
    if (/^data:image\/(?:png|jpeg|gif|webp|svg\+xml)[;,]/i.test(source)) return source;
    // Only bundled, relative resources; no external requests before sign-in.
    if (/^(?:[a-z][a-z0-9+.-]*:|[\\/])/i.test(source) || /[\\\x00-\x1f]/.test(source)) return '';
    try {
      var url = new URL(source, location.href);
      if (url.origin !== location.origin) return '';
    } catch (_) { return ''; }
    return source;
  }
  function customiseImage(value, imageId, defaultId) {
    var source = localImage(value);
    if (!source) return;
    var image = $id(imageId), fallback = $id(defaultId);
    image.addEventListener('load', function () { image.removeAttribute('hidden'); fallback.setAttribute('hidden', ''); });
    image.addEventListener('error', function () { image.setAttribute('hidden', ''); fallback.removeAttribute('hidden'); });
    image.src = source;
  }
  function updateConnectionName() {
    // URLSearchParams handles spaces and encoded SSIDs without inserting HTML.
    var connectedName = new URLSearchParams(location.search).get('ssidName');
    if ((!connectedName || !connectedName.trim()) && typeof ssidName === 'string') connectedName = ssidName;
    $id('network-name').textContent = configuredText(connectedName, configuredText(config.connectionName, 'Guest Wi-Fi'));
  }
  var headerName = configuredText(config.headerText, 'Your Brand');
  var subtitle = typeof config.headerSubtitle === 'string' ? config.headerSubtitle.trim() : 'Guest Wi-Fi';
  var showLogo = config.showBrandLogo !== false && config.showHeaderBranding !== false;
  var showName = config.showBrandName !== false && config.showHeaderBranding !== false;
  var showSubtitle = !!subtitle && config.showHeaderSubtitle !== false;
  $id('header-name').textContent = headerName;
  $id('header-name').hidden = !showName;
  $id('default-brand-logo').setAttribute('hidden', '');
  if (showLogo) $id('default-brand-logo').removeAttribute('hidden');
  $id('header-subtitle').textContent = subtitle;
  $id('header-subtitle').hidden = !showSubtitle;
  $id('header-divider').hidden = !showSubtitle || (!showLogo && !showName);
  $id('header-brand').classList.toggle('brand-name-hidden', !showName);
  $id('header-brand').classList.toggle('brand-logo-hidden', !showLogo);
  $id('header-brand').setAttribute('aria-label', [showName ? headerName : '', showSubtitle ? subtitle : '', 'home'].filter(Boolean).join(' '));
  $id('header-brand').hidden = !showLogo && !showName && !showSubtitle;
  document.querySelector('.header').classList.toggle('header-unbranded', $id('header-brand').hidden);
  document.title = 'Welcome · ' + [showName ? headerName : '', showSubtitle ? subtitle : ''].filter(Boolean).join(' ');
  if (showLogo) customiseImage(config.logoImage, 'custom-brand-logo', 'default-brand-logo');
  customiseImage(config.connectionIconImage, 'custom-connection-icon', 'default-connection-icon');
  $id('footer-name').textContent = configuredText(config.footerText, 'Your Brand');
  customiseImage(config.footerLogoImage, 'custom-footer-logo', 'footer-name');
  var favicon = localImage(config.faviconImage);
  if (favicon) $id('portal-favicon').href = favicon;
  updateConnectionName();
  var methods = {
    0: ['Guest access', 'Accept the terms below and make yourself at home.'],
    1: ['Wi-Fi password', 'Enter the Wi-Fi password provided by your host.'],
    2: ['Account', 'Sign in with your network account to get online.'],
    3: ['Access code', 'Enter your access code to get online.'],
    5: ['Account', 'Sign in with the account provided by your host.'],
    6: ['SMS', 'Verify your phone number to get connected.'],
    8: ['Account', 'Sign in with your network account to get online.'],
    12: ['Guest details', 'Complete a short guest form to get connected.'],
    15: ['Account', 'Sign in with your network account to get online.']
  };
  function buttonText(text) {
    button.textContent = text;
    if (!busy) {
      var arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('class', 'icon');
      arrow.setAttribute('aria-hidden', 'true');
      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#arrow'); arrow.appendChild(use); button.appendChild(arrow);
    }
  }
  function setBusy(value) {
    busy = value; button.disabled = !ready || value;
    button.setAttribute('aria-busy', String(value));
    buttonText(value ? 'Connecting…' : window.authType === 12 ? 'Continue to guest form' : 'Connect to Wi-Fi');
  }
  function error(message, focusTarget) {
    $id('oper-hint').textContent = message;
    $id('oper-hint').style.display = 'block';
    $id('oper-hint').classList.add('visible');
    if (focusTarget) focusTarget.focus();
  }
  function refreshMethod() {
    var method = methods[window.authType];
    $id('method-description').textContent = method ? method[1] : 'This sign-in method is not supported by this template. Please ask your host.';
    document.querySelectorAll('.method-tab').forEach(function (tab) {
      tab.setAttribute('aria-pressed', String(Number(tab.dataset.type) === window.authType));
    });
    $id('login-form').querySelectorAll('.field').forEach(function (field) {
      field.querySelectorAll('input').forEach(function (input) { input.disabled = field.style.display === 'none'; });
    });
    buttonText(window.authType === 12 ? 'Continue to guest form' : 'Connect to Wi-Fi');
    document.querySelector('.host-help').hidden = window.authType !== 3;
  }
  window.portalRequestComplete = function (url) {
    if (url === '/portal/getPortalPageSetting') {
      updateConnectionName();
      ready = !!methods[window.authType];
      $id('initial-status').hidden = true;
      var tabs = $id('method-tabs');
      var types = globalConfig.authType === 11 ? globalConfig.hotspotTypes : [];
      tabs.hidden = types.length < 2;
      types.forEach(function (type) {
        if (!methods[type]) return;
        var tab = document.createElement('button');
        tab.type = 'button'; tab.className = 'method-tab'; tab.dataset.type = type;
        tab.textContent = methods[type][0];
        tab.addEventListener('click', function () {
          if (busy) return;
          var option = document.getElementById(String(type));
          if (option) option.click();
          hideOperHint(); refreshMethod();
        });
        tabs.appendChild(tab);
      });
      refreshMethod();
    }
    if (url === '/portal/sendSmsAuthCode') {
      if (window.portalIsPreview) error('Preview only: no SMS was sent. Enter any code to try the flow.');
      $id('get-code').disabled = false;
    }
    setBusy(false);
  };
  window.portalRequestFailed = function (url) {
    if (url === '/portal/getPortalPageSetting') {
      ready = false;
      $id('initial-status').textContent = '';
      var retry = document.createElement('button'); retry.className = 'inline-link'; retry.textContent = 'Try again';
      retry.addEventListener('click', function () { location.reload(); });
      $id('initial-status').appendChild(retry);
    }
    setBusy(false);
    $id('get-code').disabled = false;
    error('We could not reach the Wi-Fi controller. Check that you are connected to the guest network, then try again.');
  };
  window.portalConnected = function () {
    $id('sign-in-view').hidden = true;
    $id('form-auth-msg').style.display = 'none';
    $id('success-view').hidden = false;
    $id('success-title').tabIndex = -1; $id('success-title').focus();
  };
  window.portalPreviewSuccess = function () {
    window.portalConnected();
    $id('success-title').textContent = 'Looking good. You’re ready.';
    $id('success-copy').textContent = 'This is a preview of the connection flow. No network access has been granted. On your network controller, access is granted only after successful authentication.';
    $id('preview-again').hidden = false;
  };
  var redirectTimer, redirectTarget, redirectIsPreview = false;
  function followRedirect() {
    window.clearTimeout(redirectTimer);
    $id('redirect-panel').hidden = true;
    if (!redirectIsPreview && redirectTarget) window.location.assign(redirectTarget);
  }
  $id('redirect-now').addEventListener('click', followRedirect);
  window.portalAuthorized = function (landingUrl) {
    window.clearTimeout(redirectTimer);
    $id('redirect-panel').hidden = true;
    var preview = !!window.portalIsPreview;
    if (preview) window.portalPreviewSuccess(); else window.portalConnected();
    redirectTarget = null; redirectIsPreview = preview;
    if (typeof landingUrl === 'string' && landingUrl) {
      try { var target = new URL(landingUrl, window.location.href); if (target.protocol === 'http:' || target.protocol === 'https:') redirectTarget = target.href; } catch (_) {}
    }
    if (!redirectTarget && !preview) return;
    var seconds = Number(config.redirectionCountdownSeconds);
    if (!Number.isInteger(seconds) || seconds < 0 || seconds > 60) seconds = 5;
    if (config.showRedirectionCountdownAfterAuthorization === false || seconds === 0) { followRedirect(); return; }
    $id('redirect-panel').hidden = false;
    function tick() {
      $id('redirect-count').textContent = String(seconds);
      if (seconds <= 0) { followRedirect(); return; }
      seconds -= 1; redirectTimer = window.setTimeout(tick, 1000);
    }
    tick();
  };
  // Capture runs before the supplied controller's click handler.
  button.addEventListener('click', function (event) {
    if (!ready || busy) { event.stopImmediatePropagation(); return; }
    if (!$id('accept-terms').checked) {
      event.stopImmediatePropagation(); error('Please accept the Terms of Use and Privacy Notice to continue.', $id('accept-terms')); return;
    }
    var inputs = Array.from($id('login-form').querySelectorAll('.field input')).filter(function (input) { return !input.disabled; });
    for (var i = 0; i < inputs.length; i++) {
      if (!inputs[i].value.trim()) {
        event.stopImmediatePropagation(); error('Please enter your ' + (inputs[i].id === 'voucherCode' ? 'access code.' : inputs[i].id === 'simplePassword' ? 'Wi-Fi password.' : inputs[i].id.replace(/-/g, ' ') + '.'), inputs[i]); return;
      }
    }
    if (window.authType !== 12) setBusy(true);
  }, true);
  $id('form-auth-submit').addEventListener('click', function (event) {
    if (busy) { event.stopImmediatePropagation(); return; }
    if (formAuthController.isFormAuthValid()) setBusy(true);
  }, true);
  $id('login-form').addEventListener('submit', function (event) { event.preventDefault(); button.click(); });
  $id('get-code').addEventListener('click', function (event) {
    if (!$id('country-code').value.trim() || !$id('phone-number').value.trim()) {
      event.stopImmediatePropagation(); error('Enter your country code and phone number first.', $id('phone-number')); return;
    }
    $id('get-code').disabled = true;
  }, true);
  document.querySelectorAll('[data-password]').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var input = $id(toggle.dataset.password), show = input.type === 'password';
      input.type = show ? 'text' : 'password'; toggle.textContent = show ? 'Hide' : 'Show';
      toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      toggle.setAttribute('aria-pressed', String(show));
    });
  });
  document.querySelectorAll('[data-dialog]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      activeDialog = $id(trigger.dataset.dialog); activeDialog.showModal();
    });
  });
  document.querySelectorAll('dialog').forEach(function (dialog) {
    dialog.querySelectorAll('.dialog-close,.dialog-done').forEach(function (close) { close.addEventListener('click', function () { dialog.close(); }); });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) { var r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); } });
  });
  if (window.portalIsPreview) {
    $id('preview-notice').hidden = false;
    var previewDropdown = window.createPortalDropdown({
      container: $id('preview-picker'), id: 'preview-method', labelId: 'preview-method-label', placement: 'up',
      value: sessionStorage.getItem('guest-portal-preview-method') || 'hotspot',
      items: [
        { value: 'hotspot', label: 'Voucher & account' },
        { value: 'password', label: 'Simple password' },
        { value: 'open', label: 'Click to connect' },
        { value: 'radius', label: 'RADIUS / LDAP account' },
        { value: 'sms', label: 'SMS verification' }
      ],
      onChange: function (method) { sessionStorage.setItem('guest-portal-preview-method', method); location.reload(); }
    });
    previewDropdown.setLabel('Portal type');
    $id('preview-again').addEventListener('click', function () { location.reload(); });
  }
})();
