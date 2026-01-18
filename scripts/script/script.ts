import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient/apiClient.js';
import type { PokemonName } from '../../models/pokemon.js';

let allPokemons: PokemonName[];

let searchInput: HTMLElement | null = document.getElementById("searchInput");
let searchSuggestions: HTMLElement | null = document.getElementById("searchSuggestions");

// API Calls

async function getAllPokemons(): Promise<PokemonName[]> {
  const response: AxiosResponse = await apiClient.get("/pokemon?limit=-1");
  allPokemons = response.data.results;
  return allPokemons;
}

async function getPokemon(name: string) {
  const response: AxiosResponse = await apiClient.get(`/pokemon/${name}`);
  return response.data;
}

// Functions

(async function onPageLoad() {
  try {
    getAllPokemons();

    // Event Listeners
    document.addEventListener("click", (e) => shouldClearSuggestions(e));
    searchInput?.addEventListener("input", (e) => showSuggestions((e.currentTarget as HTMLInputElement).value));
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ ${err.message}`);
    } else {
      console.log("An unknown error occured");
    }
  }
})();

async function displayPokemon(name: string) {
  if (searchInput) {
    (searchInput as HTMLInputElement).value = "";
  } else {
    throw new Error("searchInput does not exist");
  }

  clearSearchSuggestions();

  const pokemon = await getPokemon(name);
  console.log("got pokemon", pokemon);
  updateCard(pokemon);
}

function clearSearchSuggestions(): HTMLElement {
  if (searchSuggestions) {
    searchSuggestions.innerHTML = "";
  } else {
    throw new Error("datalist searchSuggestions does not exist");
  }
  return searchSuggestions;
}

function shouldClearSuggestions(e: PointerEvent) {
  const isClickInsideSuggestionsOrSearch: boolean | undefined = searchInput?.contains(e.target as HTMLInputElement);

  if (!isClickInsideSuggestionsOrSearch) {
    clearSearchSuggestions();
  };
}

// DOM Manipulation
function showSuggestions(inputValue: string) {

  const filteredPokemonNames: PokemonName[] = allPokemons.filter(pokemon => {
    return pokemon.name.includes(inputValue.toLowerCase());
  });

  searchSuggestions = clearSearchSuggestions();

  for (const pokemon of filteredPokemonNames) {
    let pokemonNameEl: HTMLDivElement = document.createElement("div");
    pokemonNameEl.innerText = pokemon.name;
    pokemonNameEl.classList.add("searchSuggestion");
    pokemonNameEl.addEventListener("click", () => displayPokemon(pokemon.name))
    searchSuggestions.append(pokemonNameEl);
  }
}

function updateCard(pokemon: { stats: { base_stat: any; }[]; }) {
  let hpEl = document.getElementById("hpSpan");
  const baseStat = pokemon.stats[0]?.base_stat;
  console.log("baseStat", pokemon.stats[0]);

  if (!hpEl) 
    throw new Error("hp span element does not exist");
  if (!baseStat) 
    throw new Error("pokemon is missing baseStat");

  console.log("baseStat", baseStat);
  hpEl.innerText = baseStat;
}