import { ReactElement, Fragment, useState, useEffect } from "react";
import NumberFormat from 'react-number-format';
import { useStyles } from 'styles/makeTheme';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';

// Components
import TextBoxComment from 'components/commons/ui/textbox-comment';

// Util and global functions
const number = (value: any) => ((+(''+value).replaceAll(',', '')))

interface ModalConfirmApprovedProps {
  open: boolean;
  data: any;
  onClose: () => void;
  onConfirm: (submit: boolean, payload: any) => void;
}

interface InputNumberLayoutProps {
  title: string,
  id?: string,
  name?: string,
  color?: string,
  value: string | number,
  decimal?: number,
  disabled?: boolean,
  native?: boolean,
  validate?: boolean,
  onChange: (value: any) => void
}

export default function ModalConfirmApproved(props: ModalConfirmApprovedProps): ReactElement {
  const { open, data, onClose, onConfirm } = props
  const classes = useStyles();
  const depositList = [
    { name: 'PayIN', key: 'PAY_IN' },
    { name: 'CDM', key: 'CDM' }
  ]

   // Initial sate
  const initialSearchState = {
    depositeAmount: number(data.depositeAmount),
    depositType: 'PAY_IN',
    moneyDeposit: 0,
    comment: ''
  };

  const [approvedForm, setApprovedForm] = useState(initialSearchState)
  const [isError, setIsError] = useState(false)
  // Handle function
  const handleConfirm = () => {
    const { depositeAmount, moneyDeposit, comment } = approvedForm
    const isCommentValidate = ((depositeAmount === moneyDeposit) || comment) ? true : false;
    setIsError(true)
    if (isCommentValidate) {
      setIsError(false)
      onConfirm(true, {
        ...approvedForm,
        depositeAmount: depositeAmount,
        moneyDeposit: moneyDeposit
      });
    }
  }

  const handleCancle = () => {
    onClose();
  }

  useEffect(() => {
    if (approvedForm.depositType === 'PAY_IN') {
      setApprovedForm({...approvedForm, moneyDeposit: approvedForm.depositeAmount})
    }
  }, [approvedForm.depositType])

  return (
    <Fragment>
      <Dialog
        id='ModalConfirmApproved'
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='sm'
        PaperProps={{ sx: { minWidth: 700, minHeight: 241 } }}>
        <DialogContent sx={{ mt: 3, mr: 5, ml: 5 }}>
          <DialogContentText id='Topic' align='center' sx={{ color: '#263238', mb: 3 }}>
            <Typography component='span' variant='h6'>
              ยืนยันอนุมัติ
            </Typography>
          </DialogContentText>
          <Box id='Description'>
            <Grid container rowSpacing={1} columnSpacing={7} mt={'10px'}>
              <InputNumberLayout id={'DepositeAmount'} name={'depositeAmount'} color='#BEEDC2'
                title='ยอดเงินที่ต้องนำฝาก' disabled
                value={approvedForm.depositeAmount}
                onChange={(value) => setApprovedForm({...approvedForm, depositeAmount: value})} />
              <Grid container item xs={12} sx={{alignItems: 'center'}}>
                <Grid item xs={5} sx={{textAlign: 'right'}}>
                    นำฝาก
                  <Typography component='span' sx={{ ml:1 ,mr: 2 }}>:</Typography>
                </Grid>
                <Grid item xs={5}>
                  <FormControl id="DepositType" className={classes.Mselect} fullWidth>
                    <Select
                      id="Type"
                      name="type"
                      value={approvedForm.depositType}
                      // disabled={isOpenLoading}
                      onChange={(e) => setApprovedForm({...approvedForm, depositType: e.target.value})}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      {depositList.map((deposit, index: number) => (
                        <MenuItem key={index} value={deposit.key}>
                          {deposit.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <InputNumberLayout id={'MoneyDeposit'} name={'moneyDeposit'} native={false}
                title='เงินที่จะนำฝาก'
                value={approvedForm.moneyDeposit}
                onChange={(value) => setApprovedForm({...approvedForm, moneyDeposit: value})} />
              <Grid container item xs={12} sx={{alignItems: 'center'}}>
                <Grid item xs={5} sx={{textAlign: 'right', mt:'-25px'}}>
                    หมายเหตุ
                  <Typography component='span' sx={{ ml:1 ,mr: 2 }}>:</Typography>
                </Grid>
                <Grid item xs={5}>
                <TextBoxComment
                  defaultValue={approvedForm.comment}
                  isDisable={false}
                  maxLength={100}
                  maxWidth='100%'
                  isError={!approvedForm.comment && (isError && (approvedForm.depositeAmount !== approvedForm.moneyDeposit))}
                  onChangeComment={(value) => {
                    setApprovedForm({...approvedForm, comment: value});
                  }}
                  rowDisplay={2}
                />
                {(!approvedForm.comment && (isError && (approvedForm.depositeAmount !== approvedForm.moneyDeposit))) && (
                  <Typography component='label' variant='caption' sx={{ color: '#F54949' }}>
                    กรุณาระบุหมายเหตุ เนื่องจาก<br />ยอดเงินที่ต้องนำฝาก ไม่เท่ากับ เงินที่จะนำฝาก
                  </Typography>
                )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mb: 5, mr: 5, ml: 5 }}>
          <Button
            id='btnCancle'
            variant='contained'
            color='cancelColor'
            sx={{ borderRadius: 2, width: 140, mr: 4 }}
            onClick={handleCancle}>
            ยกเลิก
          </Button>
          <Button
            id='btnConfirm'
            variant='contained'
            color='primary'
            sx={{ borderRadius: 2, width: 140 }}
            onClick={handleConfirm}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </ Fragment>
  )
}

const InputNumberLayout = (props: InputNumberLayoutProps) => {
  const classes = useStyles();
  const { title, id, name, value, onChange, validate, color, disabled = false, decimal = 2, native } = props
  return (
    <Grid container item xs={12} sx={{alignItems: 'center'}}>
      <Grid item xs={5} sx={{textAlign: 'right'}}>
        {title}
        <Typography component='span' sx={{ ml:1 ,mr: 2 }}>:</Typography>
      </Grid>
      <Grid item xs={6}>
        <NumberFormat
          id={id}
          name={name}
          value={''+value}
          onChange={(e: any) => onChange(number(e.target.value))}
          decimalScale={decimal}
          className={classes.MtextFieldNumber}
          disabled={disabled}
          customInput={TextField}
          fixedDecimalScale
          allowNegative={native}
          autoComplete='off'
          thousandSeparator={true}
          sx={{
            '.MuiOutlinedInput-root': {
              '& input': {
                background: color || 'white',
                borderRadius: '3px',
                width: '230px'
              },
              '& fieldset': {
                borderColor: validate ? 'red' : '#0000003b'
              }
            },
          }}
          />
      </Grid>
    </Grid>
  )
}