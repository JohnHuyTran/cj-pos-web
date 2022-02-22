import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellParams } from '@mui/x-data-grid';
import { Box } from '@material-ui/core';
import { useStyles } from '../../styles/makeTheme';
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material';
import { numberWithCommas } from '../../utils/utils';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { updatestockRequestItemsState } from '../../store/slices/stock-request-items-slice';
import StockRequestSKU from './stock-request-list-sku';

export interface DataGridProps {
  type: string;
  onChangeItems: (items: Array<any>) => void;
  changeItems: (chang: Boolean) => void;
  update: boolean;
}

const columnsSKU: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    width: 80,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component="div" sx={{ paddingLeft: '20px' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'skuName',
    headerName: 'รายละเอียดสินค้า',
    headerAlign: 'center',
    minWidth: 300,
    flex: 2,
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
    field: 'stock',
    headerName: 'สต๊อกสินค้าคงเหลือ',
    minWidth: 150,
    headerAlign: 'center',
    align: 'right',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'baseUnit',
    headerName: 'สั่ง(ชิ้น)',
    minWidth: 120,
    headerAlign: 'center',
    align: 'right',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => calBaseUnit(params),
  },
];

var calBaseUnit = function (params: GridValueGetterParams) {
  let cal = Number(params.getValue(params.id, 'qty')) * Number(params.getValue(params.id, 'baseUnit'));
  return numberWithCommas(cal);
};

function StockRequestItems({ type, onChangeItems, changeItems, update }: DataGridProps) {
  const dispatch = useAppDispatch();
  const _ = require('lodash');
  const classes = useStyles();
  const stockRequestDetail = useAppSelector((state) => state.stockRequestDetail.stockRequestDetail.data);
  const payloadAddItem = useAppSelector((state) => state.addItems.state);

  useEffect(() => {
    // if (!update && type !== 'Create') {
    //   if (stockRequestDetail) {
    //     const items = stockRequestDetail.items ? stockRequestDetail.items : [];
    //     if (items.length > 0) {
    //       // updateItemsState(items);
    //       itemsMap(items);
    //     }
    //   }
    // }
  }, [update]);

  let rowsSKU: any = [];
  const itemsMap = async (items: any) => {
    //orderBy skuCode
    items = _.orderBy(items, ['skuCode'], ['asc']);
    let resultSKU: any = [];
    items.reduce(function (r: any, a: any) {
      //chk duplicates sku
      const x = resultSKU.filter((r: any) => r.skuCode === a.skuCode);
      if (x.length == 0) {
        const item: any = {
          skuCode: a.skuCode,
          skuName: a.skuName,
          qty: a.qty,
          baseUnit: a.baseUnit,
        };
        resultSKU.push(item);
      }
    }, Object.create(null));

    rowsSKU = resultSKU.map((item: any, index: number) => {
      return {
        id: `${item.skuCode}-${index + 1}`,
        index: index + 1,
        skuCode: item.skuCode,
        skuName: item.skuName ? item.skuName : '',
        stock: 0,
        baseUnit: item.baseUnit ? item.baseUnit : 0,
        qty: item.qty ? item.qty : 0,
      };
    });

    let itemsOrderBy: any = [];
    resultSKU.map((data: any) => {
      console.log('skuCode :', data.skuCode);

      let i = items.filter((r: any) => r.skuCode === data.skuCode);
      i = _.orderBy(i, ['baseUnit'], ['asc']);

      i.forEach((data: any) => {
        itemsOrderBy.push(data);
      });
    });
    console.log('Items orderBy :', JSON.stringify(itemsOrderBy));

    await dispatch(updatestockRequestItemsState(itemsOrderBy));

    // return onChangeItems(items ? items : []);
  };

  if (type === 'Create') {
    if (Object.keys(payloadAddItem).length > 0) itemsMap(payloadAddItem);
  } else {
    if (Object.keys(payloadAddItem).length > 0) {
      itemsMap(payloadAddItem);
    } else if (stockRequestDetail) {
      const items = stockRequestDetail.items ? stockRequestDetail.items : [];
      if (items.length > 0) {
        //   updateItemsState(items);
        itemsMap(items);
      }
    }
  }

  const [pageSizeSKU, setPageSizeSKU] = React.useState<number>(10);

  const handleChangeItems = () => {
    return changeItems(true);
  };

  const currentlySelected = async (params: GridCellParams) => {
    alert('currentlySelected');
  };

  const [flagSave, setFlagSave] = React.useState(false);
  const handleStatusChangeItems = async (items: any) => {
    setFlagSave(true);
  };
  return (
    <div>
      <div style={{ width: '100%', height: rowsSKU.length >= 8 ? '70vh' : 'auto' }} className={classes.MdataGridDetail}>
        <DataGrid
          rows={rowsSKU}
          columns={columnsSKU}
          pageSize={pageSizeSKU}
          onPageSizeChange={(newPageSize) => setPageSizeSKU(newPageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          disableColumnMenu
          autoHeight={rowsSKU.length >= 8 ? false : true}
          scrollbarSize={10}
          rowHeight={65}
        />
      </div>

      <Box mt={4} ml={1} mb={1}>
        <Typography variant="body1">รายการสินค้า : รายการสินค้าทั้งหมด</Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={2}>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="แสดงสินค้าทั้งหมด" />
            </FormGroup>
          </Grid>
          <Grid item xs={10}></Grid>
        </Grid>
      </Box>

      <StockRequestSKU
        type={type}
        onChangeItems={handleChangeItems}
        changeItems={handleStatusChangeItems}
        update={flagSave}
      />
    </div>
  );
}

export default StockRequestItems;
