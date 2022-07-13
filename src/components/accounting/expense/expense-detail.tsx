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
import { Cancel, VoicemailRounded } from '@mui/icons-material';
import { GridColumnHeadersItemCollection } from '@mui/x-data-grid';
import { mockExpenseInfo001, mockExpenseInfo002 } from '../../../mockdata/branch-accounting';
import {
  AccountAccountExpenses,
  DataItem,
  ExpenseInfo,
  ExpensePeriod,
  ExpenseSaveRequest,
  ItemItem,
  SumItems,
  SumItemsItem,
  Comment,
} from '../../../models/branch-accounting-model';
import {
  addNewItem,
  featchExpenseDetailAsync,
  initialItems,
  updateItemRows,
  updateSummaryRows,
} from '../../../store/slices/accounting/accounting-slice';
import {
  getBranchName,
  isFilterFieldInExpense,
  isFilterOutFieldInAdd,
  objectNullOrEmpty,
  stringNullOrEmpty,
  stringNumberNullOrEmpty,
} from '../../../utils/utils';
import { convertUtcToBkkDate, convertUtcToBkkWithZ } from '../../../utils/date-utill';
import { getInit, getUserInfo } from '../../../store/sessionStore';
import { env } from '../../../adapters/environmentConfigs';
import { EXPENSE_TYPE, STATUS } from '../../../utils/enum/accounting-enum';
import LoadingModal from '../../commons/ui/loading-modal';
import AlertError from '../../commons/ui/alert-error';
import SnackbarStatus from '../../commons/ui/snackbar-status';
import {
  expenseApproveByAccount,
  expenseApproveByAccountManager,
  expenseApproveByBranch,
  expenseApproveByOC,
  expenseRejectByAccountManager,
  expenseRejectByOC,
  expenseSave,
} from '../../../services/accounting';
import { ApiError } from '../../../models/api-error-model';
import moment from 'moment';
import ModelConfirmDetail from './confirm/modal-confirm-detail';
import AccordionUploadSingleFile from '../../commons/ui/accordion-upload-single-file';
import TextBoxComment from '../../commons/ui/textbox-comment';
import { Day } from '@material-ui/pickers';
import ModalConfirmExpense from './modal-confirm-expense';

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
  type: string;
  edit: boolean;
  periodProps?: ExpensePeriod;
}
function ExpenseDetail({ isOpen, onClickClose, type, edit, periodProps }: Props) {
  const [open, setOpen] = React.useState(isOpen);
  const classes = useStyles();
  const _ = require('lodash');
  const dispatch = useAppDispatch();
  const { v4: uuidv4 } = require('uuid');
  const [docNo, setDocNo] = React.useState();
  const [expenseTypeName, setExpenseTypeName] = React.useState('รายละเอียดเอกสาร');
  const [expenseType, setExpenseType] = React.useState('รายละเอียดเอกสาร');
  const [period, setPeriod] = React.useState<ExpensePeriod>({
    period: 0,
    startDate: '',
    endDate: '',
  });
  const [periodLabel, setPeriodLabel] = React.useState('');
  const [status, setStatus] = React.useState(STATUS.DRAFT);
  const [attachFiles, setAttachFiles] = React.useState([]);
  const [editAttachFiles, setEditAttachFiles] = React.useState([]);
  const [approvalAttachFiles, setApprovalAttachFiles] = React.useState([]);
  const [comment, setComment] = React.useState('');
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [branchCode, setBranchCode] = React.useState('');
  const [branchName, setBranchName] = React.useState('');
  const [uploadFileFlag, setUploadFileFlag] = React.useState(false);
  const [openModalAddExpense, setOpenModalAddExpense] = React.useState(false);
  const [openModalDescriptionExpense, setOpenModalDescriptionExpense] = React.useState(false);
  const expenseMasterList = useAppSelector((state) => state.masterExpenseListSlice.masterExpenseList.data);
  const expenseAccountDetail = useAppSelector((state) => state.expenseAccountDetailSlice.expenseAccountDetail);
  const expenseData: any = expenseAccountDetail.data ? expenseAccountDetail.data : null;
  const summary: SumItems = expenseData ? expenseData.sumItems : null;
  const _items: DataItem[] = expenseData ? expenseData.items : [];
  const [items, setItems] = React.useState<any>(_items ? _items : []);
  const fileUploadList = useAppSelector((state) => state.uploadFileSlice.state);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = React.useState(false);

  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

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
  const handleAddExpenseTransactionBtn = async () => {
    sessionStorage.setItem('ADD_NEW_ITEM', 'Y');
    setPayloadAdd([]);
    setOpenModalAddExpense(true);
    await dispatch(addNewItem(null));
  };
  const handleSaveBtn = async () => {
    const items = store.getState().expenseAccountDetailSlice.itemRows;
    const summarys = store.getState().expenseAccountDetailSlice.summaryRows;
    let dataItem: DataItem[] = [];
    items.forEach((e: any) => {
      const arr = Object.entries(e);
      let items: ItemItem[] = [];
      arr
        .filter((e: any) => !isFilterOutFieldInAdd(e[0]))
        .map((element: any, index: number) => {
          let _isOtherExpense = getMasterExpenInto(element[0])?.isOtherExpense || false;

          const item: ItemItem = {
            expenseNo: element[0],
            amount: element[1],
            isOtherExpense: _isOtherExpense,
          };
          items.push(item);
        });
      const data: DataItem = {
        expenseDate: moment(e['dateTime']).startOf('day').toISOString(),
        // expenseDate: moment(new Date()).startOf('day').subtract(543, 'year').toISOString(),
        items: items,
      };
      dataItem.push(data);
    });

    const arr = Object.entries(summarys[0]);
    let sumItems: SumItemsItem[] = [];
    arr
      .filter((e: any) => !isFilterOutFieldInAdd(e[0]))
      .map((e: any, index: number) => {
        const item: SumItemsItem = {
          expenseNo: e[0],
          withdrawAmount: e[1],
        };
        sumItems.push(item);
      });

    const sumItem: SumItems = {
      items: sumItems,
    };
    const payload: ExpenseSaveRequest = {
      branchCode: branchCode,
      type: expenseType,
      expensePeriod: period,
      sumItems: sumItem.items,
      items: dataItem,
      docNo: docNo,
    };
    await expenseSave(payload, fileUploadList)
      .then(async (value) => {
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('บันทึก เรียบร้อยแล้ว');
        setDocNo(value.docNo);

        await dispatch(featchExpenseDetailAsync(value.docNo));
        setTimeout(() => {
          setOpen(false);
          // onClickClose();
        }, 500);
      })
      .catch((error: ApiError) => {
        setOpenAlert(true);
        setTextError(error.message);
      });
  };

  const onApproveByBranch = async (comment: string) => {
    const payload: ExpenseSaveRequest = {
      comment: comment,
      docNo: docNo,
      today: moment(new Date().setDate(new Date().getDate() + 5))
        .startOf('day')
        .toISOString(),
    };
    await expenseApproveByBranch(payload, fileUploadList)
      .then(async (value) => {
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('ส่งคำร้องขอ เรียบร้อยแล้ว');
        setTimeout(() => {
          setOpen(false);
          onClickClose();
        }, 500);
      })
      .catch((error: ApiError) => {
        setOpenAlert(true);
        setTextError(error.message);
      });
  };

  const onApproveByAreaMangerOC = async () => {
    const payload: ExpenseSaveRequest = {
      docNo: docNo,
    };
    await expenseApproveByOC(payload, fileUploadList)
      .then(async (value) => {
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('ส่งคำร้องขอ เรียบร้อยแล้ว');
        setTimeout(() => {
          setOpen(false);
          onClickClose();
        }, 500);
      })
      .catch((error: ApiError) => {
        setOpenAlert(true);
        setTextError(error.message);
      });
  };
  const onRejectByAreaMangerOC = async (comment: string) => {
    const payload: ExpenseSaveRequest = {
      docNo: docNo,
      comment: comment,
    };
    await expenseRejectByOC(payload)
      .then(async (value) => {
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('ส่งคำร้องขอ เรียบร้อยแล้ว');
        setTimeout(() => {
          setOpen(false);
          onClickClose();
        }, 500);
      })
      .catch((error: ApiError) => {
        setOpenAlert(true);
        setTextError(error.message);
      });
  };

  const onApproveByAccount = async () => {
    const payload: ExpenseSaveRequest = {
      docNo: docNo,
      comment: comment,
    };
    await expenseApproveByAccount(payload)
      .then(async (value) => {
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('ส่งคำร้องขอ เรียบร้อยแล้ว');
        setTimeout(() => {
          setOpen(false);
          onClickClose();
        }, 500);
      })
      .catch((error: ApiError) => {
        setOpenAlert(true);
        setTextError(error.message);
      });
  };
  const onRejectByAccount = async (returnto: string, comment: string) => {
    const payload: ExpenseSaveRequest = {
      docNo: docNo,
      comment: comment,
      returnTo: returnto,
    };
    await expenseRejectByOC(payload)
      .then(async (value) => {
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('ส่งคำร้องขอ เรียบร้อยแล้ว');
        setTimeout(() => {
          setOpen(false);
          onClickClose();
        }, 500);
      })
      .catch((error: ApiError) => {
        setOpenAlert(true);
        setTextError(error.message);
      });
  };

  const onApproveByAccountManager = async (expenDate: Date, approveDate: Date) => {
    const payload: ExpenseSaveRequest = {
      expenseDate: moment(expenDate).startOf('day').toISOString(),
      approvedDate: moment(approveDate).startOf('day').toISOString(),
    };
    await expenseApproveByAccountManager(payload)
      .then(async (value) => {
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('ส่งคำร้องขอ เรียบร้อยแล้ว');
        setTimeout(() => {
          setOpen(false);
          onClickClose();
        }, 500);
      })
      .catch((error: ApiError) => {
        setOpenAlert(true);
        setTextError(error.message);
      });
  };

  const onRejectByAccountManager = async (comment: string) => {
    const payload: ExpenseSaveRequest = {
      comment: comment,
    };
    await expenseRejectByAccountManager(payload)
      .then(async (value) => {
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('ส่งคำร้องขอ เรียบร้อยแล้ว');
        setTimeout(() => {
          setOpen(false);
          onClickClose();
        }, 500);
      })
      .catch((error: ApiError) => {
        setOpenAlert(true);
        setTextError(error.message);
      });
  };
  let callbackFunction: any;
  const [isOpenModelConfirmExpense, setIsOpenModelConfirmExpense] = React.useState<boolean>(false);
  const [isApprove, setIsApprove] = React.useState<boolean>(false);
  const [showForward, setShowForward] = React.useState<boolean>(false); // show dropdown resend
  const [showReason, setShowReason] = React.useState<boolean>(false); // show comment
  const [validateReason, setValidateReason] = React.useState<boolean>(false);

  const handleApproveBtn = () => {
    setIsApprove(true);
    if (status === STATUS.DRAFT) {
      const isFileValidate: boolean = validateFileInfo();
      if (isFileValidate) {
        setIsOpenModelConfirmExpense(true);
        setShowReason(true);
      }
    } else {
      if (status === STATUS.WAITTING_APPROVAL1) {
        setShowReason(false);
        setIsOpenModelConfirmExpense(true);
      } else if (status === STATUS.WAITTING_APPROVAL2) {
        setOpenModelConfirm(true);
      } else if (status === STATUS.WAITTING_ACCOUNTING) {
        setOpenModelConfirm(true);
      }
    }
  };

  const onCallbackFunction = (value: any) => {
    console.log(value);
    console.log(isApprove);
    if (isApprove) {
      if (status === STATUS.DRAFT) {
        onApproveByBranch(value.reason);
      } else if (status === STATUS.WAITTING_APPROVAL1) {
        onApproveByAreaMangerOC();
      } else if (status === STATUS.WAITTING_APPROVAL2) {
        onApproveByAccount();
      } else if (status === STATUS.WAITTING_ACCOUNTING) {
        onApproveByAccountManager(value.expenDate, value.approveDate);
      }
    } else {
      if (status === STATUS.WAITTING_APPROVAL1) {
        onRejectByAreaMangerOC(value.reason);
      } else if (status === STATUS.WAITTING_APPROVAL2) {
        //call confirm nun
      } else if (status === STATUS.WAITTING_ACCOUNTING) {
        //call confirm nun
      }
    }
  };

  const handleRejectBtn = () => {
    setIsApprove(false);

    if (status === STATUS.WAITTING_APPROVAL1) {
      setIsOpenModelConfirmExpense(true);
      setShowReason(true);
      setValidateReason(true);
    } else if (status === STATUS.WAITTING_APPROVAL2) {
      setShowReason(true);
      setValidateReason(true);
      setShowForward(true);
      setIsOpenModelConfirmExpense(true);
    } else if (status === STATUS.WAITTING_ACCOUNTING) {
      setValidateReason(true);
      setShowForward(true);
      setIsOpenModelConfirmExpense(true);
    }
  };

  const validateFileInfo = () => {
    const isvalid = fileUploadList.length > 0 ? true : false;
    const existingfileList =
      status === STATUS.DRAFT
        ? attachFiles
        : status === STATUS.SEND_BACK_EDIT
        ? editAttachFiles
        : status === STATUS.WAITTING_EDIT_ATTACH_FILE
        ? approvalAttachFiles
        : '';
    if (!isvalid && existingfileList.length <= 0) {
      setOpenAlert(true);
      setTextError('กรุณาแนบเอกสาร');
      return false;
    }
    return true;
  };

  const getMasterExpenInto = (key: any) => expenseMasterList.find((e: ExpenseInfo) => e.expenseNo === key);
  const isOtherExpenseField = (key: any) => {
    const master = getMasterExpenInto(key);
    return master?.isOtherExpense;
  };
  const getOtherExpenseName = (key: any) => {
    return getMasterExpenInto(key)?.accountNameTh;
  };
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
            sx={{ width: 140 }}
            disabled={docNo ? false : true}>
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
  let infoDiff: any;
  let totalWithDraw: number = 0;
  let totalApprove: number = 0;
  let totalDiff: any;
  let totalOtherWithDraw: number = 0;
  let totalOtherApprove: number = 0;
  let totalOtherDiff: number = 0;
  const entries: SumItemsItem[] = summary && summary.items ? summary.items : [];
  let rows: any[] = [];
  if (getInit()) {
    if (entries && entries.length > 0) {
      entries.map((entrie: SumItemsItem, i: number) => {
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

        infoDiff = {
          ...infosApprove,
          id: 3,
          description: 'ผลต่าง',
          [entrie.expenseNo]: entrie?.approvedAmount,
        };
        const master = getMasterExpenInto(entrie.expenseNo);
        const _isOtherExpense = master ? master.isOtherExpense : false;
        if (_isOtherExpense) {
          totalOtherWithDraw += stringNullOrEmpty(entrie?.withdrawAmount) ? 0 : entrie?.withdrawAmount;
          totalOtherApprove += entrie?.approvedAmount === undefined ? 0 : entrie?.approvedAmount;
        }
      });
      totalDiff = Number(totalWithDraw) - Number(totalApprove);
      totalOtherDiff = Number(totalOtherWithDraw) - Number(totalOtherApprove);

      if (status === STATUS.DRAFT) {
        rows = [{ ...infosWithDraw, total: totalWithDraw }];
      } else if (status === STATUS.WAITTING_APPROVAL1) {
        rows = [
          { ...infosWithDraw, total: totalWithDraw },
          { ...infosApprove, total: isNaN(totalApprove) ? 0 : totalApprove },
        ];
      } else if (status === STATUS.WAITTING_APPROVAL2) {
        rows = [
          { ...infosWithDraw, total: totalWithDraw, SUMOTHER: totalOtherWithDraw },
          { ...infosApprove, total: isNaN(totalApprove) ? 0 : totalApprove, SUMOTHER: totalOtherApprove },
          { ...infoDiff, total: isNaN(totalDiff) ? 0 : totalDiff, SUMOTHER: totalOtherDiff },
        ];
      }

      // rows = [
      //   showWithDraw && { ...infosWithDraw, total: totalWithDraw },
      //   showApprove && { ...infosApprove, total: isNaN(totalApprove) ? 0 : totalApprove },
      //   showDiff && { ...infoDiff, total: isNaN(totalDiff) ? 0 : totalDiff },
      // ];
      dispatch(updateSummaryRows(rows));
    }

    if (_items && _items.length > 0) {
      let _otherSum: number = 0;
      let _otherDetail: string = '';
      const itemRows = items.map((item: DataItem, index: number) => {
        const list: ItemItem[] = item.items;
        let newItem: any;
        list.map((data: ItemItem) => {
          newItem = {
            ...newItem,
            [data.expenseNo]: data.amount,
          };
          if (!isFilterFieldInExpense(data.expenseNo) && isOtherExpenseField(data.expenseNo)) {
            _otherSum += Number(data.amount);
            if (!stringNumberNullOrEmpty(data.amount)) {
              _otherDetail += `${getOtherExpenseName(data.expenseNo)},`;
            }
          }
        });
        return {
          id: uuidv4(),
          date: convertUtcToBkkDate(moment(item.expenseDate).startOf('day').toISOString()),
          total: item.totalAmount,
          SUMOTHER: _otherSum,
          otherDetail: _otherDetail,
          ...newItem,
        };
      });
      dispatch(initialItems(itemRows));
    }
  }

  useEffect(() => {
    if (edit) {
      setDocNo(expenseData.docNo);
      setBranchCode(expenseData.branchCode);
      setBranchName(`${expenseData.branchCode}-${getBranchName(branchList, expenseData.branchCode)}`);
      const startDate = convertUtcToBkkDate(expenseData.expensePeriod.startDate);
      const endDate = convertUtcToBkkDate(expenseData.expensePeriod.endDate);
      setPeriodLabel(`${startDate}-${endDate}`);
      setPeriod(expenseData.expensePeriod);
      setStatus(expenseData.status);
      setExpenseTypeName(
        expenseData.type === EXPENSE_TYPE.COFFEE
          ? 'รายละเอียดเอกสารค่าใช้จ่ายร้านกาแฟ'
          : expenseData.type === EXPENSE_TYPE.STOREFRONT
          ? 'รายละเอียดเอกสารค่าใช้จ่ายหน้าร้าน'
          : 'รายละเอียดเอกสาร'
      );
      setExpenseType(expenseData.type);
      setAttachFiles(expenseData.attachFiles && expenseData.attachFiles.length > 0 ? expenseData.attachFiles : []);
      setEditAttachFiles(
        expenseData.editAttachFiles && expenseData.editAttachFiles.length > 0 ? expenseData.editAttachFiles : []
      );
      setApprovalAttachFiles(
        expenseData.approvalAttachFiles && expenseData.approvalAttachFiles.length > 0
          ? expenseData.approvalAttachFiles
          : []
      );
      const _comment: Comment[] = expenseData.comments ? expenseData.comments : [];
      let msgComment = ' ';
      _comment.forEach((e: Comment) => {
        msgComment += `${e.username} ${e.statusDesc} ${convertUtcToBkkDate(e.commentDate)} \n ${e.comment}`;
      });
      setComment(msgComment);
    } else {
      const ownBranch = getUserInfo().branch ? getUserInfo().branch : env.branch.code;
      setBranchCode(ownBranch);
      setBranchName(`${ownBranch}-${getBranchName(branchList, ownBranch)}`);
      const startDate = convertUtcToBkkDate(periodProps && periodProps.startDate ? periodProps.startDate : '');
      const endDate = convertUtcToBkkDate(periodProps && periodProps.endDate ? periodProps.endDate : '');
      setPeriodLabel(`${startDate}-${endDate}`);
      setPeriod(
        periodProps
          ? periodProps
          : {
              period: 0,
              startDate: '',
              endDate: '',
            }
      );
      setExpenseType(type);
      setExpenseTypeName(
        type === EXPENSE_TYPE.COFFEE
          ? 'รายละเอียดเอกสารค่าใช้จ่ายร้านกาแฟ'
          : type === EXPENSE_TYPE.STOREFRONT
          ? 'รายละเอียดเอกสารค่าใช้จ่ายหน้าร้าน'
          : 'รายละเอียดเอกสาร'
      );
      setComment(' ');
    }
  }, [open]);

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
  const topFunction = () => {
    document.getElementById('top-item')?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  };
  return (
    <React.Fragment>
      <Dialog open={isOpen} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={onClickClose}>
          <Typography sx={{ fontSize: 24, fontWeight: 400 }}>{expenseTypeName}</Typography>
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
              <Typography variant='body2'>{periodLabel}</Typography>
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
              {/* <AccordionUploadFile
                files={expenseData && expenseData.attachFiles ? expenseData.attachFiles : []}
                docNo={'docNo'}
                docType='BA'
                isStatus={uploadFileFlag}
                onChangeUploadFile={handleOnChangeUploadFileSave}
                enabledControl={status === STATUS.DRAFT}
                idControl={'AttachFileSave'}
              /> */}
              <AccordionUploadSingleFile files={attachFiles} disabledControl={status !== STATUS.DRAFT} />
            </Grid>
            <Grid item xs={1}>
              <Typography variant='body2'>แนบเอกสารแก้ไข:</Typography>
            </Grid>
            <Grid item xs={3}>
              <AccordionUploadFile
                files={editAttachFiles}
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
                files={approvalAttachFiles}
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
            <ExpenseDetailSummary type={expenseType} periodProps={period} />
          </Box>
          <Box mt={1}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={3}>
                <TextBoxComment
                  fieldName='หมายเหตุ:'
                  defaultValue={comment}
                  maxLength={100}
                  onChangeComment={() => {}}
                  isDisable={true}
                  rowDisplay={2}
                />
              </Grid>
              <Grid item xs={7}></Grid>
              <Grid item xs={2} textAlign='center'>
                <IconButton onClick={topFunction} data-testid='testid-btnTop'>
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
      <ModalAddExpense
        open={openModalAddExpense}
        onClose={OnCloseAddExpense}
        edit={false}
        payload={payloadAdd}
        type={expenseType}
        periodProps={period}
      />
      <ModelDescriptionExpense
        open={openModalDescriptionExpense}
        onClickClose={() => setOpenModalDescriptionExpense(false)}
        info={[mockExpenseInfo001, mockExpenseInfo002]}
      />
      <LoadingModal open={openLoadingModal} />
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} payload={null} />
      <SnackbarStatus
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        isSuccess={snackbarIsStatus}
        contentMsg={contentMsg}
      />

      <ModelConfirmDetail
        open={openModelConfirm}
        onClose={handleCloseModelConfirm}
        onConfirm={callbackFunction}
        startDate='2022-06-16T00:00:00+07:00'
        endDate='2022-06-30T23:59:59.999999999+07:00'
      />

      <ModalConfirmExpense
        open={isOpenModelConfirmExpense}
        details={{
          docNo: docNo ? docNo : '',
          type: expenseTypeName,
          period: periodLabel,
          sumWithdrawAmount: '',
        }}
        onCallBackFunction={onCallbackFunction}
        approve={isApprove}
        showForward={showForward}
        showReason={showReason}
        validateReason={validateReason}
        onClose={() => setIsOpenModelConfirmExpense(false)}
      />
    </React.Fragment>
  );
}

export default ExpenseDetail;
