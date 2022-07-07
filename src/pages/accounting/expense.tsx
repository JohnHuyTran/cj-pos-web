import { Box, Container } from '@mui/material';
import React from 'react';
import ExpenseDetail from '../../components/accounting/expense/expense-detail';
import TitleHeader from '../../components/title-header';

export default function Expense() {
  return (
    <Container maxWidth='xl'>
      <TitleHeader title='ค่าใช่จ่าย' />
      <Box mt={3}>
        <ExpenseDetail isOpen={true} onClickClose={() => {}} expenseType={2} />
      </Box>
    </Container>
  );
}
