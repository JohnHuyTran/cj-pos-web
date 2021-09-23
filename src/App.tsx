import './App.css';
import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@mui/styles';
import { useTheme, alpha } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Switch, Route, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import MuiListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRightOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

import imgUser from './assets/images/PP-NoPic.svg';
import imgLogo from './assets/images/CJlogo.png';

import Home from './pages/home';
import Notification from './pages/notification';
import Purchase from './pages/purchase';
import ProductList from './pages/products';
import Sale from './pages/sale';
import User from './pages/user';
import LoginForm from './components/login/login-form';
import { useAppSelector } from './store/store';
import CheckOrder from './pages/check-order';

function App() {
  const auth = useAppSelector((state) => state.auth);
  const drawerWidth = 240;

  const theme = useTheme();

  const useStyles = makeStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      backgroundColor: 'white',
      width: 500,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      backgroundColor: 'white',
      width: 500,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'space-between',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    toolbar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'white',
    },
    search: {
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
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#CBD4DB',
    },
    inputRoot: {
      color: '#CBD4DB',
      width: '280px',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
    branchLabel: {
      width: '280px',
      height: '48px',
      border: '2px',
      borderStyle: 'solid',
      borderColor: '#EAEBEB',
      borderRadius: theme.shape.borderRadius,
      color: '#AEAEAE',
      padding: '2px',
    },
  });

  const ListItemButton = withStyles({
    root: {
      '&$selected': {
        backgroundColor: '#E7FFE9',
        color: '#36C690',
        '& .MuiListItemIcon-root': {
          color: '#36C690',
        },
      },
      '&$selected:hover': {
        backgroundColor: '#FFFFFF',
        color: '#676767',
        '& .MuiListItemIcon-root': {
          color: '#676767',
        },
      },
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: '#E7FFE9',
        color: '#36C690',
        '& .MuiListItemIcon-root': {
          color: '#36C690',
        },
      },
    },
    selected: {},
  })(MuiListItemButton);

  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [openSaleMenu, setOpenSaleMenu] = React.useState(false);
  const [openProductMenu, setOpenProductMenu] = React.useState(false);

  const handleClick = () => {
    setOpenSaleMenu(!openSaleMenu);
  };

  const handleClickProduct = () => {
    setOpenProductMenu(!openProductMenu);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (menuId: number) => {
    setSelectedIndex(menuId);
  };

  if (!auth || !auth.isLogin) {
    return <LoginForm />;
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar className={classes.toolbar}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder='Enter key word...'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: '300px',
            }}
          >
            <div className={classes.branchLabel}>
              <Typography variant='subtitle2'>
                สาขา : (0223) สาขาที่00236 สนามจันทร์ (ชุมชนจัทรคามพิทักษ์)
              </Typography>
            </div>
            <IconButton
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              color='primary'
              edge='end'
            >
              <img src={imgUser} alt='' />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor='left'
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <img src={imgLogo} alt='' />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <Link to='/' style={{ textDecoration: 'none' }}>
            <ListItemButton
              key='HOME'
              selected={selectedIndex === 0}
              onClick={() => handleListItemClick(0)}
            >
              <ListItemIcon>
                <HomeOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary='หน้าหลัก' />
            </ListItemButton>
          </Link>
          <Link to='/notification' style={{ textDecoration: 'none' }}>
            <ListItemButton
              key='NOTIFICATION'
              selected={selectedIndex === 1}
              onClick={() => handleListItemClick(1)}
            >
              <ListItemIcon>
                <NotificationsNoneOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary='แจ้งเตือน' />
            </ListItemButton>
          </Link>
          <Link to='/purchase' style={{ textDecoration: 'none' }}>
            <ListItemButton
              key='PURCHASE'
              selected={selectedIndex === 2}
              onClick={() => handleListItemClick(2)}
            >
              <ListItemIcon>
                <ShoppingCartOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary='ซื้อ' />
            </ListItemButton>
          </Link>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <LoyaltyOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='ขาย' />
            {openSaleMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSaleMenu} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              <Link to='/sale' style={{ textDecoration: 'none' }}>
                <ListItemButton
                  key='SALE'
                  selected={selectedIndex === 3}
                  onClick={() => handleListItemClick(3)}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary='ส่วนลดสินค้า' />
                </ListItemButton>
              </Link>
            </List>
          </Collapse>
          <ListItemButton onClick={handleClickProduct}>
            <ListItemIcon>
              <LoyaltyOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='สินค้า' />
            {openProductMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openProductMenu} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              <Link to='/products' style={{ textDecoration: 'none' }}>
                <ListItemButton
                  key='PRODUCTS'
                  selected={selectedIndex === 4}
                  onClick={() => handleListItemClick(4)}
                >
                  <ListItemIcon>
                    <StorefrontOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary='ข้อมูลสินค้า' />
                </ListItemButton>
              </Link>
              <Link to='/check-order' style={{ textDecoration: 'none' }}>
                <ListItemButton
                  key='SALE'
                  selected={selectedIndex === 5}
                  onClick={() => handleListItemClick(5)}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary='ตรวจสอบการรับ-โอนสินค้า' />
                </ListItemButton>
              </Link>
            </List>
          </Collapse>
          <Link to='/user' style={{ textDecoration: 'none' }}>
            <ListItemButton
              key='USER'
              selected={selectedIndex === 6}
              onClick={() => handleListItemClick(6)}
            >
              <ListItemIcon>
                <GroupAddOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary='จัดการผู้ใช้งาน' />
            </ListItemButton>
          </Link>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />

        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/notification' component={Notification} />
          <Route path='/purchase' component={Purchase} />
          <Route path='/products' component={ProductList} />
          <Route path='/check-order' component={CheckOrder} />
          <Route path='/sale' component={Sale} />
          <Route path='/user' component={User} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
