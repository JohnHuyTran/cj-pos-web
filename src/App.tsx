import React, { useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Switch, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import Home from './pages/home';
import CheckOrder from './pages/check-order';
import DCCheckOrder from './pages/dc-check-order';
import SupplierCheckOrder from './pages/supplier-check-order';
import TaxInvoice from './pages/tax-invoice';
import StockTransfer from './pages/stock-transfer';
import StockTransferRt from './pages/stock-transfer-rt';
import LoginForm from './components/login/login-form';
import BarcodeDiscount from './pages/barcode-discount/barcode-discount';
import SaleLimitTime from './pages/sale-limit-time/sale-limit-time';

import { useAppDispatch, useAppSelector } from './store/store';
import { featchBranchListAsync } from './store/slices/search-branches-slice';
import { featchAuthorizedBranchListAsync } from './store/slices/authorized-branch-slice';
import Notification from './pages/notification';
import TransferOut from './pages/transfer-out/transfer-out';
import StockBalance from './pages/stock/stock-balance';
import TransferOutDestroy from './pages/transfer-out-destroy/transfer-out-destroy';
import StockMovement from './pages/stock/stock-movement';
import { featchMasterStockMovementTypeListAsync } from './store/slices/master/stock-movement-type-slice';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  paddingLeft: '5px',
  paddingRight: '5px',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function App2() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const navState = useAppSelector((state) => state.navigator.state);

  useEffect(() => {
    setOpen(navState);
  }, [navState]);

  if (!auth || !auth.isLogin) {
    return <LoginForm />;
  } else {
    dispatch(featchBranchListAsync());
    dispatch(featchAuthorizedBranchListAsync());
    dispatch(featchMasterStockMovementTypeListAsync());
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <Main open={open}>
        <DrawerHeader />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/notification' component={Notification} />
          <Route path='/barcode-discount' component={BarcodeDiscount} />
          <Route path='/tax-invoice' component={TaxInvoice} />
          <Route path='/sale-limit-time' component={SaleLimitTime} />
          <Route path='/check-order' component={CheckOrder} />
          <Route path='/dc-check-order' component={DCCheckOrder} />
          <Route path='/supplier-check-order' component={SupplierCheckOrder} />
          <Route path='/stock-transfer' component={StockTransfer} />
          <Route path='/stock-transfer-rt' component={StockTransferRt} />
          <Route path='/transfer-out' component={TransferOut} />
          <Route path='/transfer-out-destroy' component={TransferOutDestroy} />
          <Route path='/stock-balance' component={StockBalance} />
          <Route path='/stock-movement' component={StockMovement} />
        </Switch>
      </Main>
    </Box>
  );
}
