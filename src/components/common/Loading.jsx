import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Componente de carregamento
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.message='Carregando...'] - Mensagem de carregamento
 * @param {number} [props.size=60] - Tamanho do indicador de carregamento
 * @returns {JSX.Element} - Elemento JSX
 */
const Loading = ({ message = 'Carregando...', size = 60 }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh',
        py: 4
      }}
    >
      <CircularProgress size={size} color="primary" />
      {message && (
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mt: 3 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loading; 