import { api } from '../api/api';
import { POKEMON_LIMIT } from '../config/constants';
import { Pokemon } from '../models/Pokemon';

/**
 * Busca uma lista de Pokémons da API
 * @param {number} limit - Número de Pokémons a serem buscados
 * @param {number} offset - Índice a partir do qual buscar os Pokémons
 * @returns {Promise<Array>} - Lista de Pokémons formatados
 */
export const fetchPokemons = async (limit = POKEMON_LIMIT, offset = 0) => {
  try {
    console.log(`🌐 Buscando Pokémon - limit: ${limit}, offset: ${offset}`);
    
    // Buscamos a lista de Pokémons com o limite e offset especificados
    const response = await api.getPokemons({ limit, offset });
    const { results } = response.data;
    
    console.log(`🌐 Recebidos ${results.length} resultados da API`);
    console.log(`🌐 Nomes dos Pokémon recebidos:`, results.map(p => p.name));
    
    // Para cada Pokémon, buscamos os detalhes
    const pokemonDetailsPromises = results.map(pokemon => 
      api.getPokemonByName(pokemon.name)
    );
    
    // Aguardamos todas as requisições de detalhes
    const pokemonDetailsResponses = await Promise.all(pokemonDetailsPromises);
    
    console.log(`🌐 Detalhes recebidos para ${pokemonDetailsResponses.length} Pokémon`);
    
    // Transformamos os dados para o formato que precisamos
    const formattedPokemons = pokemonDetailsResponses.map(response => 
      Pokemon.fromApiData(response.data).toJSON()
    );
    
    console.log(`🌐 Pokémon formatados: ${formattedPokemons.length}`);
    console.log(`🌐 IDs dos Pokémon formatados:`, formattedPokemons.map(p => p.id));
    
    // Verificar se há IDs duplicados
    const idSet = new Set();
    const duplicateIds = [];
    const uniquePokemons = [];
    
    formattedPokemons.forEach(pokemon => {
      if (idSet.has(pokemon.id)) {
        duplicateIds.push(pokemon.id);
      } else {
        idSet.add(pokemon.id);
        uniquePokemons.push(pokemon);
      }
    });
    
    if (duplicateIds.length > 0) {
      console.warn(`⚠️ Encontrados IDs duplicados na resposta da API:`, duplicateIds);
    }
    
    console.log(`🌐 Pokémon únicos retornados: ${uniquePokemons.length}`);
    return uniquePokemons;
  } catch (error) {
    console.error('❌ Erro ao buscar Pokémons:', error);
    throw new Error('Não foi possível carregar os Pokémons. Tente novamente mais tarde.');
  }
};

/**
 * Busca um Pokémon específico pelo ID com detalhes completos
 * @param {number} id - ID do Pokémon
 * @returns {Promise<Object>} - Dados do Pokémon formatados com detalhes completos
 */
export const fetchPokemonById = async (id) => {
  try {
    // Busca os dados básicos do Pokémon
    const pokemonResponse = await api.getPokemonById(id);
    const pokemonData = pokemonResponse.data;
    
    // Busca os dados da espécie para obter a descrição
    const speciesResponse = await api.getPokemonSpecies(pokemonData.species.url);
    const speciesData = speciesResponse.data;
    
    // Busca as entradas da Pokédex em português ou inglês
    const flavorTextEntries = speciesData.flavor_text_entries || [];
    const ptBrEntry = flavorTextEntries.find(entry => entry.language.name === 'pt-br');
    const enEntry = flavorTextEntries.find(entry => entry.language.name === 'en');
    const description = (ptBrEntry || enEntry)?.flavor_text?.replace(/\f/g, ' ') || '';
    
    // Busca a cadeia de evolução
    let evolutionChain = [];
    if (speciesData.evolution_chain?.url) {
      const evolutionResponse = await api.getEvolutionChain(speciesData.evolution_chain.url);
      evolutionChain = extractEvolutionChain(evolutionResponse.data.chain);
    }
    
    // Cria o Pokémon com todos os detalhes
    const pokemon = Pokemon.fromApiData(pokemonData, {
      description,
      evolutionChain,
      genera: speciesData.genera,
      isBaby: speciesData.is_baby,
      isLegendary: speciesData.is_legendary,
      isMythical: speciesData.is_mythical,
      habitat: speciesData.habitat?.name,
      generation: speciesData.generation?.name,
    });
    
    return pokemon.toJSON();
  } catch (error) {
    console.error(`Erro ao buscar Pokémon com ID ${id}:`, error);
    throw new Error(`Não foi possível carregar o Pokémon #${id}. Tente novamente mais tarde.`);
  }
};

/**
 * Busca Pokémons pelo nome ou ID
 * @param {string} query - Nome ou ID do Pokémon
 * @returns {Promise<Array>} - Lista de Pokémons que correspondem à busca
 */
export const searchPokemons = async (query) => {
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    console.log(`🔍 Buscando Pokémon com query: "${query}"`);
    
    // Verificar se a query é um número (ID) ou texto (nome)
    const isNumeric = /^\d+$/.test(query);
    const searchTerm = query.toLowerCase().trim();
    
    if (isNumeric) {
      // Se for um número, buscar diretamente pelo ID
      try {
        const pokemon = await fetchPokemonById(parseInt(searchTerm));
        console.log(`🔍 Pokémon encontrado por ID: ${pokemon.name} (#${pokemon.id})`);
        return [pokemon];
      } catch (error) {
        // Se não encontrar pelo ID exato, buscar Pokémon cujo ID começa com o número
        console.log(`🔍 Pokémon não encontrado pelo ID exato: ${searchTerm}, buscando IDs similares`);
        
        // Buscar um conjunto de Pokémon e filtrar por IDs que começam com o número
        const allPokemons = await fetchPokemons(100);
        const filteredByIdPrefix = allPokemons.filter(pokemon => 
          pokemon.id.toString().startsWith(searchTerm)
        );
        
        console.log(`🔍 Pokémon encontrados por ID similar: ${filteredByIdPrefix.length}`);
        return filteredByIdPrefix;
      }
    } else {
      // Se for texto, buscar pelo nome
      try {
        // Normalizar o nome para busca (remover hífens, espaços, etc.)
        const normalizedSearchTerm = normalizeNameForSearch(searchTerm);
        
        // Tentar buscar pelo nome exato primeiro
        try {
          const response = await api.getPokemonByName(normalizedSearchTerm);
          const pokemon = Pokemon.fromApiData(response.data).toJSON();
          console.log(`🔍 Pokémon encontrado por nome exato: ${pokemon.name} (#${pokemon.id})`);
          return [pokemon];
        } catch (exactNameError) {
          console.log(`🔍 Tentando buscar com nome original: ${searchTerm}`);
          // Tentar com o nome original se o normalizado falhar
          const response = await api.getPokemonByName(searchTerm);
          const pokemon = Pokemon.fromApiData(response.data).toJSON();
          console.log(`🔍 Pokémon encontrado pelo nome original: ${pokemon.name} (#${pokemon.id})`);
          return [pokemon];
        }
      } catch (error) {
        // Se não encontrar pelo nome exato, buscar nomes similares
        console.log(`🔍 Pokémon não encontrado pelo nome exato: ${searchTerm}, buscando nomes similares`);
        
        // Buscar um conjunto maior de Pokémon para aumentar as chances de encontrar
        const allPokemons = await fetchPokemons(300);
        
        // Filtrar por nomes que contêm o texto, com diferentes estratégias de correspondência
        const filteredByName = allPokemons.filter(pokemon => {
          const pokemonName = pokemon.name.toLowerCase();
          const normalizedPokemonName = normalizeNameForSearch(pokemonName);
          const normalizedSearchTerm = normalizeNameForSearch(searchTerm);
          
          // Verificar diferentes formas de correspondência
          return pokemonName.includes(searchTerm) || 
                 normalizedPokemonName.includes(normalizedSearchTerm) ||
                 pokemonName.startsWith(searchTerm) ||
                 normalizedPokemonName.startsWith(normalizedSearchTerm);
        });
        
        // Ordenar os resultados para que os mais relevantes apareçam primeiro
        // (aqueles que começam com o termo de busca têm prioridade)
        filteredByName.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          const aStartsWith = aName.startsWith(searchTerm);
          const bStartsWith = bName.startsWith(searchTerm);
          
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return aName.localeCompare(bName);
        });
        
        console.log(`🔍 Pokémon encontrados por nome similar: ${filteredByName.length}`);
        return filteredByName;
      }
    }
  } catch (error) {
    console.error('❌ Erro ao buscar Pokémons:', error);
    throw new Error('Não foi possível realizar a busca. Tente novamente mais tarde.');
  }
};

/**
 * Normaliza um nome para busca, removendo caracteres especiais, hífens e espaços
 * @param {string} name - Nome a ser normalizado
 * @returns {string} - Nome normalizado
 */
const normalizeNameForSearch = (name) => {
  if (!name) return '';
  
  // Remover acentos, hífens, espaços e outros caracteres especiais
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]/g, ''); // Remove caracteres não alfanuméricos
};

/**
 * Extrai a cadeia de evolução a partir dos dados da API
 * @param {Object} chain - Objeto da cadeia de evolução da API
 * @returns {Array} - Array com a cadeia de evolução formatada
 */
const extractEvolutionChain = (chain) => {
  const evolutions = [];
  
  // Adiciona o primeiro Pokémon da cadeia
  const addEvolution = (pokemon, level = null, trigger = null, item = null) => {
    const id = extractIdFromUrl(pokemon.species.url);
    evolutions.push({
      id,
      name: pokemon.species.name,
      level,
      trigger,
      item,
    });
  };
  
  // Função recursiva para percorrer a cadeia de evolução
  const processChain = (currentChain, level = null, trigger = null, item = null) => {
    addEvolution(currentChain, level, trigger, item);
    
    if (currentChain.evolves_to && currentChain.evolves_to.length > 0) {
      currentChain.evolves_to.forEach(evolution => {
        const evolutionDetails = evolution.evolution_details[0] || {};
        const newLevel = evolutionDetails.min_level || null;
        const newTrigger = evolutionDetails.trigger?.name || null;
        const newItem = evolutionDetails.item?.name || null;
        
        processChain(evolution, newLevel, newTrigger, newItem);
      });
    }
  };
  
  processChain(chain);
  return evolutions;
};

/**
 * Extrai o ID do Pokémon a partir da URL
 * @param {string} url - URL da API
 * @returns {number} - ID do Pokémon
 */
const extractIdFromUrl = (url) => {
  const matches = url.match(/\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : null;
}; 