"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { ViewerState } from "@/lib/front-config";
const empty: ViewerState = {
  user: null,
  favorites: [],
  likes: [],
  history: [],
  purchases: [],
  notifications: [],
  sessions: [],
};
type Value = {
  state: ViewerState;
  ready: boolean;
  language: "zh" | "en";
  setLanguage: (v: "zh" | "en") => void;
  tr: (zh: string, en: string) => string;
  toast: (s: string) => void;
  toggleFavorite: (id: string) => void;
};
const Context = createContext<Value | null>(null);
export function ViewerProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<"zh" | "en">("zh"),
    [state, setState] = useState(empty),
    [message, toast] = useState("");
  useEffect(() => {
    try {
      const v = JSON.parse(
        localStorage.getItem("vidnest-demo-favorites") || "[]",
      );
      if (Array.isArray(v) && v.every((x) => typeof x === "string"))
        setState((s) => ({ ...s, favorites: v }));
    } catch {}
  }, []);
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => toast(""), 3500);
    return () => clearTimeout(id);
  }, [message]);
  function toggleFavorite(id: string) {
    setState((s) => {
      const favorites = s.favorites.includes(id)
        ? s.favorites.filter((x) => x !== id)
        : [...s.favorites, id];
      try {
        localStorage.setItem(
          "vidnest-demo-favorites",
          JSON.stringify(favorites),
        );
      } catch {}
      return { ...s, favorites };
    });
  }
  return (
    <Context.Provider
      value={{
        state,
        ready: true,
        language,
        setLanguage,
        tr: (zh, en) => (language === "zh" ? zh : en),
        toast,
        toggleFavorite,
      }}
    >
      {children}
      {message && (
        <div className="viewer-toast" role="status">
          {message}
        </div>
      )}
    </Context.Provider>
  );
}
export function useViewer() {
  const value = useContext(Context);
  if (!value) throw Error("Missing ViewerProvider");
  return value;
}
export function useViewerScope(..._args: unknown[]) {
  return true;
}
