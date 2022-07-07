import { Box, Button, Dialog, DialogContent, Grid, IconButton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import AccordionUploadFile from '../../commons/ui/accordion-upload-file';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import Steppers from '../../commons/ui/steppers';
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ControlPoint from '@mui/icons-material/ControlPoint';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpenseDetailSummary from './expense-detail-summary';
import ModalAddExpense from './modal-add-expense';
import ModelDescriptionExpense from './modal-description-expense';
import { mockExpenseInfo, mockExpenseInfoNoActive } from '../../../mockdata/branch-accounting';
import AccordionHuaweiFile from '../../commons/ui/accordion-huawei-file';
import { Cancel } from '@mui/icons-material';
import { GridColumnHeadersItemCollection } from '@mui/x-data-grid';
import ModelConfirmDetail from './confirm/modal-confirm-detail';

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
  expenseType: number;
}
function ExpenseDetail({ isOpen, onClickClose, expenseType }: Props) {
  const [open, setOpen] = React.useState(isOpen);
  const classes = useStyles();
  const _ = require('lodash');
  const dispatch = useAppDispatch();
  const [titleName, setTitle] = React.useState('รายละเอียดเอกสาร');
  const [uploadFileFlag, setUploadFileFlag] = React.useState(false);
  const [openModalAddExpense, setOpenModalAddExpense] = React.useState(false);
  const [openModalDescriptionExpense, setOpenModalDescriptionExpense] = React.useState(false);

  const handleClose = () => {};
  const handleOnChangeUploadFileSave = (status: boolean) => {
    setUploadFileFlag(status);
  };
  const handleOnChangeUploadFileEdit = (status: boolean) => {
    setUploadFileFlag(status);
  };
  const handleOnChangeUploadFileOC = (status: boolean) => {
    setUploadFileFlag(status);
  };

  const OnCloseAddExpense = () => {
    setOpenModalAddExpense(false);
  };
  const handleAddExpenseTransactionBtn = () => {
    setOpenModalAddExpense(true);
  };
  const handleSaveBtn = () => {};
  const handleApproveBtn = () => {
    handleOpenModelConfirm();
  };
  const handleRejectBtn = () => {};

  const componetButtonDraft = (
    <>
      <Grid item container xs={12} sx={{ mt: 3 }} justifyContent='space-between' direction='row' alignItems='flex-end'>
        <Grid item xl={5}>
          <Button
            data-testid='testid-btnAddItem'
            id='btnAddItem'
            variant='contained'
            color='info'
            className={classes.MbtnPrint}
            onClick={handleAddExpenseTransactionBtn}
            startIcon={<ControlPoint />}
            sx={{ width: 200 }}>
            เพิ่มรายการจ่าย
          </Button>
        </Grid>
        <Grid item>
          <Button
            data-testid='testid-btnSave'
            id='btnSave'
            variant='contained'
            color='warning'
            className={classes.MbtnSave}
            onClick={handleSaveBtn}
            startIcon={<SaveIcon />}
            sx={{ width: 140 }}>
            บันทึก
          </Button>

          <Button
            data-testid='testid-btnSendToDC'
            id='btnSendToDC'
            variant='contained'
            color='primary'
            className={classes.MbtnSendDC}
            onClick={handleApproveBtn}
            startIcon={<CheckCircleOutline />}
            sx={{ width: 140 }}>
            ขออนุมัติ
          </Button>
        </Grid>
      </Grid>
    </>
  );

  const componetButtonApprove = (
    <>
      <Grid item container xs={12} sx={{ mt: 3 }} justifyContent='space-between' direction='row' alignItems='flex-end'>
        <Grid item xl={5}></Grid>
        <Grid item>
          <Button
            data-testid='testid-btnApprove'
            id='btnApprove'
            variant='contained'
            color='primary'
            className={classes.MbtnSendDC}
            onClick={handleApproveBtn}
            startIcon={<CheckCircleOutline />}
            sx={{ width: 140 }}>
            ขออนุมัติ
          </Button>

          <Button
            data-testid='testid-btnSendToDC'
            id='btnSendToDC'
            variant='contained'
            color='error'
            className={classes.MbtnSendDC}
            onClick={handleRejectBtn}
            startIcon={<Cancel />}
            sx={{ width: 140 }}>
            ไม่อนุมัติ
          </Button>
        </Grid>
      </Grid>
    </>
  );

  useEffect(() => {
    setTitle(1 ? 'รายละเอียดเอกสารค่าใช้จ่ายร้านกาแฟ' : 2 ? 'รายละเอียดเอกสารค่าใช้จ่ายหน้าร้าน' : 'รายละเอียดเอกสาร');
  }, [isOpen]);

  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
  const [textHeaderConfirm, setTextHeaderConfirm] = React.useState('');
  const handleOpenModelConfirm = () => {
    setTextHeaderConfirm('Tessssst');
    setOpenModelConfirm(true);
  };

  const handleCloseModelConfirm = () => {
    setOpenModelConfirm(false);
  };

  const handleConfirm = (periodData: any) => {
    console.log('handleConfirm');
    console.log('periodData:', periodData);
  };

  return (
    <React.Fragment>
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={() => {
            setOpen(false);
          }}>
          <Typography sx={{ fontSize: 24, fontWeight: 400 }}>{titleName}</Typography>
          <Steppers status={1} stepsList={['บันทึก', 'สาขา', 'บัญชี', 'อนุมัติ']}></Steppers>
        </BootstrapDialogTitle>
        <DialogContent sx={{ minHeight: '70vh' }}>
          <Grid container spacing={2} mb={2} id='top-item'>
            <Grid item xs={1}>
              <Typography variant='body2'>เลขที่เอกสาร</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='body2'>doc no</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant='body2'>สาขา:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='body2'>จ0101 </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant='body2'>งวด:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='body2'>01/06/2565-15/06/2565</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} mb={2} id='top-item'>
            <Grid item xs={1}>
              <Typography variant='body2'>
                แนบเอกสารจากสาขา{' '}
                <IconButton
                  size='small'
                  onClick={() => setOpenModalDescriptionExpense(true)}
                  id='id-infoIcon'
                  data-testid='testid-infoIcon'>
                  <InfoIcon fontSize='small' />
                </IconButton>
                :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <AccordionUploadFile
                files={[]}
                docNo={'docNo'}
                docType='BA'
                isStatus={uploadFileFlag}
                onChangeUploadFile={handleOnChangeUploadFileSave}
                enabledControl={true}
                idControl={'AttachFileSave'}
              />
              <AccordionHuaweiFile files={[]} />
            </Grid>
            <Grid item xs={1}>
              <Typography variant='body2'>แนบเอกสารแก้ไข:</Typography>
            </Grid>
            <Grid item xs={3}>
              <AccordionUploadFile
                files={[]}
                docNo={'docNo'}
                docType='BA'
                isStatus={uploadFileFlag}
                onChangeUploadFile={handleOnChangeUploadFileEdit}
                enabledControl={true}
                idControl={'AttachFileEdit'}
              />
              <AccordionHuaweiFile files={[]} />
            </Grid>
            <Grid item xs={1}>
              <Typography variant='body2'>แนบเอกสารOC:</Typography>
            </Grid>
            <Grid item xs={3}>
              <AccordionUploadFile
                files={[]}
                docNo={'docNo'}
                docType='BA'
                isStatus={uploadFileFlag}
                onChangeUploadFile={handleOnChangeUploadFileOC}
                enabledControl={true}
                idControl={'AttachFileByOC'}
              />
              <AccordionHuaweiFile files={[]} />
            </Grid>
          </Grid>
          <Box>{componetButtonDraft}</Box>
          <Box>{componetButtonApprove}</Box>
          <Box mb={3} mt={3}>
            <ExpenseDetailSummary />
          </Box>
        </DialogContent>
      </Dialog>
      <ModalAddExpense open={openModalAddExpense} onClose={OnCloseAddExpense} />
      <ModelDescriptionExpense
        open={openModalDescriptionExpense}
        onClickClose={() => setOpenModalDescriptionExpense(false)}
        info={[mockExpenseInfo, mockExpenseInfoNoActive]}
      />

      <ModelConfirmDetail
        open={openModelConfirm}
        onClose={handleCloseModelConfirm}
        onConfirm={handleConfirm}
        startDate='2022-06-16T00:00:00+07:00'
        endDate='2022-06-30T23:59:59.999999999+07:00'
      />
    </React.Fragment>
  );
}

export default ExpenseDetail;
