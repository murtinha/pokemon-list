import React, { useEffect, useState } from "react";
import {
  PokemonType,
  PokemonDetailsType,
  PokemonDetailsResponse,
  PokemonFormResponse,
  PokemonAbilityResponse,
} from "../../types";

type Props = {
  pokemon: PokemonType;
  onClose: () => void;
};

function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then((data) => data.json());
}

export default function PokemonDetails({ pokemon, onClose }: Props) {
  const [
    pokemonDetails,
    setPokemonDetails,
  ] = useState<PokemonDetailsType | null>(null);

  useEffect(() => {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
    fetchData<PokemonDetailsResponse>(pokemonUrl).then(async (details) => {
      const { abilities, forms } = details;
      const abilitiesResponse = await Promise.all(
        abilities.map(({ ability }) =>
          fetchData<PokemonAbilityResponse>(ability.url)
        )
      );
      const formsResponse = await Promise.all(
        forms.map((form) => fetchData<PokemonFormResponse>(form.url))
      );

      const pokemonDetails = {
        abilities: abilitiesResponse.map((ability) => {
          const effect =
            ability.effect_entries.find((efct) => efct.language.name === "en")
              ?.effect || "";

          return { effect, name: ability.name };
        }),
        forms: formsResponse.map((form) => ({
          isBattleOnly: form.is_battle_only,
          isMega: form.is_mega,
        })),
      };

      setPokemonDetails(pokemonDetails);
    });
  }, []);

  function renderAbilities() {
    return pokemonDetails?.abilities.map((ability) => (
      <div className="pokemonAbility">
        <span className="abilityName">{ability.name}: </span>
        <span className="abilityEffect">{ability.effect}</span>
      </div>
    ));
  }

  return (
    <div className="pokemonDetails">
      <div className="pokemonDetailsHeader">
        <div onClick={onClose} className="closeButton">
          Fechar
        </div>
      </div>
      <div className="pokemonDetailsContent">
        <div className="leftSide">
          <img
            width={300}
            height={300}
            className="pokemonImage"
            src={pokemon.imageUrl}
            alt="Imagem não existente"
          />
        </div>
        <div className="rightSide">
          <h2 className="pokemonDetailsTitle">{pokemon.name}</h2>
          <div className="pokemonAbilities">
            {pokemonDetails && renderAbilities()}
          </div>
        </div>
      </div>
    </div>
  );
}
