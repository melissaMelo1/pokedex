import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

/**
 * Cliente Axios configurado para a API
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para tratar erros de requisição
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aqui podemos tratar erros comuns, como 401, 403, 404, 500, etc.
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Erro na resposta da API:', error.response.status, error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta da API:', error.request);
    } else {
      // Algo aconteceu na configuração da requisição que causou o erro
      console.error('Erro na configuração da requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Funções de API
 */
export const api = {
  /**
   * Busca uma lista de Pokémons
   * @param {Object} params - Parâmetros da requisição
   * @returns {Promise} - Promessa com a resposta
   */
  getPokemons: (params = {}) => {
    return apiClient.get('/pokemon', { params });
  },
  
  /**
   * Busca um Pokémon pelo ID
   * @param {number|string} id - ID do Pokémon
   * @returns {Promise} - Promessa com a resposta
   */
  getPokemonById: (id) => {
    return apiClient.get(`/pokemon/${id}`);
  },
  
  /**
   * Busca um Pokémon pelo nome
   * @param {string} name - Nome do Pokémon
   * @returns {Promise} - Promessa com a resposta
   */
  getPokemonByName: (name) => {
    return apiClient.get(`/pokemon/${name}`);
  },
  
  /**
   * Busca uma lista de tipos de Pokémon
   * @returns {Promise} - Promessa com a resposta
   */
  getTypes: () => {
    return apiClient.get('/type');
  },
  
  /**
   * Busca detalhes de um tipo de Pokémon
   * @param {number|string} id - ID do tipo
   * @returns {Promise} - Promessa com a resposta
   */
  getTypeById: (id) => {
    return apiClient.get(`/type/${id}`);
  },

  /**
   * Busca informações da espécie de um Pokémon
   * @param {string} url - URL da espécie
   * @returns {Promise} - Promessa com a resposta
   */
  getPokemonSpecies: (url) => {
    // Se a URL completa for fornecida, usamos axios diretamente
    if (url.startsWith('http')) {
      return axios.get(url);
    }
    // Caso contrário, usamos o cliente configurado
    return apiClient.get(url);
  },

  /**
   * Busca informações da cadeia de evolução de um Pokémon
   * @param {string} url - URL da cadeia de evolução
   * @returns {Promise} - Promessa com a resposta
   */
  getEvolutionChain: (url) => {
    // Se a URL completa for fornecida, usamos axios diretamente
    if (url.startsWith('http')) {
      return axios.get(url);
    }
    // Caso contrário, usamos o cliente configurado
    return apiClient.get(url);
  },
}; 