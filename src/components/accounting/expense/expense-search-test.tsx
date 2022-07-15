import { Box, Button, Grid } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { featchBranchAccountingListAsync } from '../../../store/slices/accounting/accounting-search-slice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import ExpenseSearchList from './expense-search-list';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
// import ModalSelectPeriod from '../expense/modal-select-period';
import {
  clearDataExpensePeriod,
  featchExpensePeriodTypeAsync,
} from '../../../store/slices/accounting/accounting-period-type-slice';

function expenseSearch(): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [docNo, setDocNo] = useState('');

  const handleSelectRows = async (list: any) => {
    console.log('list:', JSON.stringify(list));
  };

  const [flagSearch, setFlagSearch] = useState(false);
  const items = useAppSelector((state) => state.searchBranchAccounting);
  const orderListDatas = items.branchAccountingList.data ? items.branchAccountingList.data : [];
  const onClickSearchBtn = async () => {
    // await dispatch(featchBranchAccountingListAsync());
    setFlagSearch(true);
  };

  const [openSelectPeriod, setOpenSelectPeriod] = useState(false);
  const [types, setType] = useState('');
  const handleOpenSelectPeriodModal = async (type: string) => {
    setType(type);
    await dispatch(clearDataExpensePeriod());
    await dispatch(featchExpensePeriodTypeAsync(type));
    setOpenSelectPeriod(true);
  };
  const handleCloseSelectPeriodModal = async () => {
    setOpenSelectPeriod(false);
  };

  // useEffect(() => {
  //
  // }, []);

  return (
    <>
      <Box mb={6}>
        <Grid container spacing={2} mt={4} mb={2}>
          <Grid item xs={5}></Grid>
          <Grid item xs={7} sx={{ textAlign: 'end' }}>
            <Button
              id="btnCreateStockTransferModal"
              variant="contained"
              onClick={() => handleOpenSelectPeriodModal('COFFEE')}
              sx={{ minWidth: '15%' }}
              className={classes.MbtnSearch}
              startIcon={<AddCircleOutlineOutlinedIcon />}
              color="secondary"
            >
              ค่าใช้จ่ายร้านกาแฟ
            </Button>

            <Button
              id="btnCreateStockTransferModal"
              variant="contained"
              onClick={() => handleOpenSelectPeriodModal('STOREFRONT')}
              sx={{ minWidth: '15%', ml: 2 }}
              className={classes.MbtnSearch}
              startIcon={<AddCircleOutlineOutlinedIcon />}
              color="warning"
            >
              ค่าใช้จ่ายหน้าร้าน
            </Button>

            <Button
              id="btnSearch"
              variant="contained"
              color="primary"
              onClick={onClickSearchBtn}
              sx={{ width: 110, ml: 2 }}
              className={classes.MbtnSearch}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>

      {flagSearch && (
        <div>
          {orderListDatas.length > 0 && <ExpenseSearchList onSelectRows={handleSelectRows} />}
          {orderListDatas.length === 0 && (
            <Grid item container xs={12} justifyContent="center">
              <Box color="#CBD4DB">
                <h2>ไม่มีข้อมูล</h2>
              </Box>
            </Grid>
          )}
        </div>
      )}

      {/* <ModalSelectPeriod open={openSelectPeriod} onClose={handleCloseSelectPeriodModal} type={types} /> */}
    </>
  );
}

export default expenseSearch;
