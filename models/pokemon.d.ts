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
    abilities: Ability[];
}
interface Stat {
    base_stat: number;
    stat: StatObject;
}
interface StatObject {
    name: string;
    url: string;
}
interface Ability {
    name: string;
    url: string;
}
export {};
//# sourceMappingURL=pokemon.d.ts.map