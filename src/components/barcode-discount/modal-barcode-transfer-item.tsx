import React, {useEffect, useState} from 'react';
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
import { DeleteForever, Tune } from '@mui/icons-material';
import { useStyles } from '../../styles/makeTheme';
import { DiscountDetail } from '../../models/barcode-discount';
import DatePickerComponent from '../commons/ui/date-picker-v2';
import {
  saveBarcodeDiscount,
  updateDataDetail,
  updateErrorList,
  updateCheckStock,
  updateCheckEdit, updateApproveEdit,
} from '../../store/slices/barcode-discount-slice';
import moment from 'moment';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { numberWithCommas, objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import { Action } from '../../utils/enum/common-enum';
import SnackbarStatus from '../commons/ui/snackbar-status';
import {ACTIONS} from "../../utils/enum/permission-enum";
import NumberFormat from 'react-number-format';

export interface DataGridProps {
  action: Action | Action.INSERT;
  userPermission?: any[];
  id: string;
  typeDiscount: string;
  // onClose?: () => void;
}

const _ = require('lodash');

export const ModalTransferItem = (props: DataGridProps) => {
  const { typeDiscount, action, userPermission } = props;

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const payloadBarcodeDiscount = useAppSelector((state) => state.barcodeDiscount.createDraft);
  const dataDetail = useAppSelector((state) => state.barcodeDiscount.dataDetail);
  const approveReject = useAppSelector((state) => state.barcodeDiscount.approveReject);
  const errorList = useAppSelector((state) => state.barcodeDiscount.errorList);

  const [dtTable, setDtTable] = React.useState<Array<DiscountDetail>>([]);
  const [sumOfDiscount, updateSumOfDiscount] = React.useState<number>(0);
  const [sumOfApprovedDiscount, updateSumOfApprovedDiscount] = React.useState<number>(0);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [countText, setCountText] = React.useState<number>(
    stringNullOrEmpty(payloadBarcodeDiscount.requesterNote) ? 0 : payloadBarcodeDiscount.requesterNote.split('').length
  );
  const checkStocks = useAppSelector((state) => state.barcodeDiscount.checkStock);
  //permission
  const [approvePermission, setApprovePermission] = useState<boolean>((userPermission != null && userPermission.length > 0)
      ? userPermission.includes(ACTIONS.CAMPAIGN_BD_APPROVE) : false);

  useEffect(() => {
    if (Object.keys(payloadAddItem).length !== 0) {
      let rows = payloadAddItem.map((item: any, index: number) => {
        let sameItem = dtTable.find((el) => el.barCode === item.barcode);
        const price = parseFloat(item.unitPrice);
        let discount = !!sameItem ? sameItem.discount : 0;
        let expiryDate = !!sameItem ? sameItem.expiryDate : null;
        let numberOfDiscounted = item.qty ? item.qty : 0;
        let approvedDiscount = 0;
        let numberOfApproved = !!sameItem ? sameItem.numberOfApproved : 0;
        if (Action.UPDATE === action && objectNullOrEmpty(sameItem)) {
          discount = stringNullOrEmpty(item.discount) ? 0 : item.discount;
          expiryDate = stringNullOrEmpty(item.expiryDate) ? null : item.expiryDate;
          numberOfDiscounted = stringNullOrEmpty(item.qty) ? null : item.qty;
        }
        const cashDiscount =
          typeDiscount === 'percent'
            ? Math.floor((parseFloat(String(discount).replace(/,/g, '')) * price) / 100)
            : parseFloat(String(discount).replace(/,/g, ''));

        const priceAfterDiscount = price - (cashDiscount || 0);

        return {
          id: `${item.barcode}-${index + 1}`,
          index: index + 1,
          barCode: item.barcode,
          barcodeName: item.barcodeName,
          unit: item.unitName,
          price: price,
          discount: discount,
          errorDiscount: '',
          qty: numberOfDiscounted,
          errorQty: '',
          expiryDate: expiryDate,
          errorExpiryDate: '',
          cashDiscount: cashDiscount.toFixed(2) || 0,
          priceAfterDiscount: priceAfterDiscount.toFixed(2),
          numberOfDiscounted: numberOfDiscounted,
          numberOfApproved: numberOfApproved,
          errorNumberOfApproved: '',
          approvedDiscount: approvedDiscount,
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
      updateSumOfApprovedDiscount(dtTable.reduce((acc, val) => acc + Number(val.approvedDiscount), 0));
      updateSumOfDiscount(dtTable.reduce((acc, val) => acc + val.cashDiscount * Number(val.numberOfDiscounted), 0));
      const products = dtTable.map((item) => {
        return {
          price: item.price,
          barcode: item.barCode,
          requestedDiscount: parseFloat(String(item.discount).replace(/,/g, '')),
          numberOfDiscounted: parseInt(String(item.numberOfDiscounted).replace(/,/g, '')),
          expiredDate: item.expiryDate,
          unitFactor: item.unit,
          productName: item.barcodeName,
          skuCode: item.skuCode,
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
      updateSumOfApprovedDiscount(0);
      updateSumOfDiscount(0);
      dispatch(saveBarcodeDiscount({ ...payloadBarcodeDiscount, products: [] }));
    }
  }, [dtTable]);

  useEffect(() => {
    if (checkStocks.length !== 0 && Object.keys(payloadAddItem).length !== 0) {
      const predata = _.cloneDeep(payloadAddItem);
      const products = predata.map((item: any) => {
        const stock = checkStocks.find((el: any) => el.barcode === item.barcode);
        if (stock) {
          item.qty = stock.stockRemain;
        }
        return item;
      });

      dispatch(updateAddItemsState(products));
    }
  }, [checkStocks]);

  const handleClosePopup = () => {
    setOpenPopupModal(false);
  };

  const handleChangeDiscount = (event: any, index: number, errorIndex: number) => {
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      const value = event.target.value.replace(/[^0-9.]/g, '').replace(/,/g, '');
      data[index - 1].discount = value || 0;

      if (typeDiscount === 'percent') {
        const number = data[index - 1].price * (data[index - 1].discount / 100) || 0;

        data[index - 1].cashDiscount = Math.trunc(number).toFixed(2) || 0;
      } else {
        data[index - 1].cashDiscount = parseFloat(data[index - 1].discount || 0).toFixed(2) || 0;
      }
      data[index - 1].priceAfterDiscount = (data[index - 1].price - data[index - 1].cashDiscount).toFixed(2);
      return data;
    });
    dispatch(
      updateErrorList(
        errorList.map((item: any, idx: number) => {
          return idx === errorIndex
            ? {
                ...item,
                errorDiscount: '',
              }
            : item;
        })
      )
    );
    dispatch(updateCheckEdit(true));
  };

  const handleChangeNumberOfApprove = (event: any, index: number, errorIndex: number, barcode: string) => {
    let currentData: any;
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      currentData = data[index - 1];
      currentData.numberOfApproved = parseInt(event.target.value.replace(/,/g, ''));
      currentData.approvedDiscount = currentData.numberOfApproved * currentData.priceAfterDiscount;
      return data;
    });
    dispatch(
        updateErrorList(
            errorList.map((item: any, idx: number) => {
              return idx === errorIndex
                  ? {
                    ...item,
                    errorNumberOfApproved: '',
                  }
                  : item;
            })
        )
    );
    // dispatch(updateCheckEdit(true));
    // dispatch(updateCheckStock(checkStocks.filter((el: any) => el.barcode !== barcode)));
  };

  const handleChangeNumberOfDiscount = (event: any, index: number, errorIndex: number, barcode: string) => {
    let currentData: any;
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      currentData = data[index - 1];
      data[index - 1].numberOfDiscounted = parseInt(event.target.value.replace(/,/g, ''));
      return data;
    });
    if (Object.keys(payloadAddItem).length !== 0) {
      let updateList = _.cloneDeep(payloadAddItem);
      updateList.map((item: any) => {
        if (item.barcode === currentData.barCode) {
          item.qty = parseInt(event.target.value.replace(/,/g, ''));
        }
      });
      dispatch(updateAddItemsState(updateList));
    }
    dispatch(
      updateErrorList(
        errorList.map((item: any, idx: number) => {
          return idx === errorIndex
            ? {
                ...item,
                errorNumberOfDiscounted: '',
              }
            : item;
        })
      )
    );
    dispatch(updateCheckEdit(true));
    dispatch(updateCheckStock(checkStocks.filter((el: any) => el.barcode !== barcode)));
  };

  const handleChangeExpiry = (e: any, index: number, errorIndex: number) => {
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      data[index - 1].expiryDate = stringNullOrEmpty(e) ? null : moment(e).toISOString();
      return data;
    });
    dispatch(
      updateErrorList(
        errorList.map((item: any, idx: number) => {
          return idx === errorIndex
            ? {
                ...item,
                errorExpiryDate: '',
              }
            : item;
        })
      )
    );
    dispatch(updateCheckEdit(true));
  };

  const handleChangeNumber = (e: any, index: number) => {
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      data[index - 1].discount = numberWithCommas(parseFloat(e.target.value).toFixed(2));

      return data;
    });
  };

  const handleChangeNote = (e: any) => {
    dispatch(saveBarcodeDiscount({ ...payloadBarcodeDiscount, requesterNote: e }));
    setCountText(e.split('').length);
    dispatch(updateCheckEdit(true));
  };

  const handleChangeReason = (e: any) => {
    dispatch(updateApproveEdit({ ...approveReject, approvalNote: e }));
    dispatch(updateCheckEdit(true));
  };

  const addTwoDecimalPlaces = (value: any) => {
    if (stringNullOrEmpty(value)) return '0.00';
    else return value.toFixed(2);
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
      minWidth: 60,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'price',
      headerName: 'ราคาปกติ',
      minWidth: 60,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <Box component="div" width="100%" textAlign="end">
          {numberWithCommas(addTwoDecimalPlaces(params.value))}
        </Box>
      ),
    },
    {
      field: 'discount',
      headerName: typeDiscount === 'percent' ? 'ยอดลด (%)' : 'ยอดลด (บาท)',
      minWidth: 130,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index = errorList.findIndex((item: any) => item.id === params.row.barCode);
        const condition = index !== -1 && !!errorList[index].errorDiscount;
        return (
          <div className={classes.MLabelTooltipWrapper}>
            <NumberFormat customInput={TextField}
                          variant="outlined"
                          className={condition ? classes.MtextFieldNumberError : classes.MtextFieldNumber}
                          style={{borderColor:'red'}}
                          thousandSeparator={true}
                          decimalScale={2}
                          onChange={(e: any) => {
                            handleChangeDiscount(e, params.row.index, index);
                          }}
                          fixedDecimalScale
                          value={String(params.value)}
                          disabled={dataDetail.status > 1}
                          autoComplete="off"/>
            {condition && <div className="title">{errorList[index].errorDiscount}</div>}
          </div>
        );
      },
    },
    {
      field: 'cashDiscount',
      headerName: 'ส่วนลด',
      minWidth: 70,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Typography color="#F54949" fontSize="15px" textAlign="end" width="100%" fontWeight="bold">
          {numberWithCommas(params.value)}
        </Typography>
      ),
    },
    {
      field: 'priceAfterDiscount',
      headerName: 'ราคาหลังลด',
      minWidth: 110,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Typography color="#36C690" fontSize="15px" textAlign="end" width="100%" fontWeight="bold">
          {numberWithCommas(params.value)}
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
        const index = errorList.findIndex((item: any) => item.id === params.row.barCode);
        const indexStock = checkStocks.findIndex((item: any) => item.barcode === params.row.barCode);
        const condition = (index != -1 && errorList[index].errorNumberOfDiscounted) || indexStock !== -1;
        return (
          <div className={classes.MLabelTooltipWrapper}>
            <TextField
              error={condition}
              type="text"
              value={numberWithCommas(params.value)}
              className={classes.MtextFieldNumber}
              // inputProps={{ min: 0 }}
              onChange={(e) => {
                handleChangeNumberOfDiscount(e, params.row.index, index, params.row.barCode);
              }}
              disabled={dataDetail.status > 1}
            />
            {condition && <div className="title">{errorList[index]?.errorNumberOfDiscounted}</div>}
          </div>
        );
      },
    },
    {
      field: 'numberOfApproved',
      headerName: 'จำนวนที่อนุมัติ',
      minWidth: 120,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index = errorList.findIndex((item: any) => item.id === params.row.barCode);
        const indexStock = checkStocks.findIndex((item: any) => item.barcode === params.row.barCode);
        const condition = (index != -1 && errorList[index].errorNumberOfDiscounted) || indexStock !== -1;
        return (
          <div className={classes.MLabelTooltipWrapper}>
            <TextField
              type="number"
              className={classes.MtextFieldNumber}
              value={numberWithCommas(params.value)}
              disabled={!approvePermission}
              onChange={(e) => {
                handleChangeNumberOfApprove(e, params.row.index, index, params.row.barCode);
              }}
            />
            {condition && <div className="title">{errorList[index]?.errorNumberOfApproved}</div>}
          </div>
        )
      },
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'จำนวน'}</b>
            </Typography>
            <Typography variant="body2" noWrap>
              <b>{'ที่อนุมัติ'}</b>
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'approvedDiscount',
      headerName: 'รวมส่วนลดที่อนุมัติ',
      minWidth: 120,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Typography width="100%" textAlign="right">
          {numberWithCommas(addTwoDecimalPlaces(params.value))}
        </Typography>
      ),
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'รวมส่วนลด'}</b>
            </Typography>
            <Typography variant="body2" noWrap>
              <b>{'ที่อนุมัติ'}</b>
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'expiryDate',
      headerName: 'วันที่หมดอายุ',
      minWidth: 130,
      headerAlign: 'left',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index = errorList.findIndex((item: any) => item.id === params.row.barCode);
        const condition = index != -1 && errorList[index].errorExpiryDate;
        return (
          <div className={classes.MLabelTooltipWrapper}>
            <DatePickerComponent
              error={condition}
              onClickDate={(e: any) => {
                handleChangeExpiry(e, params.row.index, index);
              }}
              value={params.value}
              placeHolder="วว/ดด/ปปปป"
              disabled={dataDetail.status > 1 && !approvePermission}
            />
            {condition && <div className="title">{errorList[index].errorExpiryDate}</div>}
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
          dispatch(updateCheckEdit(true));
          setOpenModalDelete(false);
          setOpenPopupModal(true);
        };

        return (
          <>
            <Button
              onClick={handleOpenModalDelete}
              disabled={dataDetail.status > 1}
              sx={{ opacity: dataDetail.status > 1 ? '0.5' : '1' }}
            >
              <DeleteForever fontSize="medium" sx={{ color: '#F54949' }} />
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
                  {/* <Typography variant="body1" align="left" marginLeft="17px">
                    สินค้า <label style={{ color: '#AEAEAE', margin: '0 5px' }}>|</label>{' '}
                    <label style={{ color: '#36C690' }}>
                      <b>{params.row.barcodeName}</b>
                      <br />
                      <label
                        style={{
                          color: '#AEAEAE',
                          fontSize: 14,
                          marginLeft: '4em',
                        }}
                      >
                        {params.row.skuCode}
                      </label>
                    </label>
                  </Typography>
                  <Typography variant="body1" align="left">
                    บาร์โค้ด <label style={{ color: '#AEAEAE', margin: '0 5px' }}>|</label>{' '}
                    <label style={{ color: '#36C690' }}>
                      <b>{params.row.barCode}</b>
                    </label>
                  </Typography> */}
                  <Grid container>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      สินค้า <label style={{ color: '#AEAEAE', margin: '0 5px' }}>|</label>
                    </Grid>
                    <Grid item xs={8} sx={{ pl: 2 }}>
                      <label style={{ color: '#36C690' }}>
                        <b>{params.row.barcodeName}</b>
                        <br />
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
                        <b>{params.row.barCode}</b>
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
        autoHeight={dtTable.length < 8}
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
        <Box display="flex">
          <Box>
            <Typography fontSize="14px" lineHeight="21px" height="24px">
              หมายเหตุจากสาขา :{' '}
            </Typography>
            <TextField
              placeholder=" ความยาวไม่เกิน 100 ตัวอักษร"
              multiline
              rows={5}
              className={classes.MTextareaBD}
              inputProps={{
                maxLength: '100',
              }}
              sx={{ width: '339px' }}
              variant="outlined"
              value={payloadBarcodeDiscount ? payloadBarcodeDiscount.requesterNote : ''}
              onChange={(e) => {
                handleChangeNote(e.target.value);
              }}
              disabled={dataDetail.status > 1}
            />
            <Box color="#AEAEAE" width="100%" textAlign="right">
              {countText}/100
            </Box>
          </Box>
          <Box sx={{paddingLeft: 20}} style={{ display: (dataDetail.status > 1 && approvePermission) ? undefined : 'none' }}>
            <Typography fontSize="14px" lineHeight="21px" height="24px">
              หมายเหตุจากผู้อนุมัติ :{' '}
            </Typography>
            <TextField
                placeholder=" ความยาวไม่เกิน 100 ตัวอักษร"
                multiline
                rows={5}
                className={classes.MTextareaBD}
                inputProps={{
                  maxLength: '100',
                }}
                sx={{ width: '339px' }}
                variant="outlined"
                value={approveReject ? approveReject.approvalNote : ''}
                onChange={(e) => {
                  handleChangeReason(e.target.value);
                }}
                disabled={!approvePermission}
            />
            <Box color="#AEAEAE" width="100%" textAlign="right">
              {approveReject ? approveReject.approvalNote.split('').length : 0}/100
            </Box>
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
              value={numberWithCommas(addTwoDecimalPlaces(sumOfDiscount))}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" marginTop="10px">
            <Typography fontSize="14px" fontWeight="700" marginTop="6px">
              ส่วนลดที่อนุมัติทั้งหมด
            </Typography>
            <TextField
              type="text"
              sx={{ bgcolor: '#E7FFE9', pointerEvents: 'none' }}
              inputProps={{ style: { fontWeight: 'bolder', color: '#263238' } }}
              className={classes.MtextFieldNumberNoneArrow}
              value={numberWithCommas(addTwoDecimalPlaces(sumOfApprovedDiscount))}
            />
          </Box>
        </Box>
      </Box>

      <SnackbarStatus
        open={openPopupModal}
        onClose={handleClosePopup}
        isSuccess={true}
        contentMsg={'คุณได้ลบข้อมูลเรียบร้อยแล้ว'}
      />
    </div>
  );
};

export default ModalTransferItem;
