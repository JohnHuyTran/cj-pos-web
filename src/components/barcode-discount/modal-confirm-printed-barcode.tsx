import React, { ReactElement, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingModal from '../commons/ui/loading-modal';
import { Box, DialogTitle, Grid, InputLabel, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { useStyles } from "../../styles/makeTheme";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { DateFormat } from "../../utils/enum/common-enum";
import moment from 'moment';
import { numberWithCommas, stringNullOrEmpty } from "../../utils/utils";

const _ = require('lodash');

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  values: {
    printNormal: boolean;
    printInDetail: boolean;
    id: string;
    barcode: string;
    lstProductNotPrinted: any[];
    lstProductPrintAgain: any[];
  };
}

interface loadingModalState {
  open: boolean;
}

export default function ModalConfirmPrintedBarcode({ open, onClose, onConfirm, values }: Props): ReactElement {
  const classes = useStyles();
  const [printAgainRows, setPrintAgainRows] = useState<any>([]);
  const [reasonForReprint, setReasonForReprint] = useState('');
  const [errorList, setErrorList] = useState<any>([]);
  const [openLoadingModal, setOpenLoadingModal] = useState<loadingModalState>({
    open: false,
  });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleConfirm = async () => {
    handleOpenLoading('open', true);
    await onConfirm();
    handleOpenLoading('open', false);
    onClose();
  };

  useEffect(() => {
    if (values.lstProductPrintAgain && values.lstProductPrintAgain.length > 0) {
      let rows = values.lstProductNotPrinted.map((item: any, index: number) => {
        return {
          id: index,
          index: index + 1,
          documentNumber: item.documentNumber,
          barcode: item.barcode,
          barcodeName: item.productName,
          skuCode: item.skuCode,
          expiredDate: moment(item.expiredDate).format(DateFormat.DATE_FORMAT),
          numberOfApproved: item.numberOfApproved,
          printedDiscount: 0,
          errorPrintedDiscount: ''
        };
      });
      setPrintAgainRows(rows);
    } else {
      setPrintAgainRows([]);
    }
  }, [values.lstProductPrintAgain]);

  let notPrintRows: any = [];
  if (values.lstProductNotPrinted && values.lstProductNotPrinted.length > 0) {
    notPrintRows = values.lstProductNotPrinted.map((item: any, index: number) => {
      return {
        id: index,
        index: index + 1,
        documentNumber: item.documentNumber,
        barcode: item.barcode,
        barcodeName: item.productName,
        skuCode: item.skuCode,
        expiredDate: moment(item.expiredDate).format(DateFormat.DATE_FORMAT)
      };
    });
  }

  const notPrintColumns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      disableColumnMenu: false,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'documentNumber',
      headerName: 'เลขที่เอกสาร BD',
      headerAlign: 'center',
      flex: 1.3,
      sortable: false,
      hide: values.printInDetail
    },
    {
      field: 'barcode',
      headerName: 'บาร์โค้ด',
      headerAlign: 'center',
      flex: 1,
      disableColumnMenu: false,
      sortable: false
    },
    {
      field: 'barcodeName',
      headerName: 'รายละเอียดสินค้า',
      headerAlign: 'center',
      flex: 1.8,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Typography variant="body2">{params.value}</Typography>
            <Typography color="textSecondary" sx={{ fontSize: 12 }}>
              {params.getValue(params.id, 'skuCode') || ''}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'expiredDate',
      headerName: 'วันที่หมดอายุ',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Typography variant="body2" sx={{
            color: '#F54949', background: '#EAEBEB',
            border: '1px solid #CBD4DB',
            boxSizing: 'border-box',
            borderRadius: '5px', padding: '3px 2px 2px 20px'
          }}>
            {params.value}
          </Typography>
        );
      },
    },
  ];

  const printAgainColumns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      disableColumnMenu: false,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'barcode',
      headerName: 'บาร์โค้ด',
      headerAlign: 'center',
      flex: 1,
      disableColumnMenu: false,
      sortable: false
    },
    {
      field: 'barcodeName',
      headerName: 'รายละเอียดสินค้า',
      headerAlign: 'center',
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Typography variant="body2">{params.value}</Typography>
            <Typography color="textSecondary" sx={{ fontSize: 12 }}>
              {params.getValue(params.id, 'skuCode') || ''}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'numberOfApproved',
      headerName: 'จำนวนที่อนุมัติ',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Typography variant="body2"
                      sx={{
                        width: '92px', height: '26px',
                        background: '#EAEBEB',
                        border: '1px solid #CBD4DB',
                        boxSizing: 'border-box',
                        borderRadius: '5px', padding: '3px 2px 2px 20px',
                        textAlign: 'right'
                      }}
          >
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: 'printedDiscount',
      headerName: 'รายการส่วนลดที่พิมพ์',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const index =
          errorList && errorList.length > 0 ? errorList.findIndex((item: any) => item.id === params.row.barCode) : -1;
        const condition = (index != -1 && errorList[index].errorNumberOfApproved);
        return (
          <div className={classes.MLabelTooltipWrapper}>
            <TextField
              error={condition}
              type="text"
              inputProps={{ maxLength: 13, maxWidth: '92px', maxHeight: '20px' }}
              className={classes.MTextFieldNumberPrint}
              value={numberWithCommas(stringNullOrEmpty(params.value) ? '' : params.value)}
              onChange={(e) => {
                handleChangePrintedDiscount(e, params.row.index, index);
              }}
            />
            {condition && <div className="title">{errorList[index]?.errorPrintedDiscount}</div>}
          </div>
        );
      },
    }
  ];

  const handleChangePrintedDiscount = (event: any, index: number, errorIndex: number) => {
    setPrintAgainRows((preData: Array<any>) => {
      const data = [...preData];
      data[index - 1].printedDiscount = event.target.value ? parseInt(event.target.value.replace(/,/g, '')) : 0;
      return data;
    });
    if (errorList && errorList.length > 0) {
      let errors = _.cloneDeep(errorList).map((item: any, idx: number) => {
        return idx === errorIndex
          ? {
            ...item,
            errorPrintedDiscount: '',
          }
          : item;
      });
      setErrorList(errors);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        PaperProps={{ sx: { minWidth: (values.lstProductNotPrinted != null && values.lstProductNotPrinted.length > 0) ? '877px' : '547px' } }}
      >
        {
          values.printNormal ?
            (
              <DialogContent sx={{ mt: 3, mr: 5, ml: 5 }}>
                <Box>
                  <Typography>เหตุผลที่ทำการพิมพ์บาร์โค้ด : </Typography>
                  <Typography
                    sx={{
                      marginTop: '5px',
                      padding: '15px',
                      backgroundColor: '#EAEBEB',
                      borderRadius: '8px'
                    }}>
                    พิมพ์บาร์โค้ดส่วนลดสินค้าใกล้หมดอายุตามเกณฑ์
                  </Typography>
                </Box>
              </DialogContent>
            ) :
            (
              <div>
                <DialogTitle>
                  <Typography variant="h6">พิมพ์บาร์โค้ด</Typography>
                </DialogTitle>
                <DialogContent>
                  {
                    (values.lstProductNotPrinted != null && values.lstProductNotPrinted.length > 0)
                    && (
                      <div>
                        <Box sx={{ width: '50%' }}>
                          <Typography>เหตุผลที่ทำการพิมพ์บาร์โค้ด : </Typography>
                          <Typography
                            sx={{
                              marginTop: '5px',
                              padding: '15px',
                              backgroundColor: '#EAEBEB',
                              borderRadius: '8px'
                            }}>
                            พิมพ์บาร์โค้ดส่วนลดสินค้าใกล้หมดอายุตามเกณฑ์
                          </Typography>
                        </Box>
                        <Box mt={4} sx={{ width: '800px' }}>
                          <Box>
                            <Typography
                              variant="h6">รายการสินค้าที่ไม่สามารถพิมพ์ได้</Typography>
                          </Box>
                          <Box>
                            <div style={{ width: '100%' }}
                                 className={classes.MdataGridPaginationTop}>
                              <DataGrid rows={notPrintRows} columns={notPrintColumns}
                                        disableColumnMenu
                                        hideFooter
                                        autoHeight
                                        rowHeight={70}/>
                            </div>
                          </Box>
                        </Box>
                      </div>
                    )
                  }
                  {
                    (values.lstProductPrintAgain != null && values.lstProductPrintAgain.length > 0)
                    && (
                      <div>
                        <Box sx={{ width: '50%' }}>
                          <Typography align='left' sx={{ display: 'flex', width: '100%' }}>
                            เหตุผลที่ทำการพิมพ์บาร์โค้ดซ้ำ
                            <Typography sx={{
                              color: '#F54949',
                              marginRight: '5px'
                            }}> * </Typography> :
                          </Typography>
                          <FormControl fullWidth className={classes.Mselect}>
                            {
                              stringNullOrEmpty(reasonForReprint) ? (
                                <InputLabel disableAnimation shrink={false} focused={false}
                                            sx={{
                                              color: '#C1C1C1',
                                              marginTop: '-8px',
                                              fontSize: '14px'
                                            }}
                                            id='reasonPlaceholder'>
                                  กรุณาเลือกเหตุผล
                                </InputLabel>
                              ) : null
                            }
                            <Select
                              id="reasonForReprint"
                              name="reasonForReprint"
                              value={reasonForReprint}
                              onChange={(e) => {
                                setReasonForReprint(e.target.value)
                              }}
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                              <MenuItem
                                value={'1'}>{'พิมพ์บาร์โค้ดส่วนลดทดแทนที่ชำรุด'}</MenuItem>
                              <MenuItem
                                value={'2'}>{'พิมพ์บาร์โค้ดส่วนลดทดแทนที่สูญหาย'}</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Box mt={4} sx={{ width: '800px' }}>
                          <Box>
                            <div style={{ width: '100%' }}
                                 className={classes.MdataGridPaginationTop}>
                              <DataGrid rows={printAgainRows} columns={printAgainColumns}
                                        disableColumnMenu
                                        hideFooter
                                        autoHeight
                                        rowHeight={70}/>
                            </div>
                          </Box>
                        </Box>
                      </div>
                    )
                  }
                </DialogContent>
              </div>
            )
        }

        <DialogActions sx={{ justifyContent: 'center', mb: 5, mr: 5, ml: 5, mt: 1 }}>
          <Button
            id="btnCancle"
            variant="contained"
            color="cancelColor"
            sx={{ borderRadius: 2, width: 80, mr: 4 }}
            onClick={onClose}
          >
            ยกเลิก
          </Button>
          <Button
            id="btnConfirm"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, width: 80 }}
            onClick={handleConfirm}
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      <LoadingModal open={openLoadingModal.open}/>
    </div>
  );
}
