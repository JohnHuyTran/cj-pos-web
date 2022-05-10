import { Box, Button, FormControl, Grid, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
import React from 'react';
import { env } from '../../adapters/environmentConfigs';
import { BranchListOptionType } from '../../models/branch-model';
import { getUserInfo } from '../../store/sessionStore';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useStyles } from '../../styles/makeTheme';
import { isAllowActionPermission, isGroupBranch } from '../../utils/role-permission';
import { getBranchName, stringNullOrEmpty } from '../../utils/utils';
import BranchListDropDown from '../commons/ui/branch-list-dropdown';
import DatePickerAllComponent from '../commons/ui/date-picker-all';
import ModalAddTypeProduct from '../commons/ui/modal-add-type-products';
import StockBalance from './stock-balance';
import StockBalanceLocation from './stock-balance-location';
import StockBalanceNegative from './stock-balance-negative';
import SearchIcon from '@mui/icons-material/Search';
import {
  clearDataFilter,
  featchStockBalanceSearchAsync,
  savePayloadSearch,
} from '../../store/slices/stock/stock-balance-search-slice';
import { OutstandingRequest } from '../../models/stock-model';
import {
  featchStockBalanceLocationSearchAsync,
  clearDataLocationFilter,
  savePayloadSearchLocation,
} from '../../store/slices/stock/stock-balance-location-search-slice';
import { ACTIONS } from '../../utils/enum/permission-enum';
import { updateAddTypeAndProductState } from '../../store/slices/add-type-product-slice';
import AlertError from '../commons/ui/alert-error';
import _ from 'lodash';
import LoadingModal from '../commons/ui/loading-modal';
interface State {
  storeId: number;
  locationId: string;
  productId: string;
  branchCode: string;
  positionName: string;
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function StockSearch() {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const payloadAddTypeProduct = useAppSelector((state) => state.addTypeAndProduct.state);
  const [disableSearchBtn, setDisableSearchBtn] = React.useState(true);
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [values, setValues] = React.useState<State>({
    storeId: 0,
    locationId: 'ALL',
    productId: '',
    branchCode: '',
    positionName: '',
  });
  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
    if (name === 'storeId' && value != values.storeId) {
      setValues({ ...values, [event.target.name]: value });
      dispatch(updateAddTypeAndProductState([]));
    } else {
      setValues({ ...values, [event.target.name]: value });
    }
  };
  const [value, setValue] = React.useState(0);
  const [flagSearch, setFlagSearch] = React.useState(false);
  const [flagSearchLocation, setFlagSearchLocation] = React.useState(false);
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    if (newValue === 0 && flagSearchLocation) {
      setFlagSearchLocation(false);
      onClickClearBtn();
    }
  };
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [groupBranch, setGroupBranch] = React.useState(isGroupBranch);
  const [branchFromCode, setBranchFromCode] = React.useState('');
  const [ownBranch, setOwnBranch] = React.useState(
    getUserInfo().branch
      ? getBranchName(branchList, getUserInfo().branch)
        ? getUserInfo().branch
        : env.branch.code
      : env.branch.code
  );
  React.useEffect(() => {
    setDisableSearchBtn(isAllowActionPermission(ACTIONS.STOCK_BL_SKU));
    if (groupBranch) {
      setBranchFromCode(ownBranch);
      setValues({ ...values, branchCode: ownBranch });
    }

    dispatch(updateAddTypeAndProductState([]));
  }, []);

  const branchFrom = getBranchName(branchList, ownBranch);
  const branchFromMap: BranchListOptionType = {
    code: ownBranch,
    name: branchFrom ? branchFrom : '',
  };
  const [valuebranchFrom, setValuebranchFrom] = React.useState<BranchListOptionType | null>(
    groupBranch ? branchFromMap : null
  );
  const [openLoadingModal, setOpenLoadingModal] = React.useState<{ open: boolean }>({
    open: false,
  });
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const page = 1;
  const limit = useAppSelector((state) => state.stockBalanceSearchSlice.stockList.perPage);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const onClickClearBtn = async () => {
    handleOpenLoading('open', true);
    setClearBranchDropDown(!clearBranchDropDown);
    setValues({ storeId: 0, locationId: 'ALL', productId: '', branchCode: '', positionName: '' });
    await dispatch(updateAddTypeAndProductState([]));
    await dispatch(clearDataFilter());
    await dispatch(clearDataLocationFilter());
    setTimeout(() => {
      setFlagSearch(false);
      handleOpenLoading('open', false);
    }, 300);
  };

  const onClickSearchBtn = async () => {
    if (value === 2) {
      setFlagSearchLocation(true);
    }

    handleOpenLoading('open', true);
    if (isValidateInput()) {
      let limits: number;
      if (limit === 0 || limit === undefined) {
        limits = 10;
      } else {
        limits = limit;
      }
      const productList: string[] = [];
      payloadAddTypeProduct
        .filter((el: any) => el.selectedType === 2 && el.showProduct)
        .map((item: any, index: number) => {
          productList.push(item.skuCode);
        });
      const filterSKU = _.uniq(productList);

      if (value === 0) {
        const payload: OutstandingRequest = {
          limit: limits,
          page: page,
          skuCodes: filterSKU,
          locationCode: values.locationId === 'ALL' ? '' : values.locationId,
          branchCode: branchFromCode,
        };

        await dispatch(featchStockBalanceSearchAsync(payload));
        await dispatch(featchStockBalanceLocationSearchAsync(payload));
        await dispatch(savePayloadSearch(payload));
        await dispatch(savePayloadSearchLocation(payload));
        setFlagSearch(true);
      } else if (value === 2) {
        const payload: OutstandingRequest = {
          limit: limits,
          page: page,
          skuCodes: filterSKU,
          locationCode: values.locationId === 'ALL' ? '' : values.locationId,
          branchCode: branchFromCode,
          positionName: values.positionName,
        };

        await dispatch(featchStockBalanceLocationSearchAsync(payload));
        await dispatch(savePayloadSearch(payload));
        await dispatch(savePayloadSearchLocation(payload));
        setFlagSearch(true);
      }
    }
    handleOpenLoading('open', false);
  };

  const isValidateInput = () => {
    if (value === 0) {
      if (Object.keys(payloadAddTypeProduct).length <= 0) {
        setOpenAlert(true);
        setTextError('กรุณาระบุสินค้าที่ต้องการค้นหา');
        return false;
      }
    } else if (value === 2) {
      if (Object.keys(payloadAddTypeProduct).length <= 0 && values.positionName === '') {
        setOpenAlert(true);
        setTextError('กรุณาระบุสินค้าหรือโลเคชั่นสาขาที่ต้องการค้นหา');
        return false;
      }

      if (values.positionName !== '' && values.positionName.length <= 2) {
        setOpenAlert(true);
        setTextError('กรุณาระบุโลเคชั่นสาขาอย่างน้อย 3 หลัก');
        return false;
      }
    }

    if (stringNullOrEmpty(branchFromCode)) {
      setOpenAlert(true);
      setTextError('กรุณาระบุสาขา');
      return false;
    }
    return true;
  };

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleChangeBranchFrom = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setBranchFromCode(branchCode);
      setValues({ ...values, branchCode: JSON.parse(codes) });
    } else {
      setValues({ ...values, branchCode: '' });
    }
  };

  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const [skuTypes, setSkuTypes] = React.useState<number[]>([1, 2]);
  const handleOpenAddItems = () => {
    if (values.storeId === 0) {
      setSkuTypes([1, 2]);
    } else {
      setSkuTypes([values.storeId]);
    }
    setOpenModelAddItems(true);
  };
  const handleCloseModalAddItems = () => {
    setOpenModelAddItems(false);
  };

  React.useEffect(() => {
    if (Object.keys(payloadAddTypeProduct).length !== 0) {
      const strProducts = payloadAddTypeProduct
        .filter((el: any) => el.selectedType === 2 && el.showProduct)
        .map((item: any, index: number) => item.skuName)
        .join(', ');

      setValues({ ...values, productId: strProducts });
    } else {
      setValues({ ...values, productId: '' });
    }
  }, [payloadAddTypeProduct]);

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              กลุ่มสินค้า (Article)
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id='tbxstoreId'
                name='storeId'
                value={values.storeId}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}>
                <MenuItem value={0} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={1}>วัตถุดิบ</MenuItem>
                <MenuItem value={2}>สินค้า Trading goods</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              ค้นหาสินค้า{value === 0 && '*'}
            </Typography>
            <TextField
              id='txtProductList'
              name='productId'
              size='small'
              value={values.productId}
              onClick={handleOpenAddItems}
              className={`${classes.MtextField} ${classes.MSearchBranchInput}`}
              fullWidth
              placeholder='กรุณาเลือก'
              autoComplete='off'
              InputProps={{
                endAdornment: <SearchIcon color='primary' sx={{ marginRight: '12px' }} />,
                inputProps: {
                  style: { textAlignLast: 'start' },
                },
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              คลัง
            </Typography>
            {value !== 1 && (
              <FormControl fullWidth className={classes.Mselect}>
                <Select
                  id='tbxlocationId'
                  name='locationId'
                  value={values.locationId}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'Without label' }}>
                  <MenuItem value={'ALL'} selected={true}>
                    ทั้งหมด
                  </MenuItem>
                  <MenuItem key={'1'} value={'001'}>
                    หน้าร้าน
                  </MenuItem>
                  <MenuItem key={'2'} value={'002'}>
                    หลังร้าน
                  </MenuItem>
                </Select>
              </FormControl>
            )}
            {value === 1 && <TextField size='small' className={classes.MtextField} fullWidth disabled={value === 1} />}
          </Grid>
          <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              สาขา
            </Typography>
            <BranchListDropDown
              valueBranch={valuebranchFrom}
              sourceBranchCode={branchFromCode}
              onChangeBranch={handleChangeBranchFrom}
              isClear={clearBranchDropDown}
              disable={groupBranch}
              isFilterAuthorizedBranch={groupBranch ? false : true}
              placeHolder='กรุณาระบุสาขา'
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              ข้อมูล ณ วันที่
            </Typography>
            <DatePickerAllComponent onClickDate={handleStartDatePicker} value={startDate} disabled={true} />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              โลเคชั่นสาขา
            </Typography>
            <TextField
              id='txtPositionName'
              name='positionName'
              size='small'
              value={values.positionName}
              onChange={handleChange}
              className={classes.MtextField}
              fullWidth
              placeholder={value === 0 || value === 1 ? '' : 'กรุณาระบุโลเคชั่นสาขา'}
              disabled={value === 0 || value === 1}
            />
          </Grid>
          <Grid item container xs={12} sx={{ mt: 3 }} justifyContent='flex-end' direction='row' alignItems='flex-end'>
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
              onClick={onClickSearchBtn}
              sx={{ width: '13%', ml: 2, display: `${disableSearchBtn ? 'none' : ''}` }}
              className={classes.MbtnSearch}>
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChangeTab} aria-label='basic tabs example'>
          <Tab label={<Typography sx={{ fontWeight: 'bold' }}>สินค้าคงคลัง</Typography>} {...a11yProps(0)} />
          <Tab label={<Typography sx={{ fontWeight: 'bold' }}>สินค้าคงคลังติดลบ</Typography>} {...a11yProps(1)} />
          <Tab
            label={
              <Typography sx={{ fontWeight: 'bold' }} style={{ textTransform: 'none' }}>
                สินค้าคงคลัง(ตาม Location)
              </Typography>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        {flagSearch && <StockBalance />}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {flagSearch && <StockBalanceNegative />}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {flagSearch && <StockBalanceLocation />}
      </TabPanel>

      <LoadingModal open={openLoadingModal.open} />
      <ModalAddTypeProduct
        open={openModelAddItems}
        onClose={handleCloseModalAddItems}
        title='ระบุสินค้าที่ต้องการค้นหา*'
        skuType={skuTypes}
        showSearch={true}
        textBtn='เลือกสินค้า'
      />
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
    </React.Fragment>
  );
}

export default StockSearch;
