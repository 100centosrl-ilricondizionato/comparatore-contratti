import { useState } from "react";
import { usePun } from "../hooks/usePun";
import NumberInput from "./NumberInput";

function descriviData(iso: string): string {
  const data = new Date(iso);
  const oggi = new Date();
  const giorni = Math.floor((oggi.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
  if (giorni <= 0) return "aggiornato oggi";
  if (giorni === 1) return "aggiornato ieri";
  return `aggiornato ${giorni} giorni fa`;
}

export default function PunBadge() {
  const { pun, loading, aggiornaPun } = usePun();
  const [editing, setEditing] = useState(false);
  const [bozza, setBozza] = useState(0);

  function apriModifica() {
    setBozza(pun?.valore ?? 0);
    setEditing(true);
  }

  async function salva() {
    await aggiornaPun(bozza);
    setEditing(false);
  }

  if (loading) return null;

  if (editing) {
    return (
      <div
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 shrink-0"
        style={{ background: "var(--color-panel)", border: "1px solid var(--color-line-soft)" }}
      >
        <span className="text-[11px] font-semibold" style={{ color: "var(--color-ink-soft)" }}>
          PUN
        </span>
        <NumberInput
          value={bozza}
          onChange={setBozza}
          step="0.001"
          placeholder="€/kWh"
          className="w-16 text-sm outline-none bg-transparent tabular"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}
        />
        <button
          onClick={salva}
          className="text-xs px-2 py-1 rounded-md font-semibold"
          style={{ background: "var(--color-spark)", color: "var(--color-ink)" }}
        >
          Salva
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-xs px-1.5 py-1 rounded-md"
          style={{ color: "var(--color-ink-soft)" }}
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={apriModifica}
      className="flex items-center gap-2 rounded-lg px-3 py-2 shrink-0 text-left"
      style={{ background: "var(--color-panel)", border: "1px solid var(--color-line-soft)" }}
    >
      <span className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-ink-soft)" }}>
        PUN
      </span>
      <span
        className="text-sm font-bold tabular"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}
      >
        {pun ? `${pun.valore.toLocaleString("it-IT", { minimumFractionDigits: 3 })} €/kWh` : "non impostato"}
      </span>
      {pun && (
        <span className="text-[10px]" style={{ color: "var(--color-ink-soft)" }}>
          · {descriviData(pun.aggiornatoIl)}
        </span>
      )}
    </button>
  );
}
