import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient/apiClient.js';
import type { PokemonName } from '../../models/pokemon.js';

let allPokemons: PokemonName[];

const searchInput = document.getElementById("searchInput");
const searchSuggestions = document.getElementById("searchSuggestions");

// Event Listeners
searchInput?.addEventListener("input", (e) => showSuggestions((e.currentTarget as HTMLInputElement).value));

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

(async function () {
  console.log("all pokemons", await getAllPokemons());
})();

// DOM Manipulation
function showSuggestions(inputValue: string) {
  const filteredPokemonNames: PokemonName[] = allPokemons.filter(pokemon => {
    return pokemon.name.includes(inputValue.toLowerCase());
  });

  if (searchSuggestions) {
    searchSuggestions.innerHTML = "";
  } else {
    throw new Error("datalist searchSuggestions does not exist");
  }

  for (const pokemon of filteredPokemonNames) {
    let optionEl: HTMLOptionElement = document.createElement("option");
    optionEl.value = pokemon.name;
    searchSuggestions?.append(optionEl);
  }
}