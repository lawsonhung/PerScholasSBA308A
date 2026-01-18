import apiClient from '../apiClient/apiClient.js';
let allPokemons;
const searchInput = document.getElementById("searchInput");
const searchSuggestions = document.getElementById("searchSuggestions");
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
    const filteredPokemonNames = allPokemons.filter(pokemon => {
        return pokemon.name.includes(inputValue.toLowerCase());
    });
    console.log("Filtered pokemon:", filteredPokemonNames);
    if (searchSuggestions) {
        searchSuggestions.innerHTML = "";
    }
    else {
        throw new Error("datalist searchSuggestions does not exist");
    }
    for (const pokemon of filteredPokemonNames) {
        let optionEl = document.createElement("option");
        optionEl.value = pokemon.name;
        searchSuggestions?.append(optionEl);
    }
}
console.log("script getting pokemon with apiClient singleton", await getPokemon("ditto"));
//# sourceMappingURL=script.js.map