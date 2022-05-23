import React from 'react';
import { Box, Button, Checkbox, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import _ from 'lodash';

import SearchIcon from '@mui/icons-material/Search';
import { getBranchName, onChange, stringNullOrEmpty } from '../../../utils/utils';
import { BranchListOptionType } from '../../../models/branch-model';
import { getUserInfo } from '../../../store/sessionStore';
import { env } from '../../../adapters/environmentConfigs';
import BranchListDropDown from '../../commons/ui/branch-list-dropdown';
import { isGroupBranch } from '../../../utils/role-permission';
import TitleHeader from '../../title-header';
import ProductListItems from './product-list-item';
import { getProductMaster } from '../../../services/product-master';
import LoadingModal from '../../commons/ui/loading-modal';
import HtmlTooltip from '../../commons/ui/html-tooltip';
import AlertError from '../../commons/ui/alert-error';
import TextBoxSearchProduct from './text-box-search-product';
interface State {
  query: string;
  branch: string;
}

const flexStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

function ProductMasterSearch() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const ownBranch = getUserInfo().branch
    ? getBranchName(branchList, getUserInfo().branch)
      ? getUserInfo().branch
      : env.branch.code
    : env.branch.code;
  const [showData, setShowdData] = React.useState<boolean>(false);
  const branchName = getBranchName(branchList, ownBranch);
  const [groupBranch, setGroupBranch] = React.useState(isGroupBranch);
  const branchMap: BranchListOptionType = {
    code: ownBranch,
    name: branchName ? branchName : '',
  };
  const [branchOptions, setBranchOptions] = React.useState<BranchListOptionType | null>(groupBranch ? branchMap : null);
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [values, setValues] = React.useState<State>({
    query: '',
    branch: env.branch.channel === 'branch' ? env.branch.code : '',
  });
  const [listBarcode, setlistBarCode] = React.useState([]);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);
  const [skuValue, setSkuValue] = React.useState<any>({});
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);
  const [textError, setTextError] = React.useState<string>('');
  const [isClear, setIsClear] = React.useState<boolean>(false);

  const handleChangeBranch = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branch: JSON.parse(codes) });
    } else {
      setValues({ ...values, branch: '' });
    }
  };

  const onClear = async () => {
    setClearBranchDropDown(!clearBranchDropDown);
    setIsClear(!isClear);
    setValues({
      query: '',
      branch: env.branch.channel === 'branch' ? env.branch.code : '',
    });
    setShowdData(false);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleChangeProduct = (value: any) => {
    if (value) {
      setValues({ ...values, query: value.skuCode });
    } else {
      setValues({ ...values, query: '' });
    }
  };
  const onSearch = async () => {
    try {
      if (values.query) {
        setOpenLoadingModal(true);
        const rs = await getProductMaster(values.query);
        if (rs.code == 20000) {
          setSkuValue(rs.data.sku);
          setlistBarCode(rs.data.barcodes);
          setShowdData(true);
        } else {
          setShowdData(false);
          setTextError('Invalid Product Name, Product Code or SKU Product');
          setOpenAlert(true);
        }
      } else {
        setTextError('กรุณาระบุสินค้าที่ต้องการค้นหา');
        setOpenAlert(true);
      }
    } catch (error) {
      console.log('err: ', error);
      setTextError('เกิดข้อผิดพลาดระหว่างการดำเนินการ');
      setOpenAlert(true);
      setShowdData(false);
    }
    setOpenLoadingModal(false);
  };

  return (
    <React.Fragment>
      <Grid container spacing={10} mb={4}>
        <Grid item xs={4}>
          <Typography>
            ค้นหาสินค้า
            <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            id="query"
            name="query"
            size="small"
            value={values.query}
            onChange={onChange.bind(values.query, setValues, values)}
            InputProps={{
              endAdornment: <SearchIcon color="primary" sx={{ marginRight: '12px' }} />,
              inputProps: {
                style: { textAlignLast: 'start' },
              },
            }}
            className={classes.MtextField}
            fullWidth
            placeholder="รหัสสินค้า/ชื่อสินค้า/บาร์โค้ด"
          />
          {/* <TextBoxSearchProduct isClear={isClear} onSelectItem={handleChangeProduct}/> */}
        </Grid>
        <Grid item xs={4}>
          <Typography>
            สาขา
            <span style={{ color: 'red' }}>*</span>
          </Typography>
          <BranchListDropDown
            valueBranch={branchOptions}
            sourceBranchCode={ownBranch}
            onChangeBranch={handleChangeBranch}
            isClear={clearBranchDropDown}
            disable={groupBranch}
            isFilterAuthorizedBranch={true}
          />
        </Grid>
        <Grid item xs={4} mt={3} sx={{ display: 'flex' }}>
          <Button
            id="btnClear"
            variant="contained"
            sx={{ width: '150px', ml: 2 }}
            className={classes.MbtnClear}
            color="cancelColor"
            onClick={onClear}
          >
            เคลียร์
          </Button>
          <Button
            id="btnSearch"
            variant="contained"
            color="primary"
            sx={{ width: '150px', ml: 2 }}
            className={classes.MbtnSearch}
            onClick={onSearch}
          >
            ค้นหา
          </Button>
        </Grid>
      </Grid>
      {showData && (
        <Box>
          <TitleHeader title="ผลการค้นหา" />
          <Grid container spacing={3} mt={1}>
            <Grid item xs={3}>
              <Typography>รหัสสินค้า</Typography> {/* skuCode */}
            </Grid>
            <Grid item xs={2}>
              <HtmlTooltip title={<React.Fragment>{skuValue.skuCode}</React.Fragment>}>
                <TextField
                  id="sku-code"
                  name="sku-code"
                  size="small"
                  value={skuValue.skuCode}
                  style={{ backgroundColor: '#f1f1f1' }}
                  className={classes.MtextField}
                  fullWidth
                  disabled
                />
              </HtmlTooltip>
            </Grid>
            <Grid item xs={3}>
              <Typography>กลุ่ม</Typography> {/* productChain */}
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="productChainCode"
                name="productChainCode"
                size="small"
                value={skuValue.productChainCode}
                style={{ backgroundColor: '#f1f1f1' }}
                className={classes.MtextField}
                InputProps={{
                  endAdornment: <SearchIcon color="disabled" sx={{ marginRight: '12px' }} />,
                }}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="productChainName"
                name="productChainName"
                size="small"
                value={skuValue.productChainName ? skuValue.productChainName.productChainName : ''}
                style={{ backgroundColor: '#f1f1f1' }}
                className={classes.MtextField}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3}>
              <Typography>ชื่อสินค้า</Typography> {/* productNamePrime*/}
            </Grid>
            <Grid item xs={2}>
              <HtmlTooltip title={<React.Fragment>{skuValue.productNamePrime}</React.Fragment>}>
                <TextField
                  id="productNamePrime"
                  name="productNamePrime"
                  size="small"
                  value={skuValue.productNamePrime}
                  style={{ backgroundColor: '#f1f1f1' }}
                  className={classes.MtextField}
                  fullWidth
                  disabled
                />
              </HtmlTooltip>
            </Grid>
            <Grid item xs={3}>
              <Typography>ประเภท</Typography> {/* productType */}
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="productTypeCode"
                name="productTypeCode"
                size="small"
                value={skuValue.productTypeCode}
                style={{ backgroundColor: '#f1f1f1' }}
                className={classes.MtextField}
                fullWidth
                InputProps={{
                  endAdornment: <SearchIcon color="disabled" sx={{ marginRight: '12px' }} />,
                  inputProps: {
                    style: { textAlignLast: 'start' },
                  },
                }}
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <HtmlTooltip
                title={
                  <React.Fragment>
                    {skuValue.productChainName ? skuValue.productChainName.productTypeName : ''}
                  </React.Fragment>
                }
              >
                <TextField
                  id="productTypeName"
                  name="productTypeName"
                  size="small"
                  value={skuValue.productChainName ? skuValue.productChainName.productTypeName : ''}
                  style={{ backgroundColor: '#f1f1f1' }}
                  className={classes.MtextField}
                  fullWidth
                  disabled
                />
              </HtmlTooltip>
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3}>
              <Typography>ชื่ออื่น</Typography> {/* productNameSecnd */}
            </Grid>
            <Grid item xs={2}>
              <HtmlTooltip title={<React.Fragment>{skuValue.productNameSecnd}</React.Fragment>}>
                <TextField
                  id="productNameSecnd"
                  name="productNameSecnd"
                  size="small"
                  value={skuValue.productNameSecnd}
                  style={{ backgroundColor: '#f1f1f1' }}
                  className={classes.MtextField}
                  fullWidth
                  disabled
                />
              </HtmlTooltip>
            </Grid>
            <Grid item xs={3}>
              <Typography>ผู้จำหน่าย</Typography> {/* supplier */}
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="supplierCode"
                name="supplierCode"
                size="small"
                value={skuValue.supplierCode}
                style={{ backgroundColor: '#f1f1f1' }}
                className={classes.MtextField}
                fullWidth
                InputProps={{
                  endAdornment: <SearchIcon color="disabled" sx={{ marginRight: '12px' }} />,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <HtmlTooltip title={<React.Fragment>{skuValue.supplier ? skuValue.supplier.name : ''}</React.Fragment>}>
                <TextField
                  id="supplierName"
                  name="supplierName"
                  size="small"
                  value={skuValue.supplier ? skuValue.supplier.name : ''}
                  style={{ backgroundColor: '#f1f1f1' }}
                  className={classes.MtextField}
                  fullWidth
                  disabled
                />
              </HtmlTooltip>
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3}>
              <Typography>หมวด</Typography> {/* skuStatus */}
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth className={classes.Mselect}>
                <Select
                  id="skuStatus"
                  name="skuStatus"
                  value={skuValue.skuStatus}
                  inputProps={{ 'aria-label': 'Without label' }}
                  disabled
                >
                  <MenuItem value={'1'}>{'สินค้าทั่วไป'}</MenuItem>
                  <MenuItem value={'2'}>{'สินค้าชุด'}</MenuItem>
                  <MenuItem value={'3'}>{'สินค้าบริการ'}</MenuItem>
                  <MenuItem value={'4'}>{'สินค้ารายรับ'}</MenuItem>
                  <MenuItem value={'5'}>{'สินคารายจ่าย'}</MenuItem>
                  <MenuItem value={'6'}>{'สินค้าฝากขาย'}</MenuItem>
                  <MenuItem value={'9'}>{'สินค้าอื่นๆ'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <Typography>จำนวนเก็บต่ำสุด</Typography> {/* stockMin */}
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="stockMin"
                name="stockMin"
                size="small"
                value={skuValue.stockMin}
                inputProps={{ style: { textAlign: 'right' } }}
                style={{ backgroundColor: '#f1f1f1' }}
                className={classes.MtextField}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3}></Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={3}>
              <Typography>จำนวนเก็บสูงสุด</Typography> {/* stockMax */}
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="stockMax"
                name="stockMax"
                size="small"
                value={skuValue.stockMax}
                inputProps={{ style: { textAlign: 'right' } }}
                style={{ backgroundColor: '#f1f1f1' }}
                className={classes.MtextField}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3} style={flexStyle}>
              <Typography>ใช้งาน</Typography> {/* isActive */}
              <Checkbox size="small" name="isActive" checked={skuValue.isActive} disabled />
            </Grid>
            {/* <Grid item xs={2} style={flexStyle}>
              <Typography>อนุญาต ทำรายการ</Typography> XBSkuIsExtendMat 
              <Checkbox size="small" name="XBSkuIsExtendMat" checked={skuValue.XBSkuIsExtendMat} disabled />
            </Grid> */}
            <Grid item xs={2} style={flexStyle}>
              <Typography>อนุญาต ลดคูปอง / บัตรเงินสด</Typography> {/* isAllowCoupon */}
              <Checkbox size="small" name="isAllowCoupon" checked={skuValue.isAllowCoupon} disabled />
            </Grid>
            <Grid item xs={3}>
              <Typography>สถานะสินค้า</Typography> {/* scmStatus */}
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="scmStatus"
                name="scmStatus"
                inputProps={{ style: { textAlign: 'right' } }}
                size="small"
                value={skuValue.scmStatus}
                style={{ backgroundColor: '#f1f1f1' }}
                className={classes.MtextField}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3} style={flexStyle}>
              <Typography>คำนวณภาษี</Typography> {/* isCalVat */}
              <Checkbox size="small" name="isCalVat" checked={skuValue.isCalVat} disabled />
            </Grid>
            <Grid item xs={2} style={flexStyle}>
              <Typography>อนุญาต แก้ราคา</Typography> {/* isAllowEditPrice */}
              <Checkbox size="small" name="isAllowEditPrice" checked={skuValue.isAllowEditPrice} disabled />
            </Grid>
            <Grid item xs={3}>
              <Typography>อายุสินค้า</Typography> {/* shelfLife */}
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="shelfLife"
                name="shelfLife"
                size="small"
                value={skuValue.shelfLife}
                inputProps={{ style: { textAlign: 'right' } }}
                style={{ backgroundColor: '#f1f1f1' }}
                className={classes.MtextField}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3} style={flexStyle}>
              <Typography>ควบคุมพิเศษ</Typography> {/* isSpecialRegulate */}
              <Checkbox size="small" name="isSpecialRegulate" checked={skuValue.isSpecialRegulate} disabled />
            </Grid>
            <Grid item xs={2} style={flexStyle}>
              <Typography>อนุญาต ลด/ชาร์จ</Typography> {/* isAllowDiscount */}
              <Checkbox size="small" name="isAllowDiscount" checked={skuValue.isAllowDiscount} disabled />
            </Grid>
            <Grid item xs={3}>
              <Typography>สินค้าแลกแต้ม</Typography> {/* pointType */}
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth className={classes.Mselect}>
                <Select
                  id="pointType"
                  name="pointType"
                  value={skuValue.pointType}
                  inputProps={{ 'aria-label': 'Without label' }}
                  disabled
                >
                  <MenuItem value={'0'}>{'แต้มร้าน'}</MenuItem>
                  <MenuItem value={'1'}>{'แต้มผู้จำหน่าย'}</MenuItem>
                  <MenuItem value={'2'}>{'ไม่กำหนด'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3} style={flexStyle}>
              <Typography>ตัดสต๊อก</Typography> {/* isCtrlStock */}
              <Checkbox size="small" name="isCtrlStock" checked={skuValue.isCtrlStock} disabled />
            </Grid>
            <Grid item xs={2} style={flexStyle}>
              <Typography>อนุญาต ลดทอปอัพ</Typography> {/* isAllowTopup */}
              <Checkbox size="small" name="isAllowTopup" checked={skuValue.isAllowTopup} disabled />
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3} style={flexStyle}>
              <Typography>สินค้าด่วน</Typography> {/* isQuickItem */}
              <Checkbox size="small" name="isQuickItem" checked={skuValue.isQuickItem} disabled />
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3} style={flexStyle}>
              <Typography>ของสด</Typography> {/* isFreshLife */}
              <Checkbox size="small" name="isFreshLife" checked={skuValue.isFreshLife} disabled />
            </Grid>
            {/* <Grid item xs={2} style={flexStyle}>
              <Typography>อนุญาตใช้บัตรสวัสดิการ</Typography>  XVSgdCode  
              <Checkbox size="small" name="XVSgdCode" checked={skuValue.XVSgdCode} disabled />
            </Grid> */}
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3} style={flexStyle}>
              <Typography>คำนวณแต้ม</Typography> {/* isPointCal */}
              <Checkbox size="small" name="isPointCal" checked={skuValue.isPointCal} disabled />
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={-2}>
            <Grid item xs={3} style={flexStyle}>
              <Typography>สินค้าฟรี</Typography> {/* isAllowFreebie */}
              <Checkbox size="small" name="isAllowFreebie" checked={skuValue.isAllowFreebie} disabled />
            </Grid>
          </Grid>
          <ProductListItems listData={listBarcode} />
        </Box>
      )}
      <LoadingModal open={openLoadingModal} />
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
    </React.Fragment>
  );
}

export default ProductMasterSearch;
