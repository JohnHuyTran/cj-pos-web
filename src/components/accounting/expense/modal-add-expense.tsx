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
import { stringNullOrEmpty } from '../../../utils/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  periodProps?: ExpensePeriod;
  edit: boolean;
  payload: any;
}
function ModalAddExpense({ open, onClose, periodProps, edit, payload }: Props) {
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

  const [flagEdit, setFlagEdit] = React.useState<boolean>(false);
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleSaveBtn = async () => {
    setOpenLoadingModal(true);

    if (edit) {
      let data: any;
      testList.map((e: any) => {
        data = { ...data, [e.key]: e.value };
      });
      await dispatch(addNewItem(data));
    } else {
      const data = { ...values, id: uuidv4(), total: 100, date: '12/07' };
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

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };
  const handleOnChange = (event: any) => {
    const value = Number(event.target.value);
    const sum = Number(sumOther);
    setSumOther(sum + value);
    setValues({ ...values, [event.target.name]: value });
  };
  const isFilterField = (value: string) => {
    return value === 'date' || value === 'total' || value === 'id';
  };

  useEffect(() => {
    setTestList(payload);
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
                    .filter((i: ExpenseInfo) => i.active && !i.isOtherExpense)
                    .map((i: ExpenseInfo) => {
                      return (
                        <>
                          <Grid item xs={1}>
                            <Typography variant='body2'>{i.accountName}: </Typography>
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
                    .filter((i: ExpenseInfo) => i.active && i.isOtherExpense)
                    .map((i: ExpenseInfo) => {
                      return (
                        <>
                          <Grid item xs={1}>
                            <Typography variant='body2'>{i.accountName}: </Typography>
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
                    .filter((i: payLoadAdd) => !isFilterField(i.key))
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
                    .filter((i: ExpenseInfo) => i.active && i.isOtherExpense)
                    .map((i: ExpenseInfo) => {
                      return (
                        <>
                          <Grid item xs={1}>
                            <Typography variant='body2'>{i.accountName}: </Typography>
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
