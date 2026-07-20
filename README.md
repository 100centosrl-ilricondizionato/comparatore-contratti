# Comparatore Risparmio (100Cento)

App per mostrare rapidamente ai clienti il risparmio annuo passando dal loro
contratto attuale a un'offerta 100Cento (luce e gas, in schede separate),
scegliendo automaticamente la più conveniente tra quelle inserite, con
esportazione in PDF pronto per il cliente.

## Come funziona

- Tab **Luce / Gas** in alto per scegliere la categoria.
- L'operatore inserisce il **consumo annuo** del cliente e i dati del suo
  **contratto attuale** (costo unitario + spesa vendita mensile).
- L'app mostra una **classifica delle offerte** 100Cento disponibili per
  quella categoria, ordinate dal risparmio maggiore, con la migliore
  evidenziata come "Consigliata". Si può toccare un'altra offerta per
  proporre quella invece.
- Il pulsante "Scarica PDF" genera un report a marchio 100Cento con
  l'offerta selezionata, pronto per il cliente.
- "Gestisci offerte" apre l'elenco delle offerte per la categoria attiva:
  si possono aggiungere, modificare, disattivare o eliminare. Le modifiche
  sono **condivise in tempo reale** tra tutti i dispositivi/operatori che
  usano l'app (salvate su Firebase).

## Configurazione Firebase (obbligatoria)

L'elenco offerte è condiviso tra tutti, quindi serve un progetto Firebase
con Firestore attivo:

1. Vai su https://console.firebase.google.com → "Aggiungi progetto" (va bene
   il piano gratuito Spark).
2. Nel progetto, menu laterale → **Firestore Database** → "Crea database" →
   modalità **produzione** → scegli una regione europea (es. `eur3`).
3. In **Firestore → Regole**, per un uso interno semplice puoi impostare:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   (accesso libero: va bene per uno strumento interno non pubblico; se in
   futuro serve più sicurezza si può aggiungere autenticazione.)
4. Menu ⚙️ → **Impostazioni progetto** → scorri fino a "Le tue app" → icona
   **`</>`** (Web) → registra l'app (basta un nome) → copia i valori di
   `firebaseConfig` (apiKey, authDomain, projectId, storageBucket,
   messagingSenderId, appId).
5. Su **Vercel**: progetto → Settings → Environment Variables → aggiungi
   queste sei chiavi (vedi `.env.example`), incollando i valori copiati da
   Firebase:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
6. Rifai il deploy (o "Redeploy" dall'ultima build) perché le variabili
   d'ambiente vengano lette da Vite in fase di build.

Per sviluppo locale: crea un file `.env.local` nella root del progetto con
le stesse chiavi (non viene caricato su GitHub, è già in `.gitignore`).

## Sviluppo locale

```bash
npm install
npm run dev
```

## Deploy

Stack: **Vite + React + TypeScript + Tailwind v4 + Firebase (Firestore)**.

```bash
git init
git add .
git commit -m "Comparatore risparmio - luce e gas con offerte condivise"
git remote add origin <repo-github>
git push -u origin main
```

Poi su Vercel: "Import Project" dal repo → framework preset **Vite** →
aggiungi le variabili d'ambiente Firebase (vedi sopra) → Deploy.

## Prossimi passi

- Sostituire il badge "100%" testuale con il logo reale (in
  `PdfReport.tsx` e nell'header di `App.tsx`).
- Eventualmente aggiungere telefonia come terza categoria, riusando la
  stessa struttura di `ContractForm`, `OffersManager` e `OffersRanking`.
