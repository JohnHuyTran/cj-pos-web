import { Fragment, useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  // CircularProgress,
  FormHelperText,
  Box,
} from '@mui/material';
// import { LoadingButton } from '@mui/lab';
import { useStyles } from '../../../styles/makeTheme';
import { Upload, AddCircleOutline } from '@mui/icons-material';
import { expenseTypes, expenseStatusList } from '../../../utils/enum/accounting-enum';
import { PERMISSION_GROUP } from '../../../utils/enum/permission-enum';
import DatePickerMonth from '../../../components/commons/ui/date-picker-month';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import ModalSelectPeriod from '../expense/modal-select-period';
import ExpenseDetail from '../expense/expense-detail';
import LoadingModal from '../../commons/ui/loading-modal';

// Import File ที่เกี่ยวข้องกับ Business Logic Select สาขา
import BranchListDropDown from '../../../components/commons/ui/branch-list-dropdown';
import { getUserInfo } from '../../../store/sessionStore';
import { isGroupBranch } from '../../../utils/role-permission';
import { getBranchName } from '../../../utils/utils';
import { BranchListOptionType } from '../../../models/branch-model';
import { env } from '../../../adapters/environmentConfigs';

// Call API
import {
  clearDataSearchBranchAccounting,
  featchBranchAccountingListAsync,
} from '../../../store/slices/accounting/accounting-search-slice';
import { ExpenseSearchRequest, ExpensePeriod } from '../../../models/branch-accounting-model';
import {
  clearDataExpensePeriod,
  featchExpensePeriodTypeAsync,
} from '../../../store/slices/accounting/accounting-period-type-slice';
import ExpenseSearchList from './expense-search-list';
import ModelConfirmSearch from './confirm/modal-confirm-search';
import { saveExpenseSearch } from '../../../store/slices/accounting/save-accounting-search-slice';

interface FormSelectProps {
  title: string;
  dataList: any[];
  value: any;
  setValue: (value: any) => void;
  defaultValue?: string;
  isValidate?: boolean;
  isDisabled?: boolean;
}

export default function SearchExpense() {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  // Business Logic Select สาขา
  const groupBranch = isGroupBranch();
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const ownBranch = getUserInfo().branch
    ? getBranchName(branchList, getUserInfo().branch)
      ? getUserInfo().branch
      : env.branch.code
    : env.branch.code;
  const branchFrom = getBranchName(branchList, ownBranch);
  const branchFromMap: BranchListOptionType = {
    code: ownBranch,
    name: branchFrom ? branchFrom : '',
  };
  const valuebranchFrom = groupBranch ? branchFromMap : null;

  // Check role
  const isBranchRole = getUserInfo().group === PERMISSION_GROUP.BRANCH;
  const isAreaManagerRole = getUserInfo().group === PERMISSION_GROUP.AREA_MANAGER;
  const isOCRole = getUserInfo().group === PERMISSION_GROUP.OC;
  const isAccountRole = getUserInfo().group === PERMISSION_GROUP.ACCOUNTING;
  const isAccountManagerRole = getUserInfo().group === PERMISSION_GROUP.ACCOUNT_MANAGER;

  // Check default select status by role
  let defaultStatus = '';
  switch (true) {
    case isAreaManagerRole:
      defaultStatus = 'WAITTING_APPROVAL1';
      break;
    case isOCRole:
      defaultStatus = 'WAITTING_APPROVAL2';
      break;
    case isAccountRole:
      defaultStatus = 'WAITTING_ACCOUNTING';
      break;
    case isAccountManagerRole:
      defaultStatus = 'WAITTING_APPROVAL3';
      break;
    default:
      defaultStatus = 'ALL';
      break;
  }

  // Initial sate
  const initialSearchState = {
    type: '',
    branchCode: '',
    status: defaultStatus,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    period: '',
  };

  // Set state data
  const [search, setSearch] = useState(initialSearchState);
  const [expensePeriodList, setexpensePeriodList] = useState<object[]>([]);
  const [isSearch, setIsSearch] = useState(false);
  const [isValidate, setIsValidate] = useState(false);
  const [branchFromCode, setBranchFromCode] = useState('');
  const [isOpenLoading, setIsOpenLoading] = useState(false);

  const items = useAppSelector((state) => state.searchBranchAccounting);
  const orderListDatas = items.branchAccountingList.data ? items.branchAccountingList.data : [];
  const [flagBtnApproveAll, setFlagBtnApproveAll] = useState(true);
  const [openLoadingModal, setOpenLoadingModal] = useState(false);

  // Lifecycle hooks
  useEffect(() => {
    if (groupBranch) {
      setBranchFromCode(ownBranch);
      setSearch({ ...search, branchCode: ownBranch });
    }
  }, []);

  useEffect(() => {
    // Select งวดเบิก
    if (isAccountRole || isAccountManagerRole) {
      if (search.type === 'COFFEE') {
        // ถ้าเป็นค่าใช้จ่ายหน้าร้าน
        setSearch({ ...search, period: '1' });
        setexpensePeriodList([{ key: '1', text: 'รายเดือน' }]);
      } else {
        setSearch({ ...search, period: '' });
        setexpensePeriodList([
          // ถ้าเป็นค่าใช้จ่ายร้านกาแฟ
          { key: '1', text: 'ครึ่งเดือนแรก' },
          { key: '2', text: 'ครึ่งเดือนหลัง' },
        ]);
      }
    }
  }, [search.type]);

  // Handle function
  const handleClearSearch = async () => {
    setOpenLoadingModal(true);
    setSearch({ ...initialSearchState });
    setIsValidate(false);
    setIsSearch(false);

    setFlagBtnApproveAll(true);
    await dispatch(clearDataSearchBranchAccounting());
    setOpenLoadingModal(false);
  };

  const handleSearchExpense = async () => {
    // let isPeriodValidate = false
    // if (isAccountRole || isAccountManagerRole) {
    //   isPeriodValidate = search.period === "" ? true : false
    // }
    const isPeriodValidate = search.period && (isAccountRole || isAccountManagerRole) ? true : false;
    setIsValidate(true);

    if (search.type && isPeriodValidate) {
      // setOpenLoadingModal(true);
      setIsOpenLoading(true);
      setFlagBtnApproveAll(true);
      const payload: ExpenseSearchRequest = {
        limit: '10',
        page: '1',
        ...search,
        period: +search.period,
      };

      await dispatch(featchBranchAccountingListAsync(payload)).then((res) => {
        setTimeout(() => {
          setIsValidate(false);
          // setIsOpenLoading(false);

          const payload: any = res.payload ? res.payload : [];
          if (search.status === 'WAITTING_APPROVAL3' && payload.data.length) setFlagBtnApproveAll(!flagBtnApproveAll);
        }, 300);
      });
      await dispatch(saveExpenseSearch(payload));
      setIsSearch(true);
      // setOpenLoadingModal(false);
      setIsOpenLoading(false);
    }
  };

  const handleExport = () => {};

  const handleApprove = () => {};

  const handleApproveAll = () => {
    handleOpenModelConfirm();
  };

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openSelectPeriod, setOpenSelectPeriod] = useState(false);
  const [types, setType] = useState('');
  const [dataSelect, setDataSelect] = useState<ExpensePeriod>({
    period: 0,
    startDate: '',
    endDate: '',
  });
  const handleOpenSelectPeriodModal = async (type: string) => {
    setOpenLoadingModal(true);
    setType(type);
    await dispatch(clearDataExpensePeriod());
    await dispatch(featchExpensePeriodTypeAsync(type));
    setOpenSelectPeriod(true);
    setOpenLoadingModal(false);
  };
  const handleCloseSelectPeriodModal = async () => {
    setOpenSelectPeriod(false);
  };
  const handleDataSelectPeriod = (value: ExpensePeriod) => {
    setDataSelect(value);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
  };

  const [selectRowsList, setSelectRowsList] = useState<Array<any>>([]);
  const handleSelectRows = async (list: any) => {
    console.log('list:', JSON.stringify(list));
    setSelectRowsList(list);
  };

  const [openModelConfirm, setOpenModelConfirm] = useState(false);
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

  return (
    <Fragment>
      <Grid container rowSpacing={1} columnSpacing={7}>
        <Grid item md={4} sm={4} xs={6}>
          <FormSelect
            title='ประเภท'
            dataList={expenseTypes}
            value={search.type}
            isDisabled={isOpenLoading}
            isValidate={isValidate}
            setValue={(e) => setSearch({ ...search, type: e.target.value })}
          />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
            สาขา
          </Typography>
          <BranchListDropDown
            valueBranch={valuebranchFrom}
            sourceBranchCode={branchFromCode}
            onChangeBranch={(value) => setSearch({ ...search, branchCode: value })}
            isClear={false}
            disable={groupBranch || isOpenLoading}
            isFilterAuthorizedBranch={groupBranch ? false : true}
          />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <FormSelect
            title='สถานะ'
            dataList={expenseStatusList}
            value={search.status}
            isValidate={isValidate}
            isDisabled={isOpenLoading}
            setValue={(e) => setSearch({ ...search, status: e.target.value })}
          />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
            เดือน
          </Typography>
          <DatePickerMonth
            value={new Date(`${search.year}-${search.month}`)}
            isDisabled={isOpenLoading}
            onClickDate={(value: any) => setSearch({ ...search, month: value.month.number, year: value.year - 543 })}
          />
        </Grid>
        {isAccountRole ||
          (isAccountManagerRole && (
            <Grid item md={4} sm={4} xs={6}>
              <FormSelect
                title='งวดเบิก'
                dataList={expensePeriodList}
                value={search.period}
                isValidate={isValidate}
                isDisabled={isOpenLoading}
                setValue={(e) => setSearch({ ...search, period: e.target.value })}
              />
            </Grid>
          ))}
      </Grid>
      <Grid container rowSpacing={1} columnSpacing={8} mt={10}>
        <Grid item md={5} sm={5} xs={12}>
          {isAccountManagerRole && (
            <Fragment>
              <Button
                id='btnExport'
                variant='contained'
                color='primary'
                onClick={handleExport}
                sx={{ width: 110, mr: 2 }}
                startIcon={<Upload />}
                className={classes.MbtnSearch}
                disabled={true}>
                EXPORT
              </Button>
              <Fragment>
                <Button
                  id='btnSearch'
                  variant='contained'
                  color='primary'
                  onClick={handleApprove}
                  sx={{ width: 110, mr: 2 }}
                  className={classes.MbtnSearch}
                  disabled={selectRowsList.length === 0}>
                  อนุมัติ
                </Button>
                <Button
                  id='btnSearch'
                  variant='contained'
                  color='secondary'
                  // disabled={flagBtnApproveAll}
                  // onClick={handleApproveAll}
                  disabled={true}
                  sx={{ width: 110 }}
                  className={classes.MbtnSearch}>
                  อนุมัติทั้งหมด
                </Button>
              </Fragment>
            </Fragment>
          )}
        </Grid>
        <Grid item md={7} sm={7} xs={12} sx={{ textAlign: 'right' }}>
          {isBranchRole && (
            <Fragment>
              <Button
                id='btnCoffee'
                variant='contained'
                color='primary'
                onClick={() => handleOpenSelectPeriodModal('COFFEE')}
                startIcon={<AddCircleOutline />}
                sx={{
                  width: 160,
                  mr: 2,
                  background: '#5468ff',
                  ':hover': { boxShadow: 6, background: '#3e4cb8' },
                }}
                className={classes.MbtnSearch}>
                ค่าใช้จ่ายร้านกาแฟ
              </Button>
              <Button
                id='btnStorefront'
                variant='contained'
                color='warning'
                onClick={() => handleOpenSelectPeriodModal('STOREFRONT')}
                sx={{ width: 160, mr: 2 }}
                startIcon={<AddCircleOutline />}
                className={classes.MbtnSearch}>
                ค่าใช้จ่ายหน้าร้าน
              </Button>
            </Fragment>
          )}
          <Button
            id='btnClear'
            variant='contained'
            disabled={isOpenLoading}
            onClick={handleClearSearch}
            sx={{ width: 110 }}
            className={classes.MbtnClear}
            color='cancelColor'>
            เคลียร์
          </Button>
          <Button
            id='btnSearch'
            variant='contained'
            color='primary'
            disabled={isOpenLoading}
            onClick={handleSearchExpense}
            // loading={isOpenLoading}
            // loadingIndicator={
            //   <Typography component="span" sx={{ fontSize: '11px' }}>
            //     กรุณารอสักครู่ <CircularProgress color="inherit" size={15} />
            //   </Typography>
            // }
            sx={{ width: '170.42px', ml: 2 }}
            className={classes.MbtnSearch}>
            ค้นหา
          </Button>
        </Grid>
      </Grid>
      <LoadingModal open={isOpenLoading} />

      {/* <LoadingModal open={openLoadingModal} /> */}

      {openSelectPeriod && (
        <ModalSelectPeriod
          open={openSelectPeriod}
          onClose={handleCloseSelectPeriodModal}
          type={types}
          onConfirm={handleDataSelectPeriod}
        />
      )}

      {openDetailModal && (
        <ExpenseDetail
          isOpen={openDetailModal}
          onClickClose={handleCloseDetailModal}
          type={types}
          edit={false}
          periodProps={dataSelect}
        />
      )}

      {isSearch && (
        <div>
          {orderListDatas.length > 0 && <ExpenseSearchList onSelectRows={handleSelectRows} />}
          {orderListDatas.length === 0 && (
            <Grid item container xs={12} justifyContent='center'>
              <Box color='#CBD4DB' sx={{ mt: 5 }}>
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
        items={orderListDatas}
      />
    </Fragment>
  );
}

const FormSelect = ({ title, value, setValue, dataList, isValidate, isDisabled }: FormSelectProps) => {
  const classes = useStyles();
  return (
    <Fragment>
      <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
        {title}
      </Typography>
      <FormControl id='SearchType' className={classes.Mselect} fullWidth error={value === '' && isValidate}>
        <Select
          id='type'
          name='type'
          value={value}
          disabled={isDisabled}
          onChange={(e) => setValue(e)}
          displayEmpty
          renderValue={value !== '' ? undefined : () => <div style={{ color: '#CBD4DB' }}>{`กรุณาเลือก${title}`}</div>}
          inputProps={{ 'aria-label': 'Without label' }}>
          {dataList.map((item, index: number) => (
            <MenuItem key={index} value={item.key}>
              {item.text}
            </MenuItem>
          ))}
        </Select>
        {value === '' && isValidate && <FormHelperText sx={{ ml: 0 }}>{`กรุณาเลือก${title}`}</FormHelperText>}
      </FormControl>
    </Fragment>
  );
};
