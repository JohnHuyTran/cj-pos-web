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
import { checkStockBalance } from '../../services/stock-transfer';
// import { StockBalanceBySKURequest } from '../../models/stock-transfer-model';
import { updateItemsState } from '../../store/slices/supplier-add-items-slice';

export interface DataGridProps {
  type: string;
  onMapSKU: (SKU: Array<any>) => void;
  // onChangeItems: (items: Array<any>) => void;
  changeItems: (chang: Boolean) => void;
  update: boolean;
  stock: boolean;
  branch: string;
  status: string;
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

function StockRequestSKU({ type, onMapSKU, changeItems, update, stock, branch, status }: DataGridProps) {
  const dispatch = useAppDispatch();
  const _ = require('lodash');
  const classes = useStyles();
  const stockRequestDetail = useAppSelector((state) => state.stockRequestDetail.stockRequestDetail.data);
  const payloadAddItem = useAppSelector((state) => state.addItems.state);

  let rowsSKU: any = [];

  useEffect(() => {
    let skuCodes: any = [];
    if (stock) {
      if (Object.keys(payloadAddItem).length !== 0) {
        payloadAddItem.map((item: any) => {
          //chk duplicates sku
          const sku = skuCodes.filter((r: any) => r === item.skuCode);
          if (sku.length == 0) {
            skuCodes.push(item.skuCode);
          }
        });
      }
      stockBalanceBySKU(skuCodes);
    }
  }, [update, stock]);

  const [stockBalanceList, setStockBalanceList] = React.useState([]);
  // const [flagCheckStock, setFlagCheckStock] = React.useState(false);
  const [selectSKU, setSelectSKU] = React.useState('ALL');
  const [isChecked, setIschecked] = React.useState(true);

  const stockBalanceBySKU = async (skuCodes: any) => {
    const payload: any = {
      branchCode: branch,
      skuCodes: skuCodes,
    };

    await checkStockBalance(payload)
      .then((value) => {
        setStockBalanceList(value.data);
        // itemsMapStock(payloadAddItem, value.data);
      })
      .catch((error: any) => {
        console.log('StockBalanceBySKU Error:', error);
      });
  };

  const skuMapStock = async (items: any, stockBalance: any) => {
    //orderBy skuCode
    items = _.orderBy(items, ['skuCode'], ['asc']);
    let resultSKU: any = [];
    items.map((a: any) => {
      let stockRemain = 0;
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

    return onMapSKU(rowsSKU ? rowsSKU : []);
  };

  const itemMap = async (items: any) => {
    let itemsOrderBy: any = [];
    rowsSKU.map((data: any) => {
      let skuCode = data.skuCode;
      let i = items.filter((r: any) => r.skuCode === skuCode);
      i = _.orderBy(i, ['skuCode', 'baseUnit'], ['asc', 'asc']);
      i.forEach((data: any) => {
        itemsOrderBy.push(data);
      });
    });

    await dispatch(updatestockRequestItemsState(itemsOrderBy));
  };

  const itemsMap = async (items: any) => {
    // if (!stock)
    skuMapStock(items, stockBalanceList);

    console.log('selectSKU :', selectSKU);
    // if (isChecked) {
    itemMap(items);
    // }
  };

  const updateItemsState = async (items: any) => {
    await dispatch(updateAddItemsState(items));
  };

  if (Object.keys(payloadAddItem).length > 0) {
    itemsMap(payloadAddItem);
  } else if (!update && type !== 'Create') {
    let _item: any = [];
    if (stockRequestDetail) {
      const itemGroups = stockRequestDetail.itemGroups ? stockRequestDetail.itemGroups : [];
      const items = stockRequestDetail.items ? stockRequestDetail.items : [];
      if (items.length > 0) {
        items.map((item: any) => {
          let productName: any = '';
          let remainingQty: any = 0;
          if (itemGroups.length > 0) {
            itemGroups.forEach((i: any) => {
              if (i.skuCode === item.skuCode) {
                productName = i.productName;
                remainingQty = i.remainingQty;
              }
            });
          }

          const _i: any = {
            barcode: item.barcode,
            barcodeName: item.productName,
            baseUnit: item.barFactor,
            qty: item.orderQty,
            skuCode: item.skuCode,
            skuName: productName,
            unitCode: item.unitCode,
            unitName: item.unitName,
            stock: remainingQty,
          };

          _item.push(_i);
        });
      }

      updateItemsState(_item);

      // itemsMap(_item);
      // skuMapStock(_item, skuCodes);
      // console.log('useEffect _item :', JSON.stringify(_item));

      rowsSKU = _item.map((item: any, index: number) => {
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
    }
  }

  // if (!update && type !== 'Create') {
  // if (stockRequestDetail) {

  // if (Object.keys(payloadAddItem).length == 0 && stockRequestDetail && stock) {
  //   let _item: any = [];
  //   let skuCodes: any = [];

  //   const itemGroups = stockRequestDetail.itemGroups ? stockRequestDetail.itemGroups : [];
  //   const items = stockRequestDetail.items ? stockRequestDetail.items : [];

  //   if (itemGroups.length > 0) {
  //     console.log('itemGroups view :', JSON.stringify(itemGroups));
  //   }
  //   if (items.length > 0) {
  //     // itemsMap(items);
  //     console.log('items view :', JSON.stringify(items));
  //   }

  //   items.map((item: any) => {
  //     let productName: any = '';
  //     itemGroups.forEach((i: any) => {
  //       if (i.skuCode === item.skuCode) {
  //         productName = i.productName;
  //       }
  //     });

  //     const _i: any = {
  //       barcode: item.barcode,
  //       barcodeName: item.productName,
  //       baseUnit: item.barFactor,
  //       qty: item.orderQty,
  //       skuCode: item.skuCode,
  //       skuName: productName,
  //       unitCode: item.unitCode,
  //       unitName: item.unitName,
  //     };

  //     _item.push(_i);
  //   });

  //   updateItemsState(_item);

  //   _item.map((item: any) => {
  //     //chk duplicates sku
  //     const sku = skuCodes.filter((r: any) => r === item.skuCode);
  //     if (sku.length == 0) {
  //       skuCodes.push(item.skuCode);
  //     }
  //   });
  //   stockBalanceBySKU(skuCodes);

  //   itemsMap(_item);
  //   console.log('useEffect _item :', JSON.stringify(_item));
  //   stock = true;
  // }

  // if (type === 'Create') {
  //   if (Object.keys(payloadAddItem).length > 0) {
  //     itemsMap(payloadAddItem);
  //   }
  // } else {
  //   if (Object.keys(payloadAddItem).length > 0) {
  //     itemsMap(payloadAddItem);
  //   } else if (stockRequestDetail) {
  //     const itemGroups = stockRequestDetail.itemGroups ? stockRequestDetail.itemGroups : [];
  //     const items = stockRequestDetail.items ? stockRequestDetail.items : [];

  //     if (itemGroups.length > 0) {
  //       console.log('itemGroups view :', JSON.stringify(itemGroups));
  //     }
  //     if (items.length > 0) {
  //       //   updateItemsState(items);
  //       // itemsMap(items);

  //       console.log('items view :', JSON.stringify(items));
  //     }
  //   }
  // }

  const [pageSizeSKU, setPageSizeSKU] = React.useState<number>(10);
  const handleChangeItems = async (items: any) => {
    await dispatch(updateAddItemsState(items));
    return changeItems(true);
  };

  const currentlySelected = async (params: GridCellParams) => {
    setIschecked(false);
    setSelectSKU(params.row.skuCode);
  };

  const [flagSave, setFlagSave] = React.useState(false);
  // const handleStatusChangeItems = async (items: any) => {
  //   setFlagSave(true);
  // };

  const handleCheckboxChange = (e: any) => {
    const ischeck = e.target.checked;

    // if (ischeck) {
    //   setIschecked(false);
    // } else {
    //   setIschecked(true);
    //   setSelectSKU('ALL');
    //   // itemMap(payloadAddItem);
    // }
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
          onCellClick={currentlySelected}
        />
      </div>

      <Box mt={4} ml={1} mb={1}>
        <Typography variant="body1">รายการสินค้า : รายการสินค้าทั้งหมด</Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={2}>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="แสดงสินค้าทั้งหมด" />
            </FormGroup>

            {/* {isChecked && (
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={true}
                  label="รายการสินค้าทั้งหมด"
                  onChange={handleCheckboxChange}
                />
              </FormGroup>
            )}
            {!isChecked && (
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={false}
                  label="รายการสินค้าทั้งหมด"
                  onChange={handleCheckboxChange}
                />
              </FormGroup>
            )} */}
          </Grid>
          <Grid item xs={10}></Grid>
        </Grid>
      </Box>

      <StockRequestItem
        type={type}
        onChangeItems={handleChangeItems}
        // changeItems={handleStatusChangeItems}
        update={flagSave}
        status={status}
        skuCode={selectSKU}
      />
    </div>
  );
}

export default StockRequestSKU;
