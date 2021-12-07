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
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getDCStatus, getSdType } from '../../utils/utils';
import DCOrderDetailList from './dc-check-order-detail-list';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import ModalShowFile from '../commons/ui/modal-show-file';
import LoadingModal from '../commons/ui/loading-modal';
import { useStyles } from '../../styles/makeTheme';
import { TextField } from '@mui/material';
import { featchOrderListDcAsync } from '../../store/slices/dc-check-order-slice';

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

  useEffect(() => {
    setOpen(isOpen);
    setValueCommentDC(detailDC.dcComment);
  }, [open]);

  const detailDC: any = orderDetailList.data ? orderDetailList.data : null;
  const detailDCItems = detailDC.items ? detailDC.items : [];

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleChangeCommentDC = (event: any) => {
    const value = event.target.value;
    const length = event.target.value.length;
    if (length <= 100) {
      setCharacterCount(event.target.value.length);
      setValueCommentDC(value);
    }
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
    const msg = issuccess ? 'ตรวจสอบผลต่าง(DC) สำเร็จ' : errorMsg;
    setShowSnackBar(true);
    setContentMsg(msg);
    setApproveDCStatus(issuccess);
    if (issuccess) {
      await dispatch(featchOrderListDcAsync(payloadSearchDC));
      setTimeout(() => {
        handleClose();
      }, 500);
    } else {
      handleOpenLoading('open', false);
    }
  };

  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  const handleClose = () => {
    setOpen(false);
    onClickClose();
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography sx={{ fontSize: '1em' }}>ตรวจสอบผลต่าง (DC)</Typography>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร LD:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{detailDC.shipmentNo}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">สถานะการตรวจสอบผลต่าง:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{getDCStatus(detailDC.verifyDCStatus)}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร SD:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{detailDC.sdNo}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">ประเภท:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{getSdType(detailDC.sdType)}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">วันที่:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{convertUtcToBkkDate(detailDC.receivedDate)}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">
                  แนบเอกสารใบส่วนต่าง
                  <br />
                  หลังเซ็นต์:
                </Typography>
              </Grid>
              <Grid item lg={4}>
                <Link component="button" variant="body2" onClick={handleLinkDocument}>
                  ดูเอกสาร
                </Link>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">หมายเหตุ DC:</Typography>
              </Grid>
              <Grid item lg={4}>
                {/* {detailDC.verifyDCStatus === 0 && ( */}
                <div>
                  <TextField
                    multiline
                    fullWidth
                    rows={4}
                    onChange={handleChangeCommentDC}
                    defaultValue={valueCommentDC}
                    placeholder="ความยาวไม่เกิน 100 ตัวอักษร"
                    className={classes.MtextFieldRemark}
                    inputProps={{ maxLength: 100 }}
                    error={errorCommentDC === true}
                    helperText={errorCommentDC === true ? 'กรุณากรอก หมายเหตุ' : ' '}
                    disabled={detailDC.verifyDCStatus !== 0}
                    sx={{ maxWidth: 300 }}
                  />

                  {detailDC.verifyDCStatus === 0 && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#AEAEAE',
                        width: '100%',
                        maxWidth: 300,
                        textAlign: 'right',
                        marginTop: '-1.5em',
                      }}
                    >
                      {characterCount}/100
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="right" sx={{ mt: 1 }}>
              <Grid item>
                {detailDC.verifyDCStatus === 0 && (
                  <Button
                    id="btnChecked"
                    variant="contained"
                    color="primary"
                    startIcon={<ContentPaste />}
                    onClick={handlCheckedButton}
                    sx={{
                      borderRadius: '5px',
                      width: '200px',
                      padding: '8px',
                    }}
                  >
                    ตรวจสอบแล้ว
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
          {detailDCItems !== [] && <DCOrderDetailList items={detailDCItems} />}
        </DialogContent>
      </Dialog>

      <ModelConfirm
        open={openModelConfirm}
        onClose={handleModelConfirm}
        onUpdateAction={handleGenerateBOStatus}
        idDC={idDC}
        sdNo={detailDC.sdNo}
        shipmentNo={detailDC.shipmentNo}
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

      <ModalShowFile
        open={openModelPreviewDocument}
        onClose={handleModelPreviewDocument}
        url=""
        statusFile={statusFile}
        sdImageFile={detailDC.sdImageFile}
        fileName=""
      />

      <LoadingModal open={openLoadingModal.open} />
    </div>
  );
}

export default DCOrderDetail;
