# Risposte per le schede privacy degli store

Da copiare in App Store Connect e Google Play Console al momento della pubblicazione.
Si basano su come funziona l'app oggi: se aggiungi analytics, pubblicità, login o pagamenti, vanno riviste.

URL informativa privacy (serve a entrambi gli store): `https://d3m491.github.io/Adaptio/privacy.html`
(Richiede GitHub Pages attivo: Settings > Pages > Source: `main`, cartella `/docs`. Con un repo privato su account gratuito Pages non è disponibile.)

## Cosa raccoglie l'app (fatti)

- Resta solo sul telefono (non esce mai): nome, età, altezza, peso, massimali, misure, storico allenamenti, note, foto profilo, impostazioni.
- Esce dal telefono: un identificativo utente anonimo (Supabase) e i voti 1-5 stelle alle schede.
- Nessun SDK di analytics, pubblicità, crash report o tracciamento.
- Notifiche solo locali (nessun push server, nessun token).
- Nessun account con email o password.

## Apple: App Privacy ("nutrition label")

Domanda iniziale "Do you or your third-party partners collect data from this app?" → **Yes** (per il voto online).

Per Apple "raccogliere" significa inviare fuori dal dispositivo. I dati che restano solo sul telefono (salute, fitness, foto, profilo) **non vanno dichiarati**.

| Tipo di dato | Categoria Apple | Collegato all'utente | Usato per tracciare | Finalità |
|---|---|---|---|---|
| ID anonimo creato da Supabase | Identifiers > User ID | Sì | No | App Functionality |
| Voti alle schede | User Content > Other User Content | Sì | No | App Functionality |

Altre categorie (Contact Info, Health & Fitness, Photos, Usage Data, Diagnostics, Location...): **Data Not Collected**.

- Tracking (ATT): **No**, quindi non serve la richiesta di tracciamento.
- URL informativa privacy: quello sopra.
- Cancellazione account: l'app non ha account con registrazione, ma la cancellazione dei dati è comunque nelle Impostazioni.
- Export compliance (cifratura): l'app usa solo HTTPS standard, risposta tipica "usa solo cifratura esente". In `app.json` si può aggiungere `ios.config.usesNonExemptEncryption: false` per non rispondere ogni volta.

## Google Play: Data safety

- "Does your app collect or share any of the required user data types?" → **Yes** (collect), **No** per condivisione con terze parti (Supabase è un fornitore che tratta i dati per tuo conto: per Google non conta come condivisione).
- Tipi di dati raccolti:
  - **Device or other IDs** > ID anonimo → raccolto, non condiviso, finalità: *App functionality*, non facoltativo.
  - **App activity > Other user-generated content** (voti) → raccolto, non condiviso, finalità: *App functionality*.
- Dati criptati in transito: **Sì** (HTTPS).
- Gli utenti possono chiedere la cancellazione dei dati: **Sì**. Percorso in app: Impostazioni > Privacy e dati > Cancella tutti i miei dati. Link web alternativo: la pagina privacy (sezione cancellazione).
- Salute e fitness, foto, nome ecc.: **non raccolti** (restano sul dispositivo).
- Target audience: 13+ / adulti, non "design for children". Questionario contenuti: nessun contenuto sensibile.
- Permessi dichiarati: notifiche, accesso alle foto tramite selettore di sistema.

## Da verificare prima di inviare

1. Sostituisci `[INDIRIZZO EMAIL DI CONTATTO]` e `[CONTACT EMAIL ADDRESS]` in `docs/privacy.html`.
2. Dashboard Supabase > Project Settings > General: guarda la **regione** del progetto. Se è nell'UE, puoi aggiungere "server nell'Unione Europea" nell'informativa.
3. Esegui `supabase/delete_account.sql` nello SQL Editor di Supabase (senza, il pulsante di cancellazione dei dati online dà errore).
4. Attiva gli anonymous sign-ins: Authentication > Providers > Anonymous sign-ins (già necessario per i voti).
5. Prova da telefono: vota una scheda, poi Cancella tutti i miei dati, poi controlla in Supabase (Authentication > Users e tabella `ratings`) che sia sparito tutto.
6. Se aggiungi Pro con pagamenti (RevenueCat/StoreKit) o analytics, aggiorna informativa e queste risposte.
