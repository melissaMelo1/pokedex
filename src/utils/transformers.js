/**
 * Funções para transformar os dados da API em formatos mais adequados para a aplicação
 */

/**
 * Transforma os dados brutos de um Pokémon da API em um formato mais amigável
 * @param {Object} pokemonData - Dados brutos do Pokémon da API
 * @returns {Object} - Dados formatados do Pokémon
 */
export const transformPokemonData = (pokemonData) => {
  return {
    id: pokemonData.id,
    name: pokemonData.name,
    image: pokemonData.sprites.front_default,
    types: pokemonData.types.map(type => type.type.name),
    height: pokemonData.height / 10, // Convertendo para metros
    weight: pokemonData.weight / 10, // Convertendo para kg
    abilities: pokemonData.abilities.map(ability => ability.ability.name),
    stats: transformPokemonStats(pokemonData.stats),
  };
};

/**
 * Transforma os dados de estatísticas de um Pokémon
 * @param {Array} stats - Array de estatísticas do Pokémon
 * @returns {Object} - Objeto com as estatísticas formatadas
 */
export const transformPokemonStats = (stats) => {
  const statsObj = {};
  
  stats.forEach(stat => {
    // Convertendo nomes como 'special-attack' para 'specialAttack'
    const statName = stat.stat.name.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    statsObj[statName] = stat.base_stat;
  });
  
  return statsObj;
};

/**
 * Formata o nome do Pokémon para exibição (primeira letra maiúscula)
 * @param {string} name - Nome do Pokémon
 * @returns {string} - Nome formatado
 */
export const formatPokemonName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * Formata o ID do Pokémon para exibição (ex: #001)
 * @param {number} id - ID do Pokémon
 * @returns {string} - ID formatado
 */
export const formatPokemonId = (id) => {
  return `#${String(id).padStart(3, '0')}`;
}; 