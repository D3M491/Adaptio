# Adaptio

App mobile di allenamento, fatta con Expo SDK 58 (React Native 0.88, React 19, expo-router 58). JavaScript con file `.jsx`, React Compiler attivo. Tutta l'interfaccia è in italiano. Sviluppo su Windows (PowerShell), l'app si prova con Expo Go su iPhone.

## Come lavorare con l'utente
- Per funzioni nuove o cambi di comportamento grossi: prima una descrizione breve (con le tue ipotesi segnate come tali) e un suo ok, poi costruisci. Le modifiche piccole di interfaccia le fai subito.
- Commit e push solo quando li chiede. Se sei su `main`, per lavoro grosso lavora su un ramo.
- Prova a schermo quando puoi e dì chiaramente cosa non hai potuto verificare (notifiche, schermo acceso e splash nativo funzionano solo sul telefono).
- Token e password non vanno scritti in chat né nei file del progetto: restano in variabili d'ambiente.

## Struttura
- `src/app/_layout.jsx`: `ProfileProvider` > `ThemeProvider` > `Stack` con `Stack.Protected` (l'app si vede solo se `profile.onboarded`, altrimenti solo `onboarding`). Sopra tutto l'overlay `Intro`.
- `src/app/(tabs)/`: tab con `expo-router/js-top-tabs` (swipe tra le tab, barra in basso): `index` (home), `workoutTab`, `profileTab`, `settingsTab`.
- Schermate: `onboarding.jsx`, `workoutDetail.jsx`, `workoutSession.jsx`, `pro.jsx`.
- `src/app/components/`: `Intro`, `Week`, `Workout` (anteprima home e elenco della tab), `Progress`, `RulerPicker`, `NumberField`, `ConfirmDialog`, `SourceTag`, `ProBadge`, `WorkoutSummary`, `Confetti`.
- `src/data/`: `ProfileContext.jsx` (profilo salvato con AsyncStorage, chiave `profile`), `progress.js` (valori iniziali), `workouts.js` e `wgerWorkouts.js` (generato).
- `src/theme.js`, `src/utils.js`, `src/notifications.js`. `scripts/`: importazione da wger.

## Convenzioni di codice
- 2 spazi, virgolette doppie, commenti brevi come `//Commento` (i nuovi in inglese). Segui lo stile del codice intorno.
- Colori sempre dal tema: in ogni componente `const colors = useColors(); const styles = useStyles(createStyles);` e in fondo al file `const createStyles = (colors) => StyleSheet.create({...})`. Solo `Intro` e `Confetti` usano il `colors` statico scuro. Il testo sopra i pulsanti rossi usa `colors.onTertiary`.
- Le route stanno in `src/app`, compresa la cartella `components`: file in più lì diventano route.
- Lingue: l'app segue la lingua del telefono (italiano, altrimenti inglese) e l'utente può scegliere a mano nelle Impostazioni (`settings.language`: `auto`, `it`, `en`). Nessun testo nel codice: ogni testo va in `src/i18n/it/*.js` e `src/i18n/en/*.js` (stesse chiavi in entrambi) e si legge con `const t = useT();` e `t("gruppo.chiave", { parametri })`. I plurali sono `{ one, other }` con `count`. Per numeri e date usa gli helper di `src/i18n` (`formatNumber`, `numberToText`, `parseNumber`, `useLanguage`), non `toLocaleString("it-IT")` né la virgola scritta a mano. Nelle notifiche i testi si passano già tradotti.
- Nei testi italiani evita aggettivi riferiti a chi usa l'app (pronto, sicuro, motivato): l'app non chiede il genere.
- Non usare `StyleSheet.absoluteFillObject`: in RN 0.88 non esiste più (diventa `undefined` e l'elemento non si sovrappone). Usa `StyleSheet.absoluteFill`.

## Profilo salvato (`ProfileContext`)
`onboarded`, `legacyDemoCleared`, `personal {name, age, height}`, `currentWorkoutId` (null finché non scelto), `training {daysPerWeek, weekdays (0 = domenica … 6 = sabato), goal, level, place}`, `settings {keepAwake, restNotification, reminderEnabled, reminderHour, reminderMinute, theme}`, `weight {initial, current}`, `maxes[]` e `measurements[]` (voci con `name`, `initial`, `current`: `null` finché l'utente non le riempie). Al caricamento `settings` e `training` si uniscono ai default, così i campi nuovi arrivano anche ai profili già salvati.

## Workout
- Nostri (`source: "adaptio"`) in `workouts.js`; importati da wger (`source: "wger"`, id `wger-<id>`) in `wgerWorkouts.js`. Le etichette sono "Adaptio Workouts" (logo) e "Community Workouts". L'RPE può essere `null` e non va mostrato.
- Il giorno di workout di una data segue i giorni di allenamento scelti, contati da lunedì (`getWorkoutDayForWeekday`); gli altri giorni sono "Rest day".
- Per rifare l'importazione da wger: `$env:WGER_TOKEN = "..."; node scripts/import-wger.mjs` (il token non va nel repo né in chat). La licenza delle schede va verificata prima di pubblicare.

## Ambiente di sviluppo
- Server: `npx expo start -c` in un terminale, porta 8081. Dopo aver installato pacchetti riavvia con `-c`, altrimenti Metro non li trova.
- Metro si è chiuso più volte con `EMFILE: too many open files`: non lasciare aperte schede web su `localhost:8081` né altri server Expo di prova.
- Il PC è sull'hotspot dell'iPhone (indirizzo `172.20.10.x`, portata corta). Alternativa fuori portata: `--tunnel` (`@expo/ngrok` è già nelle dipendenze).
- La versione web serve solo per vedere i layout: lo splash nativo, le notifiche e lo schermo acceso si provano solo sul telefono.

## Non ancora fatto
- Timer di recupero sulla schermata di blocco (Live Activity iOS): richiede account Apple Developer, EAS Build e una development build fuori da Expo Go.
- Verificare su iPhone notifiche, schermo acceso e tema chiaro su tutte le schermate.
- La matita di modifica nei giorni del workout non fa nulla; Start parte anche per giorni diversi da oggi; restano TODO su prezzi Pro e salvataggio delle sessioni.
