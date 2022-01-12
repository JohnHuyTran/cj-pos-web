import Container from '@mui/material/Container';
import { Box } from '@mui/material';
import TitleHeader from '../components/title-header';
import StockTransferSearch from '../components/stock-transfer/stock-transfer';

const SupplierCheckOrder = () => {
  return (
    <Container maxWidth="xl">
      <TitleHeader title="รับ-โอนสินค้าระหว่างสาขา/คลัง" />
      <Box mt={3}>
        <StockTransferSearch />
      </Box>
    </Container>
  );
};

export default SupplierCheckOrder;
