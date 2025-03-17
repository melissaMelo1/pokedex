import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes';

/**
 * Componente de rotas da aplicação
 * @returns {JSX.Element} - Elemento JSX
 */
const AppRoutes = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<route.element />}
          exact={route.exact}
        />
      ))}
    </Routes>
  );
};

export default AppRoutes; 