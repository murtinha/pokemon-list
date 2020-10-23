import React, { useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";

import { PokemonType, Response, ResponseResults } from "./types";
import Pokemon from "./components/Pokemon";
import { ModalContext, ContextValues } from "./context";

import "./App.css";
import PokemonDetails from "./components/PokemonDetails";

type State = {
  pokemons: Array<PokemonType>;
  hasNextPage: boolean;
  limit: number;
  loading: boolean;
};

function getIdFromUrl(url: string) {
  const regex = /\d+/g;
  const matches = url.match(regex) as Array<string>;

  return matches[1];
}

function parseResponseResult(
  result: ResponseResults
): { name: string; imageUrl: string; id: string } {
  const pokemonId = getIdFromUrl(result.url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  return { name: result.name, imageUrl, id: pokemonId };
}

async function fetchData(limit: number): Promise<Response> {
  const data = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}`);
  return data.json();
}

function App() {
  const [state, setState] = useState<State>({
    pokemons: [],
    hasNextPage: true,
    loading: false,
    limit: 0,
  });
  const [contextValues, setContextValues] = useState<ContextValues>({
    pokemon: null,
    showModal: false,
  });

  function handleSetState(newState: Object) {
    setState({ ...state, ...newState });
  }

  function handleLoadMore() {
    const increaseLimit = state.limit + 50;
    handleSetState({ loading: true });
    fetchData(increaseLimit).then((data) => {
      const parsedResults = data.results.map(parseResponseResult);
      const hasNextPage = parsedResults.length > state.pokemons.length;

      handleSetState({
        pokemons: parsedResults,
        limit: increaseLimit,
        hasNextPage,
        loading: false,
      });
    });
  }

  function setContext(newContext: Object) {
    setContextValues({ ...contextValues, ...newContext });
  }

  const infinitRef = useInfiniteScroll<HTMLDivElement>({
    hasNextPage: state.hasNextPage,
    loading: state.loading,
    onLoadMore: handleLoadMore,
  });

  return (
    <ModalContext.Provider value={{ ...contextValues, setContext }}>
      <div className="app">
        <h1 className="title">Quem é esse pokemon?</h1>
        <div className="pokemonList" ref={infinitRef}>
          {state.pokemons.map((pokemon) => (
            <Pokemon key={pokemon.name} pokemon={pokemon} />
          ))}
        </div>
      </div>
      {contextValues.showModal && <PokemonDetails />}
    </ModalContext.Provider>
  );
}

export default App;
