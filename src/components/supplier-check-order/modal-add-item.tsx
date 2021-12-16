import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import React, { ReactElement, useEffect, useMemo } from 'react';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { ItemBySupplierCodeResponse, ItemInfo, ItemByBarcodeInfo } from '../../models/modal-add-item-model';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateItemsState } from '../../store/slices/supplier-add-items-slice';
import { updateSearchItemsState } from '../../store/slices/supplier-search-add-items-slice';

import { useStyles } from '../../styles/makeTheme';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ConstructionOutlined, DeleteForever, PersonAddAlt1TwoTone } from '@mui/icons-material';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRowData,
  GridRowId,
  useGridApiRef,
} from '@mui/x-data-grid';
import LoadingModal from '../commons/ui/loading-modal';
import { isConstructorDeclaration } from 'typescript';

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
    // flex: 1.8,
    minWidth: 125,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'unitName',
    headerName: 'หน่วย',
    flex: 1,
    headerAlign: 'center',
    sortable: false,
  },
  {
    field: 'barcodeName',
    headerName: 'รายละเอียด',
    headerAlign: 'center',
    // flex: 2,
    minWidth: 180,
    disableColumnMenu: true,
    sortable: false,
  },

  {
    field: 'actualQty',
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
          if (value < 0) value = 0;
          params.api.updateRows([{ ...params.row, actualQty: value }]);
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
  const { apiRef, columns } = useApiRef();
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [valueItemList, setValueItemList] = React.useState<any | null>(null);
  const [valueItemSelect, setValueItemSelect] = React.useState<StateItem>({
    barcodeName: '',
    barcode: '',
  });

  const itemsList = useAppSelector((state) => state.searchItemListBySup.itemList);

  //search item
  const defaultSearchItemList = {
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

  const handldCloseAddItemModal = () => {
    onClose();
    setNewAddItemListArray([]);
    setValueItemList(null);
  };

  const payloadSearchAddItems = useAppSelector((state) => state.supplierSearchAddItems.state);
  const [itemListArray, setItemListArray] = React.useState<any[]>([]);
  const [barcodeNameDel, setBarcodeNameDel] = React.useState('');
  const [skuCodeDel, setSkuCodeDel] = React.useState('');
  const [barCodeDel, setBarCodeDel] = React.useState('');
  const [openModelDeleteConfirm, setOpenModelDeleteConfirm] = React.useState(false);

  const [newAddItemListArray, setNewAddItemListArray] = React.useState<ItemInfo[]>([]);

  const onClickAddItem = async () => {
    setValueItemList(null);
    let barcodeItem = valueItemList.barcode;
    const itemSelect: any = itemsList.data.find((r: any) => r.barcode === barcodeItem);
    const checkDupItem: any = newAddItemListArray.find((a: any) => a.barcode === barcodeItem);

    console.log('newAddItemListArray: ', newAddItemListArray);
    if (checkDupItem) {
      let arrayItemDup: any = [];
      newAddItemListArray.forEach((data: any) => {
        if (data.barcode === barcodeItem) {
          const itemsDup: any = {
            barcode: data.barcode,
            barcodeName: data.barcodeName,
            qty: data.qty + 1,
            skuCode: data.skuCode,
            unitCode: data.unitCode,
            unitName: data.unitName,
            unitPrice: data.unitPrice,
          };

          arrayItemDup.push(itemsDup);
        } else {
          arrayItemDup.push(data);
        }
      });

      setNewAddItemListArray(arrayItemDup);
    } else {
      setNewAddItemListArray((newAddItemListArray) => [...newAddItemListArray, itemSelect]);
    }
  };

  const payloadAddItem = useAppSelector((state) => state.supplierAddItems.state);

  const handleAddItem = async () => {
    setOpenLoadingModal(true);
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    const itemsList: any = [];
    rowsEdit.forEach((data: GridRowData) => {
      itemsList.push(data);
    });

    let result: any = [];
    if (payloadAddItem.length > 0) {
      const sumAddItemList = [...itemsList, ...payloadAddItem];

      var o: any = {};
      sumAddItemList.forEach((i: any) => {
        var id = i.barcode;
        if (!o[id]) {
          return (o[id] = i);
        }
        return (o[id].actualQty = o[id].actualQty + i.actualQty);
      });

      var itemResult: any = [];
      Object.keys(o).forEach((key) => {
        itemResult.push(o[key]);
      });
      result = itemResult;
    } else {
      result = itemsList;
    }

    await dispatch(updateItemsState(result));
    setNewAddItemListArray([]);
    setValueItemList(null);

    setTimeout(() => {
      setOpenLoadingModal(false);
      onClose();
    }, 500);
  };

  const currentlyDelete = (params: GridCellParams) => {
    const value = params.colDef.field;
    //deleteItem
    if (value === 'delete') {
      setBarcodeNameDel(String(params.getValue(params.id, 'barcodeName')));
      setSkuCodeDel(String(params.getValue(params.id, 'skuCode')));
      setBarCodeDel(String(params.getValue(params.id, 'barcode')));
      setOpenModelDeleteConfirm(true);
      //   setNewAddItemListArray(
      //     newAddItemListArray.filter((r: any) => r.barcode !== params.getValue(params.id, 'barcode'))
      //   );
    }
  };

  const handleDeleteItem = () => {
    setNewAddItemListArray(newAddItemListArray.filter((r: any) => r.barcode !== barCodeDel));
    setOpenModelDeleteConfirm(false);
  };

  const handleModelDeleteConfirm = () => {
    setOpenModelDeleteConfirm(false);
  };

  let rows: any = [];
  rows = newAddItemListArray.map((item: any, index: number) => {
    return {
      id: index,
      barcode: item.barcode,
      unitName: item.unitName,
      barcodeName: item.barcodeName,
      actualQty: item.qty,
      skuCode: item.skuCode,
      setPrice: item.pricePerUnit,
    };
  });

  let checkHaveItems;
  if (itemsList.code === 204001) {
    checkHaveItems = (
      <Grid item container xs={12} justifyContent="center">
        <Box color="#CBD4DB">
          <h6>ไม่พบสินค้า</h6>
        </Box>
      </Grid>
    );
  } else if (newAddItemListArray.length > 0) {
    checkHaveItems = (
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
    );
  } else {
    checkHaveItems = <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}></Box>;
  }

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
                disabled={itemsList.code === 204001}
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
                disabled={!valueItemList}
              >
                เพิ่ม
              </Button>
            </Box>

            <Box sx={{ flex: 1, ml: 2 }}>
              {handldCloseAddItemModal ? (
                <IconButton
                  aria-label="close"
                  onClick={handldCloseAddItemModal}
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

          {checkHaveItems}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              id="btnSearch"
              variant="contained"
              color="secondary"
              onClick={handleAddItem}
              className={classes.MbtnSearch}
              size="large"
              disabled={newAddItemListArray.length === 0}
              startIcon={<AddCircleOutlineIcon />}
            >
              เพิ่มสินค้า
            </Button>
          </Box>
        </DialogContent>
        <LoadingModal open={openLoadingModal} />
      </Dialog>

      {/* ModalDeleteConfirm */}

      <Dialog
        open={openModelDeleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ minWidth: 800 }}
      >
        <DialogContent sx={{ pl: 6, pr: 8 }}>
          <DialogContentText id="alert-dialog-description" sx={{ color: '#263238' }}>
            <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
              ต้องการลบสินค้า
            </Typography>
            <Typography variant="body1" align="left">
              สินค้า <label style={{ color: '#AEAEAE', marginRight: 5 }}>|</label>{' '}
              <label style={{ color: '#36C690' }}>
                <b>{barcodeNameDel}</b>
                <br />
                <label style={{ color: '#AEAEAE', fontSize: 14, marginLeft: '3.8em' }}>{skuCodeDel}</label>
              </label>
            </Typography>
            <Typography variant="body1" align="left">
              บาร์โค้ด <label style={{ color: '#AEAEAE', marginRight: 5 }}>|</label>{' '}
              <label style={{ color: '#36C690' }}>
                <b>{barCodeDel}</b>
              </label>
            </Typography>
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', mb: 2, pl: 6, pr: 8 }}>
          <Button
            id="btnCancle"
            variant="contained"
            color="cancelColor"
            sx={{ borderRadius: 2, width: 90, mr: 2 }}
            onClick={handleModelDeleteConfirm}
          >
            ยกเลิก
          </Button>
          <Button
            id="btnConfirm"
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, width: 90 }}
            onClick={handleDeleteItem}
          >
            ลบสินค้า
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ModalAddItem;
