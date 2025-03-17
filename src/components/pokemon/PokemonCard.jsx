import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// Estilização do card
const StyledCard = styled(Card)(({ theme, isSelected }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
  boxShadow: isSelected 
    ? `0 0 15px ${theme.palette.primary.main}` 
    : '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: isSelected 
      ? `0 5px 15px ${theme.palette.primary.main}` 
      : '0 5px 15px rgba(0, 0, 0, 0.2)',
  },
}));

// Componente para a imagem do Pokémon com animação de hover
const PokemonImage = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 140,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  '& img': {
    objectFit: 'contain',
    maxHeight: '100%',
    maxWidth: '100%',
    transition: 'opacity 0.3s ease',
  },
  '& .front': {
    position: 'absolute',
    opacity: 1,
  },
  '& .back': {
    position: 'absolute',
    opacity: 0,
  },
  '&:hover .front': {
    opacity: 0,
  },
  '&:hover .back': {
    opacity: 1,
  },
}));

/**
 * Componente de card de Pokémon
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.pokemon - Dados do Pokémon
 * @param {Function} props.onClick - Função de clique
 * @param {boolean} props.isSelected - Indica se o Pokémon está selecionado
 * @returns {JSX.Element} - Elemento JSX
 */
const PokemonCard = ({ pokemon, onClick, isSelected = false }) => {
  const theme = useTheme();
  
  const handleClick = () => {
    if (onClick) {
      onClick(pokemon);
    }
  };
  
  // Determinar quais sprites usar (priorizando os animados)
  const frontSprite = pokemon.animated?.front_default || pokemon.sprites?.front_default || pokemon.image;
  const backSprite = pokemon.animated?.back_default || pokemon.sprites?.back_default || frontSprite;
  
  return (
    <StyledCard isSelected={isSelected} onClick={handleClick}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 1,
          bgcolor: 'rgba(0, 0, 0, 0.03)'
        }}
      >
        <Typography 
          variant="subtitle2" 
          color="text.secondary"
          sx={{ fontWeight: 'bold' }}
        >
          #{pokemon.id.toString().padStart(3, '0')}
        </Typography>
        
        <Box display="flex" gap={0.5}>
          {pokemon.types.map(type => (
            <Box
              key={type}
              sx={{
                bgcolor: theme.palette.pokemonTypes[type.toLowerCase()] || theme.palette.grey[500],
                color: 'white',
                px: 1,
                py: 0.2,
                borderRadius: 1,
                fontSize: '0.7rem',
                textTransform: 'capitalize',
                fontWeight: 'bold'
              }}
            >
              {type}
            </Box>
          ))}
        </Box>
      </Box>
      
      <PokemonImage sx={{ bgcolor: isSelected ? 'rgba(255, 107, 107, 0.05)' : 'transparent' }}>
        <Box 
          component="img"
          className="front"
          src={frontSprite}
          alt={`${pokemon.name} front`}
        />
        <Box 
          component="img"
          className="back"
          src={backSprite}
          alt={`${pokemon.name} back`}
        />
      </PokemonImage>
      
      <CardContent sx={{ flexGrow: 1, pt: 1, pb: 1.5, px: 2 }}>
        <Typography 
          variant="h6" 
          component="div" 
          align="center"
          sx={{ 
            textTransform: 'capitalize',
            fontWeight: 'bold',
            fontSize: '1rem',
            mb: 1
          }}
        >
          {pokemon.name}
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mt: 1
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Altura
            </Typography>
            <Typography variant="body2">
              {(pokemon.height / 10).toFixed(1)}m
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="text.secondary">
              Peso
            </Typography>
            <Typography variant="body2">
              {(pokemon.weight / 10).toFixed(1)}kg
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default PokemonCard; 