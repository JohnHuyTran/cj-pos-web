import React, { ReactElement, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { withStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import MuiListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import { useAppSelector, useAppDispatch } from '../store/store';
import { changeState } from '../store/slices/nav-slice';
import imgLogo from '../assets/images/CJlogo.jpeg';
import Menu from '@mui/icons-material/Menu';
import { MoveToInbox, ShoppingCartSharp } from '@mui/icons-material';
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
  const [openWithDrawMenu, setOpenWithDrawMenu] = React.useState(false);
  const [openProductInfoMenu, setOpenProductInfoMenu] = React.useState(false);
  const [openPurchaseBranchMenu, setOpenPurchaseBranchMenu] = React.useState(false);
  const [openCheckStockMenu, setOpenCheckStockMenu] = React.useState(false);

  const navState = useAppSelector((state) => state.navigator.state);

  const [disableMainMenuOrderReceive, setDisableMainMenuOrderReceive] = React.useState(true);
  const [disableMainMenuStockTransfer, setDisableMainMenuStockTransfer] = React.useState(true);
  const [disableMainMenuSell, setDisableMainMenuSell] = React.useState(true);
  const [disableMainMenuTransferOut, setDisableMainMenuTransferOut] = React.useState(true);
  const [disableMainMenuProductInfo, setDisableMainMenuProductInfo] = React.useState(true);
  const [disableMainMenuPurchaseBranch, setDisableMainMenuPurchaseBranch] = React.useState(true);
  const [disableMainMenuCheckStock, setDisableMainMenuCheckStock] = React.useState(true)

  const [disableSubMenuOROrderReceive, setDisableSubMenuOROrderReceive] = React.useState(true);
  const [disableSubMenuORStockDiff, setDisableSubMenuORStockDiff] = React.useState(true);
  const [disableSubMenuORSupplier, setDisableSubMenuORSupplier] = React.useState(true);

  const [disableSubMenuSTStockRequest, setDisableSubMenuSTStockRequest] = React.useState(true);
  const [disableSubMenuSTStockTransfer, setDisableSubMenuSTStockTransfer] = React.useState(true);
  const [disableSubMenuTaxInvoice, setDisableSubMenuTaxInvoice] = React.useState(true);
  const [disableSubMenuStockBalance, setDisableSubMenuStockBalance] = React.useState(true);
  const [disableSubMenuStockMovement, setDisableSubMenuStockMovement] = React.useState(true);
  const [disableSubMenuCreatePurchaseBranch, setDisableSubMenuCreatePurchaseBranch] = React.useState(true);

  const [disableSubMenuSaleSaleLimit, setDisableSubMenuSaleSaleLimit] = React.useState(true);
  const [disableSubMenuSaleDiscount, setDisableSubMenuSaleDiscount] = React.useState(true);
  const [disableSubMenuTODestroy, setDisableSubMenuTODestroy] = React.useState(true);
  const [disableSubMenuTOStoreUse, setDisableSubMenuTOStoreUse] = React.useState(true);
  const [disableSubMenuProductMaster, setDisableSubMenuProductMaster] = React.useState(true);
  const [disableSubMenuAuditPlan, setDisableSubMenuAuditPlan] = React.useState(true);

  useEffect(() => {
    setOpen(navState);
    setDisableMainMenuOrderReceive(isAllowMainMenuPermission(MAINMENU.ORDER_RECEIVE));
    setDisableMainMenuStockTransfer(isAllowMainMenuPermission(MAINMENU.STOCK_TRANSFER));
    setDisableMainMenuSell(isAllowMainMenuPermission(MAINMENU.SALE));
    setDisableMainMenuTransferOut(isAllowMainMenuPermission(MAINMENU.TRANSFER_OUT));
    setDisableMainMenuProductInfo(isAllowMainMenuPermission(MAINMENU.PRODUCT_INFO));
    setDisableMainMenuPurchaseBranch(isAllowMainMenuPermission(MAINMENU.PURCHASE_BRANCH));

    setDisableSubMenuSaleDiscount(isAllowSubMenuPermission(SUBMENU.SALE_DISCOUNT));
    setDisableSubMenuSaleSaleLimit(isAllowSubMenuPermission(SUBMENU.SALE_SALE_LIMIT));
    setDisableSubMenuTaxInvoice(isAllowSubMenuPermission(SUBMENU.SALE_TAX_INVOICE));

    setDisableSubMenuOROrderReceive(isAllowSubMenuPermission(SUBMENU.OR_ORDER_RECEIVE));
    setDisableSubMenuORStockDiff(isAllowSubMenuPermission(SUBMENU.OR_DIFF));
    setDisableSubMenuORSupplier(isAllowSubMenuPermission(SUBMENU.OR_SUPPLIER));

    setDisableSubMenuSTStockRequest(isAllowSubMenuPermission(SUBMENU.ST_REQUEST));
    setDisableSubMenuSTStockTransfer(isAllowSubMenuPermission(SUBMENU.ST_TRANSFER));

    setDisableSubMenuTODestroy(isAllowSubMenuPermission(SUBMENU.TO_DESTROY));
    setDisableSubMenuTOStoreUse(isAllowSubMenuPermission(SUBMENU.TO_STORE_USE));

    setDisableSubMenuStockBalance(isAllowSubMenuPermission(SUBMENU.PI_STOCK_BALANCE));
    setDisableSubMenuStockMovement(isAllowSubMenuPermission(SUBMENU.PI_STOCK_MOVEMENT));
    setDisableSubMenuProductMaster(isAllowSubMenuPermission(SUBMENU.PI_PRODUCT_MASTER));

    setDisableSubMenuCreatePurchaseBranch(isAllowSubMenuPermission(SUBMENU.PR_CREATE_PURCHASE_BRANCH));
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
  const handleClickWithDraw = () => {
    setOpenWithDrawMenu(!openWithDrawMenu);
  };

  const handleClickProductInfo = () => {
    setOpenProductInfoMenu(!openProductInfoMenu);
  };
  const handleClickCheckStockMenu = () => {
    setOpenCheckStockMenu(!openCheckStockMenu);
  };
  const handleClickPurchaseBranch = () => {
    setOpenPurchaseBranchMenu(!openPurchaseBranchMenu);
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
        {/* <Link to='/notification' style={{ textDecoration: 'none', color: '#676767' }}>
          <ListItemButton
            key='NOTIFICATION'
            selected={selectedIndex === 1}
            onClick={() => handleListItemClick(1)}
            id='notification'>
            <ListItemIcon>
              <NotificationsNoneOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='แจ้งเตือน' style={{ marginLeft: -15 }} />
          </ListItemButton>
        </Link> */}
        {/*sell menu start*/}
        {/* <ListItemButton key='SELL' onClick={handleClickSell} sx={{ display: disableSellMainMenu ? 'none' : '' }}></ListItemButton> */}
        <ListItemButton key='SELL' onClick={handleClickSell} style={{ display: disableMainMenuSell ? 'none' : '' }}>
          <ListItemIcon>
            <ShoppingCartSharp />
          </ListItemIcon>
          <ListItemText primary='ขาย' style={{ marginLeft: -15 }} />
          {openSellMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSellMenu} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <Link to='/sale-limit-time' style={{ textDecoration: 'none', color: '#676767' }} id='subMenuSaleLimitTime'>
              <ListItemButton
                key='SALE LIMIT TINE'
                selected={selectedIndex === 2}
                onClick={() => handleListItemClick(2)}
                sx={{ pl: 7, display: disableSubMenuSaleSaleLimit ? 'none' : '' }}>
                <ListItemText primary='กำหนดเวลา (งด) ขายสินค้า' />
              </ListItemButton>
            </Link>
          </List>
          <List component='div' disablePadding>
            <Link
              to='/barcode-discount'
              style={{ textDecoration: 'none', color: '#676767' }}
              id='subMenuBarcodeDiscount'>
              <ListItemButton
                key='BARCODE DISCOUNT'
                selected={selectedIndex === 3}
                onClick={() => handleListItemClick(3)}
                sx={{ pl: 7, display: disableSubMenuSaleDiscount ? 'none' : '' }}>
                <ListItemText primary='ส่วนลดสินค้า' />
              </ListItemButton>
            </Link>
          </List>
          <List component='div' disablePadding>
            <Link to='/tax-invoice' style={{ textDecoration: 'none', color: '#676767' }} id='subMenuTaxInvoice'>
              <ListItemButton
                key='TAX INVOICE'
                selected={selectedIndex === 4}
                onClick={() => handleListItemClick(4)}
                sx={{ pl: 7, display: disableSubMenuTaxInvoice ? 'none' : '' }}>
                <ListItemText primary='ใบเสร็จ/ใบกำกับฉบับเต็ม' />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
        <ListItemButton
          onClick={handleClickPickUp}
          id='mainMenuPickUp'
          style={{ display: disableMainMenuOrderReceive ? 'none' : '' }}>
          <ListItemIcon>
            <LoyaltyOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary='รับสินค้า' style={{ marginLeft: -15 }} />
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

        <ListItemButton
          onClick={handleClickTransfer}
          id='mainMenuTransfer'
          style={{ display: disableMainMenuStockTransfer ? 'none' : '' }}>
          <ListItemIcon>
            <SwapHorizontalCircleIcon />
          </ListItemIcon>
          <ListItemText primary='โอนสินค้า' style={{ marginLeft: -15 }} />
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
        <ListItemButton
          onClick={handleClickWithDraw}
          id='mainMenuWithDraw'
          style={{ display: disableMainMenuTransferOut ? 'none' : '' }}>
          <ListItemIcon>
            <PresentToAllIcon />
          </ListItemIcon>
          <ListItemText primary='เบิก' style={{ marginLeft: -15 }} />
          {openWithDrawMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openWithDrawMenu} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <Link
              to='/transfer-out-destroy'
              style={{ textDecoration: 'none', color: '#676767' }}
              id='subMenuTransferOut'>
              <ListItemButton
                key='TransferOutDestroy'
                selected={selectedIndex === 11}
                onClick={() => handleListItemClick(11)}
                sx={{ pl: 7, display: disableSubMenuTODestroy ? 'none' : '' }}>
                <ListItemText primary='ทำลาย' />
              </ListItemButton>
            </Link>
            <Link to='/transfer-out' style={{ textDecoration: 'none', color: '#676767' }} id='subMenuTransferOut'>
              <ListItemButton
                key='TransferOut'
                selected={selectedIndex === 10}
                onClick={() => handleListItemClick(10)}
                sx={{ pl: 7, display: disableSubMenuTOStoreUse ? 'none' : '' }}>
                <ListItemText primary='ใช้ในการทำกิจกรรม' />
              </ListItemButton>
            </Link>
            <Link
              to='/transfer-out-raw-masterial'
              style={{ textDecoration: 'none', color: '#676767' }}
              id='subMenuTOMasterial'>
              <ListItemButton
                key='subMenuTOMasterial'
                selected={selectedIndex === 20}
                onClick={() => handleListItemClick(20)}
                sx={{ pl: 7 }}>
                <ListItemText primary='ขอใช้วัตถุดิบร้านบาว' />
              </ListItemButton>
            </Link>
            <Link
              to='/create-purchase-branch'
              style={{
                textDecoration: 'none',
                color: '#676767',
                display: disableSubMenuCreatePurchaseBranch ? 'none' : '',
              }}
              id='subMenuCreatePurchaseBranch'>
              <ListItemButton
                key='CreatePurchaseBranch'
                selected={selectedIndex === 13}
                onClick={() => handleListItemClick(13)}
                sx={{ pl: 7 }}>
                <ListItemText primary='ของใช้หน้าร้าน' />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
        <ListItemButton
          onClick={handleClickProductInfo}
          id='mainMenuProductInfo'
          style={{ display: disableMainMenuProductInfo ? 'none' : '' }}>
          <ListItemIcon>
            <StoreMallDirectoryIcon />
          </ListItemIcon>
          <ListItemText primary='ข้อมูลสินค้า' style={{ marginLeft: -15 }} />
          {openProductInfoMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openProductInfoMenu} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <Link
              to='/product-master'
              style={{
                textDecoration: 'none',
                color: '#676767',
                display: disableSubMenuProductMaster ? 'none' : '',
              }}
              id='subMenuProductMaster'>
              <ListItemButton
                key='ProductMaster'
                selected={selectedIndex === 14}
                onClick={() => handleListItemClick(14)}
                sx={{ pl: 7 }}>
                <ListItemText primary='รายละเอียดสินค้า' />
              </ListItemButton>
            </Link>
            <Link
              to='/stock-balance'
              style={{ textDecoration: 'none', color: '#676767', display: disableSubMenuStockBalance ? 'none' : '' }}
              id='subMenuStockBalance'>
              <ListItemButton
                key='StockBalance'
                selected={selectedIndex === 11}
                onClick={() => handleListItemClick(11)}
                sx={{ pl: 7 }}>
                <ListItemText primary='สินค้าคงคลัง' />
              </ListItemButton>
            </Link>
            <Link
              to='/stock-movement'
              style={{ textDecoration: 'none', color: '#676767', display: disableSubMenuStockMovement ? 'none' : '' }}
              id='subMenuStockMovement'>
              <ListItemButton
                key='StockMovement'
                selected={selectedIndex === 12}
                onClick={() => handleListItemClick(12)}
                sx={{ pl: 7 }}>
                <ListItemText primary='ความเคลื่อนไหวของสินค้า' />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
        <ListItemButton
          onClick={handleClickCheckStockMenu}
          id='mainMenuCheckStock'
          // style={{ display: disableMainMenuCheckStock ? 'none' : '' }}
        >
          <ListItemIcon>
            <AllInboxIcon />
          </ListItemIcon>
          <ListItemText primary='ตรวจนับสต๊อก' style={{ marginLeft: -15 }} />
          {openCheckStockMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openCheckStockMenu} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <Link
              to='/audit-plan'
              style={{
                textDecoration: 'none',
                color: '#676767',
                // display: disableSubMenuAuditPlan ? 'none' : '',
              }}
              id='subMenuAuditPlan'>
              <ListItemButton
                key='AuditPlan'
                selected={selectedIndex === 15}
                onClick={() => handleListItemClick(15)}
                sx={{ pl: 7 }}>
                <ListItemText primary='สร้างแผนตรวจนับสต๊อก' />
              </ListItemButton>
            </Link>
            <Link
              to='/stock-count'
              style={{
                textDecoration: 'none',
                color: '#676767',
              }}
              id='subMenuStockCount'>
              <ListItemButton
                key='StockCount'
                selected={selectedIndex === 16}
                onClick={() => handleListItemClick(16)}
                sx={{ pl: 7 }}>
                <ListItemText primary='ตรวจนับสต๊อก (SC)' />
              </ListItemButton>
            </Link>
            <Link
              to='/stock-adjustment'
              style={{
                textDecoration: 'none',
                color: '#676767',
              }}
              id='subMenuStockAdjustment'>
              <ListItemButton
                key='StockAdjustment'
                selected={selectedIndex === 17}
                onClick={() => handleListItemClick(17)}
                sx={{ pl: 7 }}>
                <ListItemText primary='รายละเอียดตรวจนับสต๊อก (SA)' />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
}
