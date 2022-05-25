import React, { ReactElement, useEffect } from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { BootstrapDialogTitle } from '../commons/ui/dialog-title';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import ModelConfirm from './modal-confirm';
import SnackbarStatus from '../commons/ui/snackbar-status';
import { ContentPaste } from '@mui/icons-material';
import store, { useAppDispatch, useAppSelector } from '../../store/store';
import { getDCStatus, getSdType } from '../../utils/utils';
import DCOrderDetailList from './dc-check-order-detail-list';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import ModalShowFile from '../commons/ui/modal-show-file';
import LoadingModal from '../commons/ui/loading-modal';
import { useStyles } from '../../styles/makeTheme';
import { FormControl, MenuItem, Select, TextField } from '@mui/material';
import { featchOrderListDcAsync } from '../../store/slices/dc-check-order-slice';
import { isAllowActionPermission } from '../../utils/role-permission';
import { ACTIONS } from '../../utils/enum/permission-enum';
import AccordionHuaweiFile from '../commons/ui/accordion-huawei-file';
import { featchorderDetailDCAsync, setReloadScreen } from '../../store/slices/dc-check-order-detail-slice';
import TextBoxComment from '../commons/ui/textbox-comment';

interface Props {
  isOpen: boolean;
  idDC: string;
  onClickClose: () => void;
}

interface loadingModalState {
  open: boolean;
}

function DCOrderDetail({ isOpen, idDC, onClickClose }: Props): ReactElement {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const orderDetailList = useAppSelector((state) => state.dcCheckOrderDetail.orderDetail);
  const reasonNoApproveList = useAppSelector((state) => state.transferReasonsList.reasonsList.data);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });
  const [valueCommentDC, setValueCommentDC] = React.useState('');
  const [errorCommentDC, setErrorCommentDC] = React.useState(false);

  const [open, setOpen] = React.useState(isOpen);
  const [openModelPreviewDocument, setOpenModelPreviewDocument] = React.useState(false);

  const [statusFile, setStatusFile] = React.useState(0);
  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);

  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');

  const [approveDCStatus, setApproveDCStatus] = React.useState(false);

  const [characterCount, setCharacterCount] = React.useState(0);
  const [disableCheckBtn, setDisableCheckBtn] = React.useState(true);
  const detailDC: any = orderDetailList.data ? orderDetailList.data : null;
  const detailDCItems = detailDC.items ? detailDC.items : [];

  const [idVerify, setIDVerify] = React.useState(idDC);
  const [isTote, setIsTote] = React.useState(false);
  const [isShowApproveFlow, setIsShowApproveFlow] = React.useState(false);

  useEffect(() => {
    setDisableCheckBtn(isAllowActionPermission(ACTIONS.ORDER_VER_MANAGE));
    setOpen(isOpen);
    setValueCommentDC(detailDC.dcComment);
    setIDVerify(detailDC.id);
    setIsTote(detailDC.sdType === 0 ? true : false);
  }, [open, detailDC]);

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleChangeComment = (value: any) => {
    setValueCommentDC(value);
  };

  const handleClearComment = () => {
    setValueCommentDC('');
  };

  const handlCheckedButton = () => {
    if (valueCommentDC !== '') {
      setErrorCommentDC(false);
      setOpenModelConfirm(true);
    } else {
      setErrorCommentDC(true);
    }
  };

  const handleLinkDocument = () => {
    setStatusFile(0);
    setOpenModelPreviewDocument(true);
  };

  const handleModelPreviewDocument = () => {
    setOpenModelPreviewDocument(false);
  };

  const handleModelConfirm = () => {
    setOpenModelConfirm(false);
  };

  const payloadSearchDC = useAppSelector((state) => state.saveSearchOrderDc.searchCriteriaDc);

  const handleGenerateBOStatus = async (issuccess: boolean, errorMsg: string) => {
    handleOpenLoading('open', true);
    const isRefreshScreen = store.getState().dcCheckOrderDetail.isReloadScreen;
    const msg = issuccess ? 'ตรวจสอบผลต่าง(DC) สำเร็จ' : errorMsg;
    setShowSnackBar(true);
    setContentMsg(msg);
    setApproveDCStatus(issuccess);
    if (issuccess && !isRefreshScreen) {
      await dispatch(featchOrderListDcAsync(payloadSearchDC));
      setTimeout(() => {
        handleClose();
      }, 500);
    } else if (issuccess && isRefreshScreen) {
      await dispatch(featchOrderListDcAsync(payloadSearchDC));
      const itemId = store.getState().dcCheckOrderDetail.itemId;
      await dispatch(featchorderDetailDCAsync(itemId));
      handleOpenLoading('open', false);
      setTimeout(() => {
        handleCloseSnackBar();
      }, 500);
      await dispatch(setReloadScreen(false));
    } else {
      handleOpenLoading('open', false);
    }
  };

  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  const handleClose = async () => {
    const isRefreshScreen = store.getState().dcCheckOrderDetail.isReloadScreen;
    if (isRefreshScreen) {
      handleOpenLoading('open', true);
      const itemId = store.getState().dcCheckOrderDetail.itemId;
      await dispatch(featchorderDetailDCAsync(itemId));
      await dispatch(setReloadScreen(false));
      handleOpenLoading('open', false);
    } else {
      setOpen(false);
      onClickClose();
    }
  };

  const [values, setValues] = React.useState();
  const handleChange = (event: any) => {
    const value = event.target.value;
  };

  return (
    <div>
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          <Typography sx={{ fontSize: '1em' }}>ตรวจสอบผลต่าง (DC)</Typography>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item xs={2}>
                <Typography variant='body2'>เลขที่เอกสาร:</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body2'>{detailDC.docRefNo}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='body2'>สถานะการตรวจสอบผลต่าง:</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body2'>{getDCStatus(detailDC.verifyDCStatus)}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item xs={2}>
                <Typography variant='body2'>เลขที่เอกสาร SD:</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body2'>{detailDC.sdNo}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='body2'>ประเภท:</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body2'>{getSdType(detailDC.sdType)}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item xs={2}>
                <Typography variant='body2'>สาขาต้นทาง:</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body2'>{`${detailDC.shipBranchFrom.code}-${detailDC.shipBranchFrom.name}`}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='body2'>สาขาปลายทาง:</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body2'>{`${detailDC.shipBranchTo.code}-${detailDC.shipBranchTo.name}`}</Typography>
              </Grid>
            </Grid>
            {!isShowApproveFlow && (
              <>
                <Grid container spacing={2} mb={1}>
                  <Grid item xs={2}>
                    <Typography variant='body2'>วันที่:</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant='body2'>{convertUtcToBkkDate(detailDC.receivedDate)}</Typography>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4}></Grid>
                </Grid>
                <Grid container spacing={2} mb={1}>
                  <Grid item xs={2}>
                    <Typography variant='body2'>หมายเหตุ:</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextBoxComment
                      fieldName=''
                      defaultValue={valueCommentDC}
                      maxLength={100}
                      onChangeComment={handleChangeComment}
                      isDisable={detailDC.verifyDCStatus !== 0}
                      rowDisplay={2}
                      isError={errorCommentDC}
                      hypterText='กรุณากรอก หมายเหตุ'
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant='body2'>แนบเอกสาร:</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    {detailDC.files && detailDC.files.length > 0 && <AccordionHuaweiFile files={detailDC.files} />}
                  </Grid>
                </Grid>
              </>
            )}
            {isShowApproveFlow && (
              <>
                <Grid container spacing={2} mb={1}>
                  <Grid item xs={2}>
                    <Typography variant='body2'>วันที่:</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant='body2'>{convertUtcToBkkDate(detailDC.receivedDate)}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    เหตุผล-การแก้ไข:
                  </Grid>
                  <Grid item xs={4}>
                    {' '}
                    <FormControl fullWidth className={classes.Mselect}>
                      <Select
                        id='selPiType'
                        name='statuses'
                        value={values.statuses}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'Without label' }}>
                        <MenuItem value={''} selected={true}>
                          กรุณาระบุเหตุผล
                        </MenuItem>
                        {reasonNoApproveList.map((reason) => (
                          <MenuItem key={reason.id} value={reason.code}>
                            {reason.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={1}>
                  <Grid item xs={2}>
                    <Typography variant='body2'>หมายเหตุ:</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextBoxComment
                      fieldName=''
                      defaultValue={valueCommentDC}
                      maxLength={100}
                      onChangeComment={handleChangeComment}
                      isDisable={detailDC.verifyDCStatus !== 0}
                      rowDisplay={2}
                      isError={errorCommentDC}
                      hypterText='กรุณากรอก หมายเหตุ'
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant='body2'>แนบเอกสาร:</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    {detailDC.files && detailDC.files.length > 0 && <AccordionHuaweiFile files={detailDC.files} />}
                  </Grid>
                </Grid>
              </>
            )}

            <Grid container spacing={2} justifyContent='right' sx={{ mt: 1 }}>
              <Grid item>
                {detailDC.verifyDCStatus === 0 && (
                  <Button
                    id='btnChecked'
                    variant='contained'
                    color='primary'
                    startIcon={<ContentPaste />}
                    onClick={handlCheckedButton}
                    sx={{
                      borderRadius: '5px',
                      width: '200px',
                      padding: '8px',
                      display: `${disableCheckBtn ? 'none' : ''}`,
                    }}>
                    ยืนยันยอด
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
          {detailDCItems !== [] && (
            <DCOrderDetailList items={detailDCItems} clearCommment={handleClearComment} isTote={isTote} />
          )}
        </DialogContent>
      </Dialog>

      <ModelConfirm
        open={openModelConfirm}
        onClose={handleModelConfirm}
        onUpdateAction={handleGenerateBOStatus}
        idDC={idVerify}
        sdNo={detailDC.sdNo}
        docRefNo={detailDC.docRefNo}
        comment={valueCommentDC}
      />

      <SnackbarStatus
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        isSuccess={approveDCStatus}
        contentMsg={contentMsg}
      />

      {/* <ModalShowFile
        open={openModelPreviewDocument}
        onClose={handleModelPreviewDocument}
        file={detailDC.sdImageFile}
      /> */}

      {/* <ModalShowFile
        open={openModelPreviewDocument}
        onClose={handleModelPreviewDocument}
        url=''
        statusFile={statusFile}
        sdImageFile={detailDC.sdImageFile}
        fileName=''
        btnPrintName=''
      /> */}

      <LoadingModal open={openLoadingModal.open} />
    </div>
  );
}

export default DCOrderDetail;
