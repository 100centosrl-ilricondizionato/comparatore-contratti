import type { LuceInputs, CalcResult } from "./types";

export function calcolaRisparmio(input: LuceInputs): CalcResult {
  const { consumoAnnuo, attuale, nuovo } = input;

  const energiaAnnuaAttuale = consumoAnnuo * attuale.costoKwh;
  const energiaAnnuaNuovo = consumoAnnuo * nuovo.costoKwh;

  const podAnnuoAttuale = attuale.podMensile * 12;
  const podAnnuoNuovo = nuovo.podMensile * 12;

  const costoAnnuoAttuale = energiaAnnuaAttuale + podAnnuoAttuale;
  const costoAnnuoNuovo = energiaAnnuaNuovo + podAnnuoNuovo;

  const risparmioAnnuo = costoAnnuoAttuale - costoAnnuoNuovo;
  const risparmioPercentuale =
    costoAnnuoAttuale > 0 ? (risparmioAnnuo / costoAnnuoAttuale) * 100 : 0;

  return {
    costoAnnuoAttuale,
    costoAnnuoNuovo,
    podAnnuoAttuale,
    podAnnuoNuovo,
    energiaAnnuaAttuale,
    energiaAnnuaNuovo,
    risparmioAnnuo,
    risparmioPercentuale,
    risparmioMensile: risparmioAnnuo / 12,
  };
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
