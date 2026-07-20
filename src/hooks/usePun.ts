import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";

interface PunData {
  valore: number;
  aggiornatoIl: string; // ISO date string
}

const DOC_REF_PATH = ["impostazioni", "pun_luce"] as const;

export function usePun() {
  const [pun, setPun] = useState<PunData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, ...DOC_REF_PATH);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setPun(snap.data() as PunData);
      } else {
        setPun(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function aggiornaPun(valore: number) {
    const ref = doc(db, ...DOC_REF_PATH);
    await setDoc(ref, { valore, aggiornatoIl: new Date().toISOString() });
  }

  return { pun, loading, aggiornaPun };
}
