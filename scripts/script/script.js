import apiClient from '../apiClient/apiClient.js';
console.log("script connected");
async function getPokemon(name) {
    const response = await apiClient.get(`/pokemon/${name}`);
    return response.data;
}
console.log("script getting pokemon with apiClient singleton", await getPokemon("ditto"));
//# sourceMappingURL=script.js.map