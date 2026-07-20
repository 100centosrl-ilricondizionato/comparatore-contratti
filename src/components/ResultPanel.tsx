import type { CalcResult } from "../types";
import { formatEuro, formatNumero } from "../calc";
import MeterGauge from "./MeterGauge";

interface Props {
  result: CalcResult;
  onDownload: () => void;
  downloading: boolean;
}

export default function ResultPanel({ result, onDownload, downloading }: Props) {
  const isPositive = result.risparmioAnnuo >= 0;

  return (
    <div
      className="rounded-2xl p-6 flex flex-col items-center text-center"
      style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}
    >
      <span className="text-[11px] uppercase tracking-[0.2em] opacity-70">
        {isPositive ? "Risparmio stimato" : "Variazione stimata"}
      </span>

      <MeterGauge percentuale={result.risparmioPercentuale} size={220} />

      <div className="-mt-6">
        <div
          className="text-5xl font-bold tabular"
          style={{ fontFamily: "var(--font-mono)", color: isPositive ? "var(--color-spark)" : "#E38C7A" }}
        >
          {isPositive ? "" : "−"}
          {formatEuro(Math.abs(result.risparmioAnnuo))}
        </div>
        <div className="mt-1 text-sm opacity-80">
          all'anno · {formatNumero(Math.abs(result.risparmioPercentuale), 1)}% in {isPositive ? "meno" : "più"}
        </div>
      </div>

      <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="text-[10px] uppercase tracking-wide opacity-60">Oggi paga</div>
          <div className="mt-1 text-lg tabular" style={{ fontFamily: "var(--font-mono)" }}>
            {formatEuro(result.costoAnnuoAttuale)}
          </div>
          <div className="text-[11px] opacity-50">all'anno</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgba(242,169,59,0.14)" }}>
          <div className="text-[10px] uppercase tracking-wide opacity-60">Con 100Cento</div>
          <div className="mt-1 text-lg tabular" style={{ fontFamily: "var(--font-mono)", color: "var(--color-spark)" }}>
            {formatEuro(result.costoAnnuoNuovo)}
          </div>
          <div className="text-[11px] opacity-50">all'anno</div>
        </div>
      </div>

      <div className="mt-2 w-full text-left rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="text-[10px] uppercase tracking-wide opacity-60">Risparmio mensile medio</div>
        <div className="mt-1 text-lg tabular" style={{ fontFamily: "var(--font-mono)" }}>
          {formatEuro(Math.abs(result.risparmioMensile))}
        </div>
      </div>

      <button
        onClick={onDownload}
        disabled={downloading}
        className="mt-6 w-full rounded-xl py-3 font-semibold transition disabled:opacity-60"
        style={{ background: "var(--color-spark)", color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
      >
        {downloading ? "Generazione PDF…" : "Scarica PDF per il cliente"}
      </button>
    </div>
  );
}
