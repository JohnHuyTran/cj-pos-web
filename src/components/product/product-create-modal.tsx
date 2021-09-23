import React, { ReactElement, FC } from "react";
import { Grid, Button, Box, Modal, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/core/ModalUnstyled";

import { createProductStyles } from "../../pages/products/product-create-css";
interface Props {
  event: boolean;
}

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

// export default function ProductCreateModal() {
const ProductCreateModal: FC<Props> = ({ event }): ReactElement => {
  const classes = createProductStyles();

  const [opens, setOpen] = React.useState(event);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log("event in modal==", event);
  console.log("open in modal==", opens);

  return (
    <div>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={opens}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
        <Box sx={style}>
          <h2 id="unstyled-modal-title">Create</h2>
          {/* <p id="unstyled-modal-description">Aliquid amet deserunt earum!</p> */}
          <form noValidate autoComplete="off">
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
                  id="productName"
                  label="Products Name"
                  variant="outlined"
                  // value={values.name}
                  // onChange={handleChange("name")}
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
                  id="productPrice"
                  label="Product Price"
                  variant="outlined"
                  // value={values.price}
                  // onChange={handleChange("price")}
                />
              </Grid>
            </Grid>
            <Grid container spacing={0} direction="row" alignItems="center">
              <Grid item xs={4}>
                <Typography>Products Barcode: </Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="productBarcode"
                  label="Products Barcode"
                  variant="outlined"
                  // value={values.barcode}
                  // onChange={handleChange("barcode")}
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
                  <Button variant="contained" size="large" color="primary">
                    CREATE
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Box>
      </StyledModal>
    </div>
  );
};

export default ProductCreateModal;
