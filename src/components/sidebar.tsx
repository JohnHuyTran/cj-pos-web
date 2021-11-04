import React, { ReactElement, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { withStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import MuiListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import StarBorder from "@mui/icons-material/StarBorder";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useAppSelector, useAppDispatch } from "../store/store";
import { changeState } from "../store/slices/nav-slice";

import imgLogo from "../assets/images/Logo-CJ-More.png";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

const ListItemButton = withStyles({
  root: {
    "&$selected": {
      backgroundColor: "#E7FFE9",
      color: "#36C690",
      "& .MuiListItemIcon-root": {
        color: "#36C690",
      },
    },
    "&$selected:hover": {
      backgroundColor: "#FFFFFF",
      color: "#676767",
      "& .MuiListItemIcon-root": {
        color: "#676767",
      },
    },
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#E7FFE9",
      color: "#36C690",
      "& .MuiListItemIcon-root": {
        color: "#36C690",
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

  const navState = useAppSelector((state) => state.navigator.state);

  useEffect(() => {
    setOpen(navState);
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

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <img src={imgLogo} alt="" width="50" />
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <Link to="/" style={{ textDecoration: "none", color: "#676767" }}>
          <ListItemButton
            key="HOME"
            selected={selectedIndex === 0}
            onClick={() => handleListItemClick(0)}
            id="mainMenuHome"
          >
            <ListItemIcon>
              <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="หน้าหลัก" />
          </ListItemButton>
        </Link>
        <Link
          to="/notification"
          style={{ textDecoration: "none", color: "#676767" }}
        >
          <ListItemButton
            key="NOTIFICATION"
            selected={selectedIndex === 1}
            onClick={() => handleListItemClick(1)}
            id="mainMenuNotification"
          >
            <ListItemIcon>
              <NotificationsNoneOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="แจ้งเตือน" />
          </ListItemButton>
        </Link>
        <Link
          to="/purchase"
          style={{ textDecoration: "none", color: "#676767" }}
        >
          <ListItemButton
            key="PURCHASE"
            selected={selectedIndex === 2}
            onClick={() => handleListItemClick(2)}
          >
            <ListItemIcon>
              <ShoppingCartOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="ซื้อ" />
          </ListItemButton>
        </Link>
        <ListItemButton onClick={handleClick} id="mainMenuSale">
          <ListItemIcon>
            <LoyaltyOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="ขาย" style={{ color: "#676767" }} />
          {openSaleMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSaleMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link
              to="/sale"
              style={{ textDecoration: "none", color: "#676767" }}
              id="subMenuSale"
            >
              <ListItemButton
                key="SALE"
                selected={selectedIndex === 3}
                onClick={() => handleListItemClick(3)}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary="ส่วนลดสินค้า" />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
        <ListItemButton onClick={handleClickProduct} id="mainMenuProducts">
          <ListItemIcon>
            <LoyaltyOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="สินค้า" style={{ color: "#676767" }} />
          {openProductMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openProductMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link
              to="/products"
              style={{ textDecoration: "none", color: "#676767" }}
              id="subMenuProducts"
            >
              <ListItemButton
                key="PRODUCTS"
                selected={selectedIndex === 4}
                onClick={() => handleListItemClick(4)}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <StorefrontOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="ข้อมูลสินค้า" />
              </ListItemButton>
            </Link>
            <Link
              to="/check-order"
              style={{ textDecoration: "none", color: "#676767" }}
              id="subMenuCheckOrder"
            >
              <ListItemButton
                key="SALE"
                selected={selectedIndex === 5}
                onClick={() => handleListItemClick(5)}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary="ตรวจสอบการรับ-โอนสินค้า" />
              </ListItemButton>
            </Link>
            <Link
              to="/dc-check-order"
              style={{ textDecoration: "none", color: "#676767" }}
              id="subMenuDCCheckOrder"
            >
              <ListItemButton
                key="dcConfirmOrder"
                selected={selectedIndex === 7}
                onClick={() => handleListItemClick(7)}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary="ตรวจสอบผลต่างการรับสินค้า" />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
        <Link to="/user" style={{ textDecoration: "none", color: "#676767" }}>
          <ListItemButton
            key="USER"
            selected={selectedIndex === 6}
            onClick={() => handleListItemClick(6)}
            id="mainMenuUser"
          >
            <ListItemIcon>
              <GroupAddOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="จัดการผู้ใช้งาน" />
          </ListItemButton>
        </Link>
      </List>
    </Drawer>
  );
}
