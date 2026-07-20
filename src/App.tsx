import { useEffect, useMemo, useRef, useState } from "react";
import type { ComparatoreInputs } from "./types";
import { classificaOfferte } from "./calc";
import { useOfferte } from "./hooks/useOfferte";
import ContractForm from "./components/ContractForm";
import ResultPanel from "./components/ResultPanel";
import PdfReport from "./components/PdfReport";
import OffersRanking from "./components/OffersRanking";
import OffersManager from "./components/OffersManager";
import PunBadge from "./components/PunBadge";

const DEFAULT_INPUTS: ComparatoreInputs = {
  clienteNome: "",
  categoria: "luce",
  consumoAnnuo: 2700,
  attuale: { costoUnitario: 0.32, spesaFissaMensile: 8.5 },
};

export default function App() {
  const [inputs, setInputs] = useState<ComparatoreInputs>(DEFAULT_INPUTS);
  const [selezionataId, setSelezionataId] = useState<string | null>(null);
  const [gestioneAperta, setGestioneAperta] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const { offerte, loading } = useOfferte(inputs.categoria);

  const classifica = useMemo(
    () => classificaOfferte(offerte, inputs.consumoAnnuo, inputs.attuale),
    [offerte, inputs.consumoAnnuo, inputs.attuale]
  );

  // quando cambia la classifica (nuove offerte, cambio categoria, ecc.)
  // se non c'è più una selezione valida, seleziona automaticamente la migliore
  useEffect(() => {
    if (classifica.length === 0) {
      setSelezionataId(null);
      return;
    }
    if (!classifica.some((o) => o.id === selezionataId)) {
      setSelezionataId(classifica[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classifica]);

  const offertaSelezionata = classifica.find((o) => o.id === selezionataId) ?? null;

  async function handleDownload() {
    if (!reportRef.current || !offertaSelezionata) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#EDF1EF",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = canvas.height / canvas.width;
      const imgWidth = pageWidth;
      const imgHeight = imgWidth * ratio;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      const nomeFile = inputs.clienteNome
        ? `risparmio-${inputs.categoria}-${inputs.clienteNome.trim().replace(/\s+/g, "-").toLowerCase()}.pdf`
        : `risparmio-${inputs.categoria}-100cento.pdf`;
      pdf.save(nomeFile);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-paper)" }}>
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-6 sm:mb-8 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
              style={{ background: "var(--color-ink)", color: "var(--color-spark)", fontFamily: "var(--font-display)" }}
            >
              100%
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Comparatore Risparmio
              </h1>
              <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
                Quanto risparmia il cliente passando a 100Cento
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {inputs.categoria === "luce" && <PunBadge />}
            <button
              onClick={() => setGestioneAperta(true)}
              className="text-xs sm:text-sm px-3 py-2 rounded-lg font-semibold shrink-0"
              style={{ background: "var(--color-panel)", border: "1px solid var(--color-line-soft)" }}
            >
              Gestisci offerte
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-[1.3fr_1fr] gap-6 items-start">
          <div className="space-y-6">
            <ContractForm value={inputs} onChange={setInputs} />
            <OffersRanking
              categoria={inputs.categoria}
              classifica={classifica}
              selezionataId={selezionataId}
              onSeleziona={setSelezionataId}
              loading={loading}
            />
          </div>
          <ResultPanel
            result={offertaSelezionata?.risultato ?? null}
            offertaNome={offertaSelezionata?.nome ?? null}
            onDownload={handleDownload}
            downloading={downloading}
          />
        </div>
      </div>

      {/* off-screen printable report used to generate the PDF */}
      {offertaSelezionata && (
        <div style={{ position: "fixed", top: 0, left: -99999, pointerEvents: "none" }}>
          <PdfReport
            ref={reportRef}
            inputs={inputs}
            result={offertaSelezionata.risultato}
            offerta={{
              nome: offertaSelezionata.nome,
              costoUnitario: offertaSelezionata.costoUnitario,
              spesaFissaMensile: offertaSelezionata.spesaFissaMensile,
            }}
          />
        </div>
      )}

      {gestioneAperta && (
        <OffersManager categoria={inputs.categoria} onClose={() => setGestioneAperta(false)} />
      )}
    </div>
  );
}
