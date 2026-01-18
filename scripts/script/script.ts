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
    console.log("all pokemons", await getAllPokemons());

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
    searchInput.innerText = "";
  } else {
    throw new Error("searchInput does not exist");
  }

  clearSearchSuggestions();
  const pokemon = await getPokemon(name);
  console.log("got pokemon", pokemon);
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
    console.log("clicked outside modal");
  } else {
    console.log("clicked inside modal");
  }
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

