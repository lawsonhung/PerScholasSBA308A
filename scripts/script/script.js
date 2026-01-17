import axios from 'axios';
// const axios = require('axios');
console.log("script connected");
async function getPokemon() {
    let pokemon = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto/");
    // pokemon = pokemon.data;
    console.log(pokemon);
    let pokemonData = pokemon.data;
    console.log("pokemonObj", pokemonData);
}
getPokemon();
//# sourceMappingURL=script.js.map