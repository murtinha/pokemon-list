import React, { useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import "./App.css";

interface Ability {
  ability: {
    name: string;
    url: string;
  };
  isHidden: boolean;
  slot: number;
}

interface Form {
  name: string;
  url: string;
}

interface Pokemon {
  name: string;
  imageUrl: string;
  id: number;
  abilities: Array<Ability>;
  forms: Array<Form>;
}

interface ResponseResults {
  name: string;
  url: string;
}
interface Response {
  results: Array<ResponseResults>;
}

type State = {
  pokemons: Array<Pokemon>;
  hasNextPage: boolean;
  limit: number;
  loading: boolean;
};

function Pokemon({ name, imageUrl, id, abilities, forms }: Pokemon) {
  return (
    <div className="pokemonCard">
      <div className="imageWrapper">
        <img className="image" src={imageUrl} alt="Pokemon" />
      </div>
      <div className="content">
        <span>Nome: {name}</span>
      </div>
    </div>
  );
}

function getIdFromUrl(url: string) {
  const regex = /\d+/g;
  const matches = url.match(regex) as Array<string>;

  return matches[1];
}

function parseResponseResult(
  result: ResponseResults
): { name: string; imageUrl: string } {
  const pokemonId = getIdFromUrl(result.url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  return { name: result.name, imageUrl };
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

  const infinitRef = useInfiniteScroll<HTMLUListElement>({
    hasNextPage: state.hasNextPage,
    loading: state.loading,
    onLoadMore: handleLoadMore,
  });

  return (
    <div className="App">
      <ul className="pokemonList" ref={infinitRef}>
        {state.pokemons.map((pokemon) => (
          <li key={pokemon.name}>{pokemon.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
