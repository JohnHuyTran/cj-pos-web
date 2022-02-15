import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useStyles } from '../../styles/makeTheme';
import { Item } from '../../models/stock-transfer-model';
import { BootstrapDialogTitle } from '../commons/ui/dialog-title';
import { Button, Grid, Link, Typography } from '@mui/material';
import Steppers from './steppers';
import Box from '@mui/system/Box';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ControlPoint from '@mui/icons-material/ControlPoint';
import { formatFileStockTransfer, getBranchName, getReasonLabel } from '../../utils/utils';
import { getUserInfo } from '../../store/sessionStore';
import { PERMISSION_GROUP } from '../../utils/enum/permission-enum';
import { DOCUMENT_TYPE } from '../../utils/enum/stock-transfer-enum';
import DatePickerAllComponent from '../commons/ui/date-picker-all';
import TextBoxComment from '../commons/ui/textbox-comment';

import BranchTransferListItem from './stock-transfer-bt-list-item';
import BranchTransferListSKU from './stock-transfer-bt-list-sku';
import ModalShowFile from '../commons/ui/modal-show-file';
import SnackbarStatus from '../commons/ui/snackbar-status';
import AlertError from '../commons/ui/alert-error';
import LoadingModal from '../commons/ui/loading-modal';
import ConfirmModalExit from '../commons/ui/confirm-exit-model';
import ModalConfirmTransaction from './modal-confirm-transaction';
import ModalAddItems from '../commons/ui/modal-add-items';
import { FindProductRequest } from '../../models/product-model';
import { getPathReportBT } from '../../services/stock-transfer';

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

function StockTransferBT({ isOpen, onClickClose }: Props) {
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
  const [open, setOpen] = React.useState(isOpen);
  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const [openModelPreviewDocument, setOpenModelPreviewDocument] = React.useState(false);
  const [pathReport, setPathReport] = React.useState<string>('');
  const [suffixDocType, setSuffixDocType] = React.useState<string>('');
  const [docLayoutLandscape, setDocLayoutLandscape] = React.useState(false);

  const [openModelConfirmTransaction, setOpenModelConfirmTransaction] = React.useState(false);
  const [confirmModelExit, setConfirmModelExit] = React.useState(false);
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = React.useState(false);
  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const [bodyRequest, setBodyRequest] = React.useState<FindProductRequest>();

  React.useEffect(() => {
    const fromBranch = getBranchName(branchList, branchTransferInfo.branchFrom);
    setSourceBranch(fromBranch ? fromBranch : '');

    const toBranch = getBranchName(branchList, branchTransferInfo.branchTo);
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
  }, [open]);

  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };
  const handleClose = async () => {
    setOpen(false);
    onClickClose();
  };

  const handleChangeComment = (value: any) => {
    setComment(value);
  };

  function handleModelPreviewDocument() {
    setOpenModelPreviewDocument(false);
  }

  function handleNotExitModelConfirm() {
    setConfirmModelExit(false);
  }

  function handleExitModelConfirm() {
    setConfirmModelExit(false);
    setOpen(false);
    onClickClose();
  }

  const handleOnCloseModalConfirm = () => {
    setOpenModelConfirmTransaction(false);
  };

  const handleModelAddItems = () => {};
  const handleLinkDocument = (docType: string) => {
    const path = getPathReportBT(docType ? docType : DOCUMENT_TYPE.BT, btNo);
    setSuffixDocType(docType !== DOCUMENT_TYPE.BT ? docType : '');
    setPathReport(path ? path : '');
    setDocLayoutLandscape(docType === DOCUMENT_TYPE.RECALL ? true : false);
    setOpenModelPreviewDocument(true);
  };
  const handleOpenAddItems = () => {};
  const handleSaveBtn = () => {};
  const handleConfirmBtn = () => {};
  const handleSendToPickup = () => {};
  const sendTransactionToDC = async () => {};

  return (
    <React.Fragment>
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          <Typography sx={{ fontSize: 24, fontWeight: 400 }}>ตรวจสอบรายการใบโอน</Typography>
          <Steppers status={branchTransferInfo.status} type='BT'></Steppers>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box mt={4} sx={{ flexGrow: 1 }}>
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

            {isDraft && (
              <Grid container spacing={2} mb={2}>
                <Grid item lg={2}>
                  <Typography variant='body2'> สาเหตุการโอน :</Typography>
                </Grid>
                <Grid item lg={3}>
                  <Typography variant='body2'>{reasons} </Typography>
                </Grid>
                <Grid item lg={1}></Grid>
                <Grid item lg={2}></Grid>
                <Grid item lg={3}>
                  <>
                    <Box>
                      <Link
                        component='button'
                        variant='body2'
                        onClick={(e) => {
                          handleLinkDocument(DOCUMENT_TYPE.BT);
                        }}>
                        เรียกดูเอกสารใบโอน BT
                      </Link>
                    </Box>
                  </>
                </Grid>
                <Grid item lg={1}></Grid>
              </Grid>
            )}

            {!isDraft && !isDC && (
              <Grid container spacing={2} mb={2}>
                <Grid item lg={2}>
                  <Typography variant='body2'> สาเหตุการโอน :</Typography>
                </Grid>
                <Grid item lg={3}>
                  <Typography variant='body2'>{reasons} </Typography>
                </Grid>
                <Grid item lg={1}></Grid>
                <Grid item lg={2}></Grid>
                <Grid item lg={3}>
                  <>
                    <Box>
                      <Link
                        component='button'
                        variant='body2'
                        onClick={(e) => {
                          handleLinkDocument(DOCUMENT_TYPE.BT);
                        }}>
                        เรียกดูเอกสารใบโอน BT
                      </Link>
                    </Box>
                    <Box>
                      <Link
                        component='button'
                        variant='body2'
                        onClick={(e) => {
                          handleLinkDocument(DOCUMENT_TYPE.BO);
                        }}>
                        เรียกดูเอกสารใบ BO
                      </Link>
                    </Box>
                    <Box>
                      <Link
                        component='button'
                        variant='body2'
                        onClick={(e) => {
                          handleLinkDocument(DOCUMENT_TYPE.BOX);
                        }}>
                        เรียกดูเอกสารใบปะลัง
                      </Link>
                    </Box>
                  </>
                </Grid>
                <Grid item lg={1}></Grid>
              </Grid>
            )}
          </Box>
          {isDraft && (
            <Grid
              item
              container
              xs={12}
              sx={{ mt: 3 }}
              justifyContent='space-between'
              direction='row'
              alignItems='flex-end'>
              <Grid item xl={5}>
                <Button
                  id='btnAddItem'
                  variant='contained'
                  color='info'
                  className={classes.MbtnPrint}
                  onClick={handleOpenAddItems}
                  startIcon={<ControlPoint />}
                  sx={{ width: 200 }}>
                  เพิ่มสินค้า
                </Button>
              </Grid>
              <Grid item>
                <Button
                  id='btnSave'
                  variant='contained'
                  color='warning'
                  className={classes.MbtnSave}
                  onClick={handleSaveBtn}
                  startIcon={<SaveIcon />}
                  sx={{ width: 200 }}>
                  บันทึก
                </Button>

                <Button
                  id='btnApprove'
                  variant='contained'
                  color='primary'
                  className={classes.MbtnApprove}
                  onClick={handleConfirmBtn}
                  startIcon={<CheckCircleOutline />}
                  sx={{ width: 200 }}>
                  ส่งงานให้ DC
                </Button>
              </Grid>
            </Grid>
          )}

          {isDC && btStatus === 'READY_TO_TRANSFER' && (
            <Grid
              item
              container
              xs={12}
              sx={{ mt: 3 }}
              justifyContent='space-between'
              direction='row'
              alignItems='flex-end'>
              <Grid item xl={8}>
                <Grid container>
                  <Grid item>
                    <Typography gutterBottom variant='subtitle1' component='div'>
                      รอบรถเข้าต้นทางตั้งแต่
                    </Typography>
                    <DatePickerAllComponent
                      onClickDate={handleStartDatePicker}
                      value={startDate}
                      type={'TO'}
                      minDateTo={new Date(branchTransferInfo.startDate)}
                    />
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item>
                    <Typography gutterBottom variant='subtitle1' component='div'>
                      ถึง
                    </Typography>
                    <DatePickerAllComponent
                      onClickDate={handleEndDatePicker}
                      value={endDate}
                      type={'TO'}
                      minDateTo={startDate}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  id='btnSave'
                  variant='contained'
                  color='warning'
                  className={classes.MbtnSave}
                  onClick={handleSendToPickup}
                  startIcon={<SaveIcon />}
                  sx={{ width: 200 }}>
                  บันทึก
                </Button>
              </Grid>
            </Grid>
          )}
          {isDC && btStatus === 'WAIT_FOR_PICKUP' && (
            <>
              <Grid container spacing={2} mb={2}>
                <Grid item lg={2}>
                  <Typography variant='body2'> รอบรถเข้าต้นทาง :</Typography>
                </Grid>
                <Grid item lg={3}>
                  <Typography variant='body2'>{convertUtcToBkkDate(branchTransferInfo.delivery.fromDate)} </Typography>
                </Grid>
                <Grid item lg={1}></Grid>
                <Grid item lg={2}>
                  <Typography variant='body2'>ถึง :</Typography>
                </Grid>
                <Grid item lg={3}>
                  <Typography variant='body2'>{convertUtcToBkkDate(branchTransferInfo.delivery.toDate)} </Typography>
                </Grid>
                <Grid item lg={1}></Grid>
              </Grid>

              <Grid container spacing={2} mb={2}>
                <Grid item lg={2}></Grid>
                <Grid item lg={3}></Grid>
                <Grid item lg={1}></Grid>
                <Grid item lg={2}></Grid>
                <Grid item lg={3}>
                  <Link
                    component='button'
                    variant='body2'
                    onClick={(e) => {
                      handleLinkDocument(DOCUMENT_TYPE.RECALL);
                    }}>
                    เรียกดูเอกสารใบเรียกเก็บ
                  </Link>
                </Grid>
                <Grid item lg={1}></Grid>
              </Grid>
            </>
          )}

          <BranchTransferListSKU />
          <Box mt={6}></Box>
          <BranchTransferListItem />

          <Box mt={3}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={4}>
                <TextBoxComment
                  fieldName='สาเหตุการเปลี่ยนจำนวน:'
                  defaultValue={comment}
                  maxLength={100}
                  onChangeComment={handleChangeComment}
                  isDisable={!isDraft}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      <SnackbarStatus
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        isSuccess={snackbarIsStatus}
        contentMsg={contentMsg}
      />

      <ConfirmModalExit
        open={confirmModelExit}
        onClose={handleNotExitModelConfirm}
        onConfirm={handleExitModelConfirm}
      />

      <ModalConfirmTransaction
        open={openModelConfirmTransaction}
        onClose={handleOnCloseModalConfirm}
        handleConfirm={sendTransactionToDC}
        header='ยืนยันส่งรายการให้ DC'
        title='เลขที่เอกสาร BT'
        value={btNo}
      />

      <ModalAddItems
        open={openModelAddItems}
        onClose={handleModelAddItems}
        requestBody={bodyRequest ? bodyRequest : { skuCodes: [] }}></ModalAddItems>
      <LoadingModal open={openLoadingModal} />
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
      <ModalShowFile
        open={openModelPreviewDocument}
        onClose={handleModelPreviewDocument}
        url={pathReport}
        statusFile={1}
        sdImageFile={''}
        fileName={formatFileStockTransfer(btNo, btStatus, suffixDocType)}
        btnPrintName='พิมพ์เอกสาร'
        landscape={docLayoutLandscape}
      />
    </React.Fragment>
  );
}

export default StockTransferBT;
