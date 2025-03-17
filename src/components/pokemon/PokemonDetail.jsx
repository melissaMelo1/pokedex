import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Grid, 
  Paper, 
  Tabs, 
  Tab, 
  Divider,
  useTheme,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de painel de conteúdo para as abas
 * @param {Object} props - Propriedades do componente
 * @param {number} props.value - Valor da aba atual
 * @param {number} props.index - Índice da aba
 * @param {ReactNode} props.children - Conteúdo da aba
 * @returns {JSX.Element} - Elemento JSX
 */
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pokemon-tabpanel-${index}`}
      aria-labelledby={`pokemon-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

/**
 * Componente de detalhes do Pokémon
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.pokemon - Dados do Pokémon
 * @returns {JSX.Element} - Elemento JSX
 */
const PokemonDetail = ({ pokemon }) => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (!pokemon) return null;
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" gutterBottom>
          {pokemon.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          #{pokemon.id.toString().padStart(3, '0')}
        </Typography>
        
        <Box 
          component="img"
          src={pokemon.sprites?.animated?.front_default || pokemon.image}
          alt={pokemon.name}
          sx={{ 
            width: '180px', 
            height: '180px',
            objectFit: 'contain',
            mt: 2
          }}
        />
        
        <Box display="flex" gap={1} mt={2}>
          {pokemon.types.map(type => (
            <Chip
              key={type}
              label={type}
              sx={{
                bgcolor: theme.palette.pokemonTypes[type.toLowerCase()] || theme.palette.grey[500],
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            />
          ))}
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {pokemon.description && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Descrição
          </Typography>
          <Typography variant="body2">
            {pokemon.description}
          </Typography>
        </Box>
      )}
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          mb: 2
        }}
      >
        <Tab label="Estatísticas" />
        <Tab label="Habilidades" />
        {pokemon.evolutionChain && pokemon.evolutionChain.length > 0 && (
          <Tab label="Evolução" />
        )}
        <Tab label="Sprites" />
      </Tabs>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* Aba de Estatísticas */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            {pokemon.stats.map(stat => (
              <Grid item xs={12} sm={6} key={stat.name}>
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.name}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: `${Math.min(100, (stat.baseStat / 255) * 100)}%`,
                      height: 8,
                      bgcolor: theme.palette.primary.main,
                      borderRadius: 1,
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">
                    {stat.baseStat}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Grid container spacing={2} mt={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Altura
              </Typography>
              <Typography variant="body1">
                {(pokemon.height / 10).toFixed(1)}m
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Peso
              </Typography>
              <Typography variant="body1">
                {(pokemon.weight / 10).toFixed(1)}kg
              </Typography>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Aba de Habilidades */}
        <TabPanel value={tabValue} index={1}>
          {pokemon.abilities && pokemon.abilities.length > 0 ? (
            <Grid container spacing={2}>
              {pokemon.abilities.map((ability, index) => (
                <Grid item xs={12} key={ability.name}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent' 
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}
                    >
                      {ability.name.replace('-', ' ')}
                      {ability.isHidden && (
                        <Chip 
                          label="Oculta" 
                          size="small" 
                          color="secondary" 
                          sx={{ ml: 1, height: 20 }} 
                        />
                      )}
                    </Typography>
                    {ability.effect && (
                      <Typography variant="body2" mt={1}>
                        {ability.effect}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Informações sobre habilidades não disponíveis.
            </Typography>
          )}
        </TabPanel>
        
        {/* Aba de Evolução */}
        <TabPanel value={tabValue} index={2}>
          {pokemon.evolutionChain && pokemon.evolutionChain.length > 0 ? (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {pokemon.evolutionChain.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <Box 
                      component="img"
                      src={stage.image}
                      alt={stage.name}
                      sx={{ 
                        width: 120, 
                        height: 120,
                        objectFit: 'contain'
                      }}
                    />
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                        mt: 1
                      }}
                    >
                      {stage.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      #{stage.id.toString().padStart(3, '0')}
                    </Typography>
                  </Box>
                  
                  {index < pokemon.evolutionChain.length - 1 && (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        my: 1
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {stage.evolutionDetails && stage.evolutionDetails.trigger
                          ? `Evolui por: ${stage.evolutionDetails.trigger}`
                          : 'Evolui para'}
                      </Typography>
                      <Box 
                        sx={{ 
                          width: 0, 
                          height: 30, 
                          border: '1px dashed',
                          borderColor: 'divider'
                        }} 
                      />
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Informações sobre evolução não disponíveis.
            </Typography>
          )}
        </TabPanel>
        
        {/* Aba de Sprites */}
        <TabPanel value={tabValue} index={pokemon.evolutionChain && pokemon.evolutionChain.length > 0 ? 3 : 2}>
          {pokemon.sprites ? (
            <Grid container spacing={2}>
              {pokemon.sprites.animated?.front_default && (
                <Grid item xs={6} sm={3}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <Box 
                      component="img"
                      src={pokemon.sprites.animated.front_default}
                      alt={`${pokemon.name} animated front`}
                      sx={{ 
                        width: 96, 
                        height: 96,
                        objectFit: 'contain'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Animado (Frente)
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {pokemon.sprites.animated?.back_default && (
                <Grid item xs={6} sm={3}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <Box 
                      component="img"
                      src={pokemon.sprites.animated.back_default}
                      alt={`${pokemon.name} animated back`}
                      sx={{ 
                        width: 96, 
                        height: 96,
                        objectFit: 'contain'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Animado (Costas)
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {pokemon.sprites.front_default && (
                <Grid item xs={6} sm={3}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <Box 
                      component="img"
                      src={pokemon.sprites.front_default}
                      alt={`${pokemon.name} front`}
                      sx={{ 
                        width: 96, 
                        height: 96,
                        objectFit: 'contain'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Padrão (Frente)
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {pokemon.sprites.back_default && (
                <Grid item xs={6} sm={3}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <Box 
                      component="img"
                      src={pokemon.sprites.back_default}
                      alt={`${pokemon.name} back`}
                      sx={{ 
                        width: 96, 
                        height: 96,
                        objectFit: 'contain'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Padrão (Costas)
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Sprites não disponíveis.
            </Typography>
          )}
        </TabPanel>
      </Box>
      
      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/pokemon/${pokemon.id}`)}
        >
          Ver Mais Detalhes
        </Button>
      </Box>
    </Paper>
  );
};

export default PokemonDetail; 