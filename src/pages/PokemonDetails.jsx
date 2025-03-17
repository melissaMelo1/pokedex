import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Chip, 
  Divider, 
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { keyframes } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { POKEMON_TYPES_COLORS } from '../config/constants';
import { formatPokemonName, formatPokemonId } from '../utils/transformers';
import { fetchPokemonById } from '../services/pokemonService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

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
 * Página de detalhes completos do Pokémon
 * @returns {JSX.Element} - Elemento JSX
 */
const PokemonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [favorite, setFavorite] = useState(false);

  // Carrega os detalhes do Pokémon
  useEffect(() => {
    const loadPokemonDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPokemonById(id);
        setPokemon(data);
      } catch (error) {
        console.error('Erro ao carregar detalhes do Pokémon:', error);
        setError(error.message || 'Erro ao carregar detalhes do Pokémon');
      } finally {
        setLoading(false);
      }
    };

    loadPokemonDetails();
  }, [id]);

  // Função para voltar à página anterior
  const handleGoBack = () => {
    navigate(-1);
  };

  // Função para alternar entre as abas
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Função para alternar o status de favorito
  const handleToggleFavorite = () => {
    setFavorite(!favorite);
  };

  // Renderiza o estado de carregamento
  if (loading) {
    return (
      <Loading />
    );
  }

  // Renderiza o estado de erro
  if (error) {
    return (
      <ErrorMessage message={error} />
    );
  }

  // Se o Pokémon não foi encontrado
  if (!pokemon) {
    return (
      <Container maxWidth="xl">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="50vh"
          textAlign="center"
          p={2}
        >
          <Typography variant="h5" gutterBottom>
            Pokémon não encontrado
          </Typography>
          <Button variant="contained" onClick={handleGoBack}>
            Voltar
          </Button>
        </Box>
      </Container>
    );
  }

  // Tenta obter o sprite animado, se não estiver disponível, usa o estático
  const spriteUrl = pokemon.animated?.front_default || 
                    pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default || 
                    pokemon.sprites?.front_default || 
                    pokemon.image;

  // Verifica se o sprite é animado
  const isAnimated = pokemon.animated?.front_default || 
                     pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;

  // Obtém a cor de fundo com base no tipo principal do Pokémon
  const mainTypeColor = POKEMON_TYPES_COLORS[pokemon.types[0]] || '#A8A878';

  return (
    <Box 
      sx={{ 
        background: `linear-gradient(to bottom, ${mainTypeColor}22, #ffffff)`,
        minHeight: 'calc(100vh - 64px)',
        pt: 3,
        pb: 8
      }}
    >
      <Container maxWidth="xl">
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={handleGoBack} 
            sx={{ mr: 2, bgcolor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ flexGrow: 1 }}>
            {formatPokemonName(pokemon.name)} {formatPokemonId(pokemon.id)}
          </Typography>
          <IconButton 
            onClick={handleToggleFavorite} 
            sx={{ 
              color: favorite ? 'error.main' : 'action.disabled',
              bgcolor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>

        <Grid container spacing={4}>
          {/* Coluna da esquerda - Imagem e informações básicas */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 4,
                background: `linear-gradient(135deg, white 0%, ${mainTypeColor}22 100%)`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 3,
                  position: 'relative'
                }}
              >
                <Box 
                  component="img" 
                  src={spriteUrl}
                  alt={pokemon.name}
                  sx={{ 
                    width: '250px',
                    height: '250px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
                    animation: isAnimated ? `${bounce} 1s infinite alternate` : 'none'
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 3, justifyContent: 'center' }}>
                {pokemon.types.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    sx={{
                      backgroundColor: POKEMON_TYPES_COLORS[type] || '#A8A878',
                      color: '#fff',
                      textTransform: 'capitalize',
                      fontWeight: 'bold',
                      px: 2,
                      py: 2.5
                    }}
                  />
                ))}
              </Box>

              <Typography variant="h6" fontWeight="bold" mb={1}>
                DADOS DA POKÉDEX
              </Typography>
              <Typography variant="body1" mb={3}>
                {pokemon.description || 'Informação não disponível.'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    ALTURA
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {pokemon.height}m
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    PESO
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {pokemon.weight}kg
                  </Typography>
                </Grid>
                {pokemon.habitat && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      HABITAT
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                      {pokemon.habitat}
                    </Typography>
                  </Grid>
                )}
                {pokemon.generation && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      GERAÇÃO
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                      {pokemon.generation.replace('-', ' ')}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {(pokemon.isLegendary || pokemon.isMythical || pokemon.isBaby) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {pokemon.isLegendary && (
                      <Chip label="Lendário" color="primary" variant="outlined" />
                    )}
                    {pokemon.isMythical && (
                      <Chip label="Mítico" color="secondary" variant="outlined" />
                    )}
                    {pokemon.isBaby && (
                      <Chip label="Bebê" color="success" variant="outlined" />
                    )}
                  </Box>
                </>
              )}
            </Paper>
          </Grid>

          {/* Coluna da direita - Abas com informações detalhadas */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                variant="fullWidth"
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  bgcolor: mainTypeColor + '22'
                }}
              >
                <Tab label="Estatísticas" />
                <Tab label="Habilidades" />
                <Tab label="Evolução" />
                <Tab label="Sprites" />
              </Tabs>

              <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
                {/* Aba de estatísticas */}
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                      Estatísticas Base
                    </Typography>
                    {pokemon.stats && Object.entries(pokemon.stats).map(([stat, value]) => (
                      <Box key={stat} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                            {stat.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {value}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 10,
                            width: '100%',
                            bgcolor: 'grey.300',
                            borderRadius: 5,
                            position: 'relative'
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${Math.min(value / 255 * 100, 100)}%`,
                              bgcolor: value < 50 ? 'error.main' : value < 90 ? 'warning.main' : 'success.main',
                              borderRadius: 5,
                              transition: 'width 1s ease-in-out'
                            }}
                          />
                        </Box>
                      </Box>
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={200}
                          thickness={4}
                          sx={{ color: 'grey.300' }}
                        />
                        <CircularProgress
                          variant="determinate"
                          value={Math.min(
                            Object.values(pokemon.stats || {}).reduce((sum, value) => sum + value, 0) / 600 * 100,
                            100
                          )}
                          size={200}
                          thickness={4}
                          sx={{ 
                            color: mainTypeColor,
                            position: 'absolute',
                            left: 0,
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="h4" component="div" fontWeight="bold">
                            {Object.values(pokemon.stats || {}).reduce((sum, value) => sum + value, 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Aba de habilidades */}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                      Habilidades
                    </Typography>
                    <Grid container spacing={2}>
                      {pokemon.abilities.map((ability, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 1 }}>
                                {ability.replace('-', ' ')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Esta habilidade permite que o Pokémon tenha vantagens em batalha.
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Aba de evolução */}
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                      Cadeia de Evolução
                    </Typography>
                    {pokemon.evolutionChain && pokemon.evolutionChain.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                        {pokemon.evolutionChain.map((evolution, index) => (
                          <React.Fragment key={evolution.id}>
                            {index > 0 && (
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {evolution.level ? `Nível ${evolution.level}` : 
                                   evolution.trigger ? `${evolution.trigger}` : 
                                   evolution.item ? `Usar ${evolution.item}` : 'Evolui'}
                                </Typography>
                                <Box sx={{ fontSize: 24 }}>→</Box>
                              </Box>
                            )}
                            <Card 
                              sx={{ 
                                width: 150, 
                                bgcolor: evolution.id === pokemon.id ? `${mainTypeColor}33` : 'background.paper',
                                border: evolution.id === pokemon.id ? `2px solid ${mainTypeColor}` : 'none'
                              }}
                            >
                              <CardMedia
                                component="img"
                                height="120"
                                image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`}
                                alt={evolution.name}
                                sx={{ objectFit: 'contain', p: 1 }}
                              />
                              <CardContent sx={{ p: 1, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                  {formatPokemonName(evolution.name)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatPokemonId(evolution.id)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </React.Fragment>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body1" sx={{ textAlign: 'center' }}>
                        Este Pokémon não possui evolução.
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Aba de sprites */}
                {activeTab === 3 && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                      Sprites
                    </Typography>
                    <Grid container spacing={2}>
                      {pokemon.sprites && Object.entries(pokemon.sprites)
                        .filter(([key, value]) => 
                          typeof value === 'string' && 
                          value && 
                          !key.includes('back_shiny') && 
                          !key.includes('back_female')
                        )
                        .map(([key, value]) => (
                          <Grid item xs={6} sm={4} md={3} key={key}>
                            <Card sx={{ height: '100%' }}>
                              <CardMedia
                                component="img"
                                height="120"
                                image={value}
                                alt={key}
                                sx={{ objectFit: 'contain', p: 1 }}
                              />
                              <CardContent sx={{ p: 1, textAlign: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                  {key.replace(/_/g, ' ')}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))
                      }
                      {/* Sprites animados */}
                      {pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated && 
                        Object.entries(pokemon.sprites.versions['generation-v']['black-white'].animated)
                          .filter(([key, value]) => typeof value === 'string' && value)
                          .map(([key, value]) => (
                            <Grid item xs={6} sm={4} md={3} key={key}>
                              <Card sx={{ height: '100%', bgcolor: '#f5f5f5' }}>
                                <CardMedia
                                  component="img"
                                  height="120"
                                  image={value}
                                  alt={key}
                                  sx={{ objectFit: 'contain', p: 1 }}
                                />
                                <CardContent sx={{ p: 1, textAlign: 'center' }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Animado {key.replace(/_/g, ' ')}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))
                      }
                    </Grid>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PokemonDetails; 