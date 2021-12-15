import React, { ReactElement } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from '../../store/store';
import { updateItemsState } from '../../store/slices/supplier-add-items-slice';
import LoadingModal from '../commons/ui/loading-modal';
import { IconButton, TextField } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { DeleteForever } from '@mui/icons-material';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { useStyles } from '../../styles/makeTheme';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ModelDeleteConfirm from './modal-delete-confirm';

interface Props {
  open: boolean;
  onClose: () => void;
  SupplierCode: string;
}

interface StateItem {
  barcodeName: string;
  barcode: string;
}

const mockRows = [
  {
    barcode: '0810000000024',
    skuCode: '081000000000000002',
    unitCode: 'ST',
    unitName: 'ชิ้น',
    unitFactor: 1,
    barcodeName: 'แก้วพลาสติก 22oz Piece',
    pricePerUnit: 0,
    qty: 1,
    actualQty: 1,
    isCalVat: true,
    isControlStock: true,
  },
  {
    barcode: '8859356501011',
    skuCode: '000000000010000055',
    unitCode: 'KAR',
    unitName: 'ลัง',
    unitFactor: 500,
    barcodeName: 'ถ้วยร้อนDW8oz พิมพ์ลายBaoCafe Carton',
    pricePerUnit: 0,
    qty: 1,
    actualQty: 1,
    isCalVat: true,
    isControlStock: true,
  },
];

const columns: GridColDef[] = [
  {
    field: 'barcode',
    headerName: 'บาร์โค้ด',
    flex: 1.5,
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

export default function ModelAddItems({ open, onClose, SupplierCode }: Props): ReactElement {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);

  // let rows: any = [];
  const rows = mockRows.map((item: any, index: number) => {
    return {
      id: index,
      barcode: item.barcode,
      unitName: item.unitName,
      barcodeName: item.barcodeName,
      qty: 1,
      skuCode: item.skuCode,
    };
  });

  const handleAddItem = async () => {
    setOpenLoadingModal(true);
    const payload = mockRows;
    await dispatch(updateItemsState(payload));

    setTimeout(() => {
      setOpenLoadingModal(false);
      onClose();
    }, 300);
  };

  const [barcodeNameDel, setBarcodeNameDel] = React.useState('');
  const [skuCodeDel, setSkuCodeDel] = React.useState('');
  const [barCodeDel, setBarCodeDel] = React.useState('');
  const [openModelDeleteConfirm, setOpenModelDeleteConfirm] = React.useState(false);
  const currentlyDelete = (params: GridCellParams) => {
    localStorage.removeItem('checkLoadRow');
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

  const onCloseModal = async () => {
    localStorage.clear();
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth={true}>
      <DialogContent>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flex: 7 }}>
            <TextField placeholder="บาร์โค้ด/รายละเอียดสินค้า" size="small" className={classes.MtextField} fullWidth />
          </Box>

          <Box sx={{ flex: 2 }}>
            <Button
              id="btnSearch"
              variant="contained"
              color="primary"
              // onClick={onClickAddItem}
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

        <Typography variant="h5" sx={{ mt: 4, color: '#F54949' }}>
          ** Mock Data
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
          <div style={{ width: '100%' }} className={classes.MdataGridPaginationTop}>
            <DataGrid
              rows={rows}
              columns={columns}
              disableColumnMenu
              hideFooter
              autoHeight
              onCellClick={currentlyDelete}
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

      <ModelDeleteConfirm
        open={openModelDeleteConfirm}
        onClose={handleModelDeleteConfirm}
        productName={barcodeNameDel}
        skuCode={skuCodeDel}
        barCode={barCodeDel}
      />

      <LoadingModal open={openLoadingModal} />
    </Dialog>
  );
}
