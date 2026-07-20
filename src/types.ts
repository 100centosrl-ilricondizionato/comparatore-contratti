export type Categoria = "luce" | "gas";

export interface ContrattoInput {
  costoUnitario: number; // €/kWh per la luce, €/Smc per il gas
  spesaFissaMensile: number; // spesa vendita mensile, €/mese
}

export interface Offerta {
  id: string;
  nome: string;
  tipoPrezzo: "fisso" | "variabile";
  costoUnitario: number; // usato quando tipoPrezzo è "fisso" (o per il gas, finché non c'è un indice live)
  spreadPun?: number; // usato per la luce quando tipoPrezzo è "variabile": margine aggiunto al PUN, €/kWh
  spesaFissaMensile: number;
  attiva: boolean;
  note?: string;
}

export interface ComparatoreInputs {
  clienteNome: string;
  categoria: Categoria;
  consumoAnnuo: number; // kWh o Smc / anno
  attuale: ContrattoInput;
}

export interface CalcResult {
  costoAnnuoAttuale: number;
  costoAnnuoNuovo: number;
  spesaFissaAnnuaAttuale: number;
  spesaFissaAnnuaNuovo: number;
  consumoAnnuoAttuale: number;
  consumoAnnuoNuovo: number;
  risparmioAnnuo: number;
  risparmioPercentuale: number;
  risparmioMensile: number;
}

export interface OffertaClassificata extends Offerta {
  costoEffettivo: number;
  risultato: CalcResult;
}

export const UNITA: Record<Categoria, { consumo: string; costo: string }> = {
  luce: { consumo: "kWh", costo: "€/kWh" },
  gas: { consumo: "Smc", costo: "€/Smc" },
};
