import React, { ReactElement, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Button, DialogActions, DialogContent, DialogContentText, Grid, Typography } from '@mui/material';
import { DeleteForever, ErrorOutline } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useStyles } from '../../styles/makeTheme';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { updateListSelect } from '../../store/slices/sale-limit-time-detail';

interface Props {
  open: boolean;
  onClose: () => void;
  products: object[];
}

export default function STProductTypeItems(): ReactElement {
  const classes = useStyles();
  const [dtTable, setDtTable] = React.useState([]);
  const listSelect = useAppSelector((state) => state.STDetail.listSelect);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (Object.keys(listSelect).length !== 0) {
      let rows = listSelect
        .filter((el: any) => el.type === 1)
        .map((item: any, index: number) => {
          return {
            id: item.categoryTypeCode,
            index: index + 1,
            typeProduct: item.categoryName,
            numberOfPruducts: listSelect.filter(
              (el1: any) => el1.type === 2 && el1.categoryTypeCode === item.categoryTypeCode
            ).length,
          };
        });
      console.log(rows);

      setDtTable(rows);
    } else {
      setDtTable([]);
    }
  }, [listSelect]);

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      headerAlign: 'center',
      disableColumnMenu: false,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'typeProduct',
      headerName: 'ประเภท',
      headerAlign: 'center',
      flex: 1.8,
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '30px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'numberOfPruducts',
      headerName: 'จำนวนสินค้า (รายการ)',
      flex: 6,
      headerAlign: 'left',
      sortable: false,
      renderCell: (params) => {
        return (
          <Typography variant="body2" paddingLeft="30px">
            <b>{params.value}</b>
          </Typography>
        );
      },
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690', marginLeft: '30px' }}>
            <b>{'จำนวนสินค้า (รายการ)'}</b>
          </div>
        );
      },
    },
    {
      field: 'delete',
      headerName: ' ',
      flex: 0.5,
      align: 'center',
      sortable: false,
      renderCell: (params) => {
        const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);

        const handleOpenModalDelete = () => {
          setOpenModalDelete(true);
        };

        const handleCloseModalDelete = () => {
          setOpenModalDelete(false);
        };

        const handleDeleteItem = () => {
          dispatch(updateListSelect(listSelect.filter((r: any) => r.id !== params.row.id)));
          setOpenModalDelete(false);
          // setOpenPopupModal(true);
        };

        return (
          <>
            <Button onClick={handleOpenModalDelete}>
              <DeleteForever fontSize="medium" sx={{ color: '#F54949' }} />
            </Button>

            <Dialog
              open={openModalDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{ sx: { minWidth: 450, height: 241 } }}
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ color: '#263238' }}>
                  <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
                    ต้องการลบสินค้า
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={5} sx={{ textAlign: 'left' }}>
                      ประเภท <label style={{ color: '#AEAEAE', margin: '0 10px' }}>|</label>
                      <label style={{ color: '#36C690', paddingLeft: '10px' }}>
                        <b>{params.row.typeProduct}</b>
                      </label>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={7} sx={{ textAlign: 'left' }}>
                      {'จำนวนสินค้า (รายการ)'} <label style={{ color: '#AEAEAE', margin: '0 5px' }}>|</label>
                      <label style={{ color: '#36C690', paddingLeft: '10px' }}>
                        <b>{params.row.numberOfPruducts}</b>
                      </label>
                    </Grid>
                    <Grid item xs={2}></Grid>
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

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1.5 }}>
      <div style={{ width: '100%' }} className={classes.MdataGridPaginationTop}>
        <DataGrid
          rows={dtTable}
          columns={columns}
          disableColumnMenu
          hideFooter
          autoHeight
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
    </Box>
  );
}
