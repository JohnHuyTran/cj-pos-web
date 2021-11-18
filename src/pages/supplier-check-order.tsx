import Container from "@mui/material/Container";
import { Box } from "@mui/material";
import TitleHeader from "../components/title-header";
import SupplierCheckOrderSearch from "../components/supplier-check-order/supplier-check-order";

const SupplierCheckOrder = () => {
  return (
    <Container maxWidth="xl">
      <TitleHeader title="การรับสินค้าจาก Supplier" />
      <Box mt={3}>
        <SupplierCheckOrderSearch />
      </Box>
    </Container>
  );
};

export default SupplierCheckOrder;
