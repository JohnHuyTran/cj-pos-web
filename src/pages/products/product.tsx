import React, { ReactElement, useState } from "react";
import { Router, useHistory } from "react-router-dom";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  Grid,
  Button,
  Box,
  Modal,
  TextField,
  FormControl,
  Snackbar,
  IconButton,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import { BootstrapButton } from "./products-css";
import CloseIcon from "@mui/icons-material/Close";
import TitleHeader from "../../components/title-header";
import ProductListComponent from "../../components/product/product-list";
import { createProductStyles } from "../products/product-create-css";
import ProductCreateModal from "../../components/product/product-create-modal";
import { post } from "../../adapters/posback-adapter";
import { useAppDispatch } from "../../store/store";
import {
  fetchCreateProduct,
  fetchGetProductList,
} from "../../store/slices/productSlice";

interface Props {}

interface initialFormValuesState {
  name: string;
  price: string;
  barcode: string;
}

const initialFormValues: initialFormValuesState = {
  name: "",
  price: "",
  barcode: "",
};

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: 550,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  p: 2,
  px: 4,
  pb: 3,
  boxShadow: 24,
};

export default function ProductList({}: Props): ReactElement {
  const dispatch = useAppDispatch();
  const classes = createProductStyles();
  const history = useHistory();

  const [openModalCreate, setOpenModalCreate] = React.useState(false);
  const handleOpen = () => {
    setOpenModalCreate(true);
  };
  const handleClose = () => setOpenModalCreate(false);

  const [valuesForm, setValuesForm] = useState(initialFormValues);
  const handleChange = (prop: any) => (event: any) => {
    setValuesForm({ ...valuesForm, [prop]: event.target.value });
  };
  const handleClickConfirm = () => {
    console.log("values== ", valuesForm);
    const data = {
      name: valuesForm.name,
      price: parseInt(valuesForm.price),
      barcode: valuesForm.barcode,
    };

    const res = dispatch(fetchCreateProduct(data));
    if (res != null) {
      dispatch(fetchGetProductList());
      setValuesForm(initialFormValues);
      setOpenModalCreate(false);
      setOpenSnackBar(true);
    }
  };

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const handleCloseSnackBar = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const actionSnackBar = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Container maxWidth="lg">
        <TitleHeader title="สินค้า" icon="storefront" />
        <Box mt={3}>
          <BootstrapButton
            variant="contained"
            size="small"
            color="primary"
            onClick={handleOpen}
          >
            CREATE
          </BootstrapButton>
        </Box>
        <ProductListComponent />
        {/* {open && <ProductCreateModal event={true} />} */}

        <StyledModal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalCreate}
          onClose={handleClose}
          BackdropComponent={Backdrop}
        >
          <Box sx={style}>
            <h2 id="unstyled-modal-title">Create</h2>

            <FormControl>
              <Grid
                container
                spacing={0}
                direction="row"
                alignItems="center"
                className={classes.marginBottom}
              >
                <Grid item xs={4}>
                  <Typography>Products Name: </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="productName"
                    label="Products Name"
                    variant="outlined"
                    size="small"
                    value={valuesForm.name}
                    onChange={handleChange("name")}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={0}
                direction="row"
                alignItems="center"
                className={classes.marginBottom}
              >
                <Grid item xs={4}>
                  <Typography>Products Price: </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="productPrice"
                    label="Product Price"
                    variant="outlined"
                    size="small"
                    value={valuesForm.price}
                    onChange={handleChange("price")}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={0} direction="row" alignItems="center">
                <Grid item xs={4}>
                  <Typography>Products Barcode: </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="productBarcode"
                    label="Products Barcode"
                    variant="outlined"
                    size="small"
                    value={valuesForm.barcode}
                    onChange={handleChange("barcode")}
                  />
                </Grid>
              </Grid>
              <Box mt={5}>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      color="inherit"
                      onClick={handleClose}
                    >
                      CANCLE
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      type="submit"
                      onClick={handleClickConfirm}
                    >
                      CREATE
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </FormControl>
          </Box>
        </StyledModal>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={openSnackBar}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
          action={actionSnackBar}
        >
          <Alert
            onClose={handleCloseSnackBar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Create Success
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}
