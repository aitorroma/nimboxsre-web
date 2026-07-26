/* Cookie consent and privacy-first PostHog analytics for NimBox SRE. */
(function () {
  if (typeof CookieConsent === 'undefined') return;

  var posthogLoaded = false;
  var posthogKey = 'phc_mRBBLAJhFsirjcAu5wj8kBZ5xQrjaDqoxQbychErdtek';
  var posthogHost = 'https://eu.i.posthog.com';

  function analyticsAccepted() {
    return CookieConsent.acceptedCategory('analytics');
  }

  function captureConversions() {
    document.querySelectorAll('.cta, .lead-form-submit').forEach(function (element) {
      element.addEventListener('click', function () {
        if (window.posthog) {
          window.posthog.capture(element.classList.contains('lead-form-submit') ? 'demo_request_started' : 'cta_clicked', {
            label: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80)
          });
        }
      });
    });
  }

  function enableAnalytics() {
    if (posthogLoaded || !analyticsAccepted()) return;
    posthogLoaded = true;
    var script = document.createElement('script');
    script.async = true;
    script.src = posthogHost + '/static/array.js';
    script.onload = function () {
      if (!window.posthog) return;
      window.posthog.init(posthogKey, {
        api_host: posthogHost,
        ui_host: 'https://eu.posthog.com',
        autocapture: false,
        capture_pageview: true,
        capture_pageleave: true,
        disable_session_recording: true,
        person_profiles: 'identified_only'
      });
      captureConversions();
    };
    document.head.appendChild(script);
  }

  function disableAnalytics() {
    if (window.posthog) window.posthog.opt_out_capturing();
  }

  document.documentElement.classList.add('cc--darkmode');
  CookieConsent.run({
    guiOptions: {
      consentModal: { layout: 'box', position: 'bottom right', equalWeightButtons: true, flipButtons: false },
      preferencesModal: { layout: 'box', position: 'right', equalWeightButtons: true }
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: { enabled: false, readOnly: false }
    },
    onConsent: function () { if (analyticsAccepted()) enableAnalytics(); },
    onChange: function () { if (analyticsAccepted()) enableAnalytics(); else disableAnalytics(); },
    language: {
      default: 'es',
      translations: {
        es: {
          consentModal: {
            title: 'Cookies',
            description: 'Usamos cookies necesarias y, solo si lo aceptas, <strong>analítica de uso con PostHog</strong>. Consulta la <a href="/cookies/">Política de Cookies</a>.',
            acceptAllBtn: 'Aceptar', acceptNecessaryBtn: 'Rechazar', showPreferencesBtn: 'Preferencias',
            footer: '<a href="/privacidad/">Privacidad</a><a href="/aviso-legal/">Aviso legal</a>'
          },
          preferencesModal: {
            title: 'Preferencias de cookies', acceptAllBtn: 'Aceptar', acceptNecessaryBtn: 'Rechazar', savePreferencesBtn: 'Guardar preferencias', closeIconLabel: 'Cerrar',
            sections: [
              { title: 'Tu privacidad', description: 'NimBox SRE solo activa la analítica opcional después de tu consentimiento. Puedes cambiar tu elección en cualquier momento.' },
              { title: 'Cookies estrictamente necesarias', description: 'Guardan tu preferencia de consentimiento para no volver a preguntarte en cada visita. Son imprescindibles y no se pueden desactivar.', linkedCategory: 'necessary' },
              { title: 'Analítica', description: 'Con tu consentimiento, usamos PostHog Cloud EU para medir páginas vistas y conversiones básicas. No activamos grabación de sesiones ni capturamos automáticamente el contenido de formularios.', linkedCategory: 'analytics' },
              { title: 'Más información', description: 'Consulta la <a href="/privacidad/">Política de Privacidad</a> y la <a href="/cookies/">Política de Cookies</a>.' }
            ]
          }
        }
      }
    }
  });
  if (analyticsAccepted()) enableAnalytics();
})();
