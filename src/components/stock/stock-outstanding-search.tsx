import { Box, Button, FormControl, Grid, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
import React from 'react';
import { env } from '../../adapters/environmentConfigs';
import { BranchListOptionType } from '../../models/branch-model';
import { getUserInfo } from '../../store/sessionStore';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useStyles } from '../../styles/makeTheme';
import { isGroupBranch } from '../../utils/role-permission';
import { getBranchName } from '../../utils/utils';
import BranchListDropDown from '../commons/ui/branch-list-dropdown';
import DatePickerAllComponent from '../commons/ui/date-picker-all';
import ModalAddTypeProduct from '../commons/ui/modal-add-type-product';
import StockBalance from './stock-balance';
import StockBalanceLocation from './stock-balance-location';
import SearchIcon from '@mui/icons-material/Search';
interface State {
  storeId: string;
  locationId: string;
  productId: string;
  branchId: string;
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
  const [values, setValues] = React.useState<State>({ storeId: 'ALL', locationId: 'ALL', productId: '', branchId: '' });
  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };
  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [groupBranch, setGroupBranch] = React.useState(isGroupBranch);
  const [ownBranch, setOwnBranch] = React.useState(
    getUserInfo().branch
      ? getBranchName(branchList, getUserInfo().branch)
        ? getUserInfo().branch
        : env.branch.code
      : env.branch.code
  );
  const [branchFromCode, setBranchFromCode] = React.useState('');
  const branchFrom = getBranchName(branchList, ownBranch);
  const branchFromMap: BranchListOptionType = {
    code: ownBranch,
    name: branchFrom ? branchFrom : '',
  };
  const [valuebranchFrom, setValuebranchFrom] = React.useState<BranchListOptionType | null>(
    groupBranch ? branchFromMap : null
  );
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());

  const onClickClearBtn = () => {};

  const onClickValidateForm = () => {
    console.log('value: ', values);
  };

  const handleChangeBranchFrom = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setBranchFromCode(branchCode);
      setValues({ ...values, branchId: JSON.parse(codes) });
    } else {
      setValues({ ...values, branchId: '' });
    }
  };

  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };
  const handleCloseModalAddItems = () => {
    setOpenModelAddItems(false);
  };

  React.useEffect(() => {
    setDisableSearchBtn(false);
    setValues({ ...values, branchId: valuebranchFrom ? valuebranchFrom.code : '' });
  }, []);

  React.useEffect(() => {
    if (Object.keys(payloadAddTypeProduct).length !== 0) {
      const strProducts = payloadAddTypeProduct
        .filter((el: any) => el.selectedType === 2 && el.showProduct)
        .map((item: any, index: number) => item.skuName)
        .join(', ');

      setValues({ ...values, productId: strProducts });
    }
  }, [payloadAddTypeProduct]);

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              ร้าน
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id='tbxstoreId'
                name='storeId'
                value={values.storeId}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}>
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={'0'}>ลังกระดาษ/Tote</MenuItem>
                <MenuItem value={'1'}>สินค้าภายในTote</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              ค้นหาสินค้า*
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
                <MenuItem key={'1'} value={'1'}>
                  หน้าร้าน
                </MenuItem>
                <MenuItem key={'2'} value={'2'}>
                  หลังร้าน
                </MenuItem>
              </Select>
            </FormControl>
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
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              ข้อมูล ณ วันที่
            </Typography>
            <DatePickerAllComponent onClickDate={handleStartDatePicker} value={startDate} disabled={true} />
          </Grid>
          <Grid item xs={4}></Grid>
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
              onClick={onClickValidateForm}
              sx={{ width: '13%', ml: 2, display: `${disableSearchBtn ? 'none' : ''}` }}
              // sx={{ width: '13%', ml: 2 }}
              className={classes.MbtnSearch}>
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChangeTab} aria-label='basic tabs example'>
          <Tab label={<Typography sx={{ fontWeight: 'bold' }}>สินค้าคงคลัง</Typography>} {...a11yProps(0)} />
          <Tab
            label={
              <Typography sx={{ fontWeight: 'bold' }} style={{ textTransform: 'none' }}>
                สินค้าคงคลัง(ตาม Location)
              </Typography>
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <StockBalance />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StockBalanceLocation />
      </TabPanel>
      <ModalAddTypeProduct open={openModelAddItems} onClose={handleCloseModalAddItems} />
    </React.Fragment>
  );
}

export default StockSearch;
