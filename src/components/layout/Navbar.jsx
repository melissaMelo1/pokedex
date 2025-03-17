import React, { useState, useEffect, useRef } from 'react';
import { styled, alpha, keyframes } from '@mui/material/styles';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  InputBase,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Button,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { usePokemon } from '../../context/PokemonContext';
import { useNavigate, useLocation } from 'react-router-dom';
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

// Estilização do componente de busca
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: theme.spacing(5),
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

// Estilização dos itens de navegação
const NavItem = styled(Button)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : 'white',
  fontWeight: active ? 700 : 500,
  padding: theme.spacing(1, 2),
  borderBottom: active ? `3px solid ${theme.palette.primary.main}` : 'none',
  borderRadius: 0,
  '&:hover': {
    backgroundColor: 'transparent',
    borderBottom: `3px solid ${active ? theme.palette.primary.main : alpha(theme.palette.common.white, 0.5)}`,
  },
}));

/**
 * Componente de barra de navegação
 * @returns {JSX.Element} - Elemento JSX
 */
const Navbar = () => {
  const { searchPokemonsByName, resetSearch, searchTerm, searchLoading } = usePokemon();
  const [inputValue, setInputValue] = useState('');
  const searchTimeoutRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';

  // Efeito para limpar o timeout quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Limpar o timeout anterior se existir
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Se o valor estiver vazio, resetar a busca imediatamente
    if (!value.trim()) {
      resetSearch();
      return;
    }
    
    // Definir um novo timeout para atrasar a busca enquanto o usuário digita
    searchTimeoutRef.current = setTimeout(() => {
      searchPokemonsByName(value);
    }, 500); // Atraso de 500ms
  };

  const handleClearSearch = () => {
    setInputValue('');
    resetSearch();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (path === '/') {
      resetSearch();
    }
  };

  // Função para lidar com a tecla Enter no campo de busca
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      // Limpar o timeout anterior se existir
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      // Executar a busca imediatamente
      searchPokemonsByName(inputValue);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#212529" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleNavigation('/')}>
              <Box 
                component="img" 
                src="/assets/pokemon-logo.png" 
                alt="Pokémon Logo"
                height={isMobile ? "2em" : "2.5em"}
              />
            </Box>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', ml: 2 }}>
                <NavItem 
                  active={isHomePage} 
                  onClick={() => handleNavigation('/')}
                >
                  Início
                </NavItem>
              </Box>
            )}
            
            <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />
            
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar por nome ou ID..."
                inputProps={{ 'aria-label': 'busca' }}
                value={inputValue}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
              />
              {searchLoading ? (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <CircularProgress size={20} color="inherit" />
                </Box>
              ) : inputValue && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white'
                  }}
                  onClick={handleClearSearch}
                  size="small"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Search>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Navbar; 