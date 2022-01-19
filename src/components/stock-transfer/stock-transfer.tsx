import moment from 'moment';
import { Grid } from '@mui/material';
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Select } from '@mui/material';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';
import DatePickerComponent from '../commons/ui/date-picker';
import { useStyles } from '../../styles/makeTheme';
import { Button } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ModalCreateStockTransfer from './create-stock-transfer';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateAddItemsState } from '../../store/slices/add-items-slice';

import BranchListDropDown from '../commons/ui/branch-list-dropdown';
import ReasonsListDropDown from '../stock-transfer/transfer-reasons-list-dropdown';
import { gridColumnsTotalWidthSelector } from '@material-ui/data-grid';
import LoadingModal from '../commons/ui/loading-modal';
import AlertError from '../../components/commons/ui/alert-error';
import { StockTransferRequest } from '../../models/stock-transfer-model';
import { featchSearchStockTransferAsync } from '../../store/slices/stock-transfer-slice';
import StockTransferList from '../../components/stock-transfer/stock-transfer-list';
import { saveSearchStockTransfer } from '../../store/slices/save-search-stock-transfer-slice';
import StockPackChecked from './stock-pack';

interface State {
  docNo: string;
  branchFrom: string;
  branchTo: string;
  dateFrom: string;
  dateTo: string;
  statuses: string;
  transferReason: string;
}

interface loadingModalState {
  open: boolean;
}

export default function SupplierCheckOrderSearch() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  // const limit: number = 0;
  const page = '1';
  const items = useAppSelector((state) => state.searchStockTransfer);
  const limit = useAppSelector((state) => state.searchStockTransfer.orderList.perPage);
  const [values, setValues] = React.useState<State>({
    docNo: '',
    branchFrom: '',
    branchTo: '',
    dateFrom: '',
    dateTo: '',
    statuses: 'ALL',
    transferReason: '',
  });

  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  const [branchFromCode, setBranchFromCode] = React.useState('');
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const handleChangeBranchFrom = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setBranchFromCode(branchCode);
      setValues({ ...values, branchFrom: JSON.parse(codes) });
    } else {
      setValues({ ...values, branchFrom: '' });
    }
  };

  const handleChangeBranchTo = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branchTo: JSON.parse(codes) });
    } else {
      setValues({ ...values, branchTo: '' });
    }
  };

  const handleChangeReasons = (ReasonsCode: string) => {
    if (ReasonsCode !== null) {
      let codes = JSON.stringify(ReasonsCode);
      setValues({ ...values, transferReason: JSON.parse(codes) });
    } else {
      setValues({ ...values, transferReason: '' });
    }
  };

  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const handleOpenCreateModal = async () => {
    await dispatch(updateAddItemsState({}));
    setOpenCreateModal(true);
  };
  function handleCloseCreateModal() {
    setOpenCreateModal(false);
  }

  const onClickValidateForm = () => {
    if (values.branchFrom === '') {
      setOpenAlert(true);
      setTextError('กรุณาระบุสาขาต้นทาง');
    } else if (values.branchTo === '') {
      setOpenAlert(true);
      setTextError('กรุณาระบุสาขาปลายทาง');
    } else {
      onClickSearchBtn();
    }
  };

  const onClickSearchBtn = async () => {
    let limits;
    if (limit === 0 || limit === undefined) {
      limits = '10';
    } else {
      limits = limit.toString();
    }

    const payload: StockTransferRequest = {
      limit: limits,
      page: page,
      docNo: values.docNo,
      branchFrom: values.branchFrom,
      branchTo: values.branchTo,
      dateFrom: moment(startDate).startOf('day').toISOString(),
      dateTo: moment(endDate).endOf('day').toISOString(),
      statuses: values.statuses,
      transferReason: values.transferReason,
      clearSearch: false,
    };

    handleOpenLoading('open', true);
    await dispatch(featchSearchStockTransferAsync(payload));
    await dispatch(saveSearchStockTransfer(payload));
    setFlagSearch(true);
    handleOpenLoading('open', false);
  };

  const onClickClearBtn = () => {
    handleOpenLoading('open', true);
    setFlagSearch(false);
    setStartDate(null);
    setEndDate(null);
    setClearBranchDropDown(!clearBranchDropDown);
    setValues({
      docNo: '',
      branchFrom: '',
      branchTo: '',
      dateFrom: '',
      dateTo: '',
      statuses: 'ALL',
      transferReason: '',
    });

    const payload: StockTransferRequest = {
      limit: limit ? limit.toString() : '10',
      page: page,
      docNo: values.docNo,
      branchFrom: values.branchFrom,
      branchTo: values.branchTo,
      dateFrom: moment(startDate).startOf('day').toISOString(),
      dateTo: moment(endDate).endOf('day').toISOString(),
      statuses: values.statuses,
      transferReason: values.transferReason,
      clearSearch: true,
    };
    dispatch(featchSearchStockTransferAsync(payload));

    setTimeout(() => {
      handleOpenLoading('open', false);
    }, 300);
  };

  //alert Errormodel
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  //check dateFrom-dateTo
  if (endDate != null && startDate != null) {
    if (endDate < startDate) {
      setEndDate(null);
    }
  }

  let orderListData;
  const orderListDatas = items.orderList.data ? items.orderList.data : [];
  const [flagSearch, setFlagSearch] = React.useState(false);
  if (flagSearch) {
    if (orderListDatas.length > 0) {
      // orderListData = <DCOrderList />;
      orderListData = <StockTransferList />;
    } else {
      orderListData = (
        <Grid item container xs={12} justifyContent='center'>
          <Box color='#CBD4DB'>
            <h2>
              {/* ไม่มีข้อมูล <SearchOff fontSize='large' /> */}
              ไม่มีข้อมูล
            </h2>
          </Box>
        </Grid>
      );
    }
  }

  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
              ค้นหาเอกสาร
            </Typography>
            <TextField
              id='txtDocNo'
              name='docNo'
              size='small'
              value={values.docNo}
              onChange={handleChange}
              className={classes.MtextField}
              fullWidth
              placeholder='เลขที่เอกสาร BT'
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
              สาขาต้นทาง*
            </Typography>
            <BranchListDropDown
              sourceBranchCode={''}
              onChangeBranch={handleChangeBranchFrom}
              isClear={clearBranchDropDown}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
              สาขาปลายทาง*
            </Typography>
            <BranchListDropDown
              sourceBranchCode={branchFromCode}
              onChangeBranch={handleChangeBranchTo}
              isClear={clearBranchDropDown}
            />
          </Grid>

          <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              วันที่รับสินค้า
            </Typography>
            <Typography gutterBottom variant='subtitle1' component='div'>
              ตั้งแต่
            </Typography>
            <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div' sx={{ mt: 3.5 }}>
              ถึง
            </Typography>
            <DatePickerComponent onClickDate={handleEndDatePicker} value={endDate} type={'TO'} minDateTo={startDate} />
          </Grid>

          <Grid item xs={4} container>
            <Typography gutterBottom variant='subtitle1' component='div' sx={{ mt: 3.5 }}>
              สถานะ
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id='selPiType'
                name='statuses'
                value={values.statuses}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}>
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={'0'}>บันทึก</MenuItem>
                <MenuItem value={'1'}>อยู่ระหว่างดำเนินการ</MenuItem>
                <MenuItem value={'2'}>เสร็จสิ้น</MenuItem>
                <MenuItem value={'3'}>ยกเลิก</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
              สาเหตุการโอน
            </Typography>
            <ReasonsListDropDown onChangeReasons={handleChangeReasons} isClear={clearBranchDropDown} />
          </Grid>

          <Grid item container xs={12} sx={{ mt: 3 }} justifyContent='flex-end' direction='row' alignItems='flex-end'>
            <Button
              id='btnCreateStockTransferModal'
              variant='contained'
              onClick={handleOpenCreateModal}
              sx={{ minWidth: '15%' }}
              className={classes.MbtnClear}
              startIcon={<AddCircleOutlineOutlinedIcon />}
              color='secondary'>
              สร้างรายการโอน
            </Button>
            <Button
              id='btnClear'
              variant='contained'
              onClick={onClickClearBtn}
              sx={{ width: '13%', ml: 2 }}
              className={classes.MbtnClear}
              color='cancelColor'>
              เคลียร์
            </Button>
            <Button
              id='btnSearch'
              variant='contained'
              color='primary'
              onClick={onClickValidateForm}
              sx={{ width: '13%', ml: 2 }}
              className={classes.MbtnSearch}>
              ค้นหา
            </Button>
          </Grid>
        </Grid>

        <Box mt={2}></Box>

        <hr />

        <Box mt={2}>
          <Button
            id='btnSearch'
            variant='contained'
            color='primary'
            // onClick={}
            sx={{ width: '13%', ml: 2 }}
            className={classes.MbtnSearch}
            disabled>
            ส่งงาน
          </Button>
        </Box>
      </Box>

      <Box mt={6}></Box>
      {orderListData}

      <LoadingModal open={openLoadingModal.open} />

      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
      {/* {openCreateModal && <ModalCreateStockTransfer isOpen={openCreateModal} onClickClose={handleCloseCreateModal} />} */}
      {openCreateModal && <StockPackChecked isOpen={true} onClickClose={handleCloseCreateModal} />}
    </>
  );
}
