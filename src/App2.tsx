import React, { useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Switch, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Home from "./pages/home";
import Notification from "./pages/notification";
import Purchase from "./pages/purchase";
import ProductList from "./pages/products/product";
import Sale from "./pages/sale";
import User from "./pages/user";
import CheckOrder from "./pages/check-order";
import LoginForm from "./components/login/login-form";

import { useAppSelector } from "./store/store";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function App2() {
  const auth = useAppSelector((state) => state.auth);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const navState = useAppSelector((state) => state.navigator.state);

  useEffect(() => {
    setOpen(navState);
  }, [navState]);

  if (!auth || !auth.isLogin) {
    return <LoginForm />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <Main open={open}>
        <DrawerHeader />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/notification" component={Notification} />
          <Route path="/purchase" component={Purchase} />
          <Route path="/products" component={ProductList} />
          <Route path="/check-order" component={CheckOrder} />
          <Route path="/sale" component={Sale} />
          <Route path="/user" component={User} />
        </Switch>
      </Main>
    </Box>
  );
}
