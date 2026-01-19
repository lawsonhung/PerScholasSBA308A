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
    try {
        getAllPokemons();
        // Event Listeners
        document.addEventListener("click", (e) => shouldClearSuggestions(e));
        searchInput?.addEventListener("input", (e) => showSuggestions(e.currentTarget.value));
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(`❌ ${err.message}`);
        }
        else {
            console.log("An unknown error occured");
        }
    }
})();
async function displayPokemon(name) {
    if (searchInput) {
        searchInput.value = "";
    }
    else {
        throw new Error("searchInput does not exist");
    }
    clearSearchSuggestions();
    const pokemon = await getPokemon(name);
    console.log("got pokemon", pokemon);
    updateCard(pokemon);
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
        clearSearchSuggestions();
    }
    ;
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
function updateCard(pokemon) {
    let abilitiesList = document.getElementById("abilitiesList");
    updateName(pokemon.name);
    updateHp(pokemon.stats[0]?.base_stat);
    updateImg(pokemon.sprites.front_default);
}
function updateName(name) {
    let nameEl = document.getElementById("name");
    if (!nameEl)
        throw new Error("name element does not exist");
    nameEl.innerText = name[0]?.toUpperCase() + name.substring(1);
}
function updateHp(hp) {
    let hpEl = document.getElementById("hpSpan");
    if (!hpEl)
        throw new Error("hp span element does not exist");
    if (!hp)
        throw new Error("hp is undefined from Pokeapi");
    hpEl.innerText = hp.toString();
}
function updateImg(url) {
    let spriteImg = document.getElementById("spriteImg");
    if (!spriteImg)
        throw new Error("sprite image does not exist");
    const imgHeight = spriteImg.height;
    spriteImg.src = url;
    spriteImg.height = imgHeight;
    spriteImg.style.width = "auto";
    spriteImg.style.paddingLeft = "20%";
    spriteImg.style.paddingRight = "20%";
}
//# sourceMappingURL=script.js.map