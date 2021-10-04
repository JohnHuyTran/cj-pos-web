import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#36C690',
    },
    secondary: {
      main: '#446EF2',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: 'Kanit',
  },
  shape: {
    borderRadius: 2,
  },

  components: {

    MuiButton: {

      styleOverrides: {

        root: {

          backgroundColor: '#36C690',

          color: '#FFFFFF',

        },

      },

    },

    MuiOutlinedInput: {

      styleOverrides: {

        input: {

          padding: '8.5px 12px 8.5px 12px',

        },

      },

    },

  },

});

export default theme;
