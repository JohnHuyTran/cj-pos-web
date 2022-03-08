import React, { useEffect, useMemo } from 'react';
import { useStyles } from '../../styles/makeTheme';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { numberWithCommas } from '../../utils/utils';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridEditCellValueParams,
  GridRenderCellParams,
  GridRowData,
  GridRowId,
  GridValueGetterParams,
  useGridApiRef,
} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

import { useAppDispatch, useAppSelector } from '../../store/store';
import { Item, ItemGroups } from '../../models/stock-transfer-model';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { updateAddItemSkuGroupState, updateBTSkuSlice } from '../../store/slices/stock-transfer-bt-sku-slice';
import { updateAddItemsGroupState } from '../../store/slices/stock-transfer-bt-product-slice';
import { getUserInfo } from '../../store/sessionStore';
import { PERMISSION_GROUP } from '../../utils/enum/permission-enum';
import { isGroupBranch } from '../../utils/role-permission';

interface Props {
  skuCodeSelect: string;
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
    field: 'barcode',
    headerName: 'บาร์โค้ด',
    minWidth: 200,
    flex: 0.7,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'barcodeName',
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
    field: 'orderQty',
    headerName: 'จำนวนที่สั่ง',
    minWidth: 120,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    renderCell: (params) => numberWithCommas(params.value),
  },
  {
    field: 'unitName',
    headerName: 'หน่วย',
    minWidth: 110,
    headerAlign: 'center',
    sortable: false,
  },
  {
    field: 'actualQty',
    headerName: 'จำนวนโอนจริง',
    minWidth: 120,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        <TextField
          id='txnActualQty'
          variant='outlined'
          name='txnActualQty'
          type='number'
          inputProps={{ style: { textAlign: 'right' } }}
          value={params.value}
          onChange={(e) => {
            // e.persist();
            // const caretStart = e.target.selectionStart;
            // const caretEnd = e.target.selectionEnd;
            var qty: any =
              params.getValue(params.id, 'qty') &&
              params.getValue(params.id, 'qty') !== null &&
              params.getValue(params.id, 'qty') != undefined
                ? params.getValue(params.id, 'qty')
                : 0;
            var value = e.target.value ? parseInt(e.target.value, 10) : '0';
            var returnQty = Number(params.getValue(params.id, 'actualQty'));
            if (returnQty === 0) value = chkReturnQty(value);
            if (value < 0) value = 0;
            params.api.updateRows([{ ...params.row, actualQty: value }]);

            // update the state and reset the caret
            // e.target.setSelectionRange(caretStart, caretEnd);
          }}
          disabled={params.getValue(params.id, 'isDisable') ? true : false}
          autoComplete='off'
        />
      </div>
    ),
  },
  {
    field: 'toteCode',
    headerName: 'เลข Tote/ลัง',
    minWidth: 120,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        id='txbToteCode'
        variant='outlined'
        name='txbToteCode'
        inputProps={{ style: { textAlign: 'right' } }}
        value={params.value}
        onChange={(e) => {
          // e.persist();
          // const caretStart = e.target.selectionStart;
          // const caretEnd = e.target.selectionEnd;
          params.api.updateRows([{ ...params.row, toteCode: e.target.value }]);
          // e.target.setSelectionRange(caretStart, caretEnd);
        }}
        disabled={params.getValue(params.id, 'isDisable') ? true : false}
        autoComplete='off'
      />
    ),
  },
  {
    field: 'boNo',
    headerName: 'เลขที่ BO',
    minWidth: 200,
    flex: 0.7,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
];

const chkReturnQty = (value: any) => {
  let v = String(value);
  if (v.substring(1) === '0') return Number(v.substring(0, 1));
  return value;
};
function useApiRef() {
  const apiRef = useGridApiRef();
  const _columns = useMemo(
    () =>
      columns.concat({
        field: '',
        width: 0,
        sortable: false,
        renderCell: (params) => {
          apiRef.current = params.api;
          return null;
        },
      }),
    [columns]
  );

  return { apiRef, columns: _columns };
}

function BranchTransferListItem({ skuCodeSelect }: Props) {
  const classes = useStyles();
  const _ = require('lodash');
  const { apiRef, columns } = useApiRef();
  const dispatch = useAppDispatch();

  const branchTransferRslList = useAppSelector((state) => state.branchTransferDetailSlice.branchTransferRs);
  const branchTransferInfo: any = branchTransferRslList.data ? branchTransferRslList.data : null;
  const [branchTransferItems, setBranchTransferItems] = React.useState<Item[]>(
    branchTransferInfo.items ? branchTransferInfo.items : []
  );

  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const skuGroupItems = useAppSelector((state) => state.updateBTSkuSlice.state);

  const [isDisable, setIsDisable] = React.useState(false);
  const [pageSize, setPageSize] = React.useState<number>(10);

  let rows = branchTransferItems
    .filter((item: Item, index: number) => {
      if (skuCodeSelect) {
        return item.skuCode === skuCodeSelect;
      } else {
        return item;
      }
    })
    .map((item: Item, index: number) => {
      return {
        id: `${item.barcode}-${index + 1}`,
        index: index + 1,
        seqItem: item.seqItem,
        barcode: item.barcode,
        barcodeName: item.barcodeName,
        skuCode: item.skuCode,
        barFactor: item.barFactor,
        unitCode: item.unitCode ? item.unitCode : 0,
        unitName: item.unitName,
        orderQty: item.orderQty ? item.orderQty : 0,
        actualQty: item.actualQty ? item.actualQty : 0,
        toteCode: item.toteCode,
        isDisable: isDisable,
        boNo: item.boNo,
      };
    });

  React.useEffect(() => {
    storeItemAddItem(payloadAddItem);
  }, [payloadAddItem]);

  React.useEffect(() => {
    const isCreate = branchTransferInfo.status === 'CREATED';
    setIsDisable(isGroupBranch() && isCreate ? false : true);
  }, []);

  const storeItemAddItem = async (_newItem: any) => {
    let _items = [...branchTransferItems];
    let _sku = [...skuGroupItems];
    if (Object.keys(_newItem).length !== 0) {
      _newItem.map((data: any, index: number) => {
        const dupItem: any = branchTransferItems.find((item: Item, index: number) => {
          return item.barcode === data.barcode;
        });
        const dupSku: any = skuGroupItems.find((item: ItemGroups, index: number) => {
          return item.skuCode === data.skuCode;
        });

        if (dupSku) {
          const newData: ItemGroups = {
            skuCode: dupSku.skuCode,
            productName: dupSku.productName,
            orderAllQty: dupSku.orderAllQty,
            actualAllQty: dupSku.actualAllQty + data.baseUnit * data.qty,
            remainingQty: dupSku.remainingQty,
          };
          _.remove(_sku, function (item: ItemGroups) {
            return item.skuCode === data.skuCode;
          });
          _sku = [..._sku, newData];
        } else {
          const newData: ItemGroups = {
            skuCode: data.skuCode,
            productName: data.skuName,
            orderAllQty: 0,
            actualAllQty: 0,
            remainingQty: 0,
          };
          _sku = [..._sku, newData];
        }

        if (dupItem) {
          const newData: Item = {
            seqItem: dupItem.seqItem,
            barcode: dupItem.barcode,
            barcodeName: dupItem.barcodeName,
            skuCode: dupItem.skuCode,
            barFactor: dupItem.barFactor,
            unitName: dupItem.unitName,
            unitCode: dupItem.unitCode,
            orderQty: dupItem.orderQty ? dupItem.orderQty : 0,
            actualQty: dupItem.actualQty + data.qty,
            toteCode: dupItem.toteCode,
            isDisable: isDisable,
            boNo: dupItem.boNo,
          };
          _.remove(_items, function (item: Item) {
            return item.barcode === data.barcode;
          });
          _items = [..._items, newData];
        } else {
          const newData: Item = {
            seqItem: 0,
            barcode: data.barcode,
            barcodeName: data.barcodeName,
            skuCode: data.skuCode,
            barFactor: data.baseUnit,
            unitCode: data.unitCode ? data.unitCode : 0,
            unitName: data.unitName,
            orderQty: data.orderQty ? data.orderQty : 0,
            actualQty: data.qty,
            toteCode: '',
            isDisable: isDisable,
          };
          _items = [..._items, newData];
        }
      });
    }
    const orderItem = _.orderBy(_items, ['skuCode', 'barFactor'], ['asc', 'asc']);
    setBranchTransferItems(orderItem);
    dispatch(updateAddItemSkuGroupState(_.orderBy(_sku, ['skuCode'], ['asc'])));
    dispatch(updateAddItemsGroupState(orderItem));
  };

  const storeItem = async (params: GridCellParams) => {
    let _items = [...branchTransferItems];
    let _sku = [...skuGroupItems];
    let _newSku: ItemGroups[] = [];

    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    _items.forEach((dataItem: Item) => {
      rowsEdit.forEach((dataRow: GridRowData) => {
        if (dataRow.barcode === dataItem.barcode) {
          const newData: Item = {
            seqItem: dataRow.seqItem,
            barcode: dataRow.barcode,
            barcodeName: dataRow.barcodeName,
            skuCode: dataRow.skuCode,
            unitName: dataRow.unitName,
            actualQty: dataRow.actualQty,
            toteCode: dataRow.toteCode,
            isDisable: isDisable,
            boNo: dataRow.boNo,
            barFactor: dataRow.barFactor,
            unitCode: dataRow.unitCode ? dataRow.unitCode : 0,
            orderQty: dataRow.orderQty ? dataRow.orderQty : 0,
          };
          // items.push(newData);
          _.remove(_items, function (item: Item) {
            return item.barcode === dataRow.barcode;
          });
          _items = [..._items, newData];
        }
      });
    });

    _sku.forEach((data: ItemGroups) => {
      const sum = _items
        .filter((dataItem: Item) => {
          return data.skuCode === dataItem.skuCode;
        })
        .reduce((sum, dataItem: Item) => {
          return (
            sum + Number((dataItem.actualQty ? dataItem.actualQty : 0) * (dataItem.barFactor ? dataItem.barFactor : 0))
          );
        }, 0);

      const newData: ItemGroups = {
        skuCode: data.skuCode,
        productName: data.productName,
        orderAllQty: data.orderAllQty,
        actualAllQty: sum,
        remainingQty: data.remainingQty,
      };
      _newSku.push(newData);
    });
    await dispatch(updateAddItemSkuGroupState(_newSku));
    await dispatch(updateAddItemsGroupState(_items));
    await setBranchTransferItems(_items);
  };

  let newColumns = [...columns];
  if (branchTransferInfo.status != 'CREATED') {
    newColumns[7]['hide'] = false;
  } else {
    newColumns[7]['hide'] = true;
  }

  const handleFocusOut = (params: GridCellParams) => {
    storeItem(params);
  };
  const handleOnKeyDown = (params: GridCellParams) => {
    storeItem(params);
  };
  const handleOnCellClick = (params: GridCellParams) => {
    storeItem(params);
  };
  const handleOnCellOut = (params: GridCellParams) => {
    storeItem(params);
  };

  return (
    <Box mt={2} bgcolor='background.paper'>
      <div style={{ width: '100%', height: rows.length >= 8 ? '70vh' : 'auto' }} className={classes.MdataGridDetail}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          disableColumnMenu
          autoHeight={rows.length >= 8 ? false : true}
          scrollbarSize={10}
          rowHeight={65}
          onCellFocusOut={handleFocusOut}
          // onCellClick={handleOnCellClick}
          // onCellKeyDown={handleOnKeyDown}
          // onCellOut={handleOnCellOut}
          // onSelectionModelChange={handleOnSelectionModelChange}
          // onCellBlur={handleOnCellBlur}
        />
      </div>
    </Box>
  );
}
export default BranchTransferListItem;
