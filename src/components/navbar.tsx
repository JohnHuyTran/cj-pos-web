import React, { ReactElement, useEffect } from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useAppSelector, useAppDispatch } from '../store/store';
import { changeState } from '../store/slices/nav-slice';

import imgUser from '../assets/images/PP-NoPic.svg';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface Props {}

export default function Navbar({}: Props): ReactElement {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const navState = useAppSelector((state) => state.navigator.state);

  useEffect(() => {
    setOpen(navState);
  }, [navState]);

  const dispatch = useAppDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
    dispatch(changeState(true));
  };

  return (
    <AppBar position='fixed' open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: theme.palette.common.white,
        }}
      >
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              position: 'relative',
              borderRadius: theme.shape.borderRadius,
              border: '1px',
              borderStyle: 'solid',
              borderColor: '#CBD4DB',
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              marginLeft: 0,
              width: '500px',
              [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
              },
            }}
          >
            <Box
              sx={{
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#CBD4DB',
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder='Enter key word...'
              sx={{
                color: '#CBD4DB',
                width: '100%',
                padding: theme.spacing(1, 1, 1, 0),
                // vertical padding + font size from searchIcon
                paddingLeft: '48px',
                transition: theme.transitions.create('width'),
                [theme.breakpoints.up('sm')]: {
                  width: '12ch',
                  '&:focus': {
                    width: '20ch',
                  },
                },
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Box>
        </Box>
        <Box
          sx={{ display: 'inline-flex', alignItems: 'center', width: '300px' }}
        >
          <Box
            sx={{
              width: '280px',
              height: '48px',
              border: '2px',
              borderStyle: 'solid',
              borderColor: '#EAEBEB',
              borderRadius: theme.shape.borderRadius,
              color: '#AEAEAE',
              padding: '2px',
            }}
          >
            <Typography variant='subtitle2'>
              สาขา : (0223) สาขาที่00236 สนามจันทร์ (ชุมชนจัทรคามพิทักษ์)
            </Typography>
          </Box>
          <IconButton
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            color='primary'
            edge='end'
          >
            <img src={imgUser} alt='' />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
