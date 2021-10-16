import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';

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
    cancelColor: {
      main: grey[500]
    }
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
          color: '#fff',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#36C690',
          color: '#fff'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          padding: '2px 12px 2px 12px',
        },
        input: {
          padding: '2px 12px 2px 12px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          padding: '2px 2px 2px 2px',
        },
        input: {
          padding: '2px 2px 2px 2px',
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          paddingTop: '0px',
        },
        item: {
          paddingTop: '0px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          marginBottom: '0px',
        },
      },
    },
  },

});

export default theme;
