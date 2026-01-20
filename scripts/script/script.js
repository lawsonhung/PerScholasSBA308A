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
    console.log("got pokemon", name, pokemon);
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
    updateName(pokemon.name);
    updateEvolutionChain(pokemon.species.url);
    updateHp(pokemon.stats[0]);
    updateImg(pokemon.sprites.front_default);
    updatePhysicalProps(pokemon.id, pokemon.species.url, pokemon.height, pokemon.weight);
    updateAbilities(pokemon.abilities);
    updateDamageRelations(pokemon.types);
    updateFlavor(pokemon.species.url);
}
function updateName(name) {
    let nameEl = document.getElementById("name");
    if (!nameEl)
        throw new Error("name element does not exist");
    nameEl.innerText = capitalizeFirstLetterOf(name);
}
async function updateEvolutionChain(speciesURL) {
    const evolvesFromEl = document.getElementById("evolvesFrom");
    let res = await apiClient.get(speciesURL);
    if (!res.data.evolves_from_species) {
        evolvesFromEl.innerText = "";
        return;
    }
    const name = res.data.evolves_from_species.name;
    evolvesFromEl.innerText = `Evolves from ${capitalizeFirstLetterOf(name)}`;
    console.log("evolves from", name);
}
function updateHp(stat) {
    const statLabelEl = document.getElementById("statLabelSpan");
    const hpEl = document.getElementById("hpSpan");
    if (!statLabelEl)
        throw new Error("stat name element does not exist");
    if (!hpEl)
        throw new Error("hp span element does not exist");
    if (!stat)
        throw new Error("base stats are undefined from Pokeapi");
    if (!stat.stat.name)
        throw new Error("hp stat name does not exist");
    if (!stat.base_stat)
        throw new Error("hp is undefined from Pokeapi");
    statLabelEl.innerText = stat.stat.name.toUpperCase();
    hpEl.innerText = stat.base_stat.toString();
}
function updateImg(url) {
    let spriteImg = document.getElementById("spriteImg");
    if (!spriteImg)
        throw new Error("sprite image does not exist");
    const imgHeight = spriteImg.height;
    spriteImg.src = url;
    spriteImg.height = imgHeight;
    spriteImg.style.width = "auto";
}
async function updatePhysicalProps(id, speciesURL, height, weight) {
    const pokedexIdSpan = document.getElementById("pokedexId");
    const genusSpan = document.getElementById("genus");
    const heightSpan = document.getElementById("height");
    const weightSpan = document.getElementById("weight");
    pokedexIdSpan.innerText = id.toString();
    genusSpan.innerText = await updateGenus(speciesURL);
    heightSpan.innerText = heightInFeetInches(height);
    weightSpan.innerText = weightInPounds(weight);
}
async function updateGenus(url) {
    const res = await apiClient.get(url);
    let result = "";
    res.data.genera.forEach((genus) => {
        if (genus.language.name === "en")
            result = genus.genus;
    });
    return result;
}
function heightInFeetInches(decimeterValue) {
    const inches = Math.round(decimeterValue * 3.93701);
    const feet = Math.floor(inches / 12);
    if (inches % 12 === 0)
        return `${feet}'`;
    else
        return `${feet}'${inches % 12}"`;
}
function weightInPounds(hectogramValue) {
    return (hectogramValue * 0.220462).toFixed(1);
}
async function updateAbilities(abilities) {
    let abilitiesList = document.getElementById("abilitiesList");
    abilitiesList.innerHTML = "";
    abilities.forEach(async (ability) => {
        let res = await apiClient.get(ability.ability.url);
        const abilityFrag = document.createDocumentFragment();
        const nameEl = document.createElement("h3");
        nameEl.innerText = capitalizeFirstLetterOf(res.data.name);
        nameEl.classList.add("abilityName");
        abilityFrag.append(nameEl);
        res.data.effect_entries.forEach((effectEntry) => {
            if (effectEntry.language.name === "en") {
                const effectEl = document.createElement("p");
                effectEl.innerText = effectEntry.short_effect.replace(/\n\n/g, '\n');
                effectEl.classList.add("abilityEffect");
                abilityFrag.append(effectEl);
            }
        });
        abilitiesList.append(abilityFrag);
    });
}
async function updateDamageRelations(types) {
    types.forEach(async (type) => {
        const res = await apiClient.get(type.type.url);
        console.log(res.data);
    });
}
async function updateFlavor(url) {
    const flavorEl = document.getElementById("flavorText");
    if (!flavorEl)
        throw new Error("Flavor paragraph element does not exist");
    const res = await apiClient.get(url);
    res.data.flavor_text_entries.forEach((flavorEntry) => {
        if (flavorEntry.language.name === "en") {
            flavorEl.innerText = flavorEntry.flavor_text.replace(/\n/g, '');
        }
    });
}
function capitalizeFirstLetterOf(name) {
    return name[0]?.toUpperCase() + name.substring(1);
}
//# sourceMappingURL=script.js.map