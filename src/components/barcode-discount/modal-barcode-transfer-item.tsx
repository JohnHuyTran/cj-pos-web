import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, TextareaAutosize, Tooltip, withStyles } from '@material-ui/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Typography,
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { useStyles } from '../../styles/makeTheme';
import { DiscountDetail } from '../../models/barcode-discount';
import DatePickerComponent from '../../components/commons/ui/date-picker-detail';
import { saveBarcodeDiscount } from '../../store/slices/barcode-discount-slice';
import moment from 'moment';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { stringNullOrEmpty } from '../../utils/utils';
export interface DataGridProps {
  id: string;
  typeDiscount: string;
  // onClose?: () => void;
}
export const ModalTransferItem = (props: DataGridProps) => {
  const { typeDiscount } = props;

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const payloadBarcodeDiscount = useAppSelector(
    (state) => state.barcodeDiscount.createDraft
  );

  const [dtTable, setDtTable] = React.useState<Array<DiscountDetail>>([]);
  useEffect(() => {
    if (Object.keys(payloadAddItem).length !== 0) {
      let rows = payloadAddItem.map((item: any, index: number) => {
        const price = item.unitPrice;
        let discount = 0;
        const cashDiscount =
          typeDiscount === 'percent' ? (discount * price) / 100 : discount;

        const priceAffterDicount = price - cashDiscount;
        const date = moment(new Date()).startOf('day').toISOString();

        return {
          id: `${item.barcode}-${index + 1}`,
          index: index + 1,
          barCode: item.barcode,
          productName: item.barcodeName,
          unit: item.unitName,
          price: price,
          discount: 0,
          errorDiscount: '',
          qty: item.qty ? item.qty : 0,
          errorQty: '',
          expiryDate: date,
          errorExpiryDate: '',
          cashDiscount: cashDiscount || 0,
          priceAffterDicount: priceAffterDicount,
          numberOfDiscounted: item.qty,
          approvedDiscount: 0,
          skuCode: item.skuCode,
        };
      });
      setDtTable(rows);
    }
  }, [payloadAddItem, typeDiscount]);

  useEffect(() => {
    if (dtTable.length !== 0) {
      // const products = dtTable.map((item) => {
      //   console.log(item);

      //   return {
      //     price: item.price,
      //     barcode: item.barCode,
      //     RequestedDiscount: item.discount,
      //     NumberOfDiscounted: item.numberOfDiscounted,
      //     ExpiredDate: item.expiryDate,
      //   };
      // });
      dispatch(
        saveBarcodeDiscount({ ...payloadBarcodeDiscount, products: dtTable })
      );
    }
  }, [dtTable]);

  const handleChangeDiscount = (event: any, index: number) => {
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      const value = event.target.value;
      data[index - 1].discount = !!value ? parseInt(value) : 0;
      if (typeDiscount === "percent") {
        const number = data[index - 1].price * (data[index - 1].discount / 100);

        data[index - 1].cashDiscount = Math.trunc(number) || 0;
      } else {
        data[index - 1].cashDiscount = data[index - 1].discount || 0;
      }
      data[index - 1].priceAffterDicount =
        data[index - 1].price - data[index - 1].cashDiscount;
      return data;
    });
  };

  const handleChangeNumberOfDiscount = (event: any, index: number) => {
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      data[index - 1].numberOfDiscounted = parseInt(event.target.value);
      return data;
    });
  };

  const handleChangeExpiry = (e: any, index: number) => {
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      console.log({ e });

      data[index - 1].expiryDate = e;

      return data;
    });
  };

  const CustomTooltip = withStyles({
    tooltip: {
      color: '#F54949',
      backgroundColor: '#ffffff',
      fontSize: 'medium',
    },
  })(Tooltip);

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      minWidth: 60,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'barCode',
      headerName: 'บาร์โค้ด',
      minWidth: 122,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
    },
    {
      field: 'productName',
      headerName: 'รายละเอียดสินค้า',
      minWidth: 250,
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
      field: 'unit',
      headerName: 'หน่วย',
      minWidth: 77,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'price',
      headerName: 'ราคาปกติ',
      minWidth: 80,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'discount',
      headerName: typeDiscount === 'percent' ? 'ยอดลด (%)' : 'ยอดลด (บาท)',
      resizable: true,
      minWidth: 130,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) =>
        typeDiscount === 'percent' ? (
          <CustomTooltip
            title={params.row.errorDiscount}
            hidden={!stringNullOrEmpty(params.row.errorDiscount)}
          >
            <TextField
              type="number"
              error={!stringNullOrEmpty(params.row.errorDiscount)}
              value={params.value}
              // inputProps={{ min: 0, max: 100 }}
              onChange={(e) => {
                handleChangeDiscount(e, params.row.index);
              }}
            />
          </CustomTooltip>
        ) : (
          <CustomTooltip
            title={params.row.errorDiscount}
            hidden={!stringNullOrEmpty(params.row.errorDiscount)}
          >
            <TextField
              type="number"
              error={!stringNullOrEmpty(params.row.errorDiscount)}
              // inputProps={{ min: 0, max: params.row.price }}
              onChange={(e) => {
                setTimeout(() => {handleChangeDiscount(e, params.row.index)}, 500) ;
              }}
            />
          </CustomTooltip>
        ),
    },
    {
      field: 'cashDiscount',
      headerName: 'ส่วนลด',
      minWidth: 73,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'priceAffterDicount',
      headerName: 'ราคาหลังลด',
      minWidth: 120,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'numberOfDiscounted',
      headerName: 'จำนวนที่ขอลด',
      minWidth: 119,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <CustomTooltip
            title={params.row.errorQty}
            hidden={!stringNullOrEmpty(params.row.errorQty)}
          >
          <TextField
            error={!stringNullOrEmpty(params.row.errorQty)}
            type="number"
            value={params.value}
            inputProps={{ min: 0, max: 100 }}
            onChange={(e) => {
              handleChangeNumberOfDiscount(e, params.row.index);
            }}
          />
        </CustomTooltip>
      ),
    },
    {
      field: 'numberOfApproved',
      headerName: 'จำนวน<br>ที่อนุมัติ',
      minWidth: 150,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: () => <TextField type="number" disabled />,
    },
    {
      field: 'approvedDiscount',
      headerName: 'รวมส่วนลดที่อนุมัติ',
      minWidth: 153,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'expiryDate',
      headerName: 'วันที่หมดอายุ',
      minWidth: 180,
      headerAlign: 'left',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DatePickerComponent
            onClickDate={(e: any) => {
              handleChangeExpiry(e, params.row.index);
            }}
            value={params.value}
          />
        );
      },
    },
    {
      field: 'delete',
      headerName: ' ',
      flex: 0.2,
      align: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const [openModalDelete, setOpenModalDelete] =
          React.useState<boolean>(false);

        const handleOpenModalDelete = () => {
          setOpenModalDelete(true);
        };

        const handleCloseModalDelete = () => {
          setOpenModalDelete(false);
        };

        const handleDeleteItem = () => {
          dispatch(
            updateAddItemsState(
              payloadAddItem.filter(
                (r: any) => r.barcode !== params.row.barCode
              )
            )
          );

          setOpenModalDelete(false);
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
              maxWidth="md"
              sx={{ minWidth: 800 }}
            >
              <DialogContent sx={{ pl: 6, pr: 8 }}>
                <DialogContentText
                  id="alert-dialog-description"
                  sx={{ color: '#263238' }}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ marginBottom: 2 }}
                  >
                    ต้องการลบสินค้า
                  </Typography>
                  <Typography variant="body1" align="left">
                    สินค้า{' '}
                    <label style={{ color: '#AEAEAE', marginRight: 5 }}>
                      |
                    </label>{' '}
                    <label style={{ color: '#36C690' }}>
                      <b>{params.row.productName}</b>
                      <br />
                      <label
                        style={{
                          color: '#AEAEAE',
                          fontSize: 14,
                          marginLeft: '3.8em',
                        }}
                      >
                        {params.row.skuCode}
                      </label>
                    </label>
                  </Typography>
                  <Typography variant="body1" align="left">
                    บาร์โค้ด{' '}
                    <label style={{ color: '#AEAEAE', marginRight: 5 }}>
                      |
                    </label>{' '}
                    <label style={{ color: '#36C690' }}>
                      <b>{params.row.barCode}</b>
                    </label>
                  </Typography>
                </DialogContentText>
              </DialogContent>

              <DialogActions
                sx={{ justifyContent: 'center', mb: 2, pl: 6, pr: 8 }}
              >
                <Button
                  id="btnCancle"
                  variant="contained"
                  color="cancelColor"
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
  return (
    <div
      style={{ width: '100%', height: dtTable.length >= 8 ? '70vh' : 'auto' }}
      className={classes.MdataGridDetail}
    >
      <DataGrid
        rows={dtTable}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 20, 50, 100]}
        pagination
        disableColumnMenu
        autoHeight={dtTable.length >= 8 ? false : true}
        scrollbarSize={10}
        rowHeight={80}
        // onCellClick={currentlySelected}
        // onCellFocusOut={handleCalculateItems}
      />
      <Box display="flex" justifyContent="space-between" paddingTop="30px">
        <Box>
          <Typography fontSize="14px" lineHeight="21px" height="24px">
            หมายเหตุจากสาขา :{' '}
          </Typography>
          <TextareaAutosize
            placeholder="ความยาวไม่เกิน 100 ตัวอักษร"
            style={{
              width: '339px',
              height: '115px',
              border: '1px solid #C1C1C1',
              borderRadius: '10px',
              backgroundColor: 'transparent',
            }}
          />
        </Box>
        <Box width="350px" marginTop="20px">
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize="14px" lineHeight="21px" height="24px">
              ขอส่วนลดทั้งหมด
            </Typography>
            <TextField
              style={{
                backgroundColor: '#EAEBEB',
                border: '1px solid #C1C1C1',
                borderRadius: '6px',
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" marginTop="10px">
            <Typography fontSize="14px" fontWeight="700" marginTop="6px">
              ส่วนลดที่อนุมัติทั้งหมด
            </Typography>
            <TextField
              style={{
                backgroundColor: '#E7FFE9',
                border: '1px solid #C1C1C1',
                borderRadius: '6px',
              }}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ModalTransferItem;
