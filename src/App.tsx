import { useMemo, useRef, useState } from "react";
import type { LuceInputs } from "./types";
import { calcolaRisparmio } from "./calc";
import ContractForm from "./components/ContractForm";
import ResultPanel from "./components/ResultPanel";
import PdfReport from "./components/PdfReport";

const DEFAULT_INPUTS: LuceInputs = {
  clienteNome: "",
  consumoAnnuo: 2700,
  attuale: { costoKwh: 0.32, podMensile: 8.5 },
  nuovo: { costoKwh: 0.26, podMensile: 5.9 },
};

export default function App() {
  const [inputs, setInputs] = useState<LuceInputs>(DEFAULT_INPUTS);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const result = useMemo(() => calcolaRisparmio(inputs), [inputs]);

  async function handleDownload() {
    if (!reportRef.current) return;
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
        ? `risparmio-luce-${inputs.clienteNome.trim().replace(/\s+/g, "-").toLowerCase()}.pdf`
        : "risparmio-luce-100cento.pdf";
      pdf.save(nomeFile);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-paper)" }}>
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-6 sm:mb-8 flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-full flex items-center justify-center font-bold text-xs"
            style={{ background: "var(--color-ink)", color: "var(--color-spark)", fontFamily: "var(--font-display)" }}
          >
            100%
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Comparatore Risparmio · Luce
            </h1>
            <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
              Mostra al cliente quanto risparmia passando a 100Cento
            </p>
          </div>
        </header>

        <div className="grid md:grid-cols-[1.3fr_1fr] gap-6 items-start">
          <ContractForm value={inputs} onChange={setInputs} />
          <ResultPanel result={result} onDownload={handleDownload} downloading={downloading} />
        </div>
      </div>

      {/* off-screen printable report used to generate the PDF */}
      <div style={{ position: "fixed", top: 0, left: -99999, pointerEvents: "none" }}>
        <PdfReport ref={reportRef} inputs={inputs} result={result} />
      </div>
    </div>
  );
}
