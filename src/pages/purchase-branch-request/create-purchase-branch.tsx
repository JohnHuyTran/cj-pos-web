import Container from '@mui/material/Container';
import { Box } from '@mui/material';
import TitleHeader from '../../components/title-header';
import CreatePurchaseBranch from '../../components/purchase-branch-request/create-purchase-branch/purchase-mock';

const StockBalance = () => {
  return (
    <Container maxWidth='xl'>
      <TitleHeader title='ค้นหารายการ' />
      <Box mt={3}>
        <CreatePurchaseBranch />
      </Box>
    </Container>
  );
};

export default StockBalance;
