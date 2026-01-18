import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient/apiClient.js';
import type { PokemonName } from '../../models/pokemon.js';

let allPokemons: PokemonName[];

let searchInput = document.getElementById("searchInput");
let searchSuggestions = document.getElementById("searchSuggestions");

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
  console.log("all pokemons", await getAllPokemons());

  // Event Listeners
  searchInput?.addEventListener("input", (e) => showSuggestions((e.currentTarget as HTMLInputElement).value));
})();

async function displayPokemon(name: string) {
  clearSearchSuggestions();
  const pokemon = await getPokemon(name);
  console.log(pokemon);
}

function clearSearchSuggestions() {
  if (searchSuggestions) {
    searchSuggestions.innerHTML = "";
  } else {
    throw new Error("datalist searchSuggestions does not exist");
  }
  return searchSuggestions;
}

// DOM Manipulation
function showSuggestions(inputValue: string) {

  console.log(inputValue);

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

