import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Componente de mensagem de erro
 * @param {Object} props - Propriedades do componente
 * @param {string} props.message - Mensagem de erro
 * @param {Function} [props.onRetry] - Função a ser chamada quando o botão de tentar novamente for clicado
 * @returns {JSX.Element} - Elemento JSX
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh',
        py: 4,
        textAlign: 'center'
      }}
    >
      <ErrorOutlineIcon 
        color="error" 
        sx={{ fontSize: 60, mb: 2 }} 
      />
      
      <Typography 
        variant="h5" 
        color="error" 
        gutterBottom
      >
        Ops! Algo deu errado.
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ maxWidth: 500, mb: 3 }}
      >
        {message}
      </Typography>
      
      {onRetry && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Tentar Novamente
        </Button>
      )}
    </Box>
  );
};

export default ErrorMessage; 