import apiClient from '../apiClient/apiClient.js';
let allPokemons;
const searchInput = document.getElementById("searchInput");
// Event Listeners
searchInput?.addEventListener("input", (e) => showSuggestions(e.currentTarget.value));
// API Calls
async function getAllPokemons() {
    const response = await apiClient.get("/pokemon?limit=-1");
    allPokemons = response.data.results;
    return allPokemons;
}
async function getPokemon(name) {
    const response = await apiClient.get(`/pokemon/${name}`);
    return response.data;
}
// Functions
(async function () {
    console.log("all pokemons", await getAllPokemons());
})();
// DOM Manipulation
function showSuggestions(inputValue) {
    console.log(inputValue);
}
console.log("script getting pokemon with apiClient singleton", await getPokemon("ditto"));
//# sourceMappingURL=script.js.map