export interface ContractInput {
  costoKwh: number; // €/kWh
  podMensile: number; // spesa vendita mensile, €/mese
}

export interface LuceInputs {
  clienteNome: string;
  consumoAnnuo: number; // kWh/anno
  attuale: ContractInput;
  nuovo: ContractInput;
}

export interface CalcResult {
  costoAnnuoAttuale: number;
  costoAnnuoNuovo: number;
  podAnnuoAttuale: number;
  podAnnuoNuovo: number;
  energiaAnnuaAttuale: number;
  energiaAnnuaNuovo: number;
  risparmioAnnuo: number;
  risparmioPercentuale: number;
  risparmioMensile: number;
}
