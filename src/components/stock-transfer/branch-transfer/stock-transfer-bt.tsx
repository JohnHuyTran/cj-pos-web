import React, { useCallback } from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import store, { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import { BranchTransferRequest, Delivery, Item, ItemGroups, StockBalanceType } from '../../../models/stock-transfer-model';
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Link, Typography } from '@mui/material';
import Steppers from '../steppers';
import Box from '@mui/system/Box';
import { convertUtcToBkkDate } from '../../../utils/date-utill';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ControlPoint from '@mui/icons-material/ControlPoint';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { formatFileStockTransfer, getBranchName, getReasonLabel } from '../../../utils/utils';
import { getUserInfo } from '../../../store/sessionStore';
import { PERMISSION_GROUP } from '../../../utils/enum/permission-enum';
import { DOCUMENT_TYPE } from '../../../utils/enum/stock-transfer-enum';
import DatePickerAllComponent from '../../commons/ui/date-picker-all';
import TextBoxComment from '../../commons/ui/textbox-comment';


import ModalShowFile from '../../commons/ui/modal-show-file';
import SnackbarStatus from '../../commons/ui/snackbar-status';
import AlertError from '../../commons/ui/alert-error';
import LoadingModal from '../../commons/ui/loading-modal';
import ConfirmModalExit from '../../commons/ui/confirm-exit-model';
import ModalConfirmTransaction from '../modal-confirm-transaction';
import ModalAddItems from '../../commons/ui/modal-add-items';
import { FindProductRequest } from '../../../models/product-model';
import {
  getPathReportBT,
  sendBranchTransferToDC,
  sendBranchTransferToPickup,
  submitStockTransfer,
  checkStockBalance,
  saveBranchTransfer,
} from '../../../services/stock-transfer';
import theme from '../../../styles/theme';
import { featchPurchaseNoteAsync } from '../../../store/slices/supplier-order-return-slice';
import { FileType } from '../../../models/supplier-check-order-model';
import { featchSearchStockTransferAsync } from '../../../store/slices/stock-transfer-slice';
import { ApiError } from '../../../models/api-error-model';
import { GridRowData } from '@mui/x-data-grid';
import { featchBranchTransferDetailAsync } from '../../../store/slices/stock-transfer-branch-request-slice';
import moment from 'moment';
import { env } from 'process';
import { updateAddItemsState } from '../../../store/slices/add-items-slice';
import { updateAddItemSkuGroupState } from '../../../store/slices/stock-transfer-bt-sku-slice';
import { isGroupBranch } from '../../../utils/role-permission';
import AccordionUploadFile from '../../commons/ui/accordion-upload-file';
import AccordionHuaweiFile from '../../commons/ui/accordion-huawei-file';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import BranchTransferListSKU from './stock-transfer-bt-sku';
interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

function StockTransferBT({ isOpen, onClickClose }: Props) {
  const [open, setOpen] = React.useState(isOpen);
  const classes = useStyles();
  const _ = require('lodash');
  const dispatch = useAppDispatch();
  const branchTransferRslList = useAppSelector((state) => state.branchTransferDetailSlice.branchTransferRs);
  const reasonsList = useAppSelector((state) => state.transferReasonsList.reasonsList.data);
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const payloadSearch = useAppSelector((state) => state.saveSearchStock.searchStockTransfer);

  const branchTransferInfo: any = branchTransferRslList.data ? branchTransferRslList.data : null;
  const [branchTransferItems, setBranchTransferItems] = React.useState<Item[]>(
    branchTransferInfo.items ? branchTransferInfo.items : []
  );

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [sourceBranch, setSourceBranch] = React.useState('');
  const [destinationBranch, setDestinationBranch] = React.useState('');
  const [btNo, setBtNo] = React.useState('');
  const [btStatus, setBtStatus] = React.useState<string>('CREATED');
  const [reasons, setReasons] = React.useState('');
  const [isDraft, setIsDraft] = React.useState(false);
  const [isDC, setIsDC] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [isChecked, setIschecked] = React.useState(true);
  const [skuNameDisplay, setSkuNameDisplay] = React.useState<string>(branchTransferInfo.itemGroups[0].productName);
  const [skuCodeSelect, setSkuCodeSelect] = React.useState<string>('');
  const [defaultSkuSelected, setDefaultSkuSelected] = React.useState<string>(branchTransferInfo.itemGroups[0].skuCode);
  const onClickSku = (skuCode: string) => {
    if (skuCode) {
      setDefaultSkuSelected(skuCode);
      const sku: ItemGroups = branchTransferInfo.itemGroups.find((item: ItemGroups, index: number) => {
        return skuCode === item.skuCode;
      });
      setSkuNameDisplay(sku.productName ? sku.productName : '');
    }
    setSkuCodeSelect(skuCode);
    setIschecked(false);
  };


  const [skuList, setSkuList] = React.useState<ItemGroups[]>([]);
  const [itemList, setItemList] = React.useState<Item[]>([]);
  const topFunction = () => {
    document.getElementById('top-item')?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  };
  const handleClose = ()=>{}
  const handleChangeComment =()=>{}
  const handleCheckboxChange = ()=>{}
  const onUpdateItemsList = (item: Item[]) => {
    setItemList(item);
  };

  React.useEffect(() => {
    const fromBranch = `${branchTransferInfo.branchFrom}-${getBranchName(branchList, branchTransferInfo.branchFrom)}`;
    setSourceBranch(fromBranch ? fromBranch : '');

    const toBranch = `${branchTransferInfo.branchTo}-${getBranchName(branchList, branchTransferInfo.branchTo)}`;
    setDestinationBranch(toBranch ? toBranch : '');

    const reason = getReasonLabel(reasonsList, branchTransferInfo.transferReason);
    setReasons(reason ? reason : '');
    setBtNo(branchTransferInfo.btNo);
    setBtStatus(branchTransferInfo.status);
    setComment(branchTransferInfo.comment);

    setIsDraft(branchTransferInfo.status === 'CREATED' ? true : false);
    setIsDC(getUserInfo().group === PERMISSION_GROUP.DC);
    setStartDate(new Date(branchTransferInfo.startDate));
    setEndDate(new Date(branchTransferInfo.endDate));
    // dispatch(updateAddItemSkuGroupState(branchTransferInfo.itemGroups));
    setSkuList(branchTransferInfo.itemGroups);
  }, [open]);
    return (
        <React.Fragment>
          <Dialog open={open} maxWidth='xl' fullWidth={true}>
            <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
              <Typography sx={{ fontSize: 24, fontWeight: 400 }}>ตรวจสอบรายการใบโอน</Typography>
              <Steppers status={branchTransferInfo.status} type='BT'></Steppers>
            </BootstrapDialogTitle>
            <DialogContent>
              <Box mt={4} sx={{ flexGrow: 1 }} id='top-item'>
                <Grid container spacing={2} mb={2}>
                  <Grid item lg={2}>
                    <Typography variant='body2'>เลขที่เอกสาร BT</Typography>
                  </Grid>
                  <Grid item lg={3}>
                    <Typography variant='body2'>{branchTransferInfo.btNo}</Typography>
                  </Grid>
                  <Grid item lg={1}></Grid>
                  <Grid item lg={2}>
                    <Typography variant='body2'>เลขที่เอกสาร RT</Typography>
                  </Grid>
                  <Grid item lg={3}>
                    <Typography variant='body2'>{branchTransferInfo.rtNo}</Typography>
                  </Grid>
                  <Grid item lg={1}></Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item lg={2}>
                    <Typography variant='body2'>วันที่โอน :</Typography>
                  </Grid>
                  <Grid item lg={3}>
                    <Typography variant='body2'>{convertUtcToBkkDate(branchTransferInfo.startDate)}</Typography>
                  </Grid>
                  <Grid item lg={1}></Grid>
                  <Grid item lg={2}>
                    <Typography variant='body2'>วันที่สิ้นสุด :</Typography>
                  </Grid>
                  <Grid item lg={3}>
                    <Typography variant='body2'>{convertUtcToBkkDate(branchTransferInfo.endDate)}</Typography>
                  </Grid>
                  <Grid item lg={1}></Grid>
                </Grid>
    
                <Grid container spacing={2} mb={2}>
                  <Grid item lg={2}>
                    <Typography variant='body2'> สาขาต้นทาง :</Typography>
                  </Grid>
                  <Grid item lg={3}>
                    <Typography variant='body2'>{sourceBranch} </Typography>
                  </Grid>
                  <Grid item lg={1}></Grid>
                  <Grid item lg={2}>
                    <Typography variant='body2'>สาขาปลายทาง :</Typography>
                  </Grid>
                  <Grid item lg={3}>
                    <Typography variant='body2'>{destinationBranch} </Typography>
                  </Grid>
                  <Grid item lg={1}></Grid>
                </Grid>
              </Box>

    
              
              <Box mt={6}>
                {' '}
                <Typography>
                  รายการสินค้า: {isChecked && 'รายการสินค้าทั้งหมด'} {!isChecked && `${skuNameDisplay} (${skuCodeSelect})`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }} mt={1}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    checked={isChecked}
                    label='รายการสินค้าทั้งหมด'
                    onChange={handleCheckboxChange}
                  />
                </FormGroup>
              </Box>
    
<BranchTransferListSKU onSelectSku={onClickSku} skuList={skuList} onUpdateItemList={onUpdateItemsList}/>
    
              <Box mt={3}>
                <Grid container spacing={2} mb={1}>
                  <Grid item lg={3}>
                    <TextBoxComment
                      fieldName='สาเหตุการเปลี่ยนจำนวน:'
                      defaultValue={comment}
                      maxLength={100}
                      onChangeComment={handleChangeComment}
                      isDisable={isGroupBranch() && isDraft ? false : true}
                      rowDisplay={2}
                    />
                  </Grid>
                  <Grid item xs={7}></Grid>
                  <Grid item xs={2} textAlign='center'>
                    <IconButton onClick={topFunction}>
                      <ArrowForwardIosIcon
                        sx={{
                          fontSize: '41px',
                          padding: '6px',
                          backgroundColor: '#C8E8FF',
                          transform: 'rotate(270deg)',
                          color: '#fff',
                          borderRadius: '50%',
                        }}
                      />
                    </IconButton>
    
                    <Box fontSize='13px'>กลับขึ้นด้านบน</Box>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
          </Dialog>
    

        </React.Fragment>
  )
}

export default StockTransferBT