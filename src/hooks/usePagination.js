import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para lidar com paginação
 * @param {Array} items - Lista de itens a serem paginados
 * @param {number} itemsPerPage - Número de itens por página
 * @returns {Object} - Objeto com os dados e funções de paginação
 */
export const usePagination = (items = [], itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState([]);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  /**
   * Atualiza os itens paginados com base na página atual
   */
  const updatePaginatedItems = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedItems(items.slice(startIndex, endIndex));
  }, [currentPage, items, itemsPerPage]);

  /**
   * Navega para a próxima página
   */
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  /**
   * Navega para a página anterior
   */
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  /**
   * Navega para uma página específica
   * @param {number} page - Número da página
   */
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  // Atualiza os itens paginados quando a página atual ou os itens mudam
  useEffect(() => {
    updatePaginatedItems();
  }, [updatePaginatedItems]);

  // Reseta para a primeira página quando os itens mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
    goToPage,
  };
}; 