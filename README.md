# Per Scholas SBA 308A
An app to search for Pokemon\
Uses Vite, Axios and TypeScript

## Getting Set Up
- `npm install -D @types/axios` to install axios types to use with TypeScript
- `npm install -D @types/node` to install node types

## Making Changes
When making changes to files, you have to compile the Typescript first, then run node on the changed file, then start Vite

1. Compile Typescript for the project. <br>
`npx tsc`

2. Run node on EACH of the changed files. The path is relative to the root of the project. You do this for each file you've made changes in.  <br>
e.g.  <br>
`node ./scripts/apiClient/apiClient.js`

3. Start vite.  <br>
`npm run dev`

### Acknowledgements
[![PokeAPI](/assets/images/PokeAPI%20Logo.png)](https://pokeapi.co/)