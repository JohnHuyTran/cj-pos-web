import { Box, Button, Dialog, DialogContent, Grid, IconButton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import store, { useAppDispatch, useAppSelector } from '../../../store/store';
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

import AccordionHuaweiFile from '../../commons/ui/accordion-huawei-file';
import { Cancel } from '@mui/icons-material';
import { GridColumnHeadersItemCollection } from '@mui/x-data-grid';
import { mockExpenseInfo001, mockExpenseInfo002 } from '../../../mockdata/branch-accounting';
import {
  ExpenseByDay,
  ExpenseInfo,
  ExpenseItem,
  ExpensePeriod,
  ExpenseSummaryItem,
} from '../../../models/branch-accounting-model';
import { initialItems, updateItemRows, updateSummaryRows } from '../../../store/slices/accounting/accounting-slice';
import { getBranchName } from '../../../utils/utils';
import { convertUtcToBkkDate } from '../../../utils/date-utill';
import { getInit, getUserInfo } from '../../../store/sessionStore';
import { env } from '../../../adapters/environmentConfigs';
import { EXPENSE_TYPE, STATUS } from '../../../utils/enum/accounting-enum';
interface Props {
  isOpen: boolean;
  onClickClose: () => void;
  expenseType: string;
  edit: boolean;
  periodProps?: ExpensePeriod;
}
function ExpenseDetail({ isOpen, onClickClose, expenseType, edit, periodProps }: Props) {
  const [open, setOpen] = React.useState(isOpen);
  const classes = useStyles();
  const _ = require('lodash');
  const dispatch = useAppDispatch();
  const { v4: uuidv4 } = require('uuid');
  const [docNo, setDocNo] = React.useState();
  const [titleName, setTitle] = React.useState('รายละเอียดเอกสาร');
  const [period, setPeriod] = React.useState('');
  const [status, setStatus] = React.useState(STATUS.DRAFT);
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [branchName, setBranchName] = React.useState('');
  const [uploadFileFlag, setUploadFileFlag] = React.useState(false);
  const [openModalAddExpense, setOpenModalAddExpense] = React.useState(false);
  const [openModalDescriptionExpense, setOpenModalDescriptionExpense] = React.useState(false);
  // const expenseMasterList = useAppSelector((state) => state.masterExpenseListSlice.masterExpenseList.data);
  const expenseAccountDetail = useAppSelector((state) => state.expenseAccountDetailSlice.expenseAccountDetail);
  const expenseData: any = expenseAccountDetail.data ? expenseAccountDetail.data : null;
  const summary = expenseData ? expenseData.itemSummary : null;
  const _items: ExpenseByDay[] = expenseData ? expenseData.itemByDays : [];
  const [items, setItems] = React.useState<any>(_items ? _items : []);

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
  const [payloadAdd, setPayloadAdd] = React.useState<any>();
  const handleAddExpenseTransactionBtn = () => {
    sessionStorage.setItem('ADD_NEW_ITEM', 'Y');
    setPayloadAdd(entries);
    setOpenModalAddExpense(true);
  };
  const handleSaveBtn = () => {};
  const handleApproveBtn = () => {};
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

  let infosWithDraw: any;
  let infosApprove: any;
  let totalWithDraw: number = 0;
  let totalApprove: number = 0;
  const entries: ExpenseSummaryItem[] = summary && summary.items ? summary.items : [];
  let rows: any[] = [];
  if (getInit()) {
    if (entries && entries.length > 0) {
      entries.map((entrie: ExpenseSummaryItem, i: number) => {
        infosWithDraw = {
          ...infosWithDraw,
          id: 1,
          description: 'ยอดเงินเบิก',
          [entrie.expenseNo]: entrie?.withdrawAmount,
        };
        totalWithDraw += Number(entrie?.withdrawAmount);
        infosApprove = {
          ...infosApprove,
          id: 2,
          description: 'ยอดเงินอนุมัติ',
          [entrie.expenseNo]: entrie?.approvedAmount,
        };
        totalApprove += Number(entrie?.approvedAmount);
      });
      rows = [
        { ...infosWithDraw, total: totalWithDraw },
        { ...infosApprove, total: totalApprove },
      ];
      dispatch(updateSummaryRows(rows));
    }
  } else {
    console.log('update summary');
    console.log(store.getState().expenseAccountDetailSlice.itemRows);
    console.log(store.getState().expenseAccountDetailSlice.summaryRows);
    const items = store.getState().expenseAccountDetailSlice.itemRows;
    let gfg = _.sumBy(items, function (o: any) {
      return o.total;
    });
    console.log('total', gfg);
    console.log(_.sumBy(items, '001'));
    console.log(_.sum(items));
  }

  if (_items && _items.length > 0) {
    const itemRows = items.map((item: ExpenseByDay, index: number) => {
      const list: ExpenseItem[] = item.expenseItems;
      let newItem: any;
      list.map((data: ExpenseItem) => {
        newItem = {
          ...newItem,
          [data.expenseNo]: data.amount,
        };
      });
      return {
        id: uuidv4(),
        date: item.expenseDate,
        total: item.totalAmount,
        ...newItem,
      };
    });
    console.log('detail113');
    dispatch(initialItems(itemRows));
  }

  useEffect(() => {
    if (edit) {
      setBranchName(`${expenseData.branchCode}-${getBranchName(branchList, expenseData.branchCode)}`);
      const startDate = convertUtcToBkkDate(expenseData.expensePeriod.startDate);
      const endDate = convertUtcToBkkDate(expenseData.expensePeriod.endDate);
      setPeriod(`${startDate}-${endDate}`);
      setStatus(expenseData.status);
      setTitle(
        expenseData.type === EXPENSE_TYPE.COFFEE
          ? 'รายละเอียดเอกสารค่าใช้จ่ายร้านกาแฟ'
          : EXPENSE_TYPE.STOREFRONT === 'STOREFRONT'
          ? 'รายละเอียดเอกสารค่าใช้จ่ายหน้าร้าน'
          : 'รายละเอียดเอกสาร'
      );
    } else {
      const ownBranch = getUserInfo().branch ? getUserInfo().branch : env.branch.code;
      setBranchName(`${ownBranch}-${getBranchName(branchList, ownBranch)}`);
      const startDate = convertUtcToBkkDate(periodProps && periodProps.startDate ? periodProps.startDate : '');
      const endDate = convertUtcToBkkDate(periodProps && periodProps.endDate ? periodProps.endDate : '');
      setPeriod(`${startDate}-${endDate}`);
      setTitle(
        expenseType === EXPENSE_TYPE.COFFEE
          ? 'รายละเอียดเอกสารค่าใช้จ่ายร้านกาแฟ'
          : EXPENSE_TYPE.STOREFRONT === 'STOREFRONT'
          ? 'รายละเอียดเอกสารค่าใช้จ่ายหน้าร้าน'
          : 'รายละเอียดเอกสาร'
      );
    }

    console.log('items: ', items);
  }, [open]);

  return (
    <React.Fragment>
      <Dialog open={isOpen} maxWidth='xl' fullWidth={true}>
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
              <Typography variant='body2'>{docNo}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant='body2'>สาขา:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='body2'>{branchName} </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant='body2'>งวด:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='body2'>{period}</Typography>
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
                files={expenseData && expenseData.attachFiles ? expenseData.attachFiles : []}
                docNo={'docNo'}
                docType='BA'
                isStatus={uploadFileFlag}
                onChangeUploadFile={handleOnChangeUploadFileSave}
                enabledControl={status === STATUS.DRAFT}
                idControl={'AttachFileSave'}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={3}>
              <AccordionUploadFile
                files={expenseData && expenseData.editAttachFiles ? expenseData.editAttachFiles : []}
                docNo={'docNo'}
                docType='BA'
                isStatus={uploadFileFlag}
                onChangeUploadFile={handleOnChangeUploadFileEdit}
                enabledControl={status === STATUS.SEND_BACK_EDIT}
                idControl={'AttachFileEdit'}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography variant='body2'>แนบเอกสารOC:</Typography>
            </Grid>
            <Grid item xs={3}>
              <AccordionUploadFile
                files={expenseData && expenseData.approvalAttachFiles ? expenseData.approvalAttachFiles : []}
                docNo={'docNo'}
                docType='BA'
                isStatus={uploadFileFlag}
                onChangeUploadFile={handleOnChangeUploadFileOC}
                enabledControl={status === STATUS.WAITTING_APPROVAL1}
                idControl={'AttachFileByOC'}
              />
            </Grid>
          </Grid>
          {status === STATUS.DRAFT && <Box>{componetButtonDraft}</Box>}

          {status !== STATUS.DRAFT && <Box>{componetButtonApprove}</Box>}
          <Box mb={3} mt={3}>
            <ExpenseDetailSummary />
          </Box>
        </DialogContent>
      </Dialog>
      <ModalAddExpense open={openModalAddExpense} onClose={OnCloseAddExpense} edit={false} payload={payloadAdd} />
      <ModelDescriptionExpense
        open={openModalDescriptionExpense}
        onClickClose={() => setOpenModalDescriptionExpense(false)}
        info={[mockExpenseInfo001, mockExpenseInfo002]}
      />
    </React.Fragment>
  );
}

export default ExpenseDetail;
