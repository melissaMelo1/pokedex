import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { fetchPokemons, searchPokemons } from '../services/pokemonService';
import { POKEMON_LIMIT } from '../config/constants';

// Definindo o estado inicial
const initialState = {
  pokemons: [],
  filteredPokemons: [],
  loading: false,
  loadingMore: false,
  searchLoading: false,
  error: null,
  searchTerm: '',
  offset: 0,
  hasMore: true,
  filters: {
    types: [],
    sortOrder: 'asc',
    minNumber: 1,
    maxNumber: 1000
  },
  isSearching: false,
  searchResults: []
};

// Definindo as ações do reducer
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_MORE_START: 'FETCH_MORE_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_MORE_SUCCESS: 'FETCH_MORE_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  SEARCH_START: 'SEARCH_START',
  SEARCH_SUCCESS: 'SEARCH_SUCCESS',
  SEARCH_ERROR: 'SEARCH_ERROR',
  RESET_SEARCH: 'RESET_SEARCH',
  APPLY_FILTERS: 'APPLY_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS'
};

// Criando o reducer
const pokemonReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ACTIONS.FETCH_MORE_START:
      return {
        ...state,
        loadingMore: true,
        error: null,
      };
    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        pokemons: action.payload,
        filteredPokemons: applyFiltersToPokemons(action.payload, state.filters, state.searchTerm),
        error: null,
        offset: POKEMON_LIMIT,
        hasMore: action.payload.length === POKEMON_LIMIT,
      };
    case ACTIONS.FETCH_MORE_SUCCESS:
      // Combinar os Pokémon existentes com os novos, garantindo que não haja duplicatas
      console.log('🔄 Combinando Pokémon - Total antes:', state.pokemons.length + action.payload.length);
      console.log('🔄 IDs existentes:', state.pokemons.map(p => p.id));
      console.log('🔄 IDs novos:', action.payload.map(p => p.id));
      
      // Criar um Map com os Pokémon existentes indexados por ID
      const existingPokemonMap = new Map(
        state.pokemons.map(pokemon => [pokemon.id, pokemon])
      );
      
      // Adicionar apenas os novos Pokémon que não existem no Map
      action.payload.forEach(pokemon => {
        if (!existingPokemonMap.has(pokemon.id)) {
          existingPokemonMap.set(pokemon.id, pokemon);
        }
      });
      
      // Converter o Map de volta para um array
      const uniquePokemons = Array.from(existingPokemonMap.values());
      
      console.log('🔄 Total após remover duplicatas:', uniquePokemons.length);
      console.log('🔄 IDs após remover duplicatas:', uniquePokemons.map(p => p.id));
      
      return {
        ...state,
        loadingMore: false,
        pokemons: uniquePokemons,
        filteredPokemons: applyFiltersToPokemons(uniquePokemons, state.filters, state.searchTerm),
        error: null,
        offset: state.offset + POKEMON_LIMIT,
        hasMore: action.payload.length === POKEMON_LIMIT,
      };
    case ACTIONS.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: action.payload,
      };
    case ACTIONS.SEARCH_START:
      return {
        ...state,
        searchLoading: true,
        searchTerm: action.payload,
        isSearching: action.payload.length > 0
      };
    case ACTIONS.SEARCH_SUCCESS:
      return {
        ...state,
        searchLoading: false,
        searchResults: action.payload,
        filteredPokemons: applyFiltersToPokemons(action.payload, state.filters, state.searchTerm),
        error: null
      };
    case ACTIONS.SEARCH_ERROR:
      return {
        ...state,
        searchLoading: false,
        error: action.payload
      };
    case ACTIONS.RESET_SEARCH:
      return {
        ...state,
        searchTerm: '',
        isSearching: false,
        searchResults: [],
        filteredPokemons: applyFiltersToPokemons(state.pokemons, state.filters, '')
      };
    case ACTIONS.APPLY_FILTERS:
      const newFilters = { ...state.filters, ...action.payload };
      return {
        ...state,
        filters: newFilters,
        filteredPokemons: applyFiltersToPokemons(state.pokemons, newFilters, state.searchTerm)
      };
    case ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: {
          types: [],
          sortOrder: 'asc',
          minNumber: 1,
          maxNumber: 1000
        },
        filteredPokemons: applyFiltersToPokemons(
          state.pokemons, 
          { types: [], sortOrder: 'asc', minNumber: 1, maxNumber: 1000 }, 
          state.searchTerm
        )
      };
    default:
      return state;
  }
};

// Função auxiliar para aplicar filtros aos Pokémons
const applyFiltersToPokemons = (pokemons, filters, searchTerm) => {
  console.log('🔍 Aplicando filtros - Pokémon recebidos:', pokemons.length);
  
  // Garantir que não haja duplicatas baseadas no ID
  const pokemonMap = new Map();
  pokemons.forEach(pokemon => {
    pokemonMap.set(pokemon.id, pokemon);
  });
  
  const uniquePokemons = Array.from(pokemonMap.values());
  console.log('🔍 Após garantir unicidade:', uniquePokemons.length);
  console.log('🔍 IDs únicos:', uniquePokemons.map(p => p.id));
  
  let filtered = [...uniquePokemons];
  
  // Aplicar filtro de busca por nome
  if (searchTerm) {
    filtered = filtered.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Aplicar filtro por tipo
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter(pokemon => 
      filters.types.some(type => pokemon.types.includes(type))
    );
  }
  
  // Aplicar filtro por número
  if (filters.minNumber || filters.maxNumber) {
    filtered = filtered.filter(pokemon => 
      pokemon.id >= filters.minNumber && pokemon.id <= filters.maxNumber
    );
  }
  
  // Aplicar ordenação
  if (filters.sortOrder) {
    filtered.sort((a, b) => {
      if (filters.sortOrder === 'asc') {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
  }
  
  console.log('🔍 Resultado final após filtros:', filtered.length);
  return filtered;
};

// Criando o contexto
const PokemonContext = createContext();

// Criando o provider
export const PokemonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pokemonReducer, initialState);

  // Efeito para carregar os Pokémons iniciais quando o componente é montado
  useEffect(() => {
    const loadInitialPokemons = async () => {
      try {
        dispatch({ type: ACTIONS.FETCH_START });
        const data = await fetchPokemons();
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      }
    };

    loadInitialPokemons();
  }, []);

  // Função para carregar mais Pokémons
  const loadMorePokemons = useCallback(async () => {
    if (state.loadingMore || !state.hasMore || state.isSearching) return;

    try {
      console.log('📥 Carregando mais Pokémon - Offset atual:', state.offset);
      console.log('📥 Pokémon existentes:', state.pokemons.length);
      
      dispatch({ type: ACTIONS.FETCH_MORE_START });
      const data = await fetchPokemons(POKEMON_LIMIT, state.offset);
      
      console.log('📥 Novos Pokémon recebidos:', data.length);
      console.log('📥 IDs dos novos Pokémon:', data.map(p => p.id));
      
      dispatch({ type: ACTIONS.FETCH_MORE_SUCCESS, payload: data });
    } catch (error) {
      console.error('❌ Erro ao carregar mais Pokémon:', error);
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  }, [state.loadingMore, state.hasMore, state.offset, state.isSearching]);

  // Função para buscar Pokémons
  const searchPokemonsByName = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      dispatch({ type: ACTIONS.RESET_SEARCH });
      return;
    }

    try {
      dispatch({ type: ACTIONS.SEARCH_START, payload: query });
      
      // Usar a função searchPokemons do serviço para buscar por nome ou ID
      const results = await searchPokemons(query);
      
      dispatch({ type: ACTIONS.SEARCH_SUCCESS, payload: results });
    } catch (error) {
      console.error('❌ Erro ao buscar Pokémons:', error);
      dispatch({ type: ACTIONS.SEARCH_ERROR, payload: error.message });
    }
  }, []);

  // Função para resetar a busca
  const resetSearch = () => {
    dispatch({ type: ACTIONS.RESET_SEARCH });
  };
  
  // Função para aplicar filtros
  const filterPokemons = (filters) => {
    dispatch({ type: ACTIONS.APPLY_FILTERS, payload: filters });
  };
  
  // Função para resetar filtros
  const resetFilters = () => {
    dispatch({ type: ACTIONS.RESET_FILTERS });
  };

  // Valores a serem expostos pelo contexto
  const value = {
    filteredPokemons: state.filteredPokemons,
    loading: state.loading,
    loadingMore: state.loadingMore,
    searchLoading: state.searchLoading,
    error: state.error,
    searchTerm: state.searchTerm,
    hasMore: state.hasMore && !state.isSearching,
    filters: state.filters,
    isSearching: state.isSearching,
    searchResults: state.searchResults,
    searchPokemonsByName,
    resetSearch,
    loadMorePokemons,
    filterPokemons,
    resetFilters
  };

  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemon deve ser usado dentro de um PokemonProvider');
  }
  return context;
}; 