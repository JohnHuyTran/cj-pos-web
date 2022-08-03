import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import {
  Checkbox,
  FormControlLabel, FormGroup,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useStyles } from '../../../styles/makeTheme';
import { Action } from '../../../utils/enum/common-enum';
import { KEYCLOAK_GROUP_AUDIT } from "../../../utils/enum/permission-enum";
import { getUserInfo } from "../../../store/sessionStore";
import { BarcodeCalculate, SACalculateRequest, SkuCalculate } from "../../../models/stock-adjustment-model";
import {
  getBarcodeCalculate, getSkuCalculate,
  saveBarcodeCalculateCriteria, saveSkuCalculateCriteria,
  updateRefresh, updateReload
} from "../../../store/slices/stock-adjust-calculate-slice";
import LoadingModal from "../../commons/ui/loading-modal";
import { numberWithCommas, stringNullOrEmpty } from "../../../utils/utils";
import { updateDataDetail } from "../../../store/slices/stock-adjustment-slice";

export interface DataGridProps {
  action: Action | Action.INSERT;
  userPermission?: any[];
  viewMode?: boolean;
}

interface loadingModalState {
  open: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface FilterPanelProps {
  differenceEqual: boolean;
  differenceNegative: boolean;
  differencePositive: boolean;
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
        <Box mt={1}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const _ = require('lodash');

export const ModalStockAdjustmentItem = (props: DataGridProps) => {
  const { action, userPermission, viewMode } = props;

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const dataDetail = useAppSelector((state) => state.stockAdjustmentSlice.dataDetail);
  const refreshCalculate = useAppSelector((state) => state.stockAdjustCalculateSlice.refresh);
  const reloadCalculate = useAppSelector((state) => state.stockAdjustCalculateSlice.reload);
  const skuCalculateResponse = useAppSelector((state) => state.stockAdjustCalculateSlice.skuCalculateResponse);
  const barcodeCalculateResponse = useAppSelector((state) => state.stockAdjustCalculateSlice.barcodeCalculateResponse);
  const skuCalculateData = useAppSelector((state) => state.stockAdjustCalculateSlice.skuCalculateResponse.data);
  const barcodeCalculateData = useAppSelector((state) => state.stockAdjustCalculateSlice.barcodeCalculateResponse.data);
  const skuCalculateCriteria = useAppSelector((state) => state.stockAdjustCalculateSlice.skuCalculateCriteria);
  const barcodeCalculateCriteria = useAppSelector((state) => state.stockAdjustCalculateSlice.barcodeCalculateCriteria);

  //permission
  const userInfo = getUserInfo();
  const [auditPermission, setAuditPermission] = useState<boolean>((userInfo && userInfo.groups && userInfo.groups.length > 0)
    ? userInfo.groups.includes(KEYCLOAK_GROUP_AUDIT) : false);
  const [values, setValues] = useState({
    valueTab: 0,
    differenceEqual0: false,
    differenceNegative0: false,
    differencePositive0: false,
    differenceEqual1: false,
    differenceNegative1: false,
    differencePositive1: false,
  });
  const [skuTable, setSkuTable] = React.useState<Array<SkuCalculate>>([]);
  const [barcodeTable, setBarcodeTable] = React.useState<Array<BarcodeCalculate>>([]);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({ open: false });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };
  const [loading, setLoading] = React.useState<boolean>(false);
  const [pageSizeSku, setPageSizeSku] = React.useState(skuCalculateResponse.perPage);
  const [pageSizeBarcode, setPageSizeBarcode] = React.useState(barcodeCalculateResponse.perPage);

  useEffect(() => {
    if (skuCalculateData && skuCalculateData.length > 0) {
      let rows: any = skuCalculateData.map((item: SkuCalculate, index: number) => {
        let checked = false;
        if (dataDetail.recheckSkus && dataDetail.recheckSkus.length) {
          let skuRecheckFilter = dataDetail.recheckSkus.filter((it: any) => it.sku === item.sku);
          checked = (skuRecheckFilter && skuRecheckFilter.length > 0);
        }
        return {
          checked: checked,
          id: `${item.barcode}-${index + 1}`,
          index: index + 1,
          skuName: item.skuName,
          sku: item.sku,
          saleCounting: checked ? '' : item.saleCounting,
          stockMovement: checked ? '' : item.stockMovement,
          storeFrontCount: checked ? '' : item.storeFrontCount,
          storeBackCount: checked ? '' : item.storeBackCount,
          totalCount: checked ? '' : (item.storeFrontCount + item.storeBackCount),
          availableStock: checked ? '' : item.availableStock,
          difference: checked ? '' : item.difference,
          tempStock: checked ? '' : item.tempStock,
          unitName: checked ? '' : item.unitName,
          adjustedPrice: checked ? '' : 0,
          remark: '',
        };
      });
      setSkuTable(rows);
    } else {
      setSkuTable([]);
    }
  }, [skuCalculateData, dataDetail.recheckSkus]);

  useEffect(() => {
    if (barcodeCalculateData && barcodeCalculateData.length > 0) {
      let rows2: any = barcodeCalculateData.map((item: BarcodeCalculate, index: number) => {
        let checked = false;
        if (dataDetail.recheckSkus && dataDetail.recheckSkus.length) {
          let skuRecheckFilter = dataDetail.recheckSkus.filter((it: any) => it.sku === item.sku);
          checked = (skuRecheckFilter && skuRecheckFilter.length > 0);
        }
        return {
          checked: checked,
          id: `${item.barcode}-${index + 1}`,
          index: index + 1,
          barcode: item.barcode,
          productName: item.productName,
          sku: item.sku,
          saleCounting: checked ? '' : item.saleCounting,
          stockMovement: checked ? '' : item.stockMovement,
          storeFrontCount: checked ? '' : item.storeFrontCount,
          storeBackCount: checked ? '' : item.storeBackCount,
          totalCount: checked ? '' : (item.storeFrontCount + item.storeBackCount),
          availableStock: checked ? '' : item.availableStock,
          difference: checked ? '' : item.difference,
          tempStock: checked ? '' : item.tempStock,
          unitName: checked ? '' : item.unitName,
        };
      });
      setBarcodeTable(rows2);
    } else {
      setBarcodeTable([]);
    }
  }, [barcodeCalculateData, dataDetail.recheckSkus]);

  useEffect(() => {
    if (refreshCalculate) {
      handleOpenLoading('open', true);
      handleRefreshCalculate().then(() => {
        handleOpenLoading('open', false);
      });
      dispatch(updateRefresh(false));
    }
  }, [refreshCalculate]);

  const handleRefreshCalculate = async () => {
    let skuCalculateCriteriaNew = {
      perPage: 10,
      page: 1,
      id: dataDetail.id,
      filterDifference: '',
    };
    await dispatch(saveSkuCalculateCriteria(skuCalculateCriteriaNew));
    await dispatch(getSkuCalculate(skuCalculateCriteriaNew));
    let barcodeCalculateCriteriaNew = {
      perPage: 10,
      page: 1,
      id: dataDetail.id,
      filterDifference: '',
    };
    await dispatch(saveBarcodeCalculateCriteria(barcodeCalculateCriteriaNew));
    await dispatch(getBarcodeCalculate(barcodeCalculateCriteriaNew));
  };

  useEffect(() => {
    if (reloadCalculate) {
      handleOpenLoading('open', true);
      handleReloadCalculate().then(() => {
        handleOpenLoading('open', false);
      });
      dispatch(updateReload(false));
    }
  }, [reloadCalculate]);

  const handleReloadCalculate = async () => {
    if (values.valueTab === 0) {
      let filterDifference0 = '';
      if (values.differenceEqual0) {
        filterDifference0 += '0';
      }
      if (values.differenceNegative0) {
        filterDifference0 += stringNullOrEmpty(filterDifference0) ? '-1' : ',-1';
      }
      if (values.differencePositive0) {
        filterDifference0 += stringNullOrEmpty(filterDifference0) ? '1' : ',1';
      }
      let skuCalculateCriteriaNew = {
        perPage: skuCalculateCriteria.perPage,
        page: skuCalculateCriteria.page,
        id: dataDetail.id,
        filterDifference: filterDifference0,
      };
      await dispatch(saveSkuCalculateCriteria(skuCalculateCriteriaNew));
      await dispatch(getSkuCalculate(skuCalculateCriteriaNew));
    } else if (values.valueTab === 1) {
      let filterDifference1 = '';
      if (values.differenceEqual1) {
        filterDifference1 += '0';
      }
      if (values.differenceNegative1) {
        filterDifference1 += stringNullOrEmpty(filterDifference1) ? '-1' : ',-1';
      }
      if (values.differencePositive1) {
        filterDifference1 += stringNullOrEmpty(filterDifference1) ? '1' : ',1';
      }
      let barcodeCalculateCriteriaNew = {
        perPage: barcodeCalculateCriteria.perPage,
        page: barcodeCalculateCriteria.page,
        id: dataDetail.id,
        filterDifference: filterDifference1,
      };
      await dispatch(saveBarcodeCalculateCriteria(barcodeCalculateCriteriaNew));
      await dispatch(getBarcodeCalculate(barcodeCalculateCriteriaNew));
    }
  };

  const handlePageChangeSku = async (newPage: number) => {
    setLoading(true);
    let page: number = newPage + 1;

    const payloadNewPage: SACalculateRequest = {
      perPage: pageSizeSku,
      page: page,
      id: skuCalculateCriteria.id,
      filterDifference: skuCalculateCriteria.filterDifference,
    };

    await dispatch(saveSkuCalculateCriteria(payloadNewPage));
    await dispatch(getSkuCalculate(payloadNewPage));
    setLoading(false);
  };

  const handlePageSizeChangeSku = async (pageSizeNew: number) => {
    await setPageSizeSku(pageSizeNew);
    setLoading(true);
    const payloadNewPage: SACalculateRequest = {
      perPage: pageSizeNew,
      page: 1,
      id: skuCalculateCriteria.id,
      filterDifference: skuCalculateCriteria.filterDifference,
    };

    await dispatch(saveSkuCalculateCriteria(payloadNewPage));
    await dispatch(getSkuCalculate(payloadNewPage));
    setLoading(false);
  };

  const handlePageChangeBarcode = async (newPage: number) => {
    setLoading(true);
    let page: number = newPage + 1;

    const payloadNewPage: SACalculateRequest = {
      perPage: pageSizeBarcode,
      page: page,
      id: barcodeCalculateCriteria.id,
      filterDifference: barcodeCalculateCriteria.filterDifference,
    };

    await dispatch(saveBarcodeCalculateCriteria(payloadNewPage));
    await dispatch(getBarcodeCalculate(payloadNewPage));
    setLoading(false);
  };

  const handlePageSizeChangeBarcode = async (pageSizeNew: number) => {
    await setPageSizeBarcode(pageSizeNew);
    setLoading(true);
    const payloadNewPage: SACalculateRequest = {
      perPage: pageSizeNew,
      page: 1,
      id: barcodeCalculateCriteria.id,
      filterDifference: barcodeCalculateCriteria.filterDifference,
    };

    await dispatch(saveBarcodeCalculateCriteria(payloadNewPage));
    await dispatch(getBarcodeCalculate(payloadNewPage));
    setLoading(false);
  };

  const handleChangeTab = async (event: React.SyntheticEvent, newValue: number) => {
    setValues({
      ...values,
      valueTab: newValue,
    });
  };

  const onCheckDifferenceFilter = async (e: any, fieldName: string) => {
    await setValues({ ...values, [fieldName + values.valueTab]: e.target.checked });
    dispatch(updateReload(true));
  };

  const onCheckCell = async (params: GridRenderCellParams, event: any) => {
    let skuRechecks = _.cloneDeep(dataDetail.recheckSkus);
    let skuTableHandle = _.cloneDeep(skuTable);
    for (let item of skuTableHandle) {
      if (item.id === params.row.id) {
        item.checked = event.target.checked;
        if (event.target.checked) {
          skuRechecks.push({
            name: item.skuName,
            sku: item.sku
          });
        } else {
          skuRechecks = skuRechecks.filter((it: any) => it.sku !== item.sku);
        }
        break;
      }
    }
    setSkuTable(skuTableHandle);
    await dispatch(updateDataDetail({
      ...dataDetail,
      recheckSkus: skuRechecks,
    }));
  };

  const columnsSkuTable: GridColDef[] = [
    {
      field: 'checked',
      headerName: 'นับทวน',
      flex: 0.6,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <Checkbox
          checked={Boolean(params.value)}
          disabled={!auditPermission}
          onClick={onCheckCell.bind(this, params)}
        />
      ),
    },
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.6,
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '5px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'skuName',
      headerName: 'รายละเอียดสินค้า',
      flex: 2,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Typography variant="body2">{params.value}</Typography>
          <Typography color="textSecondary" sx={{ fontSize: 12 }}>
            {params.getValue(params.id, 'sku') || ''}
          </Typography>
        </div>
      ),
    },
    {
      field: 'saleCounting',
      headerName: 'จำนวนขาย ระหว่างนับ',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'จำนวนขาย'}</b>
            </Typography>
            <Typography variant="body2" noWrap>
              <b>{'ระหว่างนับ'}</b>
            </Typography>
          </div>
        );
      },
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'stockMovement',
      headerName: 'สต๊อกเคลื่อนไหว',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'storeFrontCount',
      headerName: '',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'จำนวนนับ'}</b>
            </Typography>
            <Typography variant="body2" noWrap>
              <b>{'หน้าร้าน'}</b>
            </Typography>
          </div>
        );
      },
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'storeBackCount',
      headerName: '',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'จำนวนนับ'}</b>
            </Typography>
            <Typography variant="body2" noWrap>
              <b>{'หลังร้าน'}</b>
            </Typography>
          </div>
        );
      },
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'totalCount',
      headerName: 'จำนวนนับรวม',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'availableStock',
      headerName: 'สินค้าคงเหลือ',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'difference',
      headerName: 'ส่วนต่างการนับ',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => genDifferenceCount(
        params.getValue(params.id, 'checked') ? Boolean(params.getValue(params.id, 'checked')) : false,
        Number(params.value)),
    },
    {
      field: 'tempStock',
      headerName: 'บ้านพักสต๊อก',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'unitName',
      headerName: 'หน่วย',
      flex: 0.6,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'adjustedPrice',
      headerName: 'ราคาที่ปรับ',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'remark',
      headerName: 'หมายเหตุ',
      flex: 1,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
  ];

  const columnsBarcodeTable: GridColDef[] = [
    {
      field: 'checked',
      headerName: 'นับทวน',
      flex: 0.6,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <Checkbox
          checked={Boolean(params.value)}
          disabled
          onClick={onCheckCell.bind(this, params)}
        />
      ),
    },
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.6,
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '5px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'barcode',
      headerName: 'บาร์โค้ด',
      flex: 1.4,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
    },
    {
      field: 'productName',
      headerName: 'รายละเอียดสินค้า',
      flex: 2,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Typography variant="body2">{params.value}</Typography>
          <Typography color="textSecondary" sx={{ fontSize: 12 }}>
            {params.getValue(params.id, 'sku') || ''}
          </Typography>
        </div>
      ),
    },
    {
      field: 'saleCounting',
      headerName: 'จำนวนขาย ระหว่างนับ',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'จำนวนขาย'}</b>
            </Typography>
            <Typography variant="body2" noWrap>
              <b>{'ระหว่างนับ'}</b>
            </Typography>
          </div>
        );
      },
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'stockMovement',
      headerName: 'สต๊อกเคลื่อนไหว',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'storeFrontCount',
      headerName: '',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'จำนวนนับ'}</b>
            </Typography>
            <Typography variant="body2" noWrap>
              <b>{'หน้าร้าน'}</b>
            </Typography>
          </div>
        );
      },
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'storeBackCount',
      headerName: '',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'จำนวนนับ'}</b>
            </Typography>
            <Typography variant="body2" noWrap>
              <b>{'หลังร้าน'}</b>
            </Typography>
          </div>
        );
      },
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'totalCount',
      headerName: 'จำนวนนับรวม',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'availableStock',
      headerName: 'สินค้าคงเหลือ',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'difference',
      headerName: 'ส่วนต่างการนับ',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => genDifferenceCount(
        params.getValue(params.id, 'checked') ? Boolean(params.getValue(params.id, 'checked')) : false,
        Number(params.value)),
    },
    {
      field: 'tempStock',
      headerName: 'บ้านพักสต๊อก',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'unitName',
      headerName: 'หน่วย',
      flex: 0.6,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
  ];

  const genDifferenceCount = (checked: boolean, value: number) => {
    let colorValue: string = '#263238';
    if (value < 0) {
      colorValue = '#F54949';
    } else if (value > 0) {
      colorValue = '#446EF2';
    }
    return checked ? '' : <Typography variant='body2' sx={{ color: colorValue }}>{numberWithCommas(value)}</Typography>;
  };

  const FilterPanel = (props: FilterPanelProps) => {
    return (
      <div>
        <Box display={'flex'} justifyContent={'flex-start'}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={props.differenceEqual}
                          onChange={(e: any) => onCheckDifferenceFilter(e, 'differenceEqual')}/>
              }
              label={<Typography variant={'subtitle1'} color={'primary'}>ครบ</Typography>}
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={props.differenceNegative}
                          onChange={(e: any) => onCheckDifferenceFilter(e, 'differenceNegative')}/>
              }
              label={<Typography variant={'subtitle1'} color={'error'}>ขาด</Typography>}
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={props.differencePositive}
                          onChange={(e: any) => onCheckDifferenceFilter(e, 'differencePositive')}/>
              }
              label={<Typography variant={'subtitle1'} color={'secondary'}>เกิน</Typography>}
            />
          </FormGroup>
        </Box>
      </div>
    );
  };

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={values.valueTab} onChange={handleChangeTab} aria-label='basic tabs example'>
          <Tab label={<Typography sx={{ fontWeight: 'bold' }}>ตรวจนับสินค้าตาม SKU</Typography>}/>
          <Tab label={<Typography sx={{ fontWeight: 'bold' }}>ตรวจนับตามบาร์โค้ดสินค้า</Typography>}/>
        </Tabs>
      </Box>

      <TabPanel value={values.valueTab} index={0}>
        <div>
          <FilterPanel differenceEqual={values.differenceEqual0}
                       differenceNegative={values.differenceNegative0}
                       differencePositive={values.differencePositive0}
          />
          <Box
            sx={{
              '& .row-checked': {
                bgcolor: '#EAEBEB',
                '&:hover': {
                  bgcolor: '#EAEBEB',
                },
              },
            }}
          >
            <div style={{
              width: '100%',
              height: skuTable.length >= 10 ? '76vh' : 'auto',
              marginBottom: '10px',
              marginTop: '10px'
            }}
                 className={classes.MdataGridDetail}>
              <DataGrid
                rows={skuTable}
                columns={columnsSkuTable}
                disableColumnMenu
                pageSize={pageSizeSku}
                hideFooterSelectedRowCount={true}
                loading={loading}
                paginationMode='server'
                onPageChange={handlePageChangeSku}
                onPageSizeChange={handlePageSizeChangeSku}
                page={skuCalculateCriteria.page - 1}
                rowsPerPageOptions={[10, 20, 50, 100]}
                rowCount={skuCalculateResponse.total}
                pagination
                autoHeight={skuTable.length < 10}
                scrollbarSize={10}
                rowHeight={60}
                components={{
                  NoRowsOverlay: () => (
                    <Typography position="relative" textAlign="center" top="112px" color="#AEAEAE">
                      ไม่มีข้อมูล
                    </Typography>
                  ),
                }}
                getRowClassName={(params) => {
                  if (params.row.checked) {
                    return `row-checked`;
                  }
                  return '';
                }}
              />
            </div>
          </Box>
        </div>
      </TabPanel>
      <TabPanel value={values.valueTab} index={1}>
        <div>
          <FilterPanel differenceEqual={values.differenceEqual1}
                       differenceNegative={values.differenceNegative1}
                       differencePositive={values.differencePositive1}
          />
          <Box
            sx={{
              '& .row-checked': {
                bgcolor: '#EAEBEB',
                '&:hover': {
                  bgcolor: '#EAEBEB',
                },
              },
            }}
          >
            <div style={{
              width: '100%',
              height: barcodeTable.length >= 10 ? '76vh' : 'auto',
              marginBottom: '10px',
              marginTop: '10px'
            }}
                 className={classes.MdataGridDetail}>
              <DataGrid
                rows={barcodeTable}
                columns={columnsBarcodeTable}
                disableColumnMenu
                pageSize={pageSizeBarcode}
                hideFooterSelectedRowCount={true}
                loading={loading}
                paginationMode='server'
                onPageChange={handlePageChangeBarcode}
                onPageSizeChange={handlePageSizeChangeBarcode}
                page={barcodeCalculateCriteria.page - 1}
                rowsPerPageOptions={[10, 20, 50, 100]}
                rowCount={barcodeCalculateResponse.total}
                pagination
                autoHeight={barcodeTable.length < 10}
                scrollbarSize={10}
                rowHeight={60}
                components={{
                  NoRowsOverlay: () => (
                    <Typography position="relative" textAlign="center" top="112px" color="#AEAEAE">
                      ไม่มีข้อมูล
                    </Typography>
                  ),
                }}
                getRowClassName={(params) => {
                  if (params.row.checked) {
                    return `row-checked`;
                  }
                  return '';
                }}
              />
            </div>
          </Box>
        </div>
      </TabPanel>
      <LoadingModal open={openLoadingModal.open}/>
    </div>
  );
};

export default ModalStockAdjustmentItem;
