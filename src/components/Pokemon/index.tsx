import React, { useState } from "react";
import { PokemonType } from "../../types";

import PokemonDetails from "../PokemonDetails";

type Props = {
  pokemon: PokemonType;
};

export default function Pokemon({ pokemon }: Props) {
  const { name, imageUrl } = pokemon;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      onClick={() => {
        setShowDetails(!showDetails);
      }}
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
      {showDetails && (
        <PokemonDetails
          onClose={() => {
            console.log("CLOSE");
            setShowDetails(false);
          }}
          pokemon={pokemon}
        />
      )}
    </div>
  );
}
