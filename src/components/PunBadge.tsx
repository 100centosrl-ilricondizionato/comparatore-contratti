import { useState } from "react";
import type { Categoria } from "../types";
import { UNITA, ETICHETTA_INDICE } from "../types";
import { useIndiceMercato } from "../hooks/usePun";
import NumberInput from "./NumberInput";

interface Props {
  categoria: Categoria;
}

function descriviData(iso: string): string {
  const data = new Date(iso);
  const oggi = new Date();
  const giorni = Math.floor((oggi.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
  if (giorni <= 0) return "aggiornato oggi";
  if (giorni === 1) return "aggiornato ieri";
  return `aggiornato ${giorni} giorni fa`;
}

export default function IndiceBadge({ categoria }: Props) {
  const { indice, loading, aggiornaIndice } = useIndiceMercato(categoria);
  const [editing, setEditing] = useState(false);
  const [bozza, setBozza] = useState(0);
  const etichetta = ETICHETTA_INDICE[categoria];
  const unitaCosto = UNITA[categoria].costo;

  function apriModifica() {
    setBozza(indice?.valore ?? 0);
    setEditing(true);
  }

  async function salva() {
    await aggiornaIndice(bozza);
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
          {etichetta}
        </span>
        <NumberInput
          value={bozza}
          onChange={setBozza}
          step="0.001"
          placeholder={unitaCosto}
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
        {etichetta}
      </span>
      <span
        className="text-sm font-bold tabular"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}
      >
        {indice ? `${indice.valore.toLocaleString("it-IT", { minimumFractionDigits: 3 })} ${unitaCosto}` : "non impostato"}
      </span>
      {indice && (
        <span className="text-[10px]" style={{ color: "var(--color-ink-soft)" }}>
          · {descriviData(indice.aggiornatoIl)}
        </span>
      )}
    </button>
  );
}
