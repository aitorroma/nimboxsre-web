/* Banner de cookies de NimBox SRE.
 *
 * Usa vanilla-cookieconsent (MIT, orestbida) —la misma librería que el plugin
 * de nimbox360— para mantener la coherencia de marca, pero con texto veraz: el
 * sitio no rastrea. Sólo guarda una preferencia de consentimiento y deja lista
 * la categoría de analítica por si se activa en el futuro (GA/GTM).
 *
 * Los colores heredan la marca vía variables --cc-* (ver assets/legal.css y el
 * <style> de la landing): fondo oscuro, botones en el naranja de acento. */
(function () {
  if (typeof CookieConsent === 'undefined') return;

  document.documentElement.classList.add('cc--darkmode');

  CookieConsent.run({
    guiOptions: {
      consentModal: { layout: 'box', position: 'bottom left', equalWeightButtons: true, flipButtons: false },
      preferencesModal: { layout: 'box', position: 'right', equalWeightButtons: true }
    },
    categories: {
      // Sólo la preferencia de consentimiento; no se puede desactivar.
      necessary: { enabled: true, readOnly: true },
      // Preparada para el futuro. Hoy no hay analítica, así que no activa nada:
      // cuando se añada GA/GTM se engancharía aquí, como en el plugin de WP.
      analytics: { enabled: false, readOnly: false }
    },
    language: {
      default: 'es',
      translations: {
        es: {
          consentModal: {
            title: 'Cookies',
            description: 'Este sitio es informativo y <strong>no utiliza cookies de seguimiento, analítica ni publicidad</strong>. Solo guardamos tu preferencia de consentimiento. Consulta la <a href="/cookies/">Política de Cookies</a>.',
            acceptAllBtn: 'Aceptar',
            acceptNecessaryBtn: 'Rechazar',
            showPreferencesBtn: 'Preferencias',
            footer: '<a href="/privacidad/">Privacidad</a><a href="/aviso-legal/">Aviso legal</a>'
          },
          preferencesModal: {
            title: 'Preferencias de cookies',
            acceptAllBtn: 'Aceptar',
            acceptNecessaryBtn: 'Rechazar',
            savePreferencesBtn: 'Guardar preferencias',
            closeIconLabel: 'Cerrar',
            sections: [
              {
                title: 'Tu privacidad',
                description: 'NimBox SRE no rastrea a sus visitantes. Este sitio no carga recursos externos ni herramientas de analítica. La única información que se conserva es tu elección de consentimiento, guardada en tu navegador.'
              },
              {
                title: 'Cookies estrictamente necesarias',
                description: 'Guardan tu preferencia de consentimiento para no volver a preguntarte en cada visita. Son imprescindibles y no se pueden desactivar.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Analítica',
                description: 'Actualmente <strong>no hay ninguna herramienta de analítica activa</strong> en el sitio. Esta categoría queda disponible por si se incorpora en el futuro; mientras tanto, no se ejecuta nada aunque la actives.',
                linkedCategory: 'analytics'
              },
              {
                title: 'Más información',
                description: 'Para cualquier duda sobre el tratamiento de datos, escríbenos a <a href="mailto:aitor@nimbox360.com">aitor@nimbox360.com</a> o consulta la <a href="/privacidad/">Política de Privacidad</a>.'
              }
            ]
          }
        }
      }
    }
  });
})();
