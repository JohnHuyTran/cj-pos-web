import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
  GridRowId,
  GridRowData,
  GridValueGetterParams,
  GridCellParams,
} from '@mui/x-data-grid';
import { GridEditCellValueParams } from '@material-ui/data-grid';
import { Box } from '@material-ui/core';
import { useStyles } from '../../styles/makeTheme';
import { TextField, Typography } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import ModelDeleteConfirm from '../commons/ui/modal-delete-confirm';
import { numberWithCommas } from '../../utils/utils';
import { updateAddItemsState } from '../../store/slices/add-items-slice';

export interface DataGridProps {
  type: string;
  onChangeItems: (items: Array<any>) => void;
  changeItems: (chang: Boolean) => void;
  update: boolean;
}

const columns: GridColDef[] = [
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
    field: 'barcode',
    headerName: 'บาร์โค้ด',
    minWidth: 200,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'productName',
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
    field: 'unitName',
    headerName: 'หน่วย',
    minWidth: 120,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'qty',
    headerName: 'จำนวนที่สั่ง',
    minWidth: 150,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant="outlined"
        name="txnQuantity"
        type="number"
        inputProps={{ style: { textAlign: 'right' } }}
        value={params.value}
        onChange={(e) => {
          let qty = Number(params.getValue(params.id, 'qty'));
          var value = e.target.value ? parseInt(e.target.value, 10) : '';
          if (qty === 0) value = chkQty(value);
          if (value < 0) value = 0;
          params.api.updateRows([{ ...params.row, qty: value }]);
        }}
        // disabled={isDisable(params) ? true : false}
        autoComplete="off"
      />
    ),
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
  {
    field: 'delete',
    headerName: ' ',
    width: 40,
    minWidth: 0,
    align: 'right',
    sortable: false,
    renderCell: () => {
      return <DeleteForever fontSize="medium" sx={{ color: '#F54949' }} />;
    },
  },
];

var chkQty = (value: any) => {
  let v = String(value);
  if (v.substring(1) === '0') return Number(v.substring(0, 1));
  return value;
};

var calBaseUnit = function (params: GridValueGetterParams) {
  let cal = Number(params.getValue(params.id, 'qty')) * Number(params.getValue(params.id, 'baseUnit'));
  return numberWithCommas(cal);
};

function useApiRef() {
  const apiRef = useGridApiRef();
  const _columns = useMemo(
    () =>
      columns.concat({
        field: '',
        width: 0,
        minWidth: 0,
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

function StockTransferItem({ type, onChangeItems, changeItems, update }: DataGridProps) {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const stockRequestDetail = useAppSelector((state) => state.stockRequestDetail.stockRequestDetail.data);
  const payloadAddItem = useAppSelector((state) => state.addItems.state);

  useEffect(() => {
    if (!update) {
      if (stockRequestDetail) {
        const items = stockRequestDetail.items ? stockRequestDetail.items : [];
        if (items.length > 0) {
          updateItemsState(items);
          itemsMap(items);
        }
      }
    }
  }, [update]);

  let rows: any = [];
  const updateItemsState = async (items: any) => {
    const itemsList: any = [];
    await items.forEach((item: any) => {
      const data: any = {
        skuCode: item.skuCode,
        barcode: item.barcode,
        productName: item.productName ? item.productName : item.barcodeName,
        unitCode: item.unitCode,
        unitName: item.unitName,
        baseUnit: item.baseUnit ? item.baseUnit : 0,
        qty: item.orderQty ? item.orderQty : item.qty ? item.qty : 0,
      };
      itemsList.push(data);
    });
    if (itemsList.length > 0) await dispatch(updateAddItemsState(items));
  };

  const itemsMap = (items: any) => {
    rows = items.map((item: any, index: number) => {
      return {
        id: `${item.barcode}-${index + 1}`,
        index: index + 1,
        skuCode: item.skuCode,
        barcode: item.barcode,
        productName: item.productName ? item.productName : item.barcodeName,
        unitCode: item.unitCode,
        unitName: item.unitName,
        baseUnit: item.baseUnit ? item.baseUnit : 0,
        qty: item.orderQty ? item.orderQty : item.qty ? item.qty : 0,
      };
    });

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
        updateItemsState(items);
        itemsMap(items);
      }
    }
  }

  // if (Object.keys(payloadAddItem).length !== 0) {
  // rows = payloadAddItem.map((item: any, index: number) => {
  //   return {
  //     id: `${item.barcode}-${index + 1}`,
  //     index: index + 1,
  //     skuCode: item.skuCode,
  //     barcode: item.barcode,
  //     barcodeName: item.barcodeName,
  //     unitCode: item.unitCode,
  //     unitName: item.unitName,
  //     baseUnit: item.baseUnit,
  //     qty: item.qty ? item.qty : 0,
  //   };
  // });
  // }

  const [pageSize, setPageSize] = React.useState<number>(10);

  const { apiRef, columns } = useApiRef();
  const handleEditItems = async (params: GridEditCellValueParams) => {
    if (params.field === 'qty') {
      const itemsList: any = [];
      if (rows.length > 0) {
        const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
        await rows.forEach((data: GridRowData) => {
          itemsList.push(data);
        });
      }

      await dispatch(updateAddItemsState(itemsList));
      return onChangeItems(itemsList ? itemsList : []);
    }
  };

  const handleChangeItems = () => {
    return changeItems(true);
  };

  const [openModelDeleteConfirm, setOpenModelDeleteConfirm] = React.useState(false);
  const [deleteItems, setDeleteItems] = React.useState(false);
  const [productNameDel, setProductNameDel] = React.useState('');
  const [skuCodeDel, setSkuCodeDel] = React.useState('');
  const [barCodeDel, setBarCodeDel] = React.useState('');
  const currentlySelected = async (params: GridCellParams) => {
    const value = params.colDef.field;
    const isRefPO = params.getValue(params.id, 'isRefPO');
    //deleteItem
    // handleUpdateRowState();

    if (!isRefPO && value === 'delete') {
      setDeleteItems(true);
      setProductNameDel(String(params.getValue(params.id, 'productName')));
      setSkuCodeDel(String(params.getValue(params.id, 'skuCode')));
      setBarCodeDel(String(params.getValue(params.id, 'barcode')));
      setOpenModelDeleteConfirm(true);
    }
  };

  const handleModelDeleteConfirm = () => {
    setOpenModelDeleteConfirm(false);
  };
  return (
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
        onCellClick={currentlySelected}
        onCellFocusOut={handleEditItems}
        onCellOut={handleEditItems}
        onCellKeyDown={handleChangeItems}
        onCellBlur={handleChangeItems}
      />

      <ModelDeleteConfirm
        open={openModelDeleteConfirm}
        onClose={handleModelDeleteConfirm}
        productName={productNameDel}
        skuCode={skuCodeDel}
        barCode={barCodeDel}
      />
    </div>
  );
}

export default StockTransferItem;
