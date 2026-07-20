import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Categoria, Offerta } from "../types";

function collectionName(categoria: Categoria) {
  return categoria === "luce" ? "offerte_luce" : "offerte_gas";
}

export function useOfferte(categoria: Categoria) {
  const [offerte, setOfferte] = useState<Offerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionName(categoria)), orderBy("nome"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setOfferte(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Offerta, "id">) }))
        );
        setLoading(false);
        setErrore(null);
      },
      (err) => {
        setErrore(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [categoria]);

  async function aggiungiOfferta(o: Omit<Offerta, "id">) {
    await addDoc(collection(db, collectionName(categoria)), o);
  }

  async function aggiornaOfferta(id: string, o: Partial<Omit<Offerta, "id">>) {
    await updateDoc(doc(db, collectionName(categoria), id), o);
  }

  async function eliminaOfferta(id: string) {
    await deleteDoc(doc(db, collectionName(categoria), id));
  }

  return { offerte, loading, errore, aggiungiOfferta, aggiornaOfferta, eliminaOfferta };
}
