import React, { useContext } from "react";
import { PokemonType } from "./types";

export interface ContextValues {
  showModal?: boolean;
  pokemon?: PokemonType | null;
}
interface ModalContextType extends ContextValues {
  setContext: (context: ContextValues) => void;
}

export const ModalContext = React.createContext<ModalContextType>({
  showModal: false,
  pokemon: null,
  setContext: () => null,
});

export function useModalContext() {
  return useContext(ModalContext);
}
