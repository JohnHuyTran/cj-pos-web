import { Box, Button, Dialog, DialogActions, DialogContent, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import DatePickerAllComponent from '../../commons/ui/date-picker-all';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ExpenseInfo, ExpensePeriod, payLoadAdd } from '../../../models/branch-accounting-model';
import { values } from 'lodash';
import { addNewItem, updateItemRows } from '../../../store/slices/accounting/accounting-slice';
import LoadingModal from '../../commons/ui/loading-modal';
import userEvent from '@testing-library/user-event';
import { setInit } from '../../../store/sessionStore';
import { isFilterFieldInExpense, stringNullOrEmpty } from '../../../utils/utils';
import moment from 'moment';
import { convertUtcToBkkDate } from '../../../utils/date-utill';

interface Props {
  open: boolean;
  onClose: () => void;
  periodProps?: ExpensePeriod;
  edit: boolean;
  payload: any;
  type: string;
}
function ModalAddExpense({ open, onClose, periodProps, edit, payload, type }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [isEdit, setisEdit] = React.useState(edit);
  const [isopen, setIsopen] = React.useState(open);
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [isErrorDate, setIsErrorDate] = React.useState(false);
  const [isDisableSaveBtn, setIsDisableSaveBtn] = React.useState(false);
  const expenseMasterList = useAppSelector((state) => state.masterExpenseListSlice.masterExpenseList.data);
  const itemRows = useAppSelector((state) => state.expenseAccountDetailSlice.intialRows);
  const summaryRows = useAppSelector((state) => state.expenseAccountDetailSlice.summaryRows);
  const [values, setValues] = React.useState({});
  const [sumOther, setSumOther] = React.useState(0);
  const [isLoad, setIsLoad] = React.useState(false);
  const { v4: uuidv4 } = require('uuid');
  const [testList, setTestList] = React.useState<any>(payload);
  const [expenseType, setExpenseType] = React.useState<any>(type);

  const [flagEdit, setFlagEdit] = React.useState<boolean>(false);
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleSaveBtn = async () => {
    setOpenLoadingModal(true);

    if (edit) {
      let data: any;
      let sum: number = 0;
      testList.map((e: any) => {
        data = { ...data, [e.key]: e.value };
        if (!isFilterFieldInExpense(e.key)) {
          sum += e.value;
        }
      });
      data = { ...data, total: sum };
      await dispatch(addNewItem(data));
    } else {
      const data = {
        ...values,
        id: uuidv4(),
        total: sum(values),
        date: convertUtcToBkkDate(moment(startDate).startOf('day').toISOString()),
      };
      await dispatch(addNewItem(data));
    }
    setInit('N');
    setTimeout(() => {
      setOpenLoadingModal(false);
      onClose();
    }, 300);
  };

  // const handleSaveBtn = async () => {
  //   setOpenLoadingModal(true);

  //   const data = { ...values, id: uuidv4(), total: 100, date: '09/07' };
  //   await dispatch(addNewItem(data));
  //   setInit('N');
  //   setTimeout(() => {
  //     setOpenLoadingModal(false);
  //     onClose();
  //   }, 300);
  // };

  function sum(obj: any) {
    return Object.keys(obj).reduce((sum, key) => sum + parseFloat(obj[key] || 0), 0);
  }

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: Number(value) });
  };
  const handleOnChange = (event: any) => {
    const value = Number(event.target.value);
    const sum = Number(sumOther);
    setSumOther(sum + value);
    setValues({ ...values, [event.target.name]: value });
  };

  useEffect(() => {
    setTestList(payload);
    setExpenseType(type);
  }, [open, edit]);

  const handleChangeNew = (value: any, name: any) => {
    const data = stringNullOrEmpty(value) ? value : Number(value);
    testList.forEach((element: any) => {
      if (element.key === name) {
        element.value = data;
      }
    });

    setFlagEdit(true);
  };

  useEffect(() => {
    setTestList(testList);

    setFlagEdit(false);
  }, [flagEdit === true]);
  const getMasterExpenInto = (key: any) => expenseMasterList.find((e: ExpenseInfo) => e.expenseNo === key);

  return (
    <div>
      <Dialog open={open} maxWidth='md' fullWidth={true} key='modal-add-expense'>
        <DialogContent>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={3}>
              เพิ่มรายการจ่ายวันที่ :
            </Grid>
            <Grid item xs={4}>
              <DatePickerAllComponent
                onClickDate={handleStartDatePicker}
                value={startDate}
                type={'TO'}
                minDateTo={periodProps?.startDate ? periodProps.startDate : startDate}
                maxDate={periodProps?.endDate ? periodProps.endDate : startDate}
                isError={isErrorDate}
                hyperText={isErrorDate ? 'เลือกวันที่ซ้ำ กรุณาเลือกใหม่' : ''}
              />
            </Grid>
            {!edit && (
              <>
                <Grid container spacing={2} mb={2} mt={2}>
                  {expenseMasterList
                    .filter((i: ExpenseInfo) => i.isActive && !i.isOtherExpense && i.typeCode === expenseType)
                    .map((i: ExpenseInfo) => {
                      return (
                        <>
                          <Grid item xs={1}>
                            <Typography variant='body2'>{i.accountNameTh}: </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              id={i.expenseNo}
                              name={i.expenseNo}
                              size='small'
                              type='number'
                              // value={i.}
                              onChange={handleChange}
                              className={classes.MtextField}
                              fullWidth
                              placeholder=''
                            />
                          </Grid>
                        </>
                      );
                    })}
                </Grid>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={1}>
                    ค่าอื่นๆ:
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id='txtDocNo'
                      name='sumOther'
                      size='small'
                      value={sumOther}
                      // onChange={handleOnChange}
                      className={classes.MtextField}
                      fullWidth
                      placeholder=''
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} mb={2} mt={2}>
                  {expenseMasterList
                    .filter((i: ExpenseInfo) => i.isActive && i.isOtherExpense && i.typeCode === expenseType)
                    .map((i: ExpenseInfo) => {
                      return (
                        <>
                          <Grid item xs={1}>
                            <Typography variant='body2'>{i.accountNameTh}: </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              id='txtDocNo'
                              name={i.expenseNo}
                              size='small'
                              type='number'
                              // value=''
                              onKeyUp={handleOnChange}
                              className={classes.MtextField}
                              fullWidth
                              placeholder=''
                            />
                          </Grid>
                        </>
                      );
                    })}
                </Grid>
              </>
            )}

            {edit && testList && (
              <>
                <Grid container spacing={2} mb={2} mt={2}>
                  {testList
                    .filter((i: payLoadAdd) => !isFilterFieldInExpense(i.key))
                    .map((i: payLoadAdd) => {
                      return (
                        <>
                          <Grid item xs={1}>
                            <Typography variant='body2'>{i.title}: </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              id={i.key}
                              name={i.key}
                              size='small'
                              type='number'
                              value={i.value}
                              onChange={(event) => handleChangeNew(event.target.value, i.key)}
                              className={classes.MtextField}
                              fullWidth
                              placeholder=''
                            />
                          </Grid>
                        </>
                      );
                    })}
                </Grid>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={1}>
                    ค่าอื่นๆ:
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id='txtDocNo'
                      name='sumOther'
                      size='small'
                      value={sumOther}
                      // onChange={handleOnChange}
                      className={classes.MtextField}
                      fullWidth
                      placeholder=''
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} mb={2} mt={2}>
                  {expenseMasterList
                    .filter((i: ExpenseInfo) => i.isActive && i.isOtherExpense && i.typeCode === expenseType)
                    .map((i: ExpenseInfo) => {
                      return (
                        <>
                          <Grid item xs={1}>
                            <Typography variant='body2'>{i.accountNameTh}: </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              id='txtDocNo'
                              name={i.expenseNo}
                              size='small'
                              // value=''
                              onKeyUp={handleOnChange}
                              className={classes.MtextField}
                              fullWidth
                              placeholder=''
                            />
                          </Grid>
                        </>
                      );
                    })}
                </Grid>
              </>
            )}
          </Grid>
          <DialogActions>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                data-testid='testid-btnAdd'
                id='btnAdd'
                variant='contained'
                color='secondary'
                onClick={handleSaveBtn}
                className={classes.MbtnSearch}
                size='large'
                disabled={isErrorDate || isDisableSaveBtn ? true : false}
                startIcon={<AddCircleOutlineIcon />}>
                บันทึก
              </Button>
            </Box>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <LoadingModal open={openLoadingModal} />
    </div>
  );
}

export default ModalAddExpense;
