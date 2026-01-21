import type { AxiosResponse } from 'axios';
import apiClient from '../apiClient/apiClient.js';
import type { AbilityAPIObject, APIObject, EffectEntry, FlavorTextEntry, Genus, Pokemon, PokemonName, Stat, TypeAPIObject } from '../../models/pokemon.js';

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
  console.log("got pokemon", name, pokemon);
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
  updateEvolutionChain(pokemon.species.url);
  updateHp(pokemon.stats[0]);
  updateImg(pokemon.sprites.front_default);
  updatePhysicalProps(pokemon.id, pokemon.species.url, pokemon.height, pokemon.weight);
  updateAbilities(pokemon.abilities);
  updateDamageRelations(pokemon.types);
  updateFlavor(pokemon.species.url);
}

function updateName(name: string) {
  let nameEl = document.getElementById("name") as HTMLHeadingElement;

  if (!nameEl)
    throw new Error("name element does not exist");

  nameEl.innerText = capitalizeFirstLetterOf(name);
}

async function updateEvolutionChain(speciesURL: string) {
  const evolvesFromEl = document.getElementById("evolvesFrom") as HTMLParagraphElement;
  let res: AxiosResponse = await apiClient.get(speciesURL);

  if (!res.data.evolves_from_species) {
    evolvesFromEl.innerText = "";
    return;
  }

  const name: string = res.data.evolves_from_species.name;

  evolvesFromEl.innerText = `Evolves from ${capitalizeFirstLetterOf(name)}`;
  console.log("evolves from", name);
}

function updateHp(stat: Stat | undefined) {
  const statLabelEl = document.getElementById("statLabelSpan") as HTMLSpanElement;
  const hpEl = document.getElementById("hpSpan") as HTMLSpanElement;

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

function updateImg(url: string) {
  let spriteImg = document.getElementById("spriteImg") as HTMLImageElement;

  if (!spriteImg)
    throw new Error("sprite image does not exist");

  const imgHeight: number = spriteImg.height;
  spriteImg.src = url;
  spriteImg.height = imgHeight;
  spriteImg.style.width = "auto";
}

async function updatePhysicalProps(id: number, speciesURL: string, height: number, weight: number) {
  const pokedexIdSpan = document.getElementById("pokedexId") as HTMLSpanElement;
  const genusSpan = document.getElementById("genus") as HTMLSpanElement;
  const heightSpan = document.getElementById("height") as HTMLSpanElement;
  const weightSpan = document.getElementById("weight") as HTMLSpanElement;

  pokedexIdSpan.innerText = id.toString();
  genusSpan.innerText = await updateGenus(speciesURL);
  heightSpan.innerText = heightInFeetInches(height);
  weightSpan.innerText = weightInPounds(weight);
}

async function updateGenus(url: string): Promise<string> {
  const res: AxiosResponse = await apiClient.get(url);
  let result: string = "";

  res.data.genera.forEach((genus: Genus) => {
    if (genus.language.name === "en")
      result = genus.genus;
  })

  return result;
}

function heightInFeetInches(decimeterValue: number): string {
  const inches = Math.round(decimeterValue * 3.93701);
  const feet = Math.floor(inches / 12)
  if (inches % 12 === 0)
    return `${feet}'`;
  else
    return `${feet}'${inches % 12}"`;
}

function weightInPounds(hectogramValue: number): string {
  return (hectogramValue * 0.220462).toFixed(1)
}

async function updateAbilities(abilities: AbilityAPIObject[]) {
  let abilitiesList = document.getElementById("abilitiesList") as HTMLDivElement;
  abilitiesList.innerHTML = "";

  abilities.forEach(async (ability) => {
    let res: AxiosResponse = await apiClient.get(ability.ability.url);

    const abilityFrag = document.createDocumentFragment();
    const nameEl: HTMLHeadingElement = document.createElement("h3");
    nameEl.innerText = capitalizeFirstLetterOf(res.data.name);
    nameEl.classList.add("abilityName");
    abilityFrag.append(nameEl);

    res.data.effect_entries.forEach((effectEntry: EffectEntry) => {
      if (effectEntry.language.name === "en") {
        const effectEl: HTMLParagraphElement = document.createElement("p");
        effectEl.innerText = effectEntry.short_effect.replace(/\n\n/g, '\n');
        effectEl.classList.add("abilityEffect");
        abilityFrag.append(effectEl);
      }
    })

    abilitiesList.append(abilityFrag);
  });
}

async function updateDamageRelations(types: TypeAPIObject[]) {
  let weaknesses: string[] = [];
  let resistances: string[] = [];

  console.log("types", types);
  for (let typeIndex in types) {
    const type = types[typeIndex];

    if (!type)
      throw new Error("type is undefined");

    const tempWeaknesses = await getWeaknesses(type);
    const tempResistances = await getResistances(type);
    weaknesses.push(...tempWeaknesses);
    resistances.push(...tempResistances);
  }

  const uniqueWeaknesses = [...new Set(weaknesses)];
  const uniqueResistances = [...new Set(resistances)]
  console.log("weaknesses", uniqueWeaknesses);
  console.log("resistances", uniqueResistances);

  const weaknessEl = document.getElementById("weakessList") as HTMLDivElement;
  const resistanceEl = document.getElementById("resistanceList") as HTMLDivElement;
  weaknessEl.replaceChildren();
  resistanceEl.replaceChildren();

  uniqueWeaknesses.forEach(weakness => {
    const newWeakness: HTMLParagraphElement = document.createElement("p");
    newWeakness.innerText = capitalizeFirstLetterOf(weakness as string);
    weaknessEl.append(newWeakness);
  });

  uniqueResistances.forEach(resistance => {
    console.log(resistance);
    const newResistance: HTMLParagraphElement = document.createElement("p");
    newResistance.innerText = capitalizeFirstLetterOf(resistance as string);
    resistanceEl.append(newResistance);
  });
}

async function getWeaknesses(type: TypeAPIObject) {
  const weaknessEl = document.getElementById("weakessList") as HTMLDivElement;
  weaknessEl.replaceChildren();

  const res: AxiosResponse = await apiClient.get(type.type.url);
  const damageRelations = res.data.damage_relations;

  const doubleDamageFrom = damageRelations.double_damage_from.map(({ name }: APIObject) => name);
  const halfDamageTo = damageRelations.half_damage_to.map(({ name }: APIObject) => name);
  const halfDamageToSet = new Set(halfDamageTo);
  const weaknesses: string[] = [...new Set(doubleDamageFrom.filter((type: string) =>
    halfDamageToSet.has(type)
  ))] as string[];

  return weaknesses;
}

async function getResistances(type: TypeAPIObject) {
  const resistanceEl = document.getElementById("resistanceList") as HTMLDivElement;
  resistanceEl.replaceChildren();

  const res: AxiosResponse = await apiClient.get(type.type.url);
  const damageRelations = res.data.damage_relations;

  const doubleDamageTo = damageRelations.double_damage_to.map(({ name }: APIObject) => name);
  const halfDamageFrom = damageRelations.half_damage_from.map(({ name }: APIObject) => name);
  const halfDamageFromSet = new Set(halfDamageFrom);
  const resistances: string[] = [...new Set(doubleDamageTo.filter((type: string) => {
    return halfDamageFromSet.has(type)
  }))] as string[];

  return resistances;
}

async function updateFlavor(url: string) {
  const flavorEl = document.getElementById("flavorText");

  if (!flavorEl)
    throw new Error("Flavor paragraph element does not exist");

  const res: AxiosResponse = await apiClient.get(url);

  res.data.flavor_text_entries.forEach((flavorEntry: FlavorTextEntry) => {
    if (flavorEntry.language.name === "en") {
      flavorEl.innerText = flavorEntry.flavor_text.replace(/\n/g, ' ');
    }
  });
}

function capitalizeFirstLetterOf(name: string): string {
  return name[0]?.toUpperCase() + name.substring(1);
}