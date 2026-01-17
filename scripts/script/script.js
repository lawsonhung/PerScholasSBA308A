import apiClient from '../apiClient/apiClient.js';
let allPokemons;
async function getAllPokemons() {
    const response = await apiClient.get("/pokemon?limit=-1");
    allPokemons = response.data.results;
    return allPokemons;
}
async function getPokemon(name) {
    const response = await apiClient.get(`/pokemon/${name}`);
    return response.data;
}
console.log("script getting pokemon with apiClient singleton", await getPokemon("ditto"));
console.log("all pokemon", await getAllPokemons());
//# sourceMappingURL=script.js.map