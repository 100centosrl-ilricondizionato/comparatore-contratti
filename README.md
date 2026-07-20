# Comparatore Risparmio · Luce (100Cento)

App per mostrare rapidamente ai clienti il risparmio annuo passando dal loro
contratto attuale all'offerta luce di 100Cento, con esportazione in PDF pronto
da stampare/inviare al cliente.

## Come funziona

- L'operatore inserisce il **consumo annuo (kWh)** del cliente, poi i due
  parametri per **contratto attuale** e **offerta 100Cento**: costo €/kWh e
  spesa vendita (POD) mensile.
- L'app calcola in tempo reale il costo annuo dei due contratti e il
  risparmio (€ e %), mostrato con una manopola stile "contatore".
- Il pulsante "Scarica PDF" genera un report a marchio 100Cento pronto per
  il cliente (usa lo stesso layout della schermata risultati).

## Sviluppo locale

```bash
npm install
npm run dev
```

## Deploy

Stack: **Vite + React + TypeScript + Tailwind v4**, pensato per essere
pushato su GitHub e collegato a Vercel (deploy automatico, nessuna env var
richiesta — è tutto client-side, nessun dato lasca il browser).

```bash
git init
git add .
git commit -m "Comparatore risparmio - luce"
git remote add origin <repo-github>
git push -u origin main
```

Poi su Vercel: "Import Project" dal repo → framework preset **Vite** →
Deploy.

## Prossimi passi

- Aggiungere gas e telefonia come schede/tab separate riusando la stessa
  logica di calcolo e lo stesso template PDF.
- Sostituire il badge "100%" testuale con il logo reale (basta sostituire il
  blocco nel componente `PdfReport.tsx` e nell'header di `App.tsx` con un
  `<img>`).
