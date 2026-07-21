import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Categoria } from "../types";

interface IndiceData {
  valore: number;
  aggiornatoIl: string; // ISO date string
}

// documento Firestore condiviso per ciascun indice di mercato:
// PUN per la luce, PSV per il gas
const DOC_ID: Record<Categoria, string> = {
  luce: "pun_luce",
  gas: "psv_gas",
};

export function useIndiceMercato(categoria: Categoria) {
  const [indice, setIndice] = useState<IndiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const ref = doc(db, "impostazioni", DOC_ID[categoria]);
    const unsub = onSnapshot(ref, (snap) => {
      setIndice(snap.exists() ? (snap.data() as IndiceData) : null);
      setLoading(false);
    });
    return () => unsub();
  }, [categoria]);

  async function aggiornaIndice(valore: number) {
    const ref = doc(db, "impostazioni", DOC_ID[categoria]);
    await setDoc(ref, { valore, aggiornatoIl: new Date().toISOString() });
  }

  return { indice, loading, aggiornaIndice };
}
