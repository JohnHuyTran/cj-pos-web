import React, { ReactElement } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import ProductListComponent from "../../components/product/product-list";

interface Props {}

export default function ProductList({}: Props): ReactElement {
  return (
    <div>
      <Container maxWidth="sm">
        <ProductListComponent />
      </Container>
    </div>
  );
}
