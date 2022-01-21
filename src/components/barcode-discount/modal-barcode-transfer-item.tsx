import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, TextareaAutosize, Tooltip, withStyles } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField, Typography } from '@mui/material';
import { DeleteForever, Tune } from '@mui/icons-material';
import { useStyles } from '../../styles/makeTheme';
import { DiscountDetail } from '../../models/barcode-discount';
import DatePickerComponent from '../../components/barcode-discount/date-picker';
import { saveBarcodeDiscount, updateDataDetail } from '../../store/slices/barcode-discount-slice';
import moment from 'moment';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { stringNullOrEmpty } from '../../utils/utils';
import BarcodeDiscountPopup from './barcode-discount-popup';
export interface DataGridProps {
  id: string;
  typeDiscount: string;
  // onClose?: () => void;
}
export const ModalTransferItem = (props: DataGridProps) => {
  const { typeDiscount } = props;

  const classes = useStyles();
  const inputStyle = {};
  const dispatch = useAppDispatch();
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const payloadBarcodeDiscount = useAppSelector((state) => state.barcodeDiscount.createDraft);
  const dataDetail = useAppSelector((state) => state.barcodeDiscount.dataDetail);
  const errorList = useAppSelector((state) => state.barcodeDiscount.errorList);
  console.log({ errorList });

  const [dtTable, setDtTable] = React.useState<Array<DiscountDetail>>([]);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [countText, setCountText] = React.useState<number>(payloadBarcodeDiscount.requestorNote.split('').length);

  useEffect(() => {
    if (Object.keys(payloadAddItem).length !== 0) {
      let rows = payloadAddItem.map((item: any, index: number) => {
        let sameItem = dtTable.find((el) => el.barCode === item.barcode);
        const price = item.unitPrice;
        let discount = !!sameItem ? sameItem.discount : 0;
        const cashDiscount = typeDiscount === 'percent' ? (discount * price) / 100 : discount;

        const priceAfterDicount = price - cashDiscount;
        const date = moment(new Date()).startOf('day').toISOString();

        return {
          id: `${item.barcode}-${index + 1}`,
          index: index + 1,
          barCode: item.barcode,
          barcodeName: item.barcodeName,
          unit: item.unitName,
          price: price,
          discount: discount,
          errorDiscount: '',
          qty: item.qty ? item.qty : 0,
          errorQty: '',
          expiryDate: null,
          errorExpiryDate: '',
          cashDiscount: cashDiscount || 0,
          priceAfterDicount: priceAfterDicount,
          numberOfDiscounted: item.qty,
          numberOfApproved: 0,
          approvedDiscount: 0,
          skuCode: item.skuCode,
        };
      });
      setDtTable(rows);
    } else {
      setDtTable([]);
    }
  }, [payloadAddItem, typeDiscount]);

  useEffect(() => {
    if (dtTable.length !== 0) {
      const sumOfApprovedDiscount = dtTable.reduce((acc, val) => acc + val.approvedDiscount, 0);
      const sumOfDiscount = dtTable.reduce((acc, val) => acc + val.cashDiscount * val.numberOfDiscounted, 0);
      const products = dtTable.map((item) => {
        return {
          price: item.price,
          barcode: item.barCode,
          RequestedDiscount: item.discount,
          NumberOfDiscounted: item.numberOfDiscounted,
          ExpiredDate: item.expiryDate,
        };
      });
      dispatch(saveBarcodeDiscount({ ...payloadBarcodeDiscount, products: products }));
      dispatch(
        updateDataDetail({
          ...dataDetail,
          sumOfApprovedDiscountDefault: sumOfApprovedDiscount,
          sumOfDiscountDefault: sumOfDiscount,
        })
      );
    } else {
      dispatch(updateDataDetail({ ...dataDetail, sumOfApprovedDiscountDefault: 0, sumOfDiscountDefault: 0 }));
    }
  }, [dtTable]);

  const handleClosePopup = () => {
    setOpenPopupModal(false);
  };

  const handleChangeDiscount = (event: any, index: number) => {
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      const value = event.target.value;
      data[index - 1].discount = parseFloat(value);

      if (typeDiscount === 'percent') {
        const number = data[index - 1].price * (data[index - 1].discount / 100);

        data[index - 1].cashDiscount = Math.trunc(number) || 0;
      } else {
        data[index - 1].cashDiscount = data[index - 1].discount || 0;
      }
      data[index - 1].priceAfterDicount = data[index - 1].price - data[index - 1].cashDiscount;
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
      data[index - 1].expiryDate = e;
      return data;
    });
  };

  const handleChangeNote = (e: any) => {
    dispatch(saveBarcodeDiscount({ ...payloadBarcodeDiscount, requestorNote: e }));
    setCountText(e.split('').length);
  };

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
      field: 'barcodeName',
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
      renderCell: (params: GridRenderCellParams) => {
        const validate = payloadBarcodeDiscount.validate;
        const value = params.value;
        const price = params.row.price;
        const condition = validate && ((value && (value < 0 || value > 100)) || !value) && params.row.errorDiscount;
        const condition2 = validate && ((value && (value < 0 || value > price)) || !value) && params.row.errorDiscount;
        return typeDiscount === 'percent' ? (
          <div className={classes.MLabelTooltipWrapper}>
            <TextField
              type="number"
              className={classes.MtextFieldNumber}
              error={condition}
              value={params.value}
              onChange={(e) => {
                handleChangeDiscount(e, params.row.index);
              }}
            />
            {condition && <div className="title">{params.row.errorDiscount}</div>}
          </div>
        ) : (
          <div className={classes.MLabelTooltipWrapper}>
            <TextField
              type="number"
              className={classes.MtextFieldNumber}
              error={condition2}
              value={params.value}
              // inputProps={{ min: 0, max: 100 }}
              onChange={(e) => {
                handleChangeDiscount(e, params.row.index);
              }}
              placeholder="0"
            />
            {condition2 && <div className="title">{params.row.errorDiscount}</div>}
          </div>
        );
      },
    },
    {
      field: 'cashDiscount',
      headerName: 'ส่วนลด',
      minWidth: 73,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Typography color="#F54949" fontSize="15px" textAlign="end" width="100%" fontWeight="bold">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'priceAfterDicount',
      headerName: 'ราคาหลังลด',
      minWidth: 120,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Typography color="#36C690" fontSize="15px" textAlign="end" width="100%" fontWeight="bold">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'numberOfDiscounted',
      headerName: 'จำนวนที่ขอลด',
      minWidth: 119,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const validate = payloadBarcodeDiscount.validate;
        const value = params.value;

        const condition = validate && ((value && value < 0) || !value) && params.row.errorNumberOfDiscounted;
        return (
          <div className={classes.MLabelTooltipWrapper}>
            <TextField
              error={condition}
              type="number"
              value={params.value}
              className={classes.MtextFieldNumber}
              inputProps={{ min: 0 }}
              onChange={(e) => {
                handleChangeNumberOfDiscount(e, params.row.index);
              }}
            />
            {condition && <div className="title">{params.row.errorNumberOfDiscounted}</div>}
          </div>
        );
      },
    },
    {
      field: 'numberOfApproved',
      headerName: 'จำนวนที่อนุมัติ',
      minWidth: 150,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <TextField type="number" className={classes.MtextFieldNumberNoneArrow} value={params.value} disabled />
      ),
    },
    {
      field: 'approvedDiscount',
      headerName: 'รวมส่วนลดที่อนุมัติ',
      minWidth: 153,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Typography width="100%" textAlign="right">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'expiryDate',
      headerName: 'วันที่หมดอายุ',
      minWidth: 185,
      headerAlign: 'left',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div className={classes.MLabelTooltipWrapper}>
            <DatePickerComponent
              // error={true}
              onClickDate={(e: any) => {
                handleChangeExpiry(e, params.row.index);
              }}
              value={params.value}
              placeHolder="วว/ดด/ปปปป"
            />
            {false && <div className="title">demo</div>}
          </div>
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
        const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);

        const handleOpenModalDelete = () => {
          setOpenModalDelete(true);
        };

        const handleCloseModalDelete = () => {
          setOpenModalDelete(false);
        };

        const handleDeleteItem = () => {
          dispatch(updateAddItemsState(payloadAddItem.filter((r: any) => r.barcode !== params.row.barCode)));

          setOpenModalDelete(false);
          setOpenPopupModal(true);
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
                <DialogContentText id="alert-dialog-description" sx={{ color: '#263238' }}>
                  <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
                    ต้องการลบสินค้า
                  </Typography>
                  <Typography variant="body1" align="left">
                    สินค้า <label style={{ color: '#AEAEAE', marginRight: 5 }}>|</label>{' '}
                    <label style={{ color: '#36C690' }}>
                      <b>{params.row.barcodeName}</b>
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
                    บาร์โค้ด <label style={{ color: '#AEAEAE', marginRight: 5 }}>|</label>{' '}
                    <label style={{ color: '#36C690' }}>
                      <b>{params.row.barCode}</b>
                    </label>
                  </Typography>
                </DialogContentText>
              </DialogContent>

              <DialogActions sx={{ justifyContent: 'center', mb: 2, pl: 6, pr: 8 }}>
                <Button
                  id="btnCancle"
                  variant="contained"
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
    <div style={{ width: '100%', height: dtTable.length >= 8 ? '70vh' : 'auto' }} className={classes.MdataGridDetail}>
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
        rowHeight={70}
        components={{
          NoRowsOverlay: () => (
            <Typography position="relative" textAlign="center" top="112px" color="#AEAEAE">
              ไม่มีข้อมูล
            </Typography>
          ),
        }}
        // onCellClick={currentlySelected}
        // onCellFocusOut={handleCalculateItems}
      />
      <Box display="flex" justifyContent="space-between" paddingTop="30px">
        <Box>
          <Typography fontSize="14px" lineHeight="21px" height="24px">
            หมายเหตุจากสาขา :{' '}
          </Typography>
          <TextField
            placeholder="ความยาวไม่เกิน 100 ตัวอักษร"
            multiline
            rows={5}
            sx={{ width: '339px' }}
            variant="outlined"
            value={payloadBarcodeDiscount ? payloadBarcodeDiscount.requestorNote : ''}
            onChange={(e) => {
              handleChangeNote(e.target.value);
            }}
          />
          <Box color="#AEAEAE" width="100%" textAlign="right">
            {countText}/100
          </Box>
        </Box>
        <Box width="350px" marginTop="20px">
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize="14px" lineHeight="21px" height="24px">
              ขอส่วนลดทั้งหมด
            </Typography>
            <TextField
              disabled
              type="text"
              sx={{ bgcolor: '#EAEBEB' }}
              className={classes.MtextFieldNumberNoneArrow}
              value={dataDetail.sumOfDiscount?.toFixed(2) || '0.00'}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" marginTop="10px">
            <Typography fontSize="14px" fontWeight="700" marginTop="6px">
              ส่วนลดที่อนุมัติทั้งหมด
            </Typography>
            <TextField
              type="text"
              disabled
              sx={{ bgcolor: '#E7FFE9' }}
              className={classes.MtextFieldNumberNoneArrow}
              value={dataDetail.sumOfApprovedDiscount?.toFixed(2) || '0.00'}
            />
          </Box>
        </Box>
      </Box>

      <BarcodeDiscountPopup
        open={openPopupModal}
        onClose={handleClosePopup}
        contentMsg={'คุณได้ลบข้อมูลเรียบร้อยแล้ว'}
      />
    </div>
  );
};

export default ModalTransferItem;
