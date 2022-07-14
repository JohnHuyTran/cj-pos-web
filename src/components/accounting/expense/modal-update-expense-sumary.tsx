import { Box, Button, Dialog, DialogActions, DialogContent, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ExpenseInfo, payLoadAdd } from '../../../models/branch-accounting-model';
import { addSummaryItem } from '../../../store/slices/accounting/accounting-slice';
import LoadingModal from '../../commons/ui/loading-modal';
import { isFilterFieldInExpense, isFilterOutFieldInAdd, stringNullOrEmpty } from '../../../utils/utils';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';

interface Props {
  open: boolean;
  onClose: () => void;
  payload: any;
}
function ModalUpdateExpenseSummary({ open, onClose, payload }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [isopen, setIsopen] = React.useState(open);
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [isErrorDate, setIsErrorDate] = React.useState(false);
  const [isDisableSaveBtn, setIsDisableSaveBtn] = React.useState(false);
  const expenseMasterList = useAppSelector((state) => state.masterExpenseListSlice.masterExpenseList.data);
  const [values, setValues] = React.useState({});
  const [sumOther, setSumOther] = React.useState(0);
  const [testList, setTestList] = React.useState<any>([]);

  const [flagEdit, setFlagEdit] = React.useState<boolean>(false);

  const handleSaveBtn = async () => {
    setOpenLoadingModal(true);

    let data: any;
    let sum: number = 0;
    let _otherSum: number = 0;
    testList.map((e: any) => {
      data = { ...data, [e.key]: e.value };
      if (!isFilterOutFieldInAdd(e.key)) {
        sum += Number(e.value) || 0;

        const master = getMasterExpenInto(e.key);
        const _isOtherExpense = master ? master.isOtherExpense : false;
        if (_isOtherExpense) {
          _otherSum += Number(e.value) || 0;
        }
      }
    });
    data = { ...data, total: sum, SUMOTHER: _otherSum };
    console.log('data', data);
    await dispatch(addSummaryItem(data));
    setTimeout(() => {
      setOpenLoadingModal(false);
      onClose();
    }, 300);
  };

  const handleOnChange = (event: any) => {
    const value = Number(event.target.value);
    const sum = Number(sumOther);
    setSumOther(sum + value);
    setValues({ ...values, [event.target.name]: value });
  };

  useEffect(() => {
    setTestList(payload);
  }, [open]);

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
        <BootstrapDialogTitle id='dialog-title' onClose={onClose} />
        <DialogContent>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={3}>
              ยอดเงินอนุมัติ :
            </Grid>
            <Grid item xs={4}></Grid>
            <>
              <Grid container spacing={2} mb={2} mt={2}>
                {testList
                  .filter((i: payLoadAdd) => !isFilterOutFieldInAdd(i.key))
                  .map((i: payLoadAdd) => {
                    return (
                      <>
                        <Grid item xs={2}>
                          <Typography variant='body2'>{i.title}: </Typography>
                        </Grid>
                        <Grid item xs={2}>
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
                            autoComplete='off'
                          />
                        </Grid>
                      </>
                    );
                  })}
              </Grid>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={2}>
                  ค่าอื่นๆ:
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    id='txtDocNo'
                    name='sumOther'
                    size='small'
                    value={sumOther}
                    // onChange={handleOnChange}
                    className={classes.MtextField}
                    fullWidth
                    placeholder=''
                    autoComplete='off'
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mb={2} mt={2}>
                {testList
                  .filter((i: payLoadAdd) => i.isOtherExpense && !isFilterOutFieldInAdd(i.key))
                  .map((i: payLoadAdd) => {
                    return (
                      <>
                        <Grid item xs={2}>
                          <Typography variant='body2'>{i.title}: </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            id='txtDocNo'
                            name={i.key}
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

export default ModalUpdateExpenseSummary;
