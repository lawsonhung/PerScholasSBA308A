import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient/apiClient.js';
import type { AbilityAPIObject, EffectEntry, FlavorTextEntry, Pokemon, PokemonName } from '../../models/pokemon.js';

let allPokemons: PokemonName[];

let searchInput: HTMLElement | null = document.getElementById("searchInput");
let searchSuggestions: HTMLElement | null = document.getElementById("searchSuggestions");

// API Calls

async function getAllPokemons(): Promise<PokemonName[]> {
  const response: AxiosResponse = await apiClient.get("/pokemon?limit=-1");
  allPokemons = response.data.results;
  return allPokemons;
}

async function getPokemon(name: string) {
  const response: AxiosResponse = await apiClient.get(`/pokemon/${name}`);
  return response.data;
}

// Functions

(async function onPageLoad() {
  try {
    getAllPokemons();

    // Event Listeners
    document.addEventListener("click", (e) => shouldClearSuggestions(e));
    searchInput?.addEventListener("input", (e) => showSuggestions((e.currentTarget as HTMLInputElement).value));
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ ${err.message}`);
    } else {
      console.log("An unknown error occured");
    }
  }
})();

async function displayPokemon(name: string) {
  if (searchInput) {
    (searchInput as HTMLInputElement).value = "";
  } else {
    throw new Error("searchInput does not exist");
  }

  clearSearchSuggestions();

  const pokemon = await getPokemon(name);
  console.log("got pokemon", pokemon);
  updateCard(pokemon);
}

function clearSearchSuggestions(): HTMLElement {
  if (searchSuggestions) {
    searchSuggestions.innerHTML = "";
  } else {
    throw new Error("datalist searchSuggestions does not exist");
  }
  return searchSuggestions;
}

function shouldClearSuggestions(e: PointerEvent) {
  const isClickInsideSuggestionsOrSearch: boolean | undefined = searchInput?.contains(e.target as HTMLInputElement);

  if (!isClickInsideSuggestionsOrSearch) {
    clearSearchSuggestions();
  };
}

// DOM Manipulation
function showSuggestions(inputValue: string) {

  const filteredPokemonNames: PokemonName[] = allPokemons.filter(pokemon => {
    return pokemon.name.includes(inputValue.toLowerCase());
  });

  searchSuggestions = clearSearchSuggestions();

  for (const pokemon of filteredPokemonNames) {
    let pokemonNameEl: HTMLDivElement = document.createElement("div");
    pokemonNameEl.innerText = pokemon.name;
    pokemonNameEl.classList.add("searchSuggestion");
    pokemonNameEl.addEventListener("click", () => displayPokemon(pokemon.name))
    searchSuggestions.append(pokemonNameEl);
  }
}

function updateCard(pokemon: Pokemon) {
  updateName(pokemon.name);
  updateHp(pokemon.stats[0]?.base_stat);
  updateImg(pokemon.sprites.front_default);
  updateAbilities(pokemon.abilities);
  updateFlavor(pokemon.species.url);
}

function updateName(name: string) {
  let nameEl = document.getElementById("name") as HTMLHeadingElement;

  if (!nameEl)
    throw new Error("name element does not exist");

  nameEl.innerText = name[0]?.toUpperCase() + name.substring(1);
}

function updateHp(hp: number | undefined) {
  let hpEl = document.getElementById("hpSpan") as HTMLSpanElement;

  if (!hpEl)
    throw new Error("hp span element does not exist");
  if (!hp)
    throw new Error("hp is undefined from Pokeapi");

  hpEl.innerText = hp.toString();
}

function updateImg(url: string) {
  let spriteImg = document.getElementById("spriteImg") as HTMLImageElement;

  if (!spriteImg)
    throw new Error("sprite image does not exist");

  const imgHeight: number = spriteImg.height;
  spriteImg.src = url;
  spriteImg.height = imgHeight;
  spriteImg.style.width = "auto";
  spriteImg.style.paddingLeft = "20%";
  spriteImg.style.paddingRight = "20%";
}


async function updateAbilities(abilities: AbilityAPIObject[]) {
  let abilitiesList = document.getElementById("abilitiesList") as HTMLDivElement;
  abilitiesList.innerHTML = "";

  abilities.forEach(async (ability) => {
    let res: AxiosResponse = await apiClient.get(ability.ability.url);

    const abilityFrag = document.createDocumentFragment();
    const nameEl: HTMLHeadingElement = document.createElement("h3");
    nameEl.innerText = res.data.name;
    nameEl.classList.add("abilityName");
    abilityFrag.append(nameEl);

    res.data.effect_entries.forEach((effectEntry: EffectEntry) => {
      if (effectEntry.language.name === "en") {
        const effectEl: HTMLParagraphElement = document.createElement("p");
        effectEl.innerText = effectEntry.effect;
        effectEl.classList.add("abilityEffect");
        abilityFrag.append(effectEl);
      }
    })

    abilitiesList.append(abilityFrag);
  });
}

async function updateFlavor(url: string) {
  const flavorEl = document.getElementById("flavorText");

  if (!flavorEl)
    throw new Error("Flavor paragraph element does not exist");

  const res: AxiosResponse = await apiClient.get(url);

  res.data.flavor_text_entries.forEach((flavorEntry: FlavorTextEntry) => {
    if (flavorEntry.language.name === "en") {
      flavorEl.innerText = flavorEntry.flavor_text;
    }
  });
}