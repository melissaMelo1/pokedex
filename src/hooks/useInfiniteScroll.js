import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook personalizado para implementar o infinite scrolling
 * @param {Array} items - Lista completa de itens
 * @param {number} initialLimit - Número inicial de itens a serem exibidos
 * @param {number} incrementAmount - Quantidade de itens a serem adicionados a cada carregamento
 * @returns {Object} - Objeto com os dados e funções do infinite scrolling
 */
export const useInfiniteScroll = (items = [], initialLimit = 12, incrementAmount = 12) => {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const observer = useRef();

  // Atualiza os itens exibidos quando os itens ou o limite mudam
  useEffect(() => {
    if (items.length === 0) {
      setDisplayedItems([]);
      return;
    }

    const newDisplayedItems = items.slice(0, currentLimit);
    setDisplayedItems(newDisplayedItems);
    setHasMore(newDisplayedItems.length < items.length);
  }, [items, currentLimit]);

  // Reseta o limite quando os itens mudam (por exemplo, quando uma busca é realizada)
  useEffect(() => {
    setCurrentLimit(initialLimit);
  }, [items.length, initialLimit]);

  /**
   * Função para carregar mais itens
   */
  const loadMore = useCallback(() => {
    if (currentLimit < items.length) {
      setCurrentLimit(prevLimit => prevLimit + incrementAmount);
    }
  }, [currentLimit, items.length, incrementAmount]);

  /**
   * Função para conectar o último elemento da lista ao observer
   */
  const lastElementRef = useCallback(
    (node) => {
      if (!hasMore) return;
      
      // Desconecta o observer anterior
      if (observer.current) {
        observer.current.disconnect();
      }
      
      // Cria um novo observer
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      }, { threshold: 0.5 });
      
      // Observa o novo elemento
      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, loadMore]
  );

  return {
    displayedItems,
    hasMore,
    loadMore,
    lastElementRef
  };
}; 