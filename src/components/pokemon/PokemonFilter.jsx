import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Popover, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  Typography,
  useTheme,
  alpha,
  keyframes
} from '@mui/material';
import { usePokemon } from '../../context/PokemonContext';
import pokebolaImg from '../../pokebola.png';

// Definindo a animação de rotação
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Lista de tipos de Pokémon
const pokemonTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
  'fighting', 'poison', 'ground', 'flying', 'psychic', 
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

/**
 * Componente de filtro para Pokémon
 * @returns {JSX.Element} - Elemento JSX
 */
const PokemonFilter = () => {
  const theme = useTheme();
  const { filterPokemons, resetFilters, filters } = usePokemon();
  
  // Estados para os popover
  const [typeAnchorEl, setTypeAnchorEl] = useState(null);
  
  // Estados para os filtros
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  // Estados para ordenação
  const [sortOrder, setSortOrder] = useState('asc');
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(1000);
  
  // Funções para abrir/fechar popover
  const handleTypeClick = (event) => {
    setTypeAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setTypeAnchorEl(null);
  };
  
  // Funções para manipular mudanças nos filtros
  const handleTypeChange = (type) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newSelectedTypes);
    applyFilters({ types: newSelectedTypes });
  };
  
  const handleSortOrderChange = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    applyFilters({ sortOrder: newSortOrder });
  };
  
  const handleMinNumberChange = () => {
    // Implementar lógica para mudar o número mínimo
    applyFilters({ minNumber });
  };
  
  const handleMaxNumberChange = () => {
    // Implementar lógica para mudar o número máximo
    applyFilters({ maxNumber });
  };
  
  // Função para aplicar todos os filtros
  const applyFilters = (newFilters) => {
    const updatedFilters = {
      types: selectedTypes,
      sortOrder,
      minNumber,
      maxNumber,
      ...newFilters
    };
    
    filterPokemons(updatedFilters);
  };
  
  // Função para resetar todos os filtros
  const handleResetFilters = () => {
    setSelectedTypes([]);
    setSortOrder('asc');
    setMinNumber(1);
    setMaxNumber(1000);
    resetFilters();
  };
  
  // Verificar se os popover estão abertos
  const typeOpen = Boolean(typeAnchorEl);
  
  return (
    <Box 
      sx={{ 
        backgroundColor: '#f5f5f5', 
        py: 2,
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: { xs: 2, md: 0 } }}>
            <Box 
              component="span" 
              sx={{ 
                mr: 1, 
                fontWeight: 'bold', 
                color: theme.palette.text.secondary 
              }}
            >
              Ordenar:
            </Box>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleSortOrderChange}
              sx={{ 
                mr: 2, 
                borderRadius: 4,
                textTransform: 'none'
              }}
            >
              {sortOrder === 'asc' ? 'Ascendente ▼' : 'Descendente ▲'}
            </Button>
            
            <Box 
              component="span" 
              sx={{ 
                mx: 1, 
                fontWeight: 'bold', 
                color: theme.palette.text.secondary 
              }}
            >
              de
            </Box>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleMinNumberChange}
              sx={{ 
                mx: 1, 
                borderRadius: 4,
                minWidth: 60,
                textTransform: 'none'
              }}
            >
              {minNumber}
            </Button>
            <Box 
              component="span" 
              sx={{ 
                mx: 1, 
                fontWeight: 'bold', 
                color: theme.palette.text.secondary 
              }}
            >
              até
            </Box>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleMaxNumberChange}
              sx={{ 
                mx: 1, 
                borderRadius: 4,
                minWidth: 60,
                textTransform: 'none'
              }}
            >
              {maxNumber}
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={
                <Box 
                  component="img" 
                  src={pokebolaImg} 
                  alt="Pokébola" 
                  sx={{ 
                    width: 24, 
                    height: 24,
                    animation: `${rotate} 3s linear infinite`,
                    animationPlayState: typeOpen ? 'paused' : 'running'
                  }}
                />
              }
              onClick={handleTypeClick}
              sx={{ 
                borderRadius: 4,
                textTransform: 'none',
                backgroundColor: selectedTypes.length > 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
              }}
            >
              Tipo {selectedTypes.length > 0 && `(${selectedTypes.length})`}
            </Button>
            
            {selectedTypes.length > 0 && (
              <Button 
                variant="outlined" 
                color="error"
                size="small" 
                onClick={handleResetFilters}
                sx={{ 
                  borderRadius: 4,
                  textTransform: 'none'
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </Box>
        </Box>
      </Container>
      
      {/* Popover para Tipos */}
      <Popover
        open={typeOpen}
        anchorEl={typeAnchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { p: 2, maxWidth: 300, maxHeight: 400, overflowY: 'auto' }
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>Filtrar por Tipo</Typography>
        <FormGroup>
          {pokemonTypes.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox 
                  checked={selectedTypes.includes(type)} 
                  onChange={() => handleTypeChange(type)}
                  sx={{
                    color: theme.palette.pokemonTypes[type] || theme.palette.grey[500],
                    '&.Mui-checked': {
                      color: theme.palette.pokemonTypes[type] || theme.palette.primary.main,
                    },
                  }}
                />
              }
              label={type.charAt(0).toUpperCase() + type.slice(1)}
            />
          ))}
        </FormGroup>
      </Popover>
    </Box>
  );
};

export default PokemonFilter; 