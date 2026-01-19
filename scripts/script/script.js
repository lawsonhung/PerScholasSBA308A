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
    let nameEl = document.getElementById("name");
    let hpEl = document.getElementById("hpSpan");
    let spriteImg = document.getElementById("spriteImg");
    const baseStat = pokemon.stats[0]?.base_stat;
    if (!nameEl)
        throw new Error("name element does not exist");
    if (!hpEl)
        throw new Error("hp span element does not exist");
    if (!spriteImg)
        throw new Error("sprite image does not exist");
    if (!baseStat)
        throw new Error("pokemon is missing baseStat");
    nameEl.innerText = capitalizeName(pokemon.name);
    hpEl.innerText = baseStat.toString();
    const imgHeight = spriteImg.height;
    spriteImg.src = pokemon.sprites.front_default;
    styleImg(spriteImg, imgHeight);
}
function capitalizeName(name) {
    return name[0]?.toUpperCase() + name.substring(1);
}
function styleImg(img, height) {
    img.height = height;
    img.style.width = "auto";
    img.style.paddingLeft = "20%";
    img.style.paddingRight = "20%";
}
//# sourceMappingURL=script.js.map