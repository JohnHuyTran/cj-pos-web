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
import {
  save,
  updateCheckEdit,
  updateCheckStock,
  updateDataDetail,
  updateErrorList,
} from '../../store/slices/transfer-out-destroy-slice';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { numberWithCommas, objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import { Action, BDStatus, TOStatus } from '../../utils/enum/common-enum';
import SnackbarStatus from '../commons/ui/snackbar-status';
import { ACTIONS } from '../../utils/enum/permission-enum';
import HtmlTooltip from '../commons/ui/html-tooltip';
import { TransferOutDetail } from "../../models/transfer-out";

export interface DataGridProps {
  action: Action | Action.INSERT;
  userPermission?: any[];
  id: string;
  // onClose?: () => void;
}

const _ = require('lodash');

export const ModalTransferOutDestroyItem = (props: DataGridProps) => {
  const { action, userPermission } = props;

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const payloadTransferOut = useAppSelector((state) => state.transferOutDestroySlice.createDraft);
  const dataDetail = useAppSelector((state) => state.transferOutDestroySlice.dataDetail);
  const errorList = useAppSelector((state) => state.transferOutDestroySlice.errorList);

  const [dtTable, setDtTable] = React.useState<Array<TransferOutDetail>>([]);
  const [sumOfDiscount, updateSumOfDiscount] = React.useState<number>(0);
  const [sumOfApprovedDiscount, updateSumOfApprovedDiscount] = React.useState<number>(0);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const checkStocks = useAppSelector((state) => state.stockBalanceCheckSlice.checkStock);
  //permission
  const [approvePermission, setApprovePermission] = useState<boolean>(
    userPermission != null && userPermission.length > 0 ? userPermission.includes(ACTIONS.CAMPAIGN_TO_APPROVE) : false
  );

  useEffect(() => {
    if (Object.keys(payloadAddItem).length !== 0) {
      let rows = payloadAddItem.map((item: any, index: number) => {
        let sameItem = dtTable.find((el) => el.barCode === item.barcode);
        let numberOfRequested = item.qty ? item.qty : 0;
        let remark = !!sameItem ? sameItem.remark : '';
        if (Action.UPDATE === action && objectNullOrEmpty(sameItem)) {
          remark = stringNullOrEmpty(item.remark) ? '' : item.remark;
          numberOfRequested = stringNullOrEmpty(item.qty) ? null : item.qty;
        }
        let numberOfApproved = !!sameItem
          ? sameItem.numberOfApproved
          : item.numberOfApproved
            ? item.numberOfApproved
            : 0;

        return {
          id: `${item.barcode}-${index + 1}`,
          index: index + 1,
          barCode: item.barcode,
          barcodeName: item.barcodeName,
          unit: item.unitName,
          qty: numberOfRequested,
          errorQty: '',
          numberOfRequested: numberOfRequested,
          numberOfApproved: numberOfApproved,
          errorNumberOfApproved: '',
          skuCode: item.skuCode,
          remark: remark
        };
      });
      setDtTable(rows);
    } else {
      setDtTable([]);
    }
  }, [payloadAddItem]);

  useEffect(() => {
    if (dtTable.length !== 0) {
      updateSumOfDiscount(dtTable.reduce((acc, val) => acc + Number(val.numberOfRequested), 0));
      updateSumOfApprovedDiscount(dtTable.reduce((acc, val) => acc + Number(val.numberOfApproved), 0));
      const products = dtTable.map((item) => {
        return {
          barcode: item.barCode,
          numberOfRequested: parseInt(String(item.numberOfRequested).replace(/,/g, '')),
          numberOfApproved: parseInt(String(item.numberOfApproved).replace(/,/g, '')),
          unitName: item.unit,
          productName: item.barcodeName,
          sku: item.skuCode,
          remark: item.remark
        };
      });
      dispatch(save({ ...payloadTransferOut, products: products }));
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
      dispatch(save({ ...payloadTransferOut, products: [] }));
    }
  }, [dtTable]);

  const handleClosePopup = () => {
    setOpenPopupModal(false);
  };

  const handleChangeRemark = (event: any, index: number) => {
    setDtTable((preData: Array<TransferOutDetail>) => {
      const data = [...preData];
      data[index - 1].remark = stringNullOrEmpty(event.target.value) ? '' : event.target.value;
      return data;
    });
    dispatch(updateCheckEdit(true));
  };

  const handleChangeNumberOfApprove = (event: any, index: number, errorIndex: number, barcode: string) => {
    let currentValue = event.target.value;
    if (stringNullOrEmpty(event.target.value)
      || stringNullOrEmpty(event.target.value.trim())
    ) {
      currentValue = '0';
    }
    if (isNaN(parseInt(currentValue.replace(/,/g, '')))) {
      return;
    }
    setDtTable((preData: Array<TransferOutDetail>) => {
      const data = [...preData];
      data[index - 1].numberOfApproved = currentValue ? parseInt(currentValue.replace(/,/g, '')) : 0;
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
    dispatch(updateCheckEdit(true));
  };

  const handleChangeNumberOfDiscount = (event: any, index: number, errorIndex: number, barcode: string) => {
    let currentValue = event.target.value;
    if (stringNullOrEmpty(event.target.value)
      || stringNullOrEmpty(event.target.value.trim())
    ) {
      currentValue = '0';
    }
    if (isNaN(parseInt(currentValue.replace(/,/g, '')))) {
      return;
    }
    let currentData: any;
    setDtTable((preData: Array<TransferOutDetail>) => {
      const data = [...preData];
      currentData = data[index - 1];
      data[index - 1].numberOfRequested = currentValue
        ? parseInt(currentValue.replace(/,/g, '')) < 10000000000
          ? parseInt(currentValue.replace(/,/g, ''))
          : 0
        : 0;
      return data;
    });
    if (Object.keys(payloadAddItem).length !== 0) {
      let updateList = _.cloneDeep(payloadAddItem);
      updateList.map((item: any) => {
        if (item.barcode === currentData.barCode) {
          item.qty =
            parseInt(currentValue.replace(/,/g, '')) < 10000000000
              ? parseInt(currentValue.replace(/,/g, ''))
              : 0;
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
              errorNumberOfRequested: '',
            }
            : item;
        })
      )
    );
    dispatch(updateCheckEdit(true));
    dispatch(updateCheckStock(checkStocks.filter((el: any) => el.barcode !== barcode)));
  };

  const addTwoDecimalPlaces = (value: any) => {
    if (stringNullOrEmpty(value)) return '0.00';
    else return value.toFixed(2);
  };

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.4,
      headerAlign: 'center',
      align: 'center',
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
      field: 'unit',
      headerName: 'หน่วย',
      flex: 0.5,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'numberOfRequested',
      headerName: 'จำนวนทำลาย *',
      flex: 1,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index =
          errorList && errorList.length > 0 ? errorList.findIndex((item: any) => item.id === params.row.barCode) : -1;
        const indexStock =
          checkStocks && checkStocks.length > 0
            ? checkStocks.findIndex((item: any) => item.barcode === params.row.barCode)
            : -1;
        const condition = (index != -1 && errorList[index].errorNumberOfRequested) || indexStock !== -1;
        return (
          <div className={classes.MLabelTooltipWrapper}>
            <TextField
              error={condition}
              type="text"
              inputProps={{ maxLength: 13 }}
              value={numberWithCommas(stringNullOrEmpty(params.value) ? '' : params.value)}
              className={classes.MtextFieldNumber}
              // inputProps={{ min: 0 }}
              onChange={(e) => {
                handleChangeNumberOfDiscount(e, params.row.index, index, params.row.barCode);
              }}
              disabled={(!stringNullOrEmpty(dataDetail.status) && dataDetail.status != TOStatus.DRAFT)}
            />
            {condition && <div className="title">{errorList[index]?.errorNumberOfRequested}</div>}
          </div>
        );
      },
    },
    {
      field: 'numberOfApproved',
      headerName: 'จำนวนที่อนุมัติ *',
      flex: 1,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index =
          errorList && errorList.length > 0 ? errorList.findIndex((item: any) => item.id === params.row.barCode) : -1;
        const indexStock =
          checkStocks && checkStocks.length > 0
            ? checkStocks.findIndex((item: any) => item.barcode === params.row.barCode)
            : -1;
        const condition = (index != -1 && errorList[index].errorNumberOfApproved) || indexStock !== -1;
        return (
          <div className={classes.MLabelTooltipWrapper}>
            <TextField
              error={condition}
              type="text"
              inputProps={{ maxLength: 13 }}
              className={classes.MtextFieldNumber}
              value={numberWithCommas(stringNullOrEmpty(params.value) ? '' : params.value)}
              disabled={!approvePermission || stringNullOrEmpty(dataDetail.status) || dataDetail.status != TOStatus.WAIT_FOR_APPROVAL}
              onChange={(e) => {
                handleChangeNumberOfApprove(e, params.row.index, index, params.row.barCode);
              }}
            />
            {condition && <div className="title">{errorList[index]?.errorNumberOfApproved}</div>}
          </div>
        );
      }
    },
    {
      field: 'remark',
      headerName: 'หมายเหตุ',
      flex: 1.2,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <HtmlTooltip disableHoverListener={stringNullOrEmpty(params.value)}
                     disableTouchListener={stringNullOrEmpty(params.value)}
                     disableFocusListener={stringNullOrEmpty(params.value)}
                     disableInteractive={stringNullOrEmpty(params.value)}
                     title={<React.Fragment>{params.value}</React.Fragment>}>
          <TextField
            type="text"
            sx={{ width: '100%' }}
            inputProps={{ maxLength: 250 }}
            className={classes.MtextField}
            value={stringNullOrEmpty(params.value) ? '' : params.value}
            onChange={(e) => {
              handleChangeRemark(e, params.row.index);
            }}
            disabled={!stringNullOrEmpty(dataDetail.status) && dataDetail.status != TOStatus.DRAFT
              && dataDetail.status != TOStatus.WAIT_FOR_APPROVAL}
          />
        </HtmlTooltip>
      )
    },
    {
      field: 'delete',
      headerName: ' ',
      flex: 0.3,
      align: 'center',
      sortable: false,
      hide: (!stringNullOrEmpty(dataDetail.status) && dataDetail.status != TOStatus.DRAFT),
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
    <div>
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
        />
      </div>
      <Box display="flex" justifyContent="space-between" mt={0}>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={3}/>
          <Grid item xs={3}/>
          <Grid item xs={3}/>
          <Grid item xs={3}>
            <Box display="flex" justifyContent="space-between" marginTop="25px">
              <Typography fontSize="14px" fontWeight="700" lineHeight="30px" height="24px">
                จำนวนทำลายทั้งหมด
              </Typography>
              <TextField
                disabled
                type="text"
                sx={{ bgcolor: '#EAEBEB' }}
                className={classes.MtextFieldNumberNoneArrow}
                value={numberWithCommas(sumOfDiscount)}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" marginTop="10px">
              <Typography fontSize="14px" fontWeight="700" marginTop="6px">
                จำนวนที่อนุมัติทั้งหมด
              </Typography>
              <TextField
                type="text"
                sx={{ bgcolor: '#E7FFE9', pointerEvents: 'none' }}
                inputProps={{ style: { fontWeight: 'bolder', color: '#263238' } }}
                className={classes.MtextFieldNumberNoneArrow}
                value={numberWithCommas(sumOfApprovedDiscount)}
              />
            </Box>
          </Grid>
        </Grid>
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

export default ModalTransferOutDestroyItem;
