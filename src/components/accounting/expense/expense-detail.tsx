import { Box, Button, Dialog, DialogContent, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import AccordionUploadFile from '../../commons/ui/accordion-upload-file';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import Steppers from '../../commons/ui/steppers';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ControlPoint from '@mui/icons-material/ControlPoint';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpenseDetailSummary from './expense-detail-summary';
import ModalAddExpense from './modal-add-expense';
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
  const [showAddExpense, setShowAddExpense] = React.useState(false);

  const handleClose = () => {};
  const handleOnChangeUploadFile = (status: boolean) => {};

  const OnCloseAddExpense = () => {
    setShowAddExpense(false);
  };
  const handleAddExpenseTransactionBtn = () => {
    setShowAddExpense(true);
  };
  const handleSaveBtn = () => {};
  const handleApproveBtn = () => {};

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
            sx={{ width: 200 }}>
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
            sx={{ width: 200 }}>
            ขออนุมัติ
          </Button>
        </Grid>
      </Grid>
    </>
  );

  useEffect(() => {
    setTitle(1 ? 'รายละเอียดเอกสารค่าใช้จ่ายร้านกาแฟ' : 2 ? 'รายละเอียดเอกสารค่าใช้จ่ายหน้าร้าน' : 'รายละเอียดเอกสาร');
  }, [isOpen]);
  return (
    <React.Fragment>
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={onClickClose}>
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
              <Typography variant='body2'>แนบเอกสารจากสาขา:</Typography>
            </Grid>
            <Grid item xs={3}>
              <AccordionUploadFile
                files={[]}
                docNo={'docNo'}
                docType='PN'
                isStatus={uploadFileFlag}
                onChangeUploadFile={handleOnChangeUploadFile}
                enabledControl={true}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography variant='body2'>แนบเอกสารแก้ไข:</Typography>
            </Grid>
            <Grid item xs={3}>
              <AccordionUploadFile
                files={[]}
                docNo={'docNo'}
                docType='PN'
                isStatus={uploadFileFlag}
                onChangeUploadFile={handleOnChangeUploadFile}
                enabledControl={true}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography variant='body2'>แนบเอกสารOC:</Typography>
            </Grid>
            <Grid item xs={3}>
              <AccordionUploadFile
                files={[]}
                docNo={'docNo'}
                docType='PN'
                isStatus={uploadFileFlag}
                onChangeUploadFile={handleOnChangeUploadFile}
                enabledControl={true}
              />
            </Grid>
          </Grid>
          <Box>{componetButtonDraft}</Box>
          <Box mb={3} mt={3}>
            <ExpenseDetailSummary />
          </Box>
        </DialogContent>
      </Dialog>
      <ModalAddExpense open={showAddExpense} onClose={OnCloseAddExpense} />
    </React.Fragment>
  );
}

export default ExpenseDetail;
