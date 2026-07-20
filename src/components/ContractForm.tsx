import type { Categoria, ComparatoreInputs } from "../types";
import { UNITA } from "../types";
import NumberInput from "./NumberInput";

interface Props {
  value: ComparatoreInputs;
  onChange: (v: ComparatoreInputs) => void;
}

function NumberField({
  label,
  value,
  onValue,
  suffix,
  step = "0.001",
}: {
  label: string;
  value: number;
  onValue: (n: number) => void;
  suffix: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: "var(--color-ink-soft)" }}>
        {label}
      </span>
      <div className="mt-1 flex items-baseline gap-2 border-b-2 pb-1" style={{ borderColor: "var(--color-line)" }}>
        <NumberInput
          value={value}
          onChange={onValue}
          step={step}
          className="w-full bg-transparent font-mono text-xl outline-none tabular"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}
          placeholder="0"
        />
        <span className="text-sm shrink-0" style={{ color: "var(--color-ink-soft)" }}>
          {suffix}
        </span>
      </div>
    </label>
  );
}

const CATEGORIE: { key: Categoria; label: string }[] = [
  { key: "luce", label: "Luce" },
  { key: "gas", label: "Gas" },
];

export default function ContractForm({ value, onChange }: Props) {
  const unita = UNITA[value.categoria];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {CATEGORIE.map((c) => (
          <button
            key={c.key}
            onClick={() => onChange({ ...value, categoria: c.key })}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition"
            style={{
              background: value.categoria === c.key ? "var(--color-ink)" : "var(--color-panel)",
              color: value.categoria === c.key ? "var(--color-spark)" : "var(--color-ink-soft)",
              border: "1px solid var(--color-line-soft)",
              fontFamily: "var(--font-display)",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl p-4 sm:p-5"
        style={{ background: "var(--color-panel)", border: "1px solid var(--color-line-soft)" }}
      >
        <span className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: "var(--color-ink-soft)" }}>
          Cliente
        </span>
        <input
          type="text"
          value={value.clienteNome}
          onChange={(e) => onChange({ ...value, clienteNome: e.target.value })}
          placeholder="Nome cliente (facoltativo)"
          className="mt-1 w-full bg-transparent border-b-2 pb-1 outline-none text-lg"
          style={{ borderColor: "var(--color-line)", fontFamily: "var(--font-display)" }}
        />
        <div className="mt-4">
          <NumberField
            label="Consumo stimato"
            value={value.consumoAnnuo}
            step="1"
            onValue={(n) => onChange({ ...value, consumoAnnuo: n })}
            suffix={`${unita.consumo} / anno`}
          />
        </div>
      </div>

      <div
        className="rounded-2xl p-4 sm:p-5"
        style={{ background: "var(--color-old-soft)", border: "1px solid var(--color-line-soft)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--color-old)" }} />
          <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--color-old)" }}>
            Contratto attuale del cliente
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberField
            label="Costo"
            value={value.attuale.costoUnitario}
            onValue={(n) => onChange({ ...value, attuale: { ...value.attuale, costoUnitario: n } })}
            suffix={unita.costo}
          />
          <NumberField
            label="Spesa vendita mensile"
            value={value.attuale.spesaFissaMensile}
            step="0.01"
            onValue={(n) => onChange({ ...value, attuale: { ...value.attuale, spesaFissaMensile: n } })}
            suffix="€/mese"
          />
        </div>
      </div>
    </div>
  );
}
