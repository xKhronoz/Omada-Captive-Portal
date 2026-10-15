/* Preview is enabled only without controller context, or by explicit ?preview=1.
   The production ZIP intentionally omits this file's preview implementation. */
(function () {
  var params = new URLSearchParams(location.search);
  if (params.has('clientMac') && params.get('preview') !== '1' && !params.has('previewSite')) return;
  window.portalIsPreview = true;
  window.portalPreviewRequest = function (url, payload, callback) {
    setTimeout(function () {
      var request = JSON.parse(payload);
      if (url === '/portal/getPortalPageSetting') {
        var mode = sessionStorage.getItem('guest-portal-preview-method') || 'hotspot';
        var types = { hotspot: 11, password: 1, open: 0, radius: 2, sms: 11 };
        callback(JSON.stringify({ errorCode: 0, result: {
          authType: types[mode] === undefined ? 11 : types[mode],
          hotspot: { enabledTypes: mode === 'sms' ? [6] : [3, 5] },
          portalCustomize: { buttonText: 'Connect to Wi-Fi' },
          sms: { countryCode: 65 }, landingUrl: ''
        } }));
      } else if (url === '/portal/sendSmsAuthCode') {
        callback(JSON.stringify({ errorCode: 0 }));
      } else if (request.voucherCode && request.voucherCode.toLowerCase() === 'expired') {
        callback(JSON.stringify({ errorCode: -41503 }));
      } else {
        callback(JSON.stringify({ errorCode: 0, result: '' }));
      }
      window.portalRequestComplete && window.portalRequestComplete(url);
    }, 650);
  };
})();
