import React, { ReactElement } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Grid, Button, Box } from "@mui/material";

import { BootstrapButton } from "./products-css";
import TitleHeader from "../../components/title-header";
import ProductListComponent from "../../components/product/product-list";

interface Props {}

export default function ProductList({}: Props): ReactElement {
  return (
    <div>
      <Container maxWidth="lg">
        <TitleHeader title="สินค้า" icon="storefront" />
        <Box mt={3}>
          <BootstrapButton variant="contained" size="small" color="primary">
            CREATE
          </BootstrapButton>
        </Box>
        <ProductListComponent />
      </Container>
    </div>
  );
}
