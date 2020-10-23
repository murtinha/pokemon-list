import React from "react";

import { PokemonType } from "../../types";
import { useModalContext } from "../../context";

import "./styles.css";

type Props = {
  pokemon: PokemonType;
};

export default function Pokemon({ pokemon }: Props) {
  const { name, imageUrl } = pokemon;
  const { setContext } = useModalContext();

  return (
    <div
      onClick={() => setContext({ showModal: true, pokemon })}
      className="pokemonItem"
      key={name}
    >
      <img
        width={300}
        height={300}
        className="pokemonImage"
        src={imageUrl}
        alt="Imagem não existente"
      />
      <div className="pokemonName">{name}</div>
    </div>
  );
}
