import React, { ReactElement, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { withStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import MuiListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import StarBorder from '@mui/icons-material/StarBorder';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAppSelector, useAppDispatch } from '../store/store';
import { changeState } from '../store/slices/nav-slice';
import imgLogo from '../assets/images/Logo-CJ-More.png';
import Menu from '@mui/icons-material/Menu';
import { ShoppingCartSharp } from '@mui/icons-material';
import { MAINMENU, SUBMENU } from '../utils/enum/permission-enum';
import { isAllowMainMenuPermission, isAllowSubMenuPermission } from '../utils/role-permission';

const drawerWidth = 240;
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const ListItemButton = withStyles({
  root: {
    '&$selected': {
      backgroundColor: '#E7FFE9!important',
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

interface Props {}

export default function Sidebar({}: Props): ReactElement {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [openSaleMenu, setOpenSaleMenu] = React.useState(false);
  const [openProductMenu, setOpenProductMenu] = React.useState(false);
  const [openSellMenu, setOpenSellMenu] = React.useState(false);
  const [openPickUpMenu, setOpenPickUpMenu] = React.useState(false);
  const [openTransferMenu, setOpenTransferMenu] = React.useState(false);

  const navState = useAppSelector((state) => state.navigator.state);

  const [disableMainMenuOrderReceive, setDisableMainMenuOrderReceive] = React.useState(true);
  const [disableMainMenuStockTransfer, setDisableMainMenuStockTransfer] = React.useState(true);
  const [disableMainMenuSell, setDisableMainMenuSell] = React.useState(true);

  const [disableSubMenuOROrderReceive, setDisableSubMenuOROrderReceive] = React.useState(true);
  const [disableSubMenuORStockDiff, setDisableSubMenuORStockDiff] = React.useState(true);
  const [disableSubMenuORSupplier, setDisableSubMenuORSupplier] = React.useState(true);

  const [disableSubMenuSTStockRequest, setDisableSubMenuSTStockRequest] = React.useState(true);
  const [disableSubMenuSTStockTransfer, setDisableSubMenuSTStockTransfer] = React.useState(true);

  useEffect(() => {
    setOpen(navState);
    setDisableMainMenuOrderReceive(isAllowMainMenuPermission(MAINMENU.ORDER_RECEIVE));
    setDisableMainMenuStockTransfer(isAllowMainMenuPermission(MAINMENU.STOCK_TRANSFER));
    setDisableMainMenuSell(isAllowMainMenuPermission(MAINMENU.SALE));

    setDisableSubMenuOROrderReceive(isAllowSubMenuPermission(SUBMENU.OR_ORDER_RECEIVE));
    setDisableSubMenuORStockDiff(isAllowSubMenuPermission(SUBMENU.OR_DIFF));
    setDisableSubMenuORSupplier(isAllowSubMenuPermission(SUBMENU.OR_SUPPLIER));

    setDisableSubMenuSTStockRequest(isAllowSubMenuPermission(SUBMENU.ST_REQUEST));
    setDisableSubMenuSTStockTransfer(isAllowSubMenuPermission(SUBMENU.ST_TRANSFER));
  }, [navState]);

  const dispatch = useAppDispatch();

  const handleDrawerClose = () => {
    setOpen(false);
    dispatch(changeState(false));
  };

  const handleListItemClick = (menuId: number) => {
    setSelectedIndex(menuId);
  };

  const handleClick = () => {
    setOpenSaleMenu(!openSaleMenu);
  };

  const handleClickProduct = () => {
    setOpenProductMenu(!openProductMenu);
  };

  const handleClickSell = () => {
    setOpenSellMenu(!openSellMenu);
  };

  const handleClickPickUp = () => {
    setOpenPickUpMenu(!openPickUpMenu);
  };

  const handleClickTransfer = () => {
    setOpenTransferMenu(!openTransferMenu);
  };
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
      variant='persistent'
      anchor='left'
      open={open}>
      <DrawerHeader>
        <img src={imgLogo} alt='' width='50' />
        {/* <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon color="primary" />
          ) : (
            <ChevronRightIcon color="primary" />
          )}
        </IconButton> */}

        <div onClick={handleDrawerClose}>
          <ChevronLeftIcon color='primary' sx={{ marginRight: '-5px' }} />
          <Menu color='primary' />
        </div>
      </DrawerHeader>

      <List sx={{ marginTop: 2 }}>
        <Link to='/' style={{ textDecoration: 'none', color: '#676767' }}>
          <ListItemButton
            key='HOME'
            selected={selectedIndex === 0}
            onClick={() => handleListItemClick(0)}
            id='mainMenuHome'>
            <ListItemIcon>
              <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='หน้าหลัก' style={{ marginLeft: -15 }} />
          </ListItemButton>
        </Link>
        {/*sell menu start*/}
        {/* <ListItemButton key='SELL' onClick={handleClickSell} sx={{ display: disableSellMainMenu ? 'none' : '' }}></ListItemButton> */}
        <ListItemButton key='SELL' onClick={handleClickSell}>
          <ListItemIcon>
            <ShoppingCartSharp />
          </ListItemIcon>
          <ListItemText primary='ขาย' style={{ marginLeft: -15 }} />
          {openSellMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSellMenu} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <Link
              to='/barcode-discount'
              style={{ textDecoration: 'none', color: '#676767' }}
              id='subMenuBarcodeDiscount'>
              <ListItemButton
                key='BARCODE DISCOUNT'
                selected={selectedIndex === 3}
                onClick={() => handleListItemClick(3)}
                sx={{ pl: 7 }}>
                <ListItemText primary='ส่วนลดสินค้า' />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
        <ListItemButton onClick={handleClickPickUp} id='mainMenuPickUp'>
          <ListItemIcon>
            <LoyaltyOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary='รับสินค้า'
            style={{ marginLeft: -15, display: disableMainMenuOrderReceive ? 'none' : '' }}
          />
          {openPickUpMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPickUpMenu} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <Link
              to='/check-order'
              style={{ textDecoration: 'none', color: '#676767', display: disableSubMenuOROrderReceive ? 'none' : '' }}
              id='subMenuCheckOrder'>
              <ListItemButton
                key='SALE'
                selected={selectedIndex === 5}
                onClick={() => handleListItemClick(5)}
                sx={{ pl: 7 }}>
                <ListItemText primary='รับสินค้า' />
              </ListItemButton>
            </Link>
            <Link
              to='/dc-check-order'
              style={{ textDecoration: 'none', color: '#676767', display: disableSubMenuORStockDiff ? 'none' : '' }}
              id='subMenuDCCheckOrder'>
              <ListItemButton
                key='dcConfirmOrder'
                selected={selectedIndex === 6}
                onClick={() => handleListItemClick(6)}
                sx={{ pl: 7 }}>
                <ListItemText primary='ตรวจสอบผลต่างการรับสินค้า' />
              </ListItemButton>
            </Link>
            <Link
              to='/supplier-check-order'
              style={{ textDecoration: 'none', color: '#676767', display: disableSubMenuORSupplier ? 'none' : '' }}
              id='subMenuSupplierCheckOrder'>
              <ListItemButton
                key='supplierCheckOrder'
                selected={selectedIndex === 7}
                onClick={() => handleListItemClick(7)}
                sx={{ pl: 7 }}>
                <ListItemText primary='รับสินค้า จากผู้จำหน่าย' />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>

        <ListItemButton onClick={handleClickTransfer} id='mainMenuTransfer'>
          <ListItemIcon>
            <LoyaltyOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary='โอนสินค้า'
            style={{ marginLeft: -15, display: disableMainMenuStockTransfer ? 'none' : '' }}
          />
          {openTransferMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openTransferMenu} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <Link
              to='/stock-transfer-rt'
              style={{ textDecoration: 'none', color: '#676767', display: disableSubMenuSTStockRequest ? 'none' : '' }}
              id='subMenuStockTransferRt'>
              <ListItemButton
                key='StockTransferRt'
                selected={selectedIndex === 8}
                onClick={() => handleListItemClick(8)}
                sx={{ pl: 7 }}>
                <ListItemText primary='สร้างแผนโอนสินค้าระหว่างสาขา/คลัง' />
              </ListItemButton>
            </Link>
            <Link
              to='/stock-transfer'
              style={{ textDecoration: 'none', color: '#676767', display: disableSubMenuSTStockTransfer ? 'none' : '' }}
              id='subMenuStockTransfer'>
              <ListItemButton
                key='StockTransfer'
                selected={selectedIndex === 9}
                onClick={() => handleListItemClick(9)}
                sx={{ pl: 7 }}>
                <ListItemText primary='โอนสินค้าระหว่างสาขา/คลัง' />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
}
