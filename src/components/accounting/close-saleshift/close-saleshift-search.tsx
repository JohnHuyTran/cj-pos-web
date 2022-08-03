import { Box, Button, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';
import store, { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import BranchListDropDown from '../../commons/ui/branch-list-dropdown';
import DatePickerAllComponent from '../../commons/ui/date-picker-all';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UpdateIcon from '@mui/icons-material/Update';
import { getUserInfo } from '../../../store/sessionStore';
import { getBranchName } from '../../../utils/utils';
import { env } from '../../../adapters/environmentConfigs';
import { BranchListOptionType } from '../../../models/branch-model';
import { isAllowActionPermission, isGroupBranch } from '../../../utils/role-permission';
import { closeSaleShift, CLOSE_SALE_SHIFT_ENUM } from '../../../utils/enum/accounting-enum';
import CloseSaleShiftSearchList from './close-saleshift-list';
import LoadingModal from '../../commons/ui/loading-modal';
import AlertError from '../../commons/ui/alert-error';
import { SearchOff } from '@mui/icons-material';
import {
  clearCloseSaleShiftList,
  featchCloseSaleShiptListAsync,
  savePayloadSearch,
} from '../../../store/slices/accounting/close-saleshift-slice';
import { CloseSaleShiftInfo, CloseSaleShiftRequest } from '../../../models/branch-accounting-model';
import moment from 'moment';
import ModalCloseSale from './modal-close-sale';
import { shiftClose } from '../../../services/accounting';
import { ApiError } from '../../../models/api-error-model';
import { ACTIONS } from 'utils/enum/permission-enum';
import ModalDetailCash from '../open-end/modal-detail-cash';
import { featchOpenEndDeatilAsync } from 'store/slices/accounting/open-end-slice';

function CloseSaleShiftSearch() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const page = 1;
  const items = useAppSelector((state) => state.closeSaleShiftSlice.closeSaleShift);
  const limit = useAppSelector((state) => state.closeSaleShiftSlice.closeSaleShift.perPage);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
    setIsPickerDateError(false);
    setPickerDateErrorMsg('');
  };
  const [values, setValues] = React.useState({
    status: 'ALL',
    branchFrom: '',
  });
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [groupBranch, setGroupBranch] = React.useState(isGroupBranch);
  const [branchFromCode, setBranchFromCode] = React.useState('');
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [ownBranch, setOwnBranch] = React.useState(
    getUserInfo().branch
      ? getBranchName(branchList, getUserInfo().branch)
        ? getUserInfo().branch
        : env.branch.code
      : env.branch.code
  );

  const branchFrom = getBranchName(branchList, ownBranch);
  const branchFromMap: BranchListOptionType = {
    code: ownBranch,
    name: branchFrom ? branchFrom : '',
  };
  const [valuebranchFrom, setValuebranchFrom] = React.useState<BranchListOptionType | null>(
    groupBranch ? branchFromMap : null
  );
  const [flagSearch, setFlagSearch] = React.useState(false);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<{ open: boolean }>({
    open: false,
  });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };
  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');

  const [disableCloseShiftKey, setDisableCloseShiftKey] = React.useState(true);
  const [openModalCloseSale, setOpenModalCloseSale] = React.useState(false);
  const [docNo, setDocNo] = React.useState('');
  const [noOfShiftKey, setNoOfShiftKey] = React.useState('');
  const [isPickerDateError, setIsPickerDateError] = React.useState(false);
  const [pickerDateErrorMsg, setPickerDateErrorMsg] = React.useState('');
  const [disableBtnSearch, setDisableBtnSearch] = React.useState(true);
  const [disableBtnManage, setDisableBtnManage] = React.useState(true);
  const [teseModal, setTestModal] = React.useState(false);
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const handleChangeBranchFrom = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setBranchFromCode(branchCode);
      setValues({ ...values, branchFrom: JSON.parse(codes) });
    } else {
      setValues({ ...values, branchFrom: '' });
    }
  };
  const onClickSearch = async () => {
    handleOpenLoading('open', true);

    if (startDate !== null) {
      let limits: number;
      if (limit === 0 || limit === undefined) {
        limits = 10;
      } else {
        limits = limit;
      }
      const payload: CloseSaleShiftRequest = {
        shiftDate: moment(startDate).endOf('day').toISOString(),
        branchCode: branchFromCode,
        status: values.status,
        page: page,
        limit: limits,
      };

      await dispatch(featchCloseSaleShiptListAsync(payload));
      await dispatch(savePayloadSearch(payload));
      const datas = store.getState().closeSaleShiftSlice.closeSaleShift.data;
      const _noOfShiftKey = store.getState().closeSaleShiftSlice.closeSaleShift.total;
      if (datas && datas.length > 0) {
        setNoOfShiftKey(_noOfShiftKey.toString());
        let notCorrect = false;
        datas.map((item: CloseSaleShiftInfo, index: number) => {
          if (item.status !== CLOSE_SALE_SHIFT_ENUM.CORRECT) {
            notCorrect = true;
          }
        });
        setDisableCloseShiftKey(notCorrect);
      }

      setFlagSearch(true);
    } else {
      setIsPickerDateError(true);
      setPickerDateErrorMsg('กรุณาเลือกวันที่ยอดขาย');
    }

    handleOpenLoading('open', false);
  };
  const onClickClearBtn = async () => {
    handleOpenLoading('open', true);
    if (!isGroupBranch()) {
      setStartDate(null);
      setBranchFromCode('');
      setValues({ status: CLOSE_SALE_SHIFT_ENUM.PENDDING_REVIEW, branchFrom: '' });
    } else {
      setValues({ ...values, status: 'ALL' });
    }

    setClearBranchDropDown(!clearBranchDropDown);
    setIsPickerDateError(false);
    setPickerDateErrorMsg('');
    dispatch(clearCloseSaleShiftList({}));
    setTimeout(() => {
      setFlagSearch(false);
      handleOpenLoading('open', false);
    }, 300);
  };
  const handleOpenCloseSale = async () => {
    handleOpenLoading('open', true);
    const payload: CloseSaleShiftRequest = {
      shiftDate: moment(new Date()).endOf('day').toISOString(),
    };
    await shiftClose(payload)
      .then(async (value) => {
        setDocNo(value.docNo);
        const payloadSearch = store.getState().closeSaleShiftSlice.payloadSearch;
        await dispatch(featchCloseSaleShiptListAsync(payloadSearch));
        setOpenModalCloseSale(true);
      })
      .catch((error: ApiError) => {
        setOpenAlert(true);
        setTextError(error.message);
      });

    handleOpenLoading('open', false);
  };
  const handleOnBypass = () => {};
  const handleOnupdate = async () => {
    await dispatch(featchOpenEndDeatilAsync('123'));
    setTestModal(true);
  };
  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  React.useEffect(() => {
    if (groupBranch) {
      setBranchFromCode(ownBranch);
      setValues({ ...values, branchFrom: ownBranch });
    } else {
      setValues({ ...values, status: CLOSE_SALE_SHIFT_ENUM.PENDDING_REVIEW });
    }
    setDisableBtnManage(isAllowActionPermission(ACTIONS.SALE_SHIFT_MANAGE));
    setDisableBtnSearch(isAllowActionPermission(ACTIONS.SALE_SHIFT_VIEW));
  }, []);

  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              สาขา
            </Typography>
            <BranchListDropDown
              valueBranch={valuebranchFrom}
              onChangeBranch={handleChangeBranchFrom}
              isClear={clearBranchDropDown}
              isFilterAuthorizedBranch={false}
              disable={groupBranch}
              sourceBranchCode={branchFromCode}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              สถานะรหัส
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id='status'
                name='status'
                value={values.status}
                onChange={handleChange}
                disabled={true}
                inputProps={{ 'aria-label': 'Without label' }}>
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                {closeSaleShift.map((item: any, index: number) => {
                  return <MenuItem value={item.key}>{item.text}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              วันที่ยอดขาย
            </Typography>
            <DatePickerAllComponent
              type='TO'
              onClickDate={handleStartDatePicker}
              value={startDate}
              disabled={groupBranch ? true : false}
              maxDate={new Date()}
              isError={isPickerDateError}
              hyperText={pickerDateErrorMsg}
            />
          </Grid>
        </Grid>
      </Box>
      <Box mb={6}>
        <Grid container spacing={2} mt={4} mb={2}>
          <Grid item xs={5}>
            <Button
              id='btnImport'
              variant='contained'
              color='primary'
              startIcon={<UpdateIcon />}
              onClick={handleOnupdate}
              sx={{ minWidth: 100, display: disableBtnManage ? 'none' : '' }}
              disabled={false}
              className={classes.MbtnSearch}>
              อัพเดท
            </Button>
            <Button
              id='btnImport'
              variant='contained'
              color='primary'
              onClick={handleOnBypass}
              sx={{ ml: 2, minWidth: 100, display: disableBtnManage ? 'none' : '' }}
              className={classes.MbtnSearch}
              disabled={true}
              startIcon={<ArrowBackIcon />}>
              Bypass
            </Button>
          </Grid>
          <Grid item xs={7} sx={{ textAlign: 'end' }}>
            <Button
              id='btnCreateStockTransferModal'
              variant='contained'
              onClick={handleOpenCloseSale}
              sx={{ width: 150, display: disableBtnManage ? 'none' : '' }}
              className={classes.MbtnClear}
              color='secondary'
              disabled={disableCloseShiftKey || !isGroupBranch()}>
              ปิดรอบยอดการขาย
            </Button>
            <Button
              id='btnClear'
              variant='contained'
              onClick={onClickClearBtn}
              sx={{ width: 110, ml: 2 }}
              className={classes.MbtnClear}
              color='cancelColor'>
              เคลียร์
            </Button>
            <Button
              id='btnSearch'
              variant='contained'
              color='primary'
              onClick={onClickSearch}
              sx={{ width: 110, ml: 2, display: disableBtnSearch ? 'none' : '' }}
              className={classes.MbtnSearch}>
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>
      {flagSearch && items.data.length > 0 && <CloseSaleShiftSearchList />}
      {flagSearch && items.data.length === 0 && (
        <Grid container xs={12} justifyContent='center'>
          <Box color='#CBD4DB' justifyContent='center'>
            <h2>
              ไม่มีข้อมูล <SearchOff fontSize='large' />
            </h2>
          </Box>
        </Grid>
      )}
      <LoadingModal open={openLoadingModal.open} />
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
      <ModalCloseSale
        open={openModalCloseSale}
        onClose={() => setOpenModalCloseSale(false)}
        noOfShiftKey={noOfShiftKey}
        docNo={docNo}
      />
      <ModalDetailCash
        isOpen={teseModal}
        onClose={function (): void {
          setTestModal(false);
        }}
      />
    </>
  );
}

export default CloseSaleShiftSearch;
