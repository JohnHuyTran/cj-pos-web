import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box } from '@material-ui/core';
import {
  Checkbox,
  FormControlLabel, FormGroup,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useStyles } from '../../../styles/makeTheme';
import { Action } from '../../../utils/enum/common-enum';
import { TransferOutDetail } from "../../../models/transfer-out";
import { ACTIONS, KEYCLOAK_GROUP_AUDIT } from "../../../utils/enum/permission-enum";
import { getUserInfo } from "../../../store/sessionStore";

export interface DataGridProps {
  action: Action | Action.INSERT;
  userPermission?: any[];
  viewMode?: boolean;
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
  const [pageSize, setPageSize] = React.useState<number>(10);
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  //permission
  const userInfo = getUserInfo();
  const [auditPermission, setAuditPermission] = useState<boolean>((userInfo && userInfo.groups && userInfo.groups.length > 0)
    ? userInfo.groups.includes(KEYCLOAK_GROUP_AUDIT) : false);
  const [valueTab, setValueTab] = React.useState(0);
  const [values, setValues] = useState({
    differenceEqual0: false,
    differenceNegative0: false,
    differencePositive0: false,
    differenceEqual1: false,
    differenceNegative1: false,
    differencePositive1: false,
  });
  const [skuTable, setSkuTable] = React.useState<Array<TransferOutDetail>>([]);
  const [barcodeTable, setBarcodeTable] = React.useState<Array<TransferOutDetail>>([]);

  useEffect(() => {
    if (Object.keys(payloadAddItem).length !== 0) {
      let rows = payloadAddItem.map((item: any, index: number) => {
        return {
          checked: false,
          id: `${item.barcode}-${index + 1}`,
          index: index + 1,
          barcodeName: item.barcodeName,
          skuCode: item.skuCode,
          saleCounting: 0,
          stockMovement: 0,
          countStoreFront: 0,
          countStoreBack: 0,
          totalCount: 0,
          availableStock: 0,
          countDifference: 0,
          stockTemp: 0,
          unit: item.unitName,
          adjustedPrice: 0,
          remark: '',
        };
      });
      setSkuTable(rows);
    } else {
      setSkuTable([]);
    }

    if (Object.keys(payloadAddItem).length !== 0) {
      let rows2 = payloadAddItem.map((item: any, index: number) => {
        return {
          checked: false,
          id: `${item.barcode}-${index + 1}`,
          index: index + 1,
          barcode: item.barcode,
          barcodeName: item.barcodeName,
          skuCode: item.skuCode,
          saleCounting: 0,
          stockMovement: 0,
          countStoreFront: 0,
          countStoreBack: 0,
          totalCount: 0,
          availableStock: 0,
          countDifference: 0,
          stockTemp: 0,
          unit: item.unitName,
        };
      });
      setBarcodeTable(rows2);
    } else {
      setBarcodeTable([]);
    }
  }, [payloadAddItem]);

  const handleChangeTab = async (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  const onCheckDifferenceFilter = async (e: any, fieldName: string) => {
    await setValues({ ...values, [fieldName + valueTab]: e.target.checked });
    handleFilterCall();
  };

  const handleFilterCall = () => {
    console.log(values);
  };

  const onCheckCell = async (params: GridRenderCellParams, event: any) => {
    let skuTableHandle = _.cloneDeep(skuTable);
    for (let item of skuTableHandle) {
      if (item.id === params.row.id) {
        item.checked = event.target.checked;
        break;
      }
    }
    setSkuTable(skuTableHandle);
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
      field: 'barcodeName',
      headerName: 'รายละเอียดสินค้า',
      flex: 2,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Typography variant="body2">{params.value}</Typography>
          <Typography color="textSecondary" sx={{ fontSize: 12 }}>
            {params.getValue(params.id, 'skuCode') || ''}
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
    },
    {
      field: 'stockMovement',
      headerName: 'สต๊อกเคลื่อนไหว',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'countStoreFront',
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
    },
    {
      field: 'countStoreBack',
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
    },
    {
      field: 'totalCount',
      headerName: 'จำนวนนับรวม',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'availableStock',
      headerName: 'สินค้าคงเหลือ',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'countDifference',
      headerName: 'ส่วนต่างการนับ',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'stockTemp',
      headerName: 'บ้านพักสต๊อก',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'unit',
      headerName: 'หน่วย',
      flex: 0.8,
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
      flex: 1,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
    },
    {
      field: 'barcodeName',
      headerName: 'รายละเอียดสินค้า',
      flex: 2,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Typography variant="body2">{params.value}</Typography>
          <Typography color="textSecondary" sx={{ fontSize: 12 }}>
            {params.getValue(params.id, 'skuCode') || ''}
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
    },
    {
      field: 'stockMovement',
      headerName: 'สต๊อกเคลื่อนไหว',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'countStoreFront',
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
    },
    {
      field: 'countStoreBack',
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
    },
    {
      field: 'totalCount',
      headerName: 'จำนวนนับรวม',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'availableStock',
      headerName: 'สินค้าคงเหลือ',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'countDifference',
      headerName: 'ส่วนต่างการนับ',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'stockTemp',
      headerName: 'บ้านพักสต๊อก',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'unit',
      headerName: 'หน่วย',
      flex: 0.8,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
  ];

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
        <Tabs value={valueTab} onChange={handleChangeTab} aria-label='basic tabs example'>
          <Tab label={<Typography sx={{ fontWeight: 'bold' }}>ตรวจนับสินค้าตาม SKU</Typography>}/>
          <Tab label={<Typography sx={{ fontWeight: 'bold' }}>ตรวจนับตามบาร์โค้ดสินค้า</Typography>}/>
        </Tabs>
      </Box>

      <TabPanel value={valueTab} index={0}>
        <div>
          <FilterPanel differenceEqual={values.differenceEqual0}
                       differenceNegative={values.differenceNegative0}
                       differencePositive={values.differencePositive0}
          />
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
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[10, 20, 50, 100]}
              pagination
              disableColumnMenu
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
            />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={valueTab} index={1}>
        <div>
          <FilterPanel differenceEqual={values.differenceEqual1}
                       differenceNegative={values.differenceNegative1}
                       differencePositive={values.differencePositive1}
          />
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
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[10, 20, 50, 100]}
              pagination
              disableColumnMenu
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
            />
          </div>
        </div>
      </TabPanel>
    </div>
  );
};

export default ModalStockAdjustmentItem;
