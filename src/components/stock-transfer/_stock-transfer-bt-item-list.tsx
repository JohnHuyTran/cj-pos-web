import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
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
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useStyles } from '../../styles/makeTheme';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { numberWithCommas } from '../../utils/utils';
import { isGroupBranch } from '../../utils/role-permission';
import { Item } from '../../models/stock-transfer-model';

export interface DataGridProps {
  type: string;
  edit: boolean;
  onChangeItems: (items: Array<any>) => void;
  // changeItems: (chang: Boolean) => void;
  update: boolean;
  status: string;
  skuCode: string;
  skuName: string;
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

function StockTransferItemList({ type, edit, onChangeItems, update, status, skuCode, skuName }: DataGridProps) {
  const _ = require('lodash');
  const classes = useStyles();

  const branchTransferInfo: any = useAppSelector((state) => state.branchTransferDetailSlice.branchTransferRs.data);
  const branchTransferItems: any = useAppSelector((state) => state.updateBTProductSlice.state);

  const [pageSize, setPageSize] = React.useState<number>(10);

  let rows: any = [];
  const [isChecked, setIschecked] = React.useState(true);
  const [skuCodeSelect, setSkuCodeSelect] = React.useState('ALL');
  const [isDisable, setIsDisable] = React.useState(false);

  const handleCheckboxChange = (e: any) => {
    const ischeck = e.target.checked;
    if (ischeck) {
      setIschecked(true);
      setSkuCodeSelect('ALL');
    } else {
      setIschecked(false);
      setSkuCodeSelect('');
    }
  };

  useEffect(() => {
    if (skuCode !== 'ALL') {
      setIschecked(false);
      setSkuCodeSelect(skuCode);
    }
    const isCreate = true;
    setIsDisable(isGroupBranch() && isCreate ? false : true);
  }, [update, skuCode]);

  const itemsMap = (items: any) => {
    let editM = false;

    rows = items.map((item: Item, index: number) => {
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

    // return onChangeItems(items ? items : []);
  };

  if (skuCodeSelect === 'ALL') {
    if (type === 'Create') {
      if (Object.keys(branchTransferItems).length > 0) itemsMap(branchTransferItems);
    } else {
      if (Object.keys(branchTransferItems).length > 0) {
        itemsMap(branchTransferItems);
      } else if (branchTransferInfo) {
        const items = branchTransferInfo.items ? branchTransferInfo.items : [];
        if (items.length > 0) {
          //   updateItemsState(items);
          itemsMap(items);
        }
      }
    }
  } else {
    if (skuCodeSelect === '') {
      rows = [];
      skuName = '';
    } else {
      let itemsOrderBy: any = [];
      let item = branchTransferItems.filter((r: any) => r.skuCode === skuCodeSelect);
      item = _.orderBy(item, ['skuCode', 'baseUnit'], ['asc', 'asc']);
      item.forEach((data: any) => {
        itemsOrderBy.push(data);
      });

      itemsMap(item);
    }
  }

  const currentlySelected = async (params: GridCellParams) => {};

  const { apiRef, columns } = useApiRef();
  const handleEditItems = async (params: GridEditCellValueParams) => {
    if (params.field === 'actualQty' || params.field === 'toteCode') {
      const itemsList: any = [];
      if (rows.length > 0) {
        const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
        if (skuCodeSelect === 'ALL') {
          await rows.forEach((data: GridRowData) => {
            itemsList.push(data);
          });
        } else {
          await branchTransferItems.forEach((data: any) => {
            if (data.skuCode === skuCodeSelect) {
              rows.forEach((d: GridRowData) => {
                if (data.barcode === d.barcode) itemsList.push(d);
              });
            } else {
              itemsList.push(data);
            }
          });
        }
      }
      console.log('itemsList:', itemsList);
      return onChangeItems(itemsList ? itemsList : []);
    }
  };

  return (
    <div style={{ width: '100%', height: rows.length >= 8 ? '70vh' : 'auto' }} className={classes.MdataGridDetail}>
      <Box mt={6}>
        {' '}
        <Typography>
          รายการสินค้า: {isChecked && 'รายการสินค้าทั้งหมด'} {!isChecked && `${skuName}`}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }} mt={1}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            checked={isChecked}
            label='รายการสินค้าทั้งหมด'
            onChange={handleCheckboxChange}
          />
        </FormGroup>
      </Box>

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
        // onCellClick={currentlySelected}
        onCellFocusOut={handleEditItems}
        // onCellOut={handleEditItems}
        // onCellKeyDown={handleEditItems}
      />
    </div>
  );
}

export default StockTransferItemList;
