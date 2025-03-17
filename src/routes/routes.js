import Home from '../pages/Home';
import PokemonDetails from '../pages/PokemonDetails';

/**
 * Rotas da aplicação
 * @type {Array}
 */
export const routes = [
  {
    path: '/',
    element: Home,
    exact: true,
  },
  {
    path: '/pokemon/:id',
    element: PokemonDetails,
    exact: true,
  },
  // Aqui podemos adicionar mais rotas no futuro, como:
  // {
  //   path: '/pokemon/:id',
  //   element: PokemonDetail,
  //   exact: true,
  // },
];

/**
 * Mapa de rotas para facilitar a navegação
 * @type {Object}
 */
export const routeMap = {
  home: '/',
  pokemonDetail: '/pokemon/:id',
};

/**
 * Obtém uma rota pelo nome
 * @param {string} name - Nome da rota
 * @returns {Object|null} - Objeto da rota ou null se não encontrada
 */
export const getRouteByName = (name) => {
  return routeMap[name] || null;
}; 