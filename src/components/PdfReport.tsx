import { forwardRef } from "react";
import type { ComparatoreInputs, CalcResult } from "../types";
import { UNITA } from "../types";
import { formatEuro, formatNumero } from "../calc";
import MeterGauge from "./MeterGauge";

interface Props {
  inputs: ComparatoreInputs;
  result: CalcResult;
  offerta: { nome: string; costoUnitario: number; spesaFissaMensile: number };
}

const oggi = new Date().toLocaleDateString("it-IT", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const PdfReport = forwardRef<HTMLDivElement, Props>(({ inputs, result, offerta }, ref) => {
  const isPositive = result.risparmioAnnuo >= 0;
  const unita = UNITA[inputs.categoria];
  const etichettaCategoria = inputs.categoria === "luce" ? "energia elettrica" : "gas";

  return (
    <div
      ref={ref}
      style={{
        width: 794,
        minHeight: 1123,
        background: "#EDF1EF",
        color: "#10312C",
        fontFamily: "Inter, sans-serif",
        padding: "56px 60px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 999,
              background: "#10312C",
              color: "#F2A93B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            100%
          </div>
          <div>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: -0.3 }}>
              100Cento
            </div>
            <div style={{ fontSize: 11, color: "#3D544F", letterSpacing: 1, textTransform: "uppercase" }}>
              Confronto contratto {etichettaCategoria}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 12, color: "#3D544F" }}>
          <div>{oggi}</div>
          {inputs.clienteNome && <div style={{ marginTop: 2, fontWeight: 600, color: "#10312C" }}>{inputs.clienteNome}</div>}
        </div>
      </div>

      <div
        style={{
          display: "inline-block",
          fontSize: 12,
          fontWeight: 600,
          color: "#1F7A54",
          background: "#DCEEE3",
          padding: "5px 12px",
          borderRadius: 999,
          marginBottom: 20,
        }}
      >
        Offerta proposta: {offerta.nome}
      </div>

      {/* hero result */}
      <div
        style={{
          background: "#10312C",
          color: "#EDF1EF",
          borderRadius: 24,
          padding: "32px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: 0.7 }}>
            {isPositive ? "Risparmio stimato" : "Variazione stimata"}
          </div>
          <div
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontWeight: 700,
              fontSize: 48,
              color: isPositive ? "#F2A93B" : "#E38C7A",
              marginTop: 6,
            }}
          >
            {isPositive ? "" : "−"}
            {formatEuro(Math.abs(result.risparmioAnnuo))}
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
            all'anno · {formatNumero(Math.abs(result.risparmioPercentuale), 1)}% in {isPositive ? "meno" : "più"} · circa{" "}
            {formatEuro(Math.abs(result.risparmioMensile))} al mese
          </div>
        </div>
        <MeterGauge percentuale={result.risparmioPercentuale} size={190} />
      </div>

      {/* breakdown table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 28 }}>
        <thead>
          <tr>
            <th style={th}></th>
            <th style={th}>Contratto attuale</th>
            <th style={th}>{offerta.nome}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdLabel}>Consumo annuo</td>
            <td style={td} colSpan={2}>
              {formatNumero(inputs.consumoAnnuo)} {unita.consumo}
            </td>
          </tr>
          <tr>
            <td style={tdLabel}>Costo</td>
            <td style={td}>{inputs.attuale.costoUnitario.toLocaleString("it-IT", { minimumFractionDigits: 3 })} {unita.costo}</td>
            <td style={{ ...td, color: "#1F7A54", fontWeight: 600 }}>
              {offerta.costoUnitario.toLocaleString("it-IT", { minimumFractionDigits: 3 })} {unita.costo}
            </td>
          </tr>
          <tr>
            <td style={tdLabel}>Spesa vendita</td>
            <td style={td}>{formatEuro(inputs.attuale.spesaFissaMensile)} / mese</td>
            <td style={{ ...td, color: "#1F7A54", fontWeight: 600 }}>{formatEuro(offerta.spesaFissaMensile)} / mese</td>
          </tr>
          <tr style={{ borderTop: "2px solid #10312C" }}>
            <td style={{ ...tdLabel, fontWeight: 700, paddingTop: 14 }}>Spesa annua totale</td>
            <td style={{ ...td, fontWeight: 700, paddingTop: 14 }}>{formatEuro(result.costoAnnuoAttuale)}</td>
            <td style={{ ...td, fontWeight: 700, paddingTop: 14, color: "#1F7A54" }}>
              {formatEuro(result.costoAnnuoNuovo)}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ fontSize: 11, color: "#3D544F", lineHeight: 1.6 }}>
        Simulazione basata sul consumo annuo indicato e sulle condizioni economiche attuali del cliente,
        confrontate con l'offerta 100Cento selezionata alla data del documento. I valori sono stime e possono
        variare in base ai consumi effettivi e agli aggiornamenti tariffari.
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 56,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#3D544F",
          borderTop: "1px solid #C7D2CD",
          paddingTop: 14,
        }}
      >
        <span>100Cento Srl — Il Ricondizionato</span>
        <span>100cento.it</span>
      </div>
    </div>
  );
});

const th: React.CSSProperties = {
  textAlign: "left",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.6,
  color: "#3D544F",
  paddingBottom: 10,
  borderBottom: "1px solid #C7D2CD",
  fontWeight: 600,
};

const td: React.CSSProperties = {
  padding: "10px 0",
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 14,
  borderBottom: "1px solid #D9E1DD",
};

const tdLabel: React.CSSProperties = {
  padding: "10px 0",
  fontSize: 13,
  color: "#3D544F",
  borderBottom: "1px solid #D9E1DD",
};

PdfReport.displayName = "PdfReport";
export default PdfReport;
