## setup for typescript
- `touch server.mts` create a module typescript file
- `npm init -y` creates package.json file
- `npm i -g nodemon` installs nodemon gloabally, only needs to install once
- `npm i express` installs express
- In package.json add these scripts, 
```
"start": "npx tsc && node server.mjs",
"initialize": "npx tsc --init",
"dev": "npx tsc && nodemon server.mjs"
```
- ## when using node.js for ts
`npm i -D @types/node`
- and in tsconfig.json
- comment out types: []
- uncomment lib and types for nodejs

### Notes
- `npx tsc && node server.mjs` compiles the typescript file and run the compiled file to javascript
- `npm run initialize  -> npx tsc --init` initialize the typescript file
- `npx tsc && nodemon server.mjs` runs nodemon
### Installing packages in Typescript
- `npm i express`
- `npm i -D @types/express`
## if package doesn't have types 
- create a types folder at root
- create `modulename.d.ts` -> `rowdy-logger.d.ts`
- `declare module "rowdy-logger";` in file -> replace rowdy-logger with moduleName