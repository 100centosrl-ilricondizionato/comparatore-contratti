import { useState } from "react";
import type { Categoria, Offerta } from "../types";
import { UNITA } from "../types";
import { useOfferte } from "../hooks/useOfferte";

interface Props {
  categoria: Categoria;
  onClose: () => void;
}

const VUOTA = { nome: "", costoUnitario: 0, spesaFissaMensile: 0, attiva: true, note: "" };

export default function OffersManager({ categoria, onClose }: Props) {
  const { offerte, loading, errore, aggiungiOfferta, aggiornaOfferta, eliminaOfferta } =
    useOfferte(categoria);
  const [nuova, setNuova] = useState(VUOTA);
  const [editId, setEditId] = useState<string | null>(null);
  const [editBozza, setEditBozza] = useState<Omit<Offerta, "id"> | null>(null);
  const unita = UNITA[categoria];

  async function handleAggiungi() {
    if (!nuova.nome.trim()) return;
    await aggiungiOfferta({ ...nuova });
    setNuova(VUOTA);
  }

  function iniziaModifica(o: Offerta) {
    setEditId(o.id);
    setEditBozza({
      nome: o.nome,
      costoUnitario: o.costoUnitario,
      spesaFissaMensile: o.spesaFissaMensile,
      attiva: o.attiva,
      note: o.note ?? "",
    });
  }

  async function salvaModifica() {
    if (!editId || !editBozza) return;
    await aggiornaOfferta(editId, editBozza);
    setEditId(null);
    setEditBozza(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto" style={{ background: "rgba(16,49,44,0.55)" }}>
      <div
        className="w-full max-w-2xl rounded-2xl p-5 sm:p-6 my-6"
        style={{ background: "var(--color-panel)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Offerte {categoria === "luce" ? "Luce" : "Gas"}
          </h2>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1.5 rounded-lg"
            style={{ background: "var(--color-paper-dim)", color: "var(--color-ink)" }}
          >
            Chiudi
          </button>
        </div>

        {errore && (
          <div className="mb-4 text-sm rounded-lg p-3" style={{ background: "#F7DEDB", color: "#8A2E22" }}>
            Errore di connessione a Firebase: {errore}
          </div>
        )}

        {/* form nuova offerta */}
        <div className="rounded-xl p-4 mb-5" style={{ background: "var(--color-paper)" }}>
          <div className="text-[11px] uppercase tracking-wide font-semibold mb-3" style={{ color: "var(--color-ink-soft)" }}>
            Nuova offerta
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              placeholder="Nome offerta"
              value={nuova.nome}
              onChange={(e) => setNuova({ ...nuova, nome: e.target.value })}
              className="sm:col-span-2 rounded-lg px-3 py-2 text-sm outline-none border"
              style={{ borderColor: "var(--color-line)" }}
            />
            <input
              type="number"
              step="0.001"
              placeholder={unita.costo}
              value={nuova.costoUnitario || ""}
              onChange={(e) => setNuova({ ...nuova, costoUnitario: parseFloat(e.target.value) || 0 })}
              className="rounded-lg px-3 py-2 text-sm outline-none border"
              style={{ borderColor: "var(--color-line)" }}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Spesa fissa €/mese"
              value={nuova.spesaFissaMensile || ""}
              onChange={(e) => setNuova({ ...nuova, spesaFissaMensile: parseFloat(e.target.value) || 0 })}
              className="rounded-lg px-3 py-2 text-sm outline-none border"
              style={{ borderColor: "var(--color-line)" }}
            />
          </div>
          <button
            onClick={handleAggiungi}
            className="mt-3 w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--color-spark)", color: "var(--color-ink)" }}
          >
            + Aggiungi offerta
          </button>
        </div>

        {/* elenco offerte */}
        {loading ? (
          <div className="text-sm py-6 text-center" style={{ color: "var(--color-ink-soft)" }}>
            Caricamento…
          </div>
        ) : offerte.length === 0 ? (
          <div className="text-sm py-6 text-center" style={{ color: "var(--color-ink-soft)" }}>
            Nessuna offerta {categoria} inserita ancora.
          </div>
        ) : (
          <div className="space-y-2">
            {offerte.map((o) => (
              <div key={o.id} className="rounded-xl p-3 border" style={{ borderColor: "var(--color-line-soft)" }}>
                {editId === o.id && editBozza ? (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      value={editBozza.nome}
                      onChange={(e) => setEditBozza({ ...editBozza, nome: e.target.value })}
                      className="sm:col-span-2 rounded-lg px-2 py-1.5 text-sm border outline-none"
                      style={{ borderColor: "var(--color-line)" }}
                    />
                    <input
                      type="number"
                      step="0.001"
                      value={editBozza.costoUnitario}
                      onChange={(e) => setEditBozza({ ...editBozza, costoUnitario: parseFloat(e.target.value) || 0 })}
                      className="rounded-lg px-2 py-1.5 text-sm border outline-none"
                      style={{ borderColor: "var(--color-line)" }}
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={editBozza.spesaFissaMensile}
                      onChange={(e) => setEditBozza({ ...editBozza, spesaFissaMensile: parseFloat(e.target.value) || 0 })}
                      className="rounded-lg px-2 py-1.5 text-sm border outline-none"
                      style={{ borderColor: "var(--color-line)" }}
                    />
                    <div className="sm:col-span-4 flex gap-2 justify-end mt-1">
                      <button
                        onClick={() => { setEditId(null); setEditBozza(null); }}
                        className="text-xs px-3 py-1.5 rounded-lg"
                        style={{ background: "var(--color-paper-dim)" }}
                      >
                        Annulla
                      </button>
                      <button
                        onClick={salvaModifica}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                        style={{ background: "var(--color-good)", color: "white" }}
                      >
                        Salva
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate" style={{ fontFamily: "var(--font-display)" }}>
                        {o.nome}
                        {!o.attiva && (
                          <span className="ml-2 text-[10px] font-normal uppercase" style={{ color: "var(--color-ink-soft)" }}>
                            disattivata
                          </span>
                        )}
                      </div>
                      <div className="text-xs tabular" style={{ color: "var(--color-ink-soft)", fontFamily: "var(--font-mono)" }}>
                        {o.costoUnitario.toLocaleString("it-IT", { minimumFractionDigits: 3 })} {unita.costo} ·{" "}
                        {o.spesaFissaMensile.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €/mese
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => aggiornaOfferta(o.id, { attiva: !o.attiva })}
                        className="text-xs px-2.5 py-1.5 rounded-lg"
                        style={{ background: "var(--color-paper-dim)" }}
                      >
                        {o.attiva ? "Disattiva" : "Attiva"}
                      </button>
                      <button
                        onClick={() => iniziaModifica(o)}
                        className="text-xs px-2.5 py-1.5 rounded-lg"
                        style={{ background: "var(--color-paper-dim)" }}
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => eliminaOfferta(o.id)}
                        className="text-xs px-2.5 py-1.5 rounded-lg"
                        style={{ background: "#F7DEDB", color: "#8A2E22" }}
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
