import Container from '@mui/material/Container';
import { Box } from '@mui/material';
import TitleHeader from '../../components/title-header';
import ExpenseSearch from '../../components/accounting/expense/expense-search-test';

const StockBalance = () => {
  return (
    <Container maxWidth='xl'>
      <TitleHeader title='ค่าใช้จ่าย' />
      <Box mt={3}>
        <ExpenseSearch />
      </Box>
    </Container>
  );
};

export default StockBalance;
