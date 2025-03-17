import React from 'react';
import { Box, Pagination as MuiPagination, useMediaQuery, useTheme } from '@mui/material';

/**
 * Componente de paginação
 * @param {Object} props - Propriedades do componente
 * @param {number} props.currentPage - Página atual
 * @param {number} props.totalPages - Total de páginas
 * @param {Function} props.onChange - Função chamada quando a página muda
 * @returns {JSX.Element} - Elemento JSX
 */
const Pagination = ({ currentPage, totalPages, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, value) => {
    onChange(value);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      my={4}
    >
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        size={isMobile ? 'small' : 'medium'}
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default Pagination; 