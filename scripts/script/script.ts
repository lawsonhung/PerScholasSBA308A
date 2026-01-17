import axios from 'axios';
import { getPokemon } from '../apiClient/apiClient.js';

console.log("script connected");

// async function getPokemon() {
//   let pokemon = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto/");
//   let pokemonData: Object = pokemon.data;
//   console.log("pokemonObj", pokemonData);
// }

getPokemon("ditto");
