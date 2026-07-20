import { useEffect, useState } from "react";

interface Props {
  value: number;
  onChange: (n: number) => void;
  placeholder?: string;
  step?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function NumberInput({ value, onChange, placeholder, step = "0.001", className, style }: Props) {
  const [raw, setRaw] = useState(value === 0 ? "" : String(value));

  // se il valore cambia dall'esterno (es. reset del form) e non corrisponde
  // a quello che l'utente sta scrivendo, riallinea il testo mostrato
  useEffect(() => {
    const parsedRaw = raw === "" ? 0 : parseFloat(raw);
    if (Number.isNaN(parsedRaw) || parsedRaw !== value) {
      setRaw(value === 0 ? "" : String(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setRaw(next);
    const parsed = next === "" ? 0 : parseFloat(next);
    if (!Number.isNaN(parsed)) onChange(parsed);
  }

  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      value={raw}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      style={style}
    />
  );
}
