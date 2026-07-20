import type { Categoria, OffertaClassificata } from "../types";
import { UNITA } from "../types";
import { formatEuro, formatNumero } from "../calc";

interface Props {
  categoria: Categoria;
  classifica: OffertaClassificata[];
  selezionataId: string | null;
  onSeleziona: (id: string) => void;
  loading: boolean;
}

export default function OffersRanking({ categoria, classifica, selezionataId, onSeleziona, loading }: Props) {
  const unita = UNITA[categoria];

  if (loading) {
    return (
      <div className="rounded-2xl p-5 text-sm text-center" style={{ background: "var(--color-panel)", color: "var(--color-ink-soft)" }}>
        Caricamento offerte…
      </div>
    );
  }

  if (classifica.length === 0) {
    return (
      <div className="rounded-2xl p-5 text-sm text-center" style={{ background: "var(--color-panel)", color: "var(--color-ink-soft)" }}>
        Nessuna offerta {categoria} disponibile. Aggiungine una da "Gestisci offerte".
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{ background: "var(--color-panel)", border: "1px solid var(--color-line-soft)" }}
    >
      <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
        Classifica offerte {categoria === "luce" ? "luce" : "gas"}
      </h3>
      <div className="space-y-2">
        {classifica.map((o, i) => {
          const attiva = o.id === selezionataId;
          const migliore = i === 0;
          return (
            <button
              key={o.id}
              onClick={() => onSeleziona(o.id)}
              className="w-full text-left rounded-xl p-3 flex items-center justify-between gap-3 transition"
              style={{
                background: attiva ? "var(--color-good-soft)" : "var(--color-paper)",
                border: attiva ? "2px solid var(--color-good)" : "1px solid var(--color-line-soft)",
              }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {migliore && (
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{ background: "var(--color-spark)", color: "var(--color-ink)" }}
                    >
                      Consigliata
                    </span>
                  )}
                  <span className="font-semibold text-sm truncate" style={{ fontFamily: "var(--font-display)" }}>
                    {o.nome}
                  </span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-ink-soft)" }}>
                  {o.costoUnitario.toLocaleString("it-IT", { minimumFractionDigits: 3 })} {unita.costo} ·{" "}
                  {formatEuro(o.spesaFissaMensile)}/mese
                </div>
              </div>
              <div className="text-right shrink-0">
                <div
                  className="text-sm font-bold tabular"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: o.risultato.risparmioAnnuo >= 0 ? "var(--color-good)" : "#B14636",
                  }}
                >
                  {o.risultato.risparmioAnnuo >= 0 ? "" : "−"}
                  {formatEuro(Math.abs(o.risultato.risparmioAnnuo))}
                </div>
                <div className="text-[11px]" style={{ color: "var(--color-ink-soft)" }}>
                  {formatNumero(Math.abs(o.risultato.risparmioPercentuale), 1)}%
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
