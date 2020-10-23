export interface Ability {
  ability: {
    name: string;
    url: string;
  };
}

export interface Form {
  name: string;
  url: string;
}

export interface PokemonType {
  name: string;
  imageUrl: string;
  id: string;
}

export interface PokemonDetailsResponse extends PokemonType {
  abilities: Array<Ability>;
  forms: Array<Form>;
}

export interface PokemonAbilityResponse {
  effect_entries: Array<{ language: { name: string }; effect: string }>;
  name: string;
}

export interface PokemonFormResponse {
  is_battle_only: boolean;
  is_mega: boolean;
}

export interface PokemonDetailsType {
  abilities: Array<{ name: string; effect: string }>;
  forms: Array<{ isBattleOnly: boolean; isMega: boolean }>;
}

export interface ResponseResults {
  name: string;
  url: string;
}
export interface Response {
  results: Array<ResponseResults>;
}
