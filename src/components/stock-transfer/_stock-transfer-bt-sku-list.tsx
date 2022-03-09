import React, { useEffect } from 'react';
import { useStyles } from '../../styles/makeTheme';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Box from '@mui/material/Box';
import { numberWithCommas } from '../../utils/utils';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import StockTransferItemList from './_stock-transfer-bt-item-list';
import { updateAddItemsGroupState } from '../../store/slices/stock-transfer-bt-product-slice';
import { Item, ItemGroups, StockBalanceResponseType, StockBalanceType } from '../../models/stock-transfer-model';
import { checkStockBalance } from '../../services/stock-transfer';
import { ApiError } from '../../models/api-error-model';

export interface DataGridProps {
  type: string;
  edit: boolean;
  onMapSKU: (SKU: Array<any>) => void;
  // onChangeItems: (items: Array<any>) => void;
  changeItems: (chang: Boolean) => void;
  update: boolean;
  stock: boolean;
  branch: string;
  status: string;
}

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    minWidth: 70,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params) => (
      <Box component='div' sx={{ paddingLeft: '20px' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'productName',
    headerName: 'รายละเอียดสินค้า',
    headerAlign: 'center',
    minWidth: 220,
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <div>
        <Typography variant='body2'>{params.value}</Typography>
        <Typography color='textSecondary' sx={{ fontSize: 12 }}>
          {params.getValue(params.id, 'skuCode') || ''}
        </Typography>
      </div>
    ),
  },
  {
    field: 'remainingQty',
    headerName: 'สต๊อกสินค้าคงเหลือ',
    minWidth: 200,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    renderCell: (params) => numberWithCommas(params.value),
  },
  {
    field: 'orderAllQty',
    headerName: 'สั่ง(ชิ้น)',
    minWidth: 200,
    headerAlign: 'center',
    sortable: false,
    align: 'right',
    renderCell: (params) => params.value,
  },
  {
    field: 'actualAllQty',
    headerName: 'จัด(ชิ้น)',
    minWidth: 200,
    headerAlign: 'center',
    sortable: false,
    align: 'right',
    renderCell: (params) => params.value,
  },
  {
    field: 'unitDiff',
    headerName: 'ส่วนต่าง',
    minWidth: 200,
    headerAlign: 'center',
    sortable: false,
    align: 'right',
    renderCell: (params: GridRenderCellParams) => calProductDiff(params),
  },
];

const chkReturnQty = (value: any) => {
  let v = String(value);
  if (v.substring(1) === '0') return Number(v.substring(0, 1));
  return value;
};
var calUnitFactor = function (params: GridValueGetterParams) {
  let diff = Number(params.getValue(params.id, 'actualAllQty')) * Number(params.getValue(params.id, 'actualAllQty'));
  return diff;
};

var calProductDiff = function (params: GridValueGetterParams) {
  let diff = Number(params.getValue(params.id, 'actualAllQty')) - Number(params.getValue(params.id, 'orderAllQty'));

  if (diff < 0) return <label style={{ color: '#F54949', fontWeight: 700 }}> {diff} </label>;
  if (diff > 0) return <label style={{ color: '#F54949', fontWeight: 700 }}> +{diff} </label>;
  return diff;
};

function StockTransferSKUList({ type, edit, onMapSKU, changeItems, update, stock, branch, status }: DataGridProps) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [pageSize, setPageSize] = React.useState<number>(10);
  const _ = require('lodash');
  const branchTransferInfo: any = useAppSelector((state) => state.branchTransferDetailSlice.branchTransferRs.data);
  const payloadAddItem = useAppSelector((state) => state.addItems.state);

  const [skuCodeSelect, setSkuCodeSelect] = React.useState('ALL');
  const [skuNameDisplay, setSkuNameDisplay] = React.useState('');
  const [flagSave, setFlagSave] = React.useState(false);
  let rowsSKU: any = [];

  useEffect(() => {
    let skuCodes: any = [];
    if (stock) {
      fetchStockBalance();
    }
  }, [update, stock]);

  const [stockBalanceList, setStockBalanceList] = React.useState([]);
  const stockBalanceBySKU = async (skuCodes: any) => {
    const payload: any = {
      branchCode: branchTransferInfo.branchFrom,
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

  const fetchStockBalance = async () => {
    const _skuSlice = branchTransferInfo.itemGroups;
    const list = _.uniqBy(_skuSlice, 'skuCode');
    const skucodeList: string[] = [];
    list.map((i: any) => {
      skucodeList.push(i.skuCode);
    });
    const payload: StockBalanceType = {
      skuCodes: skucodeList,
      branchCode: branchTransferInfo.branchFrom,
    };

    await checkStockBalance(payload)
      .then(async (value) => {
        setStockBalanceList(value.data);
      })
      .catch((error: ApiError) => {});
  };

  const skuMapStock = async (_newItems: any, stockBalance: StockBalanceType[]) => {
    console.log('_new', _newItems);
    _newItems = _.orderBy(_newItems, ['skuCode'], ['asc']);
    let resultSKU: any = [];
    _newItems.map((_new: any) => {
      let stockRemain = 0;
      if (stockBalance) {
        if (stockBalance.length > 0) {
          stockBalance.forEach((s: StockBalanceType) => {
            if (s.skuCode === _new.skuCode) stockRemain = s.stockRemain ? s.stockRemain : 0;
          });
        }
      }

      const chkduplicate: any = resultSKU.find((r: ItemGroups) => r.skuCode === _new.skuCode);

      if (chkduplicate) {
        let duplicateSKU: any = [];
        resultSKU.forEach((dup: ItemGroups) => {
          if (dup.skuCode === _new.skuCode) {
            let orderAllQtyDup = dup.orderAllQty ? dup.orderAllQty : 0;
            let sumQty = _new.orderAllQty * _new.barFactor;
            const itemsDup: ItemGroups = {
              skuCode: _new.skuCode,
              productName: _new.skuName,
              orderAllQty: _new.orderAllQty,
              remainingQty: stockRemain,
              actualAllQty: orderAllQtyDup + sumQty,
            };
            duplicateSKU.push(itemsDup);
          } else {
            duplicateSKU.push(dup);
          }
        });

        resultSKU = duplicateSKU;
      } else {
        let sumQty = _new.orderAllQty * _new.barFactor;
        let orderAllQty = _new.orderAllQty ? _new.orderAllQty : 0;

        const item: ItemGroups = {
          skuCode: _new.skuCode,
          productName: _new.productName,
          remainingQty: stockRemain,
          orderAllQty: orderAllQty + sumQty,
          actualAllQty: _new.actualAllQty,
        };
        resultSKU.push(item);
      }
    });
    // }, Object.create(null));

    rowsSKU = resultSKU.map((item: ItemGroups, index: number) => {
      return {
        id: `${item.skuCode}-${index + 1}`,
        index: index + 1,
        skuCode: item.skuCode,
        productName: item.productName ? item.productName : '',
        remainingQty: item.remainingQty ? item.remainingQty : 0,
        orderAllQty: item.orderAllQty ? item.orderAllQty : 0,
        actualAllQty: item.actualAllQty ? item.actualAllQty : 0,
      };
    });

    return onMapSKU(rowsSKU ? rowsSKU : []);
  };

  const handleChangeItems = async (items: any) => {
    console.log('handleChangeItems: ', items);
    await dispatch(updateAddItemsGroupState(items));
    return changeItems(true);
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

    // await dispatch(updatestockRequestItemsState(itemsOrderBy));
  };

  const itemsMap = async (items: Item) => {
    skuMapStock(items, stockBalanceList);
    itemMap(items);
  };
  const updateItemsState = async (items: any) => {
    await dispatch(updateAddItemsGroupState(items));
  };

  if (Object.keys(payloadAddItem).length > 0) {
    itemsMap(payloadAddItem);
    // } else if (!update && type !== 'Create') {
  } else {
    let _item: any = [];
    if (branchTransferInfo) {
      const itemGroups = branchTransferInfo.itemGroups ? branchTransferInfo.itemGroups : [];
      const items = branchTransferInfo.items ? branchTransferInfo.items : [];
      if (items.length > 0) {
        items.map((item: Item) => {
          let productName: any = '';
          let remainingQty: number = 0;
          let orderAllQty: any = 0;
          let actualAllQty: number = 0;
          if (itemGroups.length > 0) {
            itemGroups.forEach((i: ItemGroups) => {
              if (i.skuCode === item.skuCode) {
                productName = i.productName;
                remainingQty = i.remainingQty ? i.remainingQty : 0;
                orderAllQty = i.orderAllQty;
                actualAllQty = i.actualAllQty ? i.actualAllQty : 0;
              }
            });
          }

          const _i: Item = {
            barcode: item.barcode,
            barcodeName: item.barcodeName,
            skuCode: item.skuCode,
            productName: productName,
            unitCode: item.unitCode,
            unitName: item.unitName,
            barFactor: item.barFactor,
            orderQty: item.orderQty ? item.orderQty : 0,
            actualQty: item.actualQty ? item.actualQty : 0,
            toteCode: item.toteCode,
            isDisable: false,
            boNo: item.boNo,

            orderAllQty: orderAllQty,
            remainingQty: remainingQty,
            actualAllQty: actualAllQty,
            // orderAllQty: orderAllQty,
          };

          _item.push(_i);
        });
      }

      updateItemsState(_item);
      itemsMap(_item);

      // rowsSKU = _item.map((item: Item, index: number) => {
      //   return {
      //     id: `${item.skuCode}-${index + 1}`,
      //     index: index + 1,
      //     skuCode: item.skuCode,
      //     productName: item.productName,
      //     orderAllQty: item.orderAllQty,
      //     actualAllQty: item.actualAllQty,
      //     remainingQty: item.remainingQty,
      //   };
      // });
    }
  }

  const currentlySelected = async (params: GridCellParams) => {
    setSkuCodeSelect(params.row.skuCode);
    setSkuNameDisplay(params.row.skuName);
  };

  return (
    <Box mt={2} bgcolor='background.paper' id='item-sku'>
      <div style={{ width: '100%', height: rowsSKU.length >= 8 ? '70vh' : 'auto' }} className={classes.MdataGridDetail}>
        <DataGrid
          rows={rowsSKU}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          pagination
          disableColumnMenu
          autoHeight={rowsSKU.length >= 8 ? false : true}
          scrollbarSize={10}
          rowHeight={65}
          onCellClick={currentlySelected}
        />
      </div>
      <StockTransferItemList
        type={type}
        edit={edit}
        onChangeItems={handleChangeItems}
        update={flagSave}
        status={status}
        skuCode={skuCodeSelect}
        skuName={skuNameDisplay}
      />
    </Box>
  );
}

export default StockTransferSKUList;
