import Container from '@mui/material/Container';
import { Box } from '@mui/material';
import TitleHeader from '../components/title-header';
import SearchStockTransferRt from '../components/stock-transfer/stock-transfer-rt';

const StockTransferRt = () => {
  return (
    <Container maxWidth="xl">
      <TitleHeader title="สร้างรายการโอนสินค้า" />
      <Box mt={3}>
        <SearchStockTransferRt />
      </Box>
    </Container>
  );
};

export default StockTransferRt;
