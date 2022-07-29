import React from 'react';
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useStyles } from '../../../styles/makeTheme';
import BranchListDropDown from '../../commons/ui/branch-list-dropdown';
import { getBranchName } from '../../../utils/utils';
import { BranchListOptionType } from '../../../models/branch-model';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { getUserInfo } from '../../../store/sessionStore';
import { env } from '../../../adapters/environmentConfigs';
import { isGroupBranch } from '../../../utils/role-permission';
import DatePickerAllComponent from '../../commons/ui/date-picker-all';
import { getCashStatementStatusInfo } from '../../../utils/enum/cash-statement-enum';
import { Download } from '@mui/icons-material';
import CashStatementList from './cash-statement-list';
import { CashStatementSearchRequest } from 'models/branch-accounting-model';
import moment from 'moment';
import { featchSearchCashStatementAsync } from 'store/slices/accounting/cash-statement/cash-search-slice';
import { saveCashStatementSearch } from 'store/slices/accounting/cash-statement/save-cash-search-slice';
import LoadingModal from '../../commons/ui/loading-modal';
import ModalApproveSearchList from './modal-approve-search-list';

interface State {
  branchCode: string;
  dateFrom: any;
  dateTo: any;
  status: string;
}
export default function CashStatementSearch() {
  const { t } = useTranslation(['cashStatement', 'common']);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const page = '1';
  const items = useAppSelector((state) => state.searchCashStatement);
  const limit = useAppSelector((state) => state.searchCashStatement.cashStatementList.perPage);
  const [flagSearch, setFlagSearch] = React.useState(false);
  const cashStatementList = items.cashStatementList.data ? items.cashStatementList.data : [];

  const [values, setValues] = React.useState<State>({
    branchCode: '',
    dateFrom: '',
    dateTo: '',
    status: 'ALL',
  });

  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [groupBranch, setGroupBranch] = React.useState(isGroupBranch);
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

  const handleChangeBranchFrom = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branchCode: JSON.parse(codes) });
    } else {
      setValues({ ...values, branchCode: '' });
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

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  const handleSelectRows = async (list: any) => {
    console.log('handleSelectRows: ', JSON.stringify(list));
  };

  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const onClickSearchBtn = async () => {
    let limits;
    if (limit === 0 || limit === undefined) {
      limits = '10';
    } else {
      limits = limit.toString();
    }

    const payload: CashStatementSearchRequest = {
      limit: limits,
      page: page,
      branchCode: values.branchCode,
      dateFrom: moment(startDate).startOf('day').toISOString(),
      dateTo: moment(endDate).endOf('day').toISOString(),
      status: values.status,
    };

    setOpenLoadingModal(true);
    await dispatch(featchSearchCashStatementAsync(payload));
    await dispatch(saveCashStatementSearch(payload));
    setFlagSearch(true);
    setOpenLoadingModal(false);
  };

  const onClickClearBtn = () => {
    setOpenLoadingModal(true);
    setFlagSearch(false);
    setStartDate(null);
    setEndDate(null);
    setClearBranchDropDown(!clearBranchDropDown);

    setValues({
      branchCode: values.branchCode,
      dateFrom: moment(startDate).startOf('day').toISOString(),
      dateTo: moment(endDate).endOf('day').toISOString(),
      status: 'ALL',
    });

    const payload: CashStatementSearchRequest = {
      limit: limit ? limit.toString() : '10',
      page: page,
      branchCode: values.branchCode,
      dateFrom: moment(startDate).startOf('day').toISOString(),
      dateTo: moment(endDate).endOf('day').toISOString(),
      status: values.status,
      clearSearch: true,
    };
    dispatch(featchSearchCashStatementAsync(payload));

    setTimeout(() => {
      setOpenLoadingModal(false);
    }, 300);
  };

  const [openModalApprove, setopenModalApprove] = React.useState(false);
  const handleApproveMultiple = () => {
    setopenModalApprove(true);
  };

  const handleConfirmApprove = () => {
    console.log('confirm approve');
    setopenModalApprove(false);
  };

  const onCloseModalApprove = () => {
    setopenModalApprove(false);
  };

  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              {t('documentSearchBranch')}
            </Typography>

            <BranchListDropDown
              valueBranch={valuebranchFrom}
              sourceBranchCode={''}
              onChangeBranch={handleChangeBranchFrom}
              isClear={clearBranchDropDown}
              disable={groupBranch}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              {t('documentSearchStartDate')}
            </Typography>

            <DatePickerAllComponent onClickDate={handleStartDatePicker} value={startDate} />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              {t('documentSearchEndDate')}
            </Typography>
            <DatePickerAllComponent
              onClickDate={handleEndDatePicker}
              value={endDate}
              type={'TO'}
              minDateTo={startDate}
            />
          </Grid>

          <Grid item xs={4} container>
            <Typography gutterBottom variant="subtitle1" component="div">
              {t('documentSearchStatus')}
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selPiType"
                name="statuses"
                value={values.status}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                {getCashStatementStatusInfo().map((item, index: number) => {
                  return (
                    <MenuItem key={item.key} value={item.key}>
                      {t(`status.${item.value}`)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box mb={6}>
          <Grid container spacing={2} mt={4} mb={2}>
            <Grid item xs={5}>
              <Button
                id="btnImport"
                variant="contained"
                color="primary"
                startIcon={<Download />}
                // onClick={handleOpenUploadFileModal}
                // sx={{ minWidth: 100, display: `${!displayBtnImport ? 'none' : ''}` }}
                className={classes.MbtnSearch}
              >
                Import
              </Button>
              <Button
                id="btnImport"
                variant="contained"
                color="primary"
                onClick={handleApproveMultiple}
                // sx={{ ml: 2, minWidth: 100, display: `${!displayBtnSubmit ? 'none' : ''}` }}
                sx={{ ml: 2, minWidth: 110 }}
                className={classes.MbtnSearch}
                // disabled={selectRowsList.length === 0}
                // disabled={true}
              >
                อนุมัติ
              </Button>
            </Grid>
            <Grid item xs={7} sx={{ textAlign: 'end' }}>
              <Button
                id="btnClear"
                variant="contained"
                onClick={onClickClearBtn}
                sx={{ width: 110, ml: 2 }}
                className={classes.MbtnClear}
                color="cancelColor"
              >
                เคลียร์
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
            {cashStatementList.length > 0 && <CashStatementList onSelectRows={handleSelectRows} />}
            {cashStatementList.length === 0 && (
              <Grid item container xs={12} justifyContent="center">
                <Box color="#CBD4DB">
                  <h2>ไม่มีข้อมูล</h2>
                </Box>
              </Grid>
            )}
          </div>
        )}

        <ModalApproveSearchList
          open={openModalApprove}
          onClose={onCloseModalApprove}
          payloadApprove={cashStatementList}
          onConfirmApprove={handleConfirmApprove}
        />
        <LoadingModal open={openLoadingModal} />
      </Box>
    </>
  );
}
