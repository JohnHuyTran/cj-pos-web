import { Box, Button, Grid } from '@mui/material';
import { ReactElement, useState } from 'react';
import { featchBranchAccountingListAsync } from '../../../store/slices/accounting/accounting-search-slice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import ExpenseSearchList from './expense-search-list';

function expenseSearch(): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [docNo, setDocNo] = useState('');

  const [selectRowsList, setSelectRowsList] = useState<Array<any>>([]);
  const handleSelectRows = async (list: any) => {
    console.log('list:', JSON.stringify(list));
    setSelectRowsList(list);
  };

  const [flagSearch, setFlagSearch] = useState(false);
  const items = useAppSelector((state) => state.searchBranchAccounting);
  const orderListDatas = items.branchAccountingList.data ? items.branchAccountingList.data : [];
  const onClickSearchBtn = async () => {
    await dispatch(featchBranchAccountingListAsync());
    setFlagSearch(true);
  };

  return (
    <>
      <Box mb={2}>
        <Grid container spacing={2} mt={4} mb={2}>
          <Grid item xs={5}>
            <Button
              id='btnSearch'
              variant='contained'
              color='primary'
              onClick={onClickSearchBtn}
              sx={{ width: 110, ml: 2 }}
              className={classes.MbtnSearch}
              disabled={selectRowsList.length === 0 || orderListDatas.length === 0}>
              อนุมัติ
            </Button>
            <Button
              id='btnSearch'
              variant='contained'
              color='secondary'
              onClick={onClickSearchBtn}
              sx={{ width: 110, ml: 2 }}
              className={classes.MbtnSearch}
              disabled={orderListDatas.length === 0}>
              อนุมัติทั้งหมด
            </Button>
          </Grid>
          <Grid item xs={7} sx={{ textAlign: 'end' }}>
            <Button
              id='btnSearch'
              variant='contained'
              color='primary'
              onClick={onClickSearchBtn}
              sx={{ width: 110, ml: 2 }}
              className={classes.MbtnSearch}>
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>

      {flagSearch && (
        <div>
          {orderListDatas.length > 0 && <ExpenseSearchList onSelectRows={handleSelectRows} />}
          {orderListDatas.length === 0 && (
            <Grid item container xs={12} justifyContent='center'>
              <Box color='#CBD4DB'>
                <h2>ไม่มีข้อมูล</h2>
              </Box>
            </Grid>
          )}
        </div>
      )}
    </>
  );
}

export default expenseSearch;
