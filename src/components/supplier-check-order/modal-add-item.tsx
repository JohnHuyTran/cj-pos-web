import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import React, { ReactElement, useEffect, useMemo } from 'react';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { ItemBySupplierCodeResponse, ItemInfo, ItemByBarcodeInfo } from '../../models/modal-add-item-model';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { featchItemBySupplierListAsync } from '../../store/slices/search-item-by-sup-slice';
import { featchItemByBarcodeAsync } from '../../store/slices/search-item-by-barcode-slice';
import { SupplierItem } from '../../mockdata/supplier-items';
import { updateItemsState } from '../../store/slices/supplier-add-items-slice';
import { updateSearchItemsState } from '../../store/slices/supplier-search-add-items-slice';
import ModelDeleteConfirm from './modal-delete-confirm';

import { useStyles } from '../../styles/makeTheme';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DeleteForever } from '@mui/icons-material';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, useGridApiRef } from '@mui/x-data-grid';

const mockDataItem = [
  {
    barcodeName: 'น้ำดื่มขนาด 100 มล',
    barcode: '33333333',
  },
  {
    barcodeName: 'โกลด์เบรดขนาปังหมูหยอง',
    barcode: '44',
  },
];

const mockDataItemResponse = [
  {
    barcode: '8851123237017',
    skuCode: '000000000020000565',
    unitCode: 'PAK',
    unitName: 'แพค',
    unitFactor: 10,
    barcodeName: 'ซีวิตเลมอน140ml Pack',
    pricePerUnit: 0,
    qty: 1,
    isCalVat: true,
    isControlStock: true,
    isAllowDiscount: true,
  },
];

interface StateItem {
  barcodeName: string;
  barcode: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  supNo: string;
}

const initialAddItemListByBarcode: ItemByBarcodeInfo = {
  barcode: '',
  unitName: '',
  barcodeName: '',
  qty: 1,
  skuCode: '',
  unitCode: '',
  unitFactor: 0,
  pricePerUnit: 0,
  isCalVat: false,
  isControlStock: false,
  isAllowDiscount: false,
};

const columns: GridColDef[] = [
  {
    field: 'barcode',
    headerName: 'บาร์โค้ด',
    flex: 1,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'unitName',
    headerName: 'หน่วย',
    flex: 0.7,
    headerAlign: 'center',
    sortable: false,
  },
  {
    field: 'barcodeName',
    headerName: 'รายละเอียด',
    headerAlign: 'center',
    flex: 2,
    disableColumnMenu: true,
    sortable: false,
  },

  {
    field: 'qty',
    headerName: 'จำนวน',
    flex: 1,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant="outlined"
        name="txnQuantityActual"
        type="number"
        inputProps={{ style: { textAlign: 'right' } }}
        value={params.value}
        onChange={(e) => {
          var value = e.target.value ? parseInt(e.target.value) : '';
          if (value < 0) value = 1;
          params.api.updateRows([{ ...params.row, qty: value }]);
        }}
        autoComplete="off"
      />
    ),
  },
  {
    field: 'delete',
    headerName: 'ลบ',
    width: 50,
    align: 'center',
    sortable: false,
    renderCell: () => {
      return <DeleteForever fontSize="medium" sx={{ color: '#F54949' }} />;
    },
  },
];

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

function ModalAddItem({ open, onClose, supNo }: Props): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [valueItemList, setValueItemList] = React.useState<any | null>(null);

  const [valueItemSelect, setValueItemSelect] = React.useState<StateItem>({
    barcodeName: '',
    barcode: '',
  });

  const itemsList = useAppSelector((state) => state.searchItemListBySup.itemList);

  useEffect(() => {
    dispatch(featchItemBySupplierListAsync(supNo));
  }, []);

  const onCloseModal = async () => {
    await dispatch(updateSearchItemsState({}));
    onClose();
  };

  //search item
  const defaultSearchItemList = {
    // options: mockDataItem,
    options: itemsList.data,
    getOptionLabel: (option: ItemInfo) => option.barcodeName,
  };

  const filterOptions = createFilterOptions({
    stringify: (option: ItemInfo) => option.barcodeName + option.barcode,
  });

  const handleChangeItem = (event: any, newValue: any | null) => {
    let nameItem = JSON.stringify(newValue?.barcodeName);
    setValueItemList(newValue);

    if (newValue !== null) {
      setValueItemSelect({ ...valueItemSelect, barcodeName: JSON.parse(nameItem) });
    } else {
      setValueItemSelect({ ...valueItemSelect, barcodeName: '' });
    }
  };

  const handleAddItem = async () => {
    setOpenLoadingModal(true);
    const payload = SupplierItem;
    await dispatch(updateItemsState(payload));

    setTimeout(() => {
      setOpenLoadingModal(false);
      onClose();
    }, 300);
  };

  const itemsListByBarcode = useAppSelector((state) => state.searchItemByBarcode.itemList);
  const payloadSearchAddItems = useAppSelector((state) => state.supplierSearchAddItems.state);
  const [itemListArray, setItemListArray] = React.useState<any[]>([]);
  const [barcodeNameDel, setBarcodeNameDel] = React.useState('');
  const [skuCodeDel, setSkuCodeDel] = React.useState('');
  const [barCodeDel, setBarCodeDel] = React.useState('');
  const [openModelDeleteConfirm, setOpenModelDeleteConfirm] = React.useState(false);

  const onClickAddItem = async () => {
    let barcodeItem = valueItemList.barcode;
    await dispatch(featchItemByBarcodeAsync(barcodeItem));
    console.log('itemsListByBarcode.data: ', itemsListByBarcode.data);
    await dispatch(updateSearchItemsState(itemsListByBarcode.data));
    console.log('payloadSearchAddItems in onclick: ', payloadSearchAddItems);
    // await itemListArray.push(itemsListByBarcode.data);
    // console.log('itemListArray: ', itemListArray);
  };

  const currentlyDelete = (params: GridCellParams) => {
    const value = params.colDef.field;
    //deleteItem
    if (value === 'delete') {
      setBarcodeNameDel(String(params.getValue(params.id, 'barcodeName')));
      setSkuCodeDel(String(params.getValue(params.id, 'skuCode')));
      setBarCodeDel(String(params.getValue(params.id, 'barcode')));
      setOpenModelDeleteConfirm(true);
    }
  };
  const handleModelDeleteConfirm = () => {
    setOpenModelDeleteConfirm(false);
  };

  console.log('payloadSearchAddItems: ', payloadSearchAddItems);

  let rows: any = [];
  //   if (payloadSearchAddItems) {
  //     rows = payloadSearchAddItems.map((item: any, index: number) => {
  //       rows = SupplierItem.items.map((item: any, index: number) => {
  //       return {
  //         id: index,
  //         barcode: item.barcode,
  //         unitName: item.unitName,
  //         barcodeName: item.barcodeName,
  //         qty: 1,
  //         skuCode: item.skuCode,
  //       };
  //     });
  //   }

  return (
    <div>
      <Dialog open={open} maxWidth="sm" fullWidth={true}>
        <DialogContent>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 7 }}>
              <Autocomplete
                {...defaultSearchItemList}
                className={classes.Mautocomplete}
                id="selItem"
                value={valueItemList}
                onChange={handleChangeItem}
                filterOptions={filterOptions}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.barcode}>
                      <div>
                        <Typography variant="body2">{option.barcodeName}</Typography>
                        <Typography color="textSecondary" variant="caption">
                          {option.barcode}
                        </Typography>
                      </div>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="บาร์โค้ด/รายละเอียดสินค้า"
                    size="small"
                    className={classes.MtextField}
                    fullWidth
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: 2 }}>
              <Button
                id="btnSearch"
                variant="contained"
                color="primary"
                onClick={onClickAddItem}
                sx={{ width: '100%', ml: 2 }}
                className={classes.MbtnSearch}
              >
                เพิ่ม
              </Button>
            </Box>

            <Box sx={{ flex: 1, ml: 2 }}>
              {onCloseModal ? (
                <IconButton
                  aria-label="close"
                  onClick={onCloseModal}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme: any) => theme.palette.grey[400],
                  }}
                >
                  <CancelOutlinedIcon fontSize="large" stroke={'white'} stroke-width={1} />
                </IconButton>
              ) : null}
            </Box>
          </Box>

          {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {itemListArray.map((value) => (
                <ListItem
                  key={value.barcode}
                  disableGutters
                  secondaryAction={
                    <IconButton>
                      <DeleteForever fontSize="medium" sx={{ color: '#F54949' }} />
                    </IconButton>
                  }
                >
                  <ListItemText primary={value.barcode} />
                  <ListItemText primary={value.unitName} />
                  <ListItemText primary={value.barcodeName} />
                  {value.barcodeName} | {value.unitName} | {value.barcodeName}
                </ListItem>
              ))}
            </List>
          </Box> */}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <div style={{ width: '100%' }} className={classes.MdataGridPaginationTop}>
              <DataGrid
                rows={rows}
                columns={columns}
                disableColumnMenu
                hideFooter
                autoHeight
                onCellClick={currentlyDelete}
                // rowHeight={65}
              />
            </div>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              id="btnSearch"
              variant="contained"
              color="secondary"
              onClick={handleAddItem}
              className={classes.MbtnSearch}
              size="large"
              startIcon={<AddCircleOutlineIcon />}
            >
              เพิ่มสินค้า
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <ModelDeleteConfirm
        open={openModelDeleteConfirm}
        onClose={handleModelDeleteConfirm}
        productName={barcodeNameDel}
        skuCode={skuCodeDel}
        barCode={barCodeDel}
      />
    </div>
  );
}

export default ModalAddItem;
