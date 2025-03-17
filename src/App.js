import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { alpha } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import { PokemonProvider } from './context/PokemonContext';
import Navbar from './components/layout/Navbar';

// Criação do tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B',
      dark: '#E63946',
      light: '#FF9999',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#457B9D',
      dark: '#1D3557',
      light: '#A8DADC',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212529',
      secondary: '#6C757D',
    },
    error: {
      main: '#DC3545',
    },
    warning: {
      main: '#FFC107',
    },
    info: {
      main: '#0DCAF0',
    },
    success: {
      main: '#20C997',
    },
    // Cores para os tipos de Pokémon
    pokemonTypes: {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#E63946',
          },
        },
        outlinedPrimary: {
          borderColor: '#E0E0E0',
          color: '#212529',
          '&:hover': {
            borderColor: '#FF6B6B',
            backgroundColor: alpha('#FF6B6B', 0.04),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

/**
 * Componente principal da aplicação
 * @returns {JSX.Element} - Elemento JSX
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PokemonProvider>
        <Router>
          <Navbar />
          <AppRoutes />
        </Router>
      </PokemonProvider>
    </ThemeProvider>
  );
}

export default App;
