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
    species: APIObject;
    types: TypeAPIObject[];
}
export interface Stat {
    base_stat: number;
    stat: APIObject;
}
export interface AbilityAPIObject {
    ability: APIObject;
}
export interface TypeAPIObject {
    type: APIObject;
}
export interface Type {
    name: string;
    damage_relations: {
        double_damage_from: APIObject[];
        double_damage_to: APIObject[];
        half_damage_from: APIObject[];
        half_damage_to: APIObject[];
        no_damage_from: APIObject[];
        no_damage_to: APIObject;
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
    evolution_chain: APIObject;
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
export interface APIObject {
    name: string;
    url: string;
}
export {};
//# sourceMappingURL=pokemon.d.ts.map