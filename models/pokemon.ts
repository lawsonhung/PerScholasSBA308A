export interface PokemonName {
  name: string;
  url: string;
}

export interface Pokemon {
  name: string;
  stats: Stat[];
  sprites: {
    front_default: string;
  }
}

interface Stat {
  base_stat: number;
  stat: StatObject
}

interface StatObject {
  name: string;
  url: string;
}