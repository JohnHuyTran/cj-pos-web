import React, { ReactElement, useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { featchBranchAccountingListAsync } from '../../../store/slices/accounting/accounting-search-slice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import ExpenseSearchList from './expense-search-list';
import ModelConfirmSearch from './confirm/modal-confirm-search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ModalSelectPeriod from '../expense/modal-select-period';
import {
  clearDataExpensePeriod,
  featchExpensePeriodTypeAsync,
} from '../../../store/slices/accounting/accounting-period-type-slice';
import { ExpensePeriod } from '../../../models/branch-accounting-model';

function expenseSearch(): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [docNo, setDocNo] = React.useState('');

  const [selectRowsList, setSelectRowsList] = React.useState<Array<any>>([]);
  const handleSelectRows = async (list: any) => {
    console.log('list:', JSON.stringify(list));
    setSelectRowsList(list);
  };

  const [flagSearch, setFlagSearch] = React.useState(false);
  const [flagBtnApproveAll, setFlagBtnApproveAll] = React.useState(true);
  const items = useAppSelector((state) => state.searchBranchAccounting);
  const orderListDatas = items.branchAccountingList.data ? items.branchAccountingList.data : [];

  if (flagSearch && orderListDatas.length > 0 && flagBtnApproveAll) setFlagBtnApproveAll(false);

  const onClickSearchBtn = async () => {
    // await dispatch(featchBranchAccountingListAsync());
    setFlagSearch(true);
  };

  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
  const handleOpenModelConfirm = () => {
    setOpenModelConfirm(true);
  };

  const handleCloseModelConfirm = () => {
    setOpenModelConfirm(false);
  };

  const handleConfirm = (periodData: any) => {
    console.log('handleConfirm');
    console.log('periodData:', periodData);
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
      <Box mb={2}>
        <Grid container spacing={2} mt={4} mb={2}>
          <Grid item xs={5}>
            <Button
              id='btnSearch'
              variant='contained'
              color='primary'
              onClick={handleOpenModelConfirm}
              sx={{ width: 110 }}
              className={classes.MbtnSearch}
              disabled={selectRowsList.length === 0 || orderListDatas.length === 0}>
              อนุมัติ
            </Button>
            <Button
              id='btnSearch'
              variant='contained'
              color='secondary'
              onClick={handleOpenModelConfirm}
              sx={{ width: 110, ml: 2 }}
              className={classes.MbtnSearch}
              disabled={flagBtnApproveAll}>
              อนุมัติทั้งหมด
            </Button>
          </Grid>
          <Grid item xs={7} sx={{ textAlign: 'end' }}>
            <Button
              id='btnCreateStockTransferModal'
              variant='contained'
              onClick={() => handleOpenSelectPeriodModal('COFFEE')}
              sx={{ minWidth: '15%' }}
              className={classes.MbtnSearch}
              startIcon={<AddCircleOutlineOutlinedIcon />}
              color='secondary'>
              ค่าใช้จ่ายร้านกาแฟ
            </Button>

            <Button
              id='btnCreateStockTransferModal'
              variant='contained'
              onClick={() => handleOpenSelectPeriodModal('STOREFRONT')}
              sx={{ minWidth: '15%', ml: 2 }}
              className={classes.MbtnSearch}
              startIcon={<AddCircleOutlineOutlinedIcon />}
              color='warning'>
              ค่าใช้จ่ายหน้าร้าน
            </Button>

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

      <ModelConfirmSearch
        open={openModelConfirm}
        onClose={handleCloseModelConfirm}
        onConfirm={handleConfirm}
        startDate='2022-06-16T00:00:00+07:00'
        endDate='2022-06-30T23:59:59.999999999+07:00'
      />

      <ModalSelectPeriod
        open={openSelectPeriod}
        onClose={handleCloseSelectPeriodModal}
        type={types}
        onConfirm={function (value: ExpensePeriod): void {
          throw new Error('Function not implemented.');
        }}
      />
    </>
  );
}

export default expenseSearch;
