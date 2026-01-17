import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient/apiClient.js';
import type { PokemonName } from '../../models/pokemon.js';

let allPokemons: PokemonName[];

const searchInput = document.getElementById("searchInput");

// Event Listeners
searchInput?.addEventListener("input", (e) => showSuggestions((e.currentTarget as HTMLInputElement).value))

// API Calls

async function getAllPokemons(): Promise<PokemonName[]> {
  const response: AxiosResponse = await apiClient.get("/pokemon?limit=-1");
  allPokemons = response.data.results;
  return allPokemons;
}

async function getPokemon(name: string) {
  const response = await apiClient.get(`/pokemon/${name}`);
  return response.data;
}

// Functions

(async function() {
  console.log("all pokemons", await getAllPokemons());
})();

// DOM Manipulation
function showSuggestions(inputValue: string) {
  console.log(inputValue);
}

console.log("script getting pokemon with apiClient singleton", await getPokemon("ditto"));