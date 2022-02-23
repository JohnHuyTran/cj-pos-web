import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellParams } from '@mui/x-data-grid';
import { Box } from '@material-ui/core';
import { useStyles } from '../../styles/makeTheme';
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material';
import { numberWithCommas } from '../../utils/utils';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { updatestockRequestItemsState } from '../../store/slices/stock-request-items-slice';
import StockRequestItem from './stock-request-list-item';
import { StockBalanceBySKU } from '../../services/stock-transfer';
import { StockBalanceBySKURequest } from '../../models/stock-transfer-model';

export interface DataGridProps {
  type: string;
  onChangeItems: (items: Array<any>) => void;
  changeItems: (chang: Boolean) => void;
  update: boolean;
  stock: boolean;
  branch: string;
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

function StockRequestSKU({ type, onChangeItems, changeItems, update, stock, branch }: DataGridProps) {
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

    console.log('useEffect update:', update);
    console.log('useEffect stock:', stock);

    if (stock) {
      let skuCodes: any = [];
      // payloadAddItem.forEach((data: any) => {
      //   skuCodes.push(data.skuCode);
      // });

      payloadAddItem.map((item: any) => {
        //chk duplicates sku
        const sku = skuCodes.filter((r: any) => r === item.skuCode);
        if (sku.length == 0) {
          skuCodes.push(item.skuCode);
        }
      });

      console.log('useEffect skuCodes :', JSON.stringify(skuCodes));

      stockBalanceBySKU(skuCodes);
    }
  }, [update, stock]);

  const [stockBalanceList, setStockBalanceList] = React.useState([]);
  // const [flagCheckStock, setFlagCheckStock] = React.useState(false);
  const stockBalanceBySKU = async (skuCodes: any) => {
    console.log('stockBalanceBySKU skuCodes :', JSON.stringify(skuCodes));

    const payload: StockBalanceBySKURequest = {
      branchCode: branch,
      skuCodes: skuCodes,
    };

    await StockBalanceBySKU(payload)
      .then((value) => {
        console.log('StockBalanceBySKU :', JSON.stringify(value));
        setStockBalanceList(value.data);
        // itemsMapStock(payloadAddItem, value.data);
      })
      .catch((error: any) => {
        console.log('StockBalanceBySKU Error:', error);
      });
  };

  let rowsSKU: any = [];
  const itemsMapStock = async (items: any, stockBalance: any) => {
    console.log(stockBalance.length, 'stockBalance :', JSON.stringify(stockBalance));

    let resultSKU: any = [];
    let stockRemain = 0;
    items.map((a: any) => {
      if (stockBalance.length > 0) {
        stockBalance.forEach((s: any) => {
          if (s.skuCode === a.skuCode) stockRemain = s.stockRemain;
        });
      }
      const x = resultSKU.filter((r: any) => r.skuCode === a.skuCode);
      if (x.length == 0) {
        const item: any = {
          skuCode: a.skuCode,
          skuName: a.skuName,
          qty: a.qty,
          baseUnit: a.baseUnit,
          stock: stockRemain,
        };
        resultSKU.push(item);
      }
    });
    // }, Object.create(null));

    rowsSKU = resultSKU.map((item: any, index: number) => {
      return {
        id: `${item.skuCode}-${index + 1}`,
        index: index + 1,
        skuCode: item.skuCode,
        skuName: item.skuName ? item.skuName : '',
        stock: item.stock,
        baseUnit: item.baseUnit ? item.baseUnit : 0,
        qty: item.qty ? item.qty : 0,
      };
    });

    console.log('rowsSKU :', JSON.stringify(rowsSKU));
  };

  const itemsMap = async (items: any) => {
    //orderBy skuCode
    items = _.orderBy(items, ['skuCode'], ['asc']);

    // if (!stock)
    itemsMapStock(items, stockBalanceList);

    let itemsOrderBy: any = [];
    rowsSKU.map((data: any) => {
      let i = items.filter((r: any) => r.skuCode === data.skuCode);
      i = _.orderBy(i, ['baseUnit'], ['asc']);

      i.forEach((data: any) => {
        itemsOrderBy.push(data);
      });
    });

    await dispatch(updatestockRequestItemsState(itemsOrderBy));
  };

  if (type === 'Create') {
    if (Object.keys(payloadAddItem).length > 0) {
      itemsMap(payloadAddItem);
    }
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

      <StockRequestItem
        type={type}
        onChangeItems={handleChangeItems}
        changeItems={handleStatusChangeItems}
        update={flagSave}
      />
    </div>
  );
}

export default StockRequestSKU;
