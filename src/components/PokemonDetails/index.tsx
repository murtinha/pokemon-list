import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import {
  PokemonDetailsType,
  PokemonDetailsResponse,
  PokemonFormResponse,
  PokemonAbilityResponse,
} from "../../types";

import "./styles.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useModalContext } from "../../context";

type State = {
  pokemonDetails: PokemonDetailsType | null;
  loading: boolean;
};

function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then((data) => data.json());
}

export default function PokemonDetails() {
  const [state, setState] = useState<State>({
    pokemonDetails: null,
    loading: true,
  });
  const { setContext, pokemon } = useModalContext();

  function handleSetState(newState: Object) {
    setState({ ...state, ...newState });
  }

  useEffect(() => {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon?.id}`;
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
        forms: formsResponse.map((form) => {
          function parseFormValues(value: boolean): "Yes" | "No" {
            return value ? "Yes" : "No";
          }
          return {
            isBattleOnly: parseFormValues(form.is_battle_only),
            isMega: parseFormValues(form.is_mega),
          };
        }),
      };

      handleSetState({ loading: false, pokemonDetails });
    });
  }, [pokemon?.id]);

  function renderAbilities() {
    return state.pokemonDetails?.abilities.map((ability) => (
      <div key={ability.name} className="detailRow">
        <span className="detailTitle">{ability.name}: </span>
        <span>{ability.effect}</span>
      </div>
    ));
  }

  function renderForms() {
    return state.pokemonDetails?.forms.map((form, idx) => (
      <div key={idx} className="detailRow formDetails">
        <span className="detailTitle">Battle Only: {form.isBattleOnly}</span>
        <span className="detailTitle">Mega: {form.isMega}</span>
      </div>
    ));
  }

  return (
    <div className="pokemonDetails">
      <div className="pokemonDetailsHeader">
        <div
          onClick={() => setContext({ showModal: false })}
          className="closeButton"
        >
          Fechar
        </div>
      </div>
      <div className="pokemonDetailsContent">
        <div className="leftSide">
          <img
            width={300}
            height={300}
            className="pokemonImage"
            src={pokemon?.imageUrl}
            alt="Imagem não existente"
          />
        </div>
        <div className="rightSide">
          <h2 className="pokemonDetailsTitle">{pokemon?.name}</h2>
          {state.loading ? (
            <div className="loaderWrapper">
              <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
            </div>
          ) : (
            <div className="pokemonAbilities">
              {state.pokemonDetails && renderForms()}
              {state.pokemonDetails && renderAbilities()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
