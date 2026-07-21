export type Categoria = "luce" | "gas";

export interface ContrattoInput {
  costoUnitario: number; // €/kWh per la luce, €/Smc per il gas
  spesaFissaMensile: number; // spesa vendita mensile, €/mese
}

export interface Offerta {
  id: string;
  nome: string;
  tipoPrezzo: "fisso" | "variabile";
  costoUnitario: number; // usato quando tipoPrezzo è "fisso"
  spreadIndice?: number; // usato quando tipoPrezzo è "variabile": margine aggiunto all'indice di mercato (PUN per la luce, PSV per il gas), €/kWh o €/Smc
  spesaFissaMensile: number;
  attiva: boolean;
  note?: string;
}

export interface ComparatoreInputs {
  clienteNome: string;
  clienteEmail: string;
  clienteTelefono: string;
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

export const ETICHETTA_INDICE: Record<Categoria, string> = {
  luce: "PUN",
  gas: "PSV",
};
