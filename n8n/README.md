# Captura de demos de NimBox SRE

`nimbox-sre-demo-webhook.json` es un flujo importable en n8n. Recibe el `POST`
JSON de la landing, normaliza y valida los campos y crea un lead en
`https://crm.aitorroma.com/api/leads`. El token no se exporta ni se guarda en
el repositorio.

## Activación

1. En n8n, ve a **Workflows → Import from File** e importa el JSON.
2. En **Credentials**, crea una credencial **Header Auth** con el nombre del
   encabezado `authtoken` y como valor el token de la API de Perfex. Asígnala al
   nodo **Crear lead en PerfexCRM**. No escribas ese token en el workflow.
3. El flujo incluye los IDs validados en este CRM: fuente `6`, estado `2` y
   asignado `1`. Si cambian en el futuro, edita esos tres campos en el nodo
   **Crear lead en PerfexCRM**.
4. Abre el nodo **Webhook · Solicitud de demo**, copia la **Production URL** y
   activa el workflow. No uses la URL de prueba (`/webhook-test/`).
5. La landing ya usa el proxy Worker `https://api.nimbox360.com/webhook/nimbox-sre-demo-8c4be615`.
6. Permite CORS para `https://nimboxsre.com` en el proxy inverso o en n8n. El
   navegador hará una petición `OPTIONS` antes del `POST` porque envía JSON;
   responder sólo la petición POST no es suficiente.

Ejemplo de prueba (sustituye la URL):

```bash
curl -i -X POST 'https://n8n.example.com/webhook/nimbox-sre-demo-8c4be615' \
  -H 'Content-Type: application/json' \
  --data '{"name":"Ada Lovelace","email":"ada@example.com","company":"NimBox","host_count":"50-500","message":"Quiero una demo","privacy_consent":"yes","source":"nimboxsre.com"}'
```

## Contrato de entrada

| Campo | Requerido | Descripción |
| --- | --- | --- |
| `name` | Sí | Nombre del contacto |
| `email` | Sí | Correo profesional |
| `company` | No | Empresa |
| `host_count` | No | Rango de hosts |
| `message` | No | Necesidad declarada |
| `privacy_consent` | Sí | Debe ser `yes` |
| `website` | No | Honeypot; debe estar vacío |
| `source` | No | Identificador de origen |

## Mapeo en PerfexCRM

La API disponible requiere `source`, `status`, `name` y `assigned`; autentica
la llamada con el encabezado `authtoken`. Recibe los parámetros como formulario
URL encoded (`application/x-www-form-urlencoded`), no como JSON. La API
documenta un formulario multipart, pero su controlador también procesa campos
URL encoded. El nodo envía el nombre,
contacto, email, empresa y una descripción con el rango de hosts, mensaje,
origen y marca temporal. Los envíos con honeypot o sin consentimiento no llegan
al CRM.
El flujo comprueba que Perfex devuelva `status: true` antes de confirmar el
envío a la web.

La validación interna usa `valid = yes/no` y el nodo **¿Lead válido?** compara
el texto con `yes`. Su primera salida es la rama falsa (respuesta rechazada) y
la segunda es la rama verdadera (crear el lead).

El nodo de normalización también acepta un cuerpo JSON recibido como texto desde
un proxy y expone `validation` en las ejecuciones para identificar qué dato no
ha superado la validación.
