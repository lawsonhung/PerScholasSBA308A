export interface PokemonName {
    name: string;
    url: string;
}
export interface Pokemon {
    name: string;
    stats: Stat[];
    sprites: {
        front_default: string;
    };
    abilities: AbilityAPIObject[];
}
interface Stat {
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
    language: {
        name: string;
    };
}
export {};
//# sourceMappingURL=pokemon.d.ts.map