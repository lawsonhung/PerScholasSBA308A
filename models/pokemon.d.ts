export interface PokemonName {
    name: string;
    url: string;
}
export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    stats: Stat[];
    sprites: {
        front_default: string;
    };
    abilities: AbilityAPIObject[];
    species: {
        url: string;
    };
}
export interface Stat {
    base_stat: number;
    stat: StatObject;
}
interface StatObject {
    name: string;
    url: string;
}
export interface AbilityAPIObject {
    ability: {
        name: string;
        url: string;
    };
}
export interface Ability {
    effect_entries: EffectEntry;
}
export interface EffectEntry {
    effect: string;
    language: Language;
    short_effect: string;
}
export interface Species {
    genera: Genus[];
    flavor_text_entries: FlavorTextEntry;
    evolution_chain: {
        url: string;
    };
}
export interface Genus {
    genus: string;
    language: Language;
}
export interface FlavorTextEntry {
    flavor_text: string;
    language: Language;
}
interface Language {
    name: string;
}
export {};
//# sourceMappingURL=pokemon.d.ts.map