import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  CircularProgress, 
  useMediaQuery, 
  useTheme,
  Paper,
  Divider,
  Modal,
  IconButton,
  Fab,
  Zoom
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { keyframes } from '@mui/system';
import PokemonCard from '../components/pokemon/PokemonCard';
import LoadingMore from '../components/common/LoadingMore';
import PokemonFilter from '../components/pokemon/PokemonFilter';
import { usePokemon } from '../context/PokemonContext';
import { fetchPokemonById } from '../services/pokemonService';
import { useNavigate } from 'react-router-dom';

// Definição da animação de bounce
const bounce = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
`;

/**
 * Página inicial
 * @returns {JSX.Element} - Elemento JSX
 */
const Home = () => {
  const { 
    filteredPokemons, 
    loading, 
    loadingMore, 
    error, 
    hasMore, 
    loadMorePokemons, 
    searchTerm,
    isSearching
  } = usePokemon();
  
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loadingPokemonDetails, setLoadingPokemonDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const observer = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // Função para lidar com a seleção de um Pokémon
  const handleSelectPokemon = async (pokemon) => {
    if (selectedPokemon && selectedPokemon.id === pokemon.id) {
      // Se o mesmo Pokémon for clicado novamente, apenas alterne a visibilidade do modal em telas menores
      if (isMobile) {
        setModalOpen(!modalOpen);
      }
      return;
    }
    
    try {
      setLoadingPokemonDetails(true);
      setDetailsError(null);
      
      // Buscar detalhes completos do Pokémon
      const detailedPokemon = await fetchPokemonById(pokemon.id);
      setSelectedPokemon(detailedPokemon);
      
      // Abrir o modal em telas menores
      if (isMobile) {
        setModalOpen(true);
      }
    } catch (err) {
      console.error('Erro ao carregar detalhes do Pokémon:', err);
      setDetailsError('Não foi possível carregar os detalhes deste Pokémon.');
    } finally {
      setLoadingPokemonDetails(false);
    }
  };
  
  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  // Função para abrir o modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  
  // Efeito para limpar o Pokémon selecionado quando o termo de pesquisa muda
  useEffect(() => {
    setSelectedPokemon(null);
    setModalOpen(false);
  }, [searchTerm]);
  
  // Configuração do observador para rolagem infinita
  const lastPokemonElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isSearching) {
        console.log('🔄 Elemento de referência visível, carregando mais Pokémon...');
        loadMorePokemons();
      }
    });
    
    if (node) {
      console.log('🔄 Observando novo elemento de referência');
      observer.current.observe(node);
    }
  }, [loading, loadingMore, hasMore, loadMorePokemons, isSearching]);
  
  // Verificar se a tela está em um tamanho intermediário (não é mobile, mas está ficando menor)
  const isIntermediateSize = useMediaQuery(theme.breakpoints.down('md'));
  
  // Efeito para gerenciar a exibição do modal com base no tamanho da tela
  useEffect(() => {
    if (selectedPokemon) {
      // Se for mobile ou tamanho intermediário, mostrar o modal
      if (isIntermediateSize) {
        setModalOpen(true);
      } else {
        // Em telas grandes, não mostrar o modal
        setModalOpen(false);
      }
    }
  }, [isIntermediateSize, selectedPokemon]);
  
  // Renderização condicional para diferentes estados
  if (loading && !loadingMore) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="xl">
        <Box textAlign="center" my={5}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  // Componente para renderizar os detalhes do Pokémon
  const PokemonDetails = () => (
    <>
      {loadingPokemonDetails ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : detailsError ? (
        <Box textAlign="center" my={3}>
          <Typography variant="body1" color="error">
            {detailsError}
          </Typography>
        </Box>
      ) : (
        <>
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" gutterBottom>
              {selectedPokemon.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              #{selectedPokemon.id.toString().padStart(3, '0')}
            </Typography>
            
            <Box 
              component="img"
              src={selectedPokemon.animated?.front_default || selectedPokemon.sprites?.front_default || selectedPokemon.image}
              alt={selectedPokemon.name}
              sx={{ 
                width: '180px', 
                height: '180px',
                objectFit: 'contain',
                mt: 2,
                animation: selectedPokemon.animated?.front_default ? 'bounce 1s infinite alternate' : 'none'
              }}
            />
            
            <Box display="flex" gap={1} mt={2}>
              {selectedPokemon.types.map(type => (
                <Box
                  key={type}
                  sx={{
                    bgcolor: theme.palette.pokemonTypes[type.toLowerCase()] || theme.palette.grey[500],
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}
                >
                  {type}
                </Box>
              ))}
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {selectedPokemon.description && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Descrição
              </Typography>
              <Typography variant="body2">
                {selectedPokemon.description}
              </Typography>
            </Box>
          )}
          
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Altura
              </Typography>
              <Typography variant="body1">
                {(selectedPokemon.height / 10).toFixed(1)}m
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Peso
              </Typography>
              <Typography variant="body1">
                {(selectedPokemon.weight / 10).toFixed(1)}kg
              </Typography>
            </Grid>
          </Grid>
          
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Estatísticas
            </Typography>
            <Grid container spacing={1}>
              {Object.entries(selectedPokemon.stats).map(([name, baseStat]) => (
                <Grid item xs={6} key={name}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {name}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: `${Math.min(100, (baseStat / 255) * 100)}%`,
                        height: 8,
                        bgcolor: theme.palette.primary.main,
                        borderRadius: 1,
                        mr: 1
                      }}
                    />
                    <Typography variant="body2">
                      {baseStat}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Box display="flex" justifyContent="center" mt={3}>
            <Box
              component="button"
              onClick={() => navigate(`/pokemon/${selectedPokemon.id}`)}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                border: 'none',
                borderRadius: 2,
                px: 3,
                py: 1,
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                }
              }}
            >
              Ver Mais Detalhes
            </Box>
          </Box>
        </>
      )}
    </>
  );

  return (
    <>
      <PokemonFilter />
      
      <Container maxWidth="xl" sx={{ mt: -1 }}>
        <Grid container spacing={3}>
          {/* Lista de Pokémon */}
          <Grid item xs={12} md={selectedPokemon && !isIntermediateSize ? 8 : 12}>
            {filteredPokemons.length === 0 ? (
              <Box textAlign="center" my={5}>
                <Typography variant="h5" gutterBottom>
                  Nenhum Pokémon encontrado
                </Typography>
                <Typography variant="body1">
                  Tente ajustar seus filtros ou termos de pesquisa.
                </Typography>
              </Box>
            ) : (
              <>
                {console.log('🖥️ Renderizando lista de Pokémon - Total:', filteredPokemons.length)}
                {console.log('🖥️ IDs dos Pokémon renderizados:', filteredPokemons.map(p => p.id))}
                
                {/* Verificar se há IDs duplicados */}
                {(() => {
                  const idSet = new Set();
                  const duplicateIds = [];
                  
                  filteredPokemons.forEach(pokemon => {
                    if (idSet.has(pokemon.id)) {
                      duplicateIds.push(pokemon.id);
                    } else {
                      idSet.add(pokemon.id);
                    }
                  });
                  
                  if (duplicateIds.length > 0) {
                    console.warn('⚠️ Ainda há IDs duplicados na renderização:', duplicateIds);
                  }
                  
                  return null;
                })()}
                
            <Grid container spacing={2}>
                  {/* Usar Set para garantir que cada ID seja renderizado apenas uma vez */}
                  {(() => {
                    const seenIds = new Set();
                    const uniquePokemons = filteredPokemons.filter(pokemon => {
                      if (seenIds.has(pokemon.id)) {
                        return false;
                      }
                      seenIds.add(pokemon.id);
                      return true;
                    });
                    
                    console.log('🖥️ Pokémon únicos para renderização:', uniquePokemons.length);
                    
                    return uniquePokemons.map((pokemon, index) => {
                      const isLastElement = index === uniquePokemons.length - 1;
                      
                      if (isLastElement) {
                        console.log('🖥️ Renderizando último elemento - ID:', pokemon.id);
                      }
                      
                      return (
                        <Grid 
                          item 
                          xs={6} 
                          sm={4} 
                          md={selectedPokemon ? 4 : 3} 
                          lg={selectedPokemon ? 3 : 2} 
                          key={`pokemon-${pokemon.id}`}
                          ref={isLastElement ? lastPokemonElementRef : null}
                        >
                          <PokemonCard 
                            pokemon={pokemon} 
                            onClick={handleSelectPokemon}
                            isSelected={selectedPokemon && selectedPokemon.id === pokemon.id}
                          />
                        </Grid>
                      );
                    });
                  })()}
                </Grid>
                
                {loadingMore && <LoadingMore />}
                
                {!hasMore && !isSearching && (
                  <Box textAlign="center" my={3}>
                    <Typography variant="body1">
                      Você chegou ao fim da lista de Pokémon!
                    </Typography>
                  </Box>
                )}
              </>
            )}
                     </Grid>
          
          {/* Detalhes do Pokémon selecionado para desktop */}
          {selectedPokemon && !isIntermediateSize && (
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  position: 'sticky', 
                  top: 20, 
                  maxHeight: 'calc(100vh - 40px)',
                  overflowY: 'auto'
                }}
              >
                <PokemonDetails />
              </Paper>
            </Grid>
          )}
            </Grid>
        </Container>
      
      {/* Modal para exibir detalhes em telas menores ou quando redimensionada */}
      {selectedPokemon && (
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="pokemon-details-modal"
          aria-describedby="modal-with-pokemon-details"
        >
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 500,
              maxHeight: '90vh',
              overflowY: 'auto',
              p: 3,
              borderRadius: 2,
              outline: 'none',
            }}
          >
            <IconButton
              aria-label="fechar"
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <PokemonDetails />
          </Paper>
        </Modal>
      )}
      
      {/* Botão flutuante para reabrir o modal em telas menores */}
      {selectedPokemon && isIntermediateSize && !modalOpen && (
        <Zoom in={!modalOpen}>
          <Fab
            color="primary"
            aria-label="ver detalhes"
            onClick={handleOpenModal}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <InfoIcon />
          </Fab>
        </Zoom>
      )}
    </>
  );
};
        
export default Home;
