import apiClient from '../apiClient/apiClient.js';
let allPokemons;
let searchInput = document.getElementById("searchInput");
let searchSuggestions = document.getElementById("searchSuggestions");
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
(async function onPageLoad() {
    console.log("all pokemons", await getAllPokemons());
    // Event Listeners
    document.addEventListener("click", (e) => shouldClearSuggestions(e));
    searchInput?.addEventListener("input", (e) => showSuggestions(e.currentTarget.value));
})();
async function displayPokemon(name) {
    clearSearchSuggestions();
    const pokemon = await getPokemon(name);
    console.log("got pokemon", pokemon);
}
function clearSearchSuggestions() {
    if (searchSuggestions) {
        searchSuggestions.innerHTML = "";
    }
    else {
        throw new Error("datalist searchSuggestions does not exist");
    }
    return searchSuggestions;
}
function shouldClearSuggestions(e) {
    const isClickInsideSuggestionsOrSearch = searchInput?.contains(e.target);
    if (!isClickInsideSuggestionsOrSearch) {
        console.log("clicked outside modal");
    }
    else {
        console.log("clicked inside modal");
    }
}
// DOM Manipulation
function showSuggestions(inputValue) {
    const filteredPokemonNames = allPokemons.filter(pokemon => {
        return pokemon.name.includes(inputValue.toLowerCase());
    });
    searchSuggestions = clearSearchSuggestions();
    for (const pokemon of filteredPokemonNames) {
        let pokemonNameEl = document.createElement("div");
        pokemonNameEl.innerText = pokemon.name;
        pokemonNameEl.classList.add("searchSuggestion");
        pokemonNameEl.addEventListener("click", () => displayPokemon(pokemon.name));
        searchSuggestions.append(pokemonNameEl);
    }
}
//# sourceMappingURL=script.js.map