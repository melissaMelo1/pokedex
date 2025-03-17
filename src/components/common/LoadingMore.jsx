import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Componente de carregamento para indicar que mais itens estão sendo carregados
 * @returns {JSX.Element} - Elemento JSX
 */
const LoadingMore = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 4
      }}
    >
      <CircularProgress size={40} color="primary" />
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ mt: 2 }}
      >
        Carregando mais Pokémon...
      </Typography>
    </Box>
  );
};

export default LoadingMore; 