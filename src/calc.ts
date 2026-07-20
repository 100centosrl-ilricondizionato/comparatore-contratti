import type { ContrattoInput, CalcResult, Offerta, OffertaClassificata } from "./types";

export function calcolaRisparmio(
  consumoAnnuo: number,
  attuale: ContrattoInput,
  nuovo: ContrattoInput
): CalcResult {
  const consumoAnnuoAttuale = consumoAnnuo * attuale.costoUnitario;
  const consumoAnnuoNuovo = consumoAnnuo * nuovo.costoUnitario;

  const spesaFissaAnnuaAttuale = attuale.spesaFissaMensile * 12;
  const spesaFissaAnnuaNuovo = nuovo.spesaFissaMensile * 12;

  const costoAnnuoAttuale = consumoAnnuoAttuale + spesaFissaAnnuaAttuale;
  const costoAnnuoNuovo = consumoAnnuoNuovo + spesaFissaAnnuaNuovo;

  const risparmioAnnuo = costoAnnuoAttuale - costoAnnuoNuovo;
  const risparmioPercentuale =
    costoAnnuoAttuale > 0 ? (risparmioAnnuo / costoAnnuoAttuale) * 100 : 0;

  return {
    costoAnnuoAttuale,
    costoAnnuoNuovo,
    spesaFissaAnnuaAttuale,
    spesaFissaAnnuaNuovo,
    consumoAnnuoAttuale,
    consumoAnnuoNuovo,
    risparmioAnnuo,
    risparmioPercentuale,
    risparmioMensile: risparmioAnnuo / 12,
  };
}

export function classificaOfferte(
  offerte: Offerta[],
  consumoAnnuo: number,
  attuale: ContrattoInput
): OffertaClassificata[] {
  return offerte
    .filter((o) => o.attiva)
    .map((o) => ({
      ...o,
      risultato: calcolaRisparmio(consumoAnnuo, attuale, {
        costoUnitario: o.costoUnitario,
        spesaFissaMensile: o.spesaFissaMensile,
      }),
    }))
    .sort((a, b) => b.risultato.risparmioAnnuo - a.risultato.risparmioAnnuo);
}

export function formatEuro(v: number): string {
  return v.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

export function formatNumero(v: number, decimals = 0): string {
  return v.toLocaleString("it-IT", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
