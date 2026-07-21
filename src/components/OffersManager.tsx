import { useState } from "react";
import type { Categoria, Offerta } from "../types";
import { UNITA } from "../types";
import { useOfferte } from "../hooks/useOfferte";
import { usePun } from "../hooks/usePun";
import NumberInput from "./NumberInput";

interface Props {
  categoria: Categoria;
  onClose: () => void;
}

const VUOTA = {
  nome: "",
  tipoPrezzo: "fisso" as const,
  costoUnitario: 0,
  spreadPun: 0,
  spesaFissaMensile: 0,
  attiva: true,
  note: "",
};

function SelectTipoPrezzo({
  value,
  onChange,
}: {
  value: "fisso" | "variabile";
  onChange: (v: "fisso" | "variabile") => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as "fisso" | "variabile")}
      className="rounded-lg px-3 py-2 text-sm outline-none border bg-white"
      style={{ borderColor: "var(--color-line)" }}
    >
      <option value="fisso">Fisso</option>
      <option value="variabile">Variabile</option>
    </select>
  );
}

export default function OffersManager({ categoria, onClose }: Props) {
  const { offerte, loading, errore, aggiungiOfferta, aggiornaOfferta, eliminaOfferta } =
    useOfferte(categoria);
  const { pun } = usePun();
  const [nuova, setNuova] = useState<Omit<Offerta, "id">>(VUOTA);
  const [editId, setEditId] = useState<string | null>(null);
  const [editBozza, setEditBozza] = useState<Omit<Offerta, "id"> | null>(null);
  const unita = UNITA[categoria];

  const nuovaEVariabileLuce = categoria === "luce" && nuova.tipoPrezzo === "variabile";
  const editEVariabileLuce = categoria === "luce" && editBozza?.tipoPrezzo === "variabile";

  async function handleAggiungi() {
    if (!nuova.nome.trim()) return;
    await aggiungiOfferta({ ...nuova });
    setNuova(VUOTA);
  }

  function iniziaModifica(o: Offerta) {
    setEditId(o.id);
    setEditBozza({
      nome: o.nome,
      tipoPrezzo: o.tipoPrezzo ?? "fisso",
      costoUnitario: o.costoUnitario,
      spreadPun: o.spreadPun ?? 0,
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

  function prezzoLive(spread: number) {
    if (!pun) return null;
    return pun.valore + spread;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" style={{ background: "rgba(16,49,44,0.55)" }}>
      <div
        className="w-full max-w-2xl rounded-2xl flex flex-col"
        style={{ background: "var(--color-panel)", maxHeight: "90vh" }}
      >
        <div className="p-5 sm:p-6 pb-0 shrink-0">
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
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <input
                placeholder="Nome offerta"
                value={nuova.nome}
                onChange={(e) => setNuova({ ...nuova, nome: e.target.value })}
                className="sm:col-span-2 rounded-lg px-3 py-2 text-sm outline-none border"
                style={{ borderColor: "var(--color-line)" }}
              />
              <SelectTipoPrezzo
                value={nuova.tipoPrezzo}
                onChange={(v) => setNuova({ ...nuova, tipoPrezzo: v })}
              />
              {nuovaEVariabileLuce ? (
                <NumberInput
                  step="0.001"
                  placeholder="Spread su PUN €/kWh"
                  value={nuova.spreadPun ?? 0}
                  onChange={(n) => setNuova({ ...nuova, spreadPun: n })}
                  className="rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: "var(--color-line)" }}
                />
              ) : (
                <NumberInput
                  step="0.001"
                  placeholder={unita.costo}
                  value={nuova.costoUnitario}
                  onChange={(n) => setNuova({ ...nuova, costoUnitario: n })}
                  className="rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: "var(--color-line)" }}
                />
              )}
              <NumberInput
                step="0.01"
                placeholder="Spesa fissa €/mese"
                value={nuova.spesaFissaMensile}
                onChange={(n) => setNuova({ ...nuova, spesaFissaMensile: n })}
                className="rounded-lg px-3 py-2 text-sm outline-none border"
                style={{ borderColor: "var(--color-line)" }}
              />
            </div>
            {nuovaEVariabileLuce && (
              <div className="mt-2 text-xs" style={{ color: "var(--color-ink-soft)" }}>
                {pun
                  ? `Prezzo di oggi: PUN (${pun.valore.toLocaleString("it-IT", { minimumFractionDigits: 3 })}) + spread (${(nuova.spreadPun ?? 0).toLocaleString("it-IT", { minimumFractionDigits: 3 })}) = ${prezzoLive(nuova.spreadPun ?? 0)!.toLocaleString("it-IT", { minimumFractionDigits: 3 })} €/kWh`
                  : "PUN non ancora impostato: aggiornalo dal badge in alto per vedere il prezzo attuale."}
              </div>
            )}
            <input
              placeholder="Note (es. obbligo email, obbligo SDD, altre condizioni)"
              value={nuova.note}
              onChange={(e) => setNuova({ ...nuova, note: e.target.value })}
              className="mt-3 w-full rounded-lg px-3 py-2 text-sm outline-none border"
              style={{ borderColor: "var(--color-line)" }}
            />
            <button
              onClick={handleAggiungi}
              className="mt-3 w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "var(--color-spark)", color: "var(--color-ink)" }}
            >
              + Aggiungi offerta
            </button>
          </div>
        </div>

        {/* elenco offerte: unica parte che scorre */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 overflow-y-auto min-h-0">
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
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      <input
                        value={editBozza.nome}
                        onChange={(e) => setEditBozza({ ...editBozza, nome: e.target.value })}
                        className="sm:col-span-2 rounded-lg px-2 py-1.5 text-sm border outline-none"
                        style={{ borderColor: "var(--color-line)" }}
                      />
                      <SelectTipoPrezzo
                        value={editBozza.tipoPrezzo}
                        onChange={(v) => setEditBozza({ ...editBozza, tipoPrezzo: v })}
                      />
                      {editEVariabileLuce ? (
                        <NumberInput
                          step="0.001"
                          value={editBozza.spreadPun ?? 0}
                          onChange={(n) => setEditBozza({ ...editBozza, spreadPun: n })}
                          className="rounded-lg px-2 py-1.5 text-sm border outline-none"
                          style={{ borderColor: "var(--color-line)" }}
                        />
                      ) : (
                        <NumberInput
                          step="0.001"
                          value={editBozza.costoUnitario}
                          onChange={(n) => setEditBozza({ ...editBozza, costoUnitario: n })}
                          className="rounded-lg px-2 py-1.5 text-sm border outline-none"
                          style={{ borderColor: "var(--color-line)" }}
                        />
                      )}
                      <NumberInput
                        step="0.01"
                        value={editBozza.spesaFissaMensile}
                        onChange={(n) => setEditBozza({ ...editBozza, spesaFissaMensile: n })}
                        className="rounded-lg px-2 py-1.5 text-sm border outline-none"
                        style={{ borderColor: "var(--color-line)" }}
                      />
                    </div>
                    {editEVariabileLuce && (
                      <div className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
                        {pun
                          ? `Prezzo di oggi: PUN (${pun.valore.toLocaleString("it-IT", { minimumFractionDigits: 3 })}) + spread (${(editBozza.spreadPun ?? 0).toLocaleString("it-IT", { minimumFractionDigits: 3 })}) = ${prezzoLive(editBozza.spreadPun ?? 0)!.toLocaleString("it-IT", { minimumFractionDigits: 3 })} €/kWh`
                          : "PUN non ancora impostato."}
                      </div>
                    )}
                    <input
                      placeholder="Note (es. obbligo email, obbligo SDD, altre condizioni)"
                      value={editBozza.note}
                      onChange={(e) => setEditBozza({ ...editBozza, note: e.target.value })}
                      className="w-full rounded-lg px-2 py-1.5 text-sm border outline-none"
                      style={{ borderColor: "var(--color-line)" }}
                    />
                    <div className="flex gap-2 justify-end">
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
                      <div className="font-semibold text-sm truncate flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                        {o.nome}
                        <span
                          className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded"
                          style={{ background: "var(--color-paper-dim)", color: "var(--color-ink-soft)" }}
                        >
                          {(o.tipoPrezzo ?? "fisso") === "fisso" ? "Fisso" : "Variabile"}
                        </span>
                        {!o.attiva && (
                          <span className="text-[10px] font-normal uppercase" style={{ color: "var(--color-ink-soft)" }}>
                            disattivata
                          </span>
                        )}
                      </div>
                      <div className="text-xs tabular" style={{ color: "var(--color-ink-soft)", fontFamily: "var(--font-mono)" }}>
                        {categoria === "luce" && o.tipoPrezzo === "variabile" ? (
                          <>
                            PUN + {(o.spreadPun ?? 0).toLocaleString("it-IT", { minimumFractionDigits: 3 })} {unita.costo}
                            {pun && <> (oggi: {prezzoLive(o.spreadPun ?? 0)!.toLocaleString("it-IT", { minimumFractionDigits: 3 })} {unita.costo})</>}
                          </>
                        ) : (
                          <>{o.costoUnitario.toLocaleString("it-IT", { minimumFractionDigits: 3 })} {unita.costo}</>
                        )}
                        {" · "}
                        {o.spesaFissaMensile.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €/mese
                      </div>
                      {o.note && (
                        <div className="text-xs mt-0.5 italic" style={{ color: "var(--color-ink-soft)" }}>
                          {o.note}
                        </div>
                      )}
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
    </div>
  );
}
