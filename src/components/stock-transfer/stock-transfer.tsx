import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Select } from '@mui/material';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';
import DatePickerAllComponent from '../commons/ui/date-picker-all';
import { useStyles } from '../../styles/makeTheme';
import { Button } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
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
import { getStockTransferStatusList } from '../../utils/enum/stock-transfer-enum';
import { featchPurchaseNoteAsync } from '../../store/slices/supplier-order-return-slice';
import { isAllowActionPermission, isGroupBranch, isGroupDC } from '../../utils/role-permission';
import { ACTIONS } from '../../utils/enum/permission-enum';
import { getBranchName } from '../../utils/utils';
import { env } from '../../adapters/environmentConfigs';
import { BranchListOptionType } from '../../models/branch-model';
import { getUserInfo } from '../../store/sessionStore';
import { KeyCloakTokenInfo } from '../../models/keycolak-token-info';

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
  const [disableSearchBtn, setDisableSearchBtn] = React.useState(true);
  const { t } = useTranslation(['stockTransfer', 'common']);
  const [displaySearchBtn, setDisplaySearchBtn] = React.useState(true);
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
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;

  const [branchFromCode, setBranchFromCode] = React.useState('');
  const [branchToCode, setBranchToCode] = React.useState('');
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [groupBranch, setGroupBranch] = React.useState(isGroupBranch);
  const [ownBranch, setOwnBranch] = React.useState(
    getUserInfo().branch
      ? getBranchName(branchList, getUserInfo().branch)
        ? getUserInfo().branch
        : env.branch.code
      : env.branch.code
  );
  React.useEffect(() => {
    setDisplaySearchBtn(isAllowActionPermission(ACTIONS.STOCK_BT_VIEW));
    if (groupBranch) {
      setBranchFromCode(ownBranch);
      setValues({ ...values, branchFrom: ownBranch });
    }
  }, []);

  const branchFrom = getBranchName(branchList, ownBranch);
  const branchFromMap: BranchListOptionType = {
    code: ownBranch,
    name: branchFrom ? branchFrom : '',
  };
  const [valuebranchFrom, setValuebranchFrom] = React.useState<BranchListOptionType | null>(
    groupBranch ? branchFromMap : null
  );

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
    // console.log(values);
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
              placeholder="เลขที่เอกสาร BT, RT"
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
                {getStockTransferStatusList('BT').map((item, index: number) => {
                  return <MenuItem value={item.key}>{t(`status.${item.value}`)}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>

          {/* <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
              สาเหตุการโอน
            </Typography>
            <ReasonsListDropDown onChangeReasons={handleChangeReasons} isClear={clearBranchDropDown} />
          </Grid> */}

          <Grid item container xs={12} sx={{ mt: 3 }} justifyContent="flex-end" direction="row" alignItems="flex-end">
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
              sx={{ width: '13%', ml: 2, display: `${displaySearchBtn ? 'none' : ''}` }}
              // sx={{ width: '13%', ml: 2 }}
              className={classes.MbtnSearch}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>

        <Box mt={2}></Box>

        {/* <hr />

        <Box mt={2}>
          <Button
            id="btnSearch"
            variant="contained"
            color="primary"
            // onClick={}
            sx={{ width: '13%', ml: 2 }}
            className={classes.MbtnSearch}
            disabled
          >
            ส่งงาน
          </Button>
        </Box> */}
      </Box>

      <Box mt={6}></Box>
      {orderListData}

      <LoadingModal open={openLoadingModal.open} />

      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
    </>
  );
}
