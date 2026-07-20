import type { LuceInputs } from "../types";

interface Props {
  value: LuceInputs;
  onChange: (v: LuceInputs) => void;
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
      <span className="text-[11px] uppercase tracking-wide text-ink-soft font-semibold" style={{ color: "var(--color-ink-soft)" }}>
        {label}
      </span>
      <div className="mt-1 flex items-baseline gap-2 border-b-2 pb-1" style={{ borderColor: "var(--color-line)" }}>
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) => onValue(e.target.value === "" ? 0 : parseFloat(e.target.value))}
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

export default function ContractForm({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-5"
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
            suffix="kWh / anno"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--color-old-soft)", border: "1px solid var(--color-line-soft)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--color-old)" }}
            />
            <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--color-old)" }}>
              Contratto attuale
            </h3>
          </div>
          <div className="space-y-4">
            <NumberField
              label="Costo energia"
              value={value.attuale.costoKwh}
              onValue={(n) => onChange({ ...value, attuale: { ...value.attuale, costoKwh: n } })}
              suffix="€/kWh"
            />
            <NumberField
              label="Spesa vendita (POD) mensile"
              value={value.attuale.podMensile}
              step="0.01"
              onValue={(n) => onChange({ ...value, attuale: { ...value.attuale, podMensile: n } })}
              suffix="€/mese"
            />
          </div>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--color-good-soft)", border: "1px solid var(--color-line-soft)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full" style={{ background: "var(--color-good)" }} />
            <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--color-good)" }}>
              Offerta 100Cento
            </h3>
          </div>
          <div className="space-y-4">
            <NumberField
              label="Costo energia"
              value={value.nuovo.costoKwh}
              onValue={(n) => onChange({ ...value, nuovo: { ...value.nuovo, costoKwh: n } })}
              suffix="€/kWh"
            />
            <NumberField
              label="Spesa vendita (POD) mensile"
              value={value.nuovo.podMensile}
              step="0.01"
              onValue={(n) => onChange({ ...value, nuovo: { ...value.nuovo, podMensile: n } })}
              suffix="€/mese"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
