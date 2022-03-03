import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Box, Grid, Typography, TextField, FormControl, Select, MenuItem, Button } from '@mui/material';
import { useStyles } from '../../styles/makeTheme';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import BranchListDropDown from '../commons/ui/branch-list-dropdown';
import DatePickerAllComponent from '../commons/ui/date-picker-all';
import ReasonsListDropDown from './transfer-reasons-list-dropdown';
import AlertError from '../commons/ui/alert-error';
import LoadingModal from '../commons/ui/loading-modal';
import { getStockTransferStatusList } from '../../utils/enum/stock-transfer-enum';
import { StockTransferRequest } from '../../models/stock-transfer-model';
import { featchSearchStockTransferRtAsync } from '../../store/slices/stock-transfer-rt-slice';
import moment from 'moment';
import { saveSearchStockTransferRt } from '../../store/slices/save-search-stock-transfer-rt-slice';
import StockTransferRtList from './stock-transfer-rt-list';
import ModalCreateStockTransfer from './stock-request-detail';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { updatestockRequestItemsState } from '../../store/slices/stock-request-items-slice';
import { isAllowActionPermission, isAllowMainMenuPermission, isGroupBranch } from '../../utils/role-permission';
import { env } from '../../adapters/environmentConfigs';
import { getBranchName } from '../../utils/utils';
import { BranchListOptionType } from '../../models/branch-model';
import { ACTIONS } from '../../utils/enum/permission-enum';
import { getUserInfo } from '../../store/sessionStore';

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

export default function StockTransferRt() {
  const { t } = useTranslation(['stockTransfer', 'common']);
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const page = '1';
  const items = useAppSelector((state) => state.searchStockTrnasferRt);
  const limit = useAppSelector((state) => state.searchStockTrnasferRt.orderList.perPage);
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

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  const [branchFromCode, setBranchFromCode] = React.useState('');
  const [branchToCode, setBranchToCode] = React.useState('');
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [groupBranch, setGroupBranch] = React.useState(isGroupBranch);
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [displayBtnCreate, setDisplayBtnCreate] = React.useState(false);
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

  React.useEffect(() => {
    setDisplayBtnCreate(isAllowActionPermission(ACTIONS.STOCK_RT_MANAGE));
    if (groupBranch) {
      setBranchFromCode(ownBranch);
      setValues({ ...values, branchFrom: ownBranch });
    }
  }, []);

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
      setBranchToCode(branchCode);
      setValues({ ...values, branchTo: JSON.parse(codes) });
    } else {
      setValues({ ...values, branchTo: '' });
    }
  };

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  const handleChangeReasons = (ReasonsCode: string) => {
    if (ReasonsCode !== null) {
      let codes = JSON.stringify(ReasonsCode);
      setValues({ ...values, transferReason: JSON.parse(codes) });
    } else {
      setValues({ ...values, transferReason: '' });
    }
  };

  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const onClickValidateForm = () => {
    if (startDate === null || endDate === null) {
      setOpenAlert(true);
      setTextError('กรุณาระบุวันที่โอน');
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
    await dispatch(featchSearchStockTransferRtAsync(payload));
    await dispatch(saveSearchStockTransferRt(payload));
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
    dispatch(featchSearchStockTransferRtAsync(payload));

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

  const [flagSearch, setFlagSearch] = React.useState(false);
  const orderListDatas = items.orderList.data ? items.orderList.data : [];

  let orderListData;
  if (flagSearch) {
    if (orderListDatas.length > 0) {
      orderListData = <StockTransferRtList />;
    } else {
      orderListData = (
        <Grid item container xs={12} justifyContent="center">
          <Box color="#CBD4DB">
            <h2>
              {/* ไม่มีข้อมูล <SearchOff fontSize='large' /> */}
              ไม่มีข้อมูล
            </h2>
          </Box>
        </Grid>
      );
    }
  }

  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [typeModal, setTypeModal] = React.useState('Create');
  const handleOpenCreateModal = async () => {
    await dispatch(updateAddItemsState({}));
    await dispatch(updatestockRequestItemsState({}));
    setTypeModal('Create');
    setOpenCreateModal(true);
  };

  function handleCloseCreateModal() {
    setOpenCreateModal(false);
  }

  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              {t('documentSearch')}
            </Typography>
            <TextField
              id="txtDocNo"
              name="docNo"
              size="small"
              value={values.docNo}
              onChange={handleChange}
              className={classes.MtextField}
              fullWidth
              placeholder="เลขที่เอกสาร RT"
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาขาต้นทาง
            </Typography>
            <BranchListDropDown
              valueBranch={valuebranchFrom}
              sourceBranchCode={branchToCode}
              onChangeBranch={handleChangeBranchFrom}
              isClear={clearBranchDropDown}
              disable={groupBranch}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาขาปลายทาง
            </Typography>
            <BranchListDropDown
              sourceBranchCode={branchFromCode}
              onChangeBranch={handleChangeBranchTo}
              isClear={clearBranchDropDown}
              filterOutDC={groupBranch}
            />
          </Grid>

          <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant="subtitle1" component="div">
              วันที่โอน
            </Typography>
            <Typography gutterBottom variant="subtitle1" component="div">
              ตั้งแต่*
            </Typography>
            <DatePickerAllComponent onClickDate={handleStartDatePicker} value={startDate} />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" sx={{ mt: 3.5 }}>
              ถึง*
            </Typography>
            <DatePickerAllComponent
              onClickDate={handleEndDatePicker}
              value={endDate}
              type={'TO'}
              minDateTo={startDate}
            />
          </Grid>
          <Grid item xs={4} container>
            <Typography gutterBottom variant="subtitle1" component="div" sx={{ mt: 3.5 }}>
              สถานะ
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selPiType"
                name="statuses"
                value={values.statuses}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                {getStockTransferStatusList('RT').map((item, index: number) => {
                  return <MenuItem value={item.key}>{t(`status.${item.value}`)}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาเหตุการโอน
            </Typography>
            <ReasonsListDropDown onChangeReasons={handleChangeReasons} isClear={clearBranchDropDown} />
          </Grid>

          <Grid item container xs={12} sx={{ mt: 3 }} justifyContent="flex-end" direction="row" alignItems="flex-end">
            <Button
              id="btnCreateStockTransferModal"
              variant="contained"
              onClick={handleOpenCreateModal}
              sx={{ minWidth: '15%', display: `${displayBtnCreate ? 'none' : ''}` }}
              className={classes.MbtnClear}
              startIcon={<AddCircleOutlineOutlinedIcon />}
              color="secondary"
            >
              สร้างรายการโอน
            </Button>
            <Button
              id="btnClear"
              variant="contained"
              onClick={onClickClearBtn}
              sx={{ width: '13%', ml: 2 }}
              className={classes.MbtnClear}
              color="cancelColor"
            >
              เคลียร์
            </Button>
            <Button
              id="btnSearch"
              variant="contained"
              color="primary"
              onClick={onClickValidateForm}
              sx={{ width: '13%', ml: 2 }}
              className={classes.MbtnSearch}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box mt={6}></Box>
      {orderListData}

      <LoadingModal open={openLoadingModal.open} />

      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
      {openCreateModal && (
        <ModalCreateStockTransfer
          type={typeModal}
          edit={true}
          isOpen={openCreateModal}
          onClickClose={handleCloseCreateModal}
        />
      )}
    </>
  );
}
