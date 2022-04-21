import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box } from '@material-ui/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { useStyles } from '../../styles/makeTheme';
import { numberWithCommas, objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import { BootstrapDialogTitle } from "../commons/ui/dialog-title";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SnackbarStatus from "../commons/ui/snackbar-status";
import AlertError from "../commons/ui/alert-error";
import { updateAddDestroyProductState } from "../../store/slices/add-to-destroy-product-slice";

interface Props {
  open: boolean;
  onClose: () => void;
}

const _ = require('lodash');

const lstProductMock = [
  {
    id: 1,
    barcode: '9999990181225',
    barcodeName: 'GF กล้วยหอมแพ็คเดี่ยว 120g',
    unitName: 'ชิ้น',
    numberOfDiscounted: 5,
    numberOfApproved: 0
  },
  {
    id: 2,
    barcode: '9999990197786',
    barcodeName: 'GF ส้มแพ็ค 500 g',
    unitName: 'ชิ้น',
    numberOfDiscounted: 10,
    numberOfApproved: 0
  },
  {
    id: 3,
    barcode: '9999990197788',
    barcodeName: 'GF ส้มแพ็ค 600 g',
    unitName: 'ชิ้น',
    numberOfDiscounted: 3,
    numberOfApproved: 0
  }
];

export const ModalAddProductToDestroyDiscount = ({ open, onClose }: Props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [dataTable, setDataTable] = React.useState<Array<any>>([]);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [textError, setTextError] = React.useState('');
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const payloadAddItem = useAppSelector((state) => state.addToDestroyProductSlice.state);

  useEffect(() => {
    let dataTableHandle = _.differenceBy(lstProductMock, payloadAddItem, 'barcode');
    setDataTable(dataTableHandle);
  }, [lstProductMock, payloadAddItem]);

  const handleClosePopup = () => {
    setOpenPopupModal(false);
  };

  const handleCloseModalError = () => {
    setOpenModalError(false);
  };

  const columns: GridColDef[] = [
    // {
    //   field: 'id',
    //   headerName: 'ลำดับ',
    //   flex: 0.4,
    //   headerAlign: 'center',
    //   align: 'center',
    //   disableColumnMenu: false,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <Box component="div" sx={{ paddingLeft: '20px' }}>
    //       {params.value}
    //     </Box>
    //   ),
    // },
    {
      field: 'barcode',
      headerName: 'บาร์โค้ด',
      flex: 1,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
    },
    {
      field: 'barcodeName',
      headerName: 'รายละเอียด',
      flex: 1.4,
      headerAlign: 'center',
      disableColumnMenu: false,
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
      flex: 0.5,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'numberOfDiscounted',
      headerName: 'จำนวนขอลด',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return numberWithCommas(stringNullOrEmpty(params.value) ? '' : params.value);
      },
    },
    {
      field: 'numberOfApproved',
      headerName: 'จำนวนทำลายจริง',
      flex: 1,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div className={classes.MLabelTooltipWrapper}>
            <TextField
              type="text"
              inputProps={{ maxLength: 13 }}
              className={classes.MtextFieldNumber}
              value={numberWithCommas(stringNullOrEmpty(params.value) ? '' : params.value)}
            />
          </div>
        );
      }
    },
    {
      field: 'delete',
      headerName: ' ',
      flex: 0.3,
      align: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);

        const handleOpenModalDelete = () => {
          setOpenModalDelete(true);
        };

        const handleCloseModalDelete = () => {
          setOpenModalDelete(false);
        };

        const handleDeleteItem = () => {
          setDataTable(dataTable.filter((r: any) => r.barcode !== params.row.barcode));
          setOpenModalDelete(false);
          setOpenPopupModal(true);
        };

        return (
          <>
            <Button
              onClick={handleOpenModalDelete}
            >
              <DeleteForever fontSize="medium" sx={{ color: '#F54949' }}/>
            </Button>

            <Dialog
              open={openModalDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{ sx: { minWidth: 450, height: 241 } }}
            >
              <DialogContent sx={{ pl: 6, pr: 8 }}>
                <DialogContentText id="alert-dialog-description" sx={{ color: '#263238' }}>
                  <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
                    ต้องการลบสินค้า
                  </Typography>
                  <Grid container>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      สินค้า <label style={{ color: '#AEAEAE', margin: '0 5px' }}>|</label>
                    </Grid>
                    <Grid item xs={8} sx={{ pl: 2 }}>
                      <label style={{ color: '#36C690' }}>
                        <b>{params.row.barcodeName}</b>
                        <br/>
                        <label
                          style={{
                            color: '#AEAEAE',
                            fontSize: 14,
                          }}
                        >
                          {params.row.skuCode}
                        </label>
                      </label>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      บาร์โค้ด <label style={{ color: '#AEAEAE', margin: '0 5px' }}>|</label>
                    </Grid>
                    <Grid item xs={8} sx={{ pl: 1 }}>
                      <label style={{ color: '#36C690' }}>
                        <b>{params.row.barcode}</b>
                      </label>
                    </Grid>
                  </Grid>
                </DialogContentText>
              </DialogContent>

              <DialogActions sx={{ justifyContent: 'center', mb: 2, pl: 6, pr: 8 }}>
                <Button
                  id="btnCancle"
                  variant="contained"
                  color="inherit"
                  sx={{ borderRadius: 2, width: 90, mr: 2 }}
                  onClick={handleCloseModalDelete}
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
          </>
        );
      },
    },
  ];
  const [pageSize, setPageSize] = React.useState<number>(10);

  const onChangeScanProduct = (e: any) => {
    if (e && !stringNullOrEmpty(e.target.value) && e.target.value.length > 2) {
      let currentValue = e.target.value.trim();
      let prefixValue = currentValue.slice(0, 2);
      if ('A4' === prefixValue) {
        try {
          let barcode = currentValue.slice(9, currentValue.length);
          let dataTableHandle = _.cloneDeep(dataTable);
          let dataObj = dataTableHandle.find((it: any) => it.barcode === barcode);
          if (objectNullOrEmpty(dataObj)) {
            showModalError('ไม่ใช่บาร์โค้ดส่วนลด โปรดสแกนใหม่');
          } else {
            dataObj.numberOfApproved = dataObj.numberOfApproved + 1;
            setDataTable(dataTableHandle);
          }
        } catch (e) {
          showModalError('ไม่ใช่บาร์โค้ดส่วนลด โปรดสแกนใหม่');
        }
      } else {
        showModalError('ไม่ใช่บาร์โค้ดส่วนลด โปรดสแกนใหม่');
      }
    }
  };

  const showModalError = (textError: string) => {
    setOpenModalError(true);
    setTextError(textError);
  };

  const handleAddProductDestroy = () => {
    let allProduct = [...dataTable, ...payloadAddItem];
    dispatch(updateAddDestroyProductState(allProduct));
    onClose();
  }

  return (
    <div>
      <Dialog open={open} maxWidth='lg' fullWidth>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={() => {
          onClose();
        }}>
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item container xs={12}>
              <Grid item xs={6} mb={2}>
                <Typography sx={{ fontWeight: '800' }}>สแกนบาร์โค้ดเพื่อนับ :</Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12} mb={3}>
              <Grid item xs={6}>
                <TextField
                  placeholder={'ค้นหาบาร์โค๊ด / รายละเอียดสินค้า'}
                  className={classes.MtextField}
                  variant="outlined"
                  size="small"
                  sx={{ width: '266px' }}
                  onChange={onChangeScanProduct}
                />
              </Grid>
            </Grid>
          </Grid>
          <div style={{ width: '100%', height: dataTable.length >= 10 ? '70vh' : 'auto' }}
               className={classes.MdataGridDetail}>
            <DataGrid
              rows={dataTable}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[10, 20, 50, 100]}
              pagination
              disableColumnMenu
              autoHeight={dataTable.length < 10}
              scrollbarSize={10}
              rowHeight={70}
              components={{
                NoRowsOverlay: () => (
                  <Typography position="relative" textAlign="center" top="112px" color="#AEAEAE">
                    ไม่มีข้อมูล
                  </Typography>
                ),
              }}
            />
          </div>
        </DialogContent>
        <Grid item xs={12} sx={{ textAlign: 'right' }} mr={3} mb={3}>
          <Button
            variant="contained"
            color="info"
            startIcon={<AddCircleOutlineOutlinedIcon/>}
            className={classes.MbtnSearch}
            onClick={handleAddProductDestroy}
          >
            เพิ่มสินค้า
          </Button>
        </Grid>
        <SnackbarStatus
          open={openPopupModal}
          onClose={handleClosePopup}
          isSuccess={true}
          contentMsg={'คุณได้ลบข้อมูลเรียบร้อยแล้ว'}
        />
        <AlertError
          open={openModalError}
          onClose={handleCloseModalError}
          textError={textError}
        />
      </Dialog>
    </div>
  );
};

export default ModalAddProductToDestroyDiscount;
