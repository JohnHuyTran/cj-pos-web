import { Box, Button, Container } from '@mui/material';
import React, { useEffect } from 'react';
import ExpenseDetail from '../../components/accounting/expense/expense-detail';
import TitleHeader from '../../components/title-header';
import { periodMockData } from '../../mockdata/branch-accounting';
import {
  addNewItem,
  featchExpenseDetailAsync,
  initialItems,
  updateItemRows,
  updateSummaryRows,
  updateToInitialState,
} from '../../store/slices/accounting/accounting-slice';
import { useAppDispatch } from '../../store/store';
import { useStyles } from '../../styles/makeTheme';

export default function Expense() {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const onClose = () => {
    setOpen(false);
  };

  const onOpenNew = async () => {
    setOpen(true);
    setEdit(false);
    await dispatch(updateToInitialState());
    // await dispatch(initialItems([]));
    // await dispatch(addNewItem(null));
    // await dispatch(updateSummaryRows([]));
    // await dispatch(updateItemRows([]));
  };
  return (
    <Container maxWidth='xl'>
      <TitleHeader title='ค่าใช่จ่าย' />

      <Button
        data-testid='testid-btnSendToDC'
        id='btnSendToDC'
        variant='contained'
        color='error'
        className={classes.MbtnSendDC}
        onClick={onOpenNew}
        sx={{ width: 140 }}>
        OpenNew
      </Button>
      <Box mt={3}>
        <ExpenseDetail isOpen={open} onClickClose={onClose} type={'COFFEE'} edit={edit} periodProps={periodMockData} />
      </Box>
    </Container>
  );
}
