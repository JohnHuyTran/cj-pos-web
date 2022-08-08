import { ReactNode, ReactElement, Fragment, useState, useRef } from "react";
import NumberFormat from 'react-number-format';
import { HighlightOff } from '@mui/icons-material';
import { useStyles } from 'styles/makeTheme';
import {
  Grid,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
  TabScrollButton,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  ArrowForwardIos,
  CheckCircleOutline,
  Save
} from '@mui/icons-material'

// Components
import CardHeader from 'components/card-header'

// Hooks function
import useScrollTop from 'hooks/useScrollTop'

interface ModalSaleShiftDetailsProps {
  open: boolean;
  payload?: any;
  onClose: () => void;
}

interface InputNumberLayoutProps {
  id: string,
  name?: string,
  value: string | number,
  decimal?: number,
  children?: ReactNode,
  disable?: boolean,
  validate?: boolean,
  onChange: (value: any) => void
}
/* 
interface InputProps {
  inputForm: any
  setInputForm: (value: any) => void
} */

interface DetailsProps {
  detailsData: any
}

export default function ModalSaleShiftDetails(props: ModalSaleShiftDetailsProps): ReactElement {
  // Props
  const { open, payload, onClose } = props

  // Custom style
  const classes = useStyles();
  const TopLine = { 
    mt:'30px',
    borderTop: '2px solid #EAEBEB',
    paddingTop: '15px'
  }
  
  // Set valiable
  const state = {
    docNo: '0E22060412-20',
    branch: '412 นครชื่นชุ่ม',
    date: '20/06/2565',
    bypass: 'ไม่มี'
  }
  const initialSearchState = {
    summaryAmoun: {
      test: 'test'
    },
    cashReceived: {
      test2: 'test2',
      result: '',
      boonterm: '',
      aj: ''
    },
    cashPayment: {
      test3: 'test3'
    }
  }

  // Set state data
  const CardContent = useRef<HTMLElement>(null);
  const [summaryAmoun, setSummaryAmoun] = useState(initialSearchState.summaryAmoun)
  const [cashReceived, setCashReceived] = useState(initialSearchState.cashReceived)
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [scrollTop, scrollProps] = useScrollTop();
  
  // handle function
  const goTopModal = () => {
    CardContent.current?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Fragment>
      <Dialog id='ModalSaveCloseShiftKey' open={open} fullWidth={true} maxWidth='lg'>
        <Box id='Card'>
          <CardHeader
            onClose={handleClose}
            scrollTop={scrollTop}
            isLoading={isOpenLoading}
            steps={['บันทึก', 'ขออนุมัติ', 'อนุมัติ']}
            actionStep={0}
          >
            <b>รายละเอียดปิดรอบการขาย</b>
          </CardHeader>
          <DialogContent id='CardContent'
            {...(typeof scrollProps === 'object' ? scrollProps : {})}
            sx={{ maxHeight: 'calc(100vh - 230px)', padding: 0 }}
          >
            <Box ref={CardContent} sx={{ display: 'flex', flexDirection: 'column', padding: '20px 24px' }}>
              <Box id='DetailsSection'>
                <Details detailsData={state} />
                <DialogActions sx={{ justifyContent: 'right', marginTop: '15px' }}>
                  <LoadingButton
                    id='btnSave'
                    variant='contained'
                    color='warning'
                    startIcon={<Save />}
                    loading={isOpenLoading}
                    loadingIndicator={
                      <Typography component='span' sx={{ fontSize: '11px' }}>
                        กรุณารอสักครู่ <CircularProgress color='inherit' size={15} />
                      </Typography>
                    }
                    sx={{ borderRadius: 2, height: 40, width: 110}}
                    onClick={(e) => {console.log(e)}}>
                    บันทึก
                  </LoadingButton>
                  <LoadingButton
                    id='btnSave'
                    variant='contained'
                    color='primary'
                    startIcon={<CheckCircleOutline />}
                    loading={isOpenLoading}
                    loadingIndicator={
                      <Typography component='span' sx={{ fontSize: '11px' }}>
                        กรุณารอสักครู่ <CircularProgress color='inherit' size={15} />
                      </Typography>
                    }
                    sx={{ borderRadius: 2, height: 40, width: 110}}
                    onClick={(e) => {console.log(e)}}>
                    ขออนุมัติ
                  </LoadingButton>
                </DialogActions>
              </Box>

              <Box id='SummaryAmounSection' sx={TopLine}>
                <Typography component='label' sx={{ fontSize: '18px' }}>
                  <b>สรุปยอดเงินที่ต้องนำฝาก</b>
                </Typography>
                {/* <SummaryAmoun inputForm={inputForm.summaryAmoun} setInputForm={setInputForm} /> */}
              </Box>
              
              <Box id='CashReceivedSection' sx={TopLine}>
                <Typography component='label' sx={{ fontSize: '18px' }}>
                  <b>รายการเงินสดรับภายนอก</b>
                </Typography>
                <Grid container rowSpacing={1} columnSpacing={7} mt={'10px'}>
                  <InputNumberLayout id={'result'} name={'result'}
                    value={cashReceived.result}
                    onChange={(value) => setCashReceived({...cashReceived, result: value})}>
                    รวม
                  </InputNumberLayout>
                  <InputNumberLayout id={'boonterm'} name={'boonterm'}
                    value={cashReceived.boonterm}
                    onChange={(value) => setCashReceived({...cashReceived, boonterm: value})}>
                    บุญเติม
                  </InputNumberLayout>
                  <InputNumberLayout id={'aj'} name={'aj'}
                    value={cashReceived.aj}
                    onChange={(value) => setCashReceived({...cashReceived, aj: value})}>
                    AJ เติมสบาย
                  </InputNumberLayout>
                </Grid>
              </Box>

              <Box id='CashPaymentSection' sx={TopLine}>
                <Typography component='label' sx={{ fontSize: '18px' }}>
                  <b>รายการเงินสดจ่าย</b>
                </Typography>
                {/* <CashPayment inputForm={inputForm.cashPayment} setInputForm={setInputForm} /> */}
              </Box>

              { !!scrollTop && (
                <DialogActions sx={{
                  display: 'grid',
                  position: 'absolute',
                  right: '40px',
                  bottom: '15px'}}>
                  <IconButton sx={{width: 'fit-content', margin: 'auto'}} onClick={goTopModal}>
                    <ArrowForwardIos
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
                  <Typography fontSize="13px" onClick={goTopModal}>กลับขึ้นด้านบน</Typography>
                </DialogActions>
              )}
            </Box>
          </DialogContent>
          {/* <Box id=''>
            <DialogActions sx={{ justifyContent: 'center', marginTop: '15px' }}>
              <LoadingButton
                id='btnSave'
                variant='contained'
                color='primary'
                loading={isOpenLoading}
                loadingIndicator={
                  <Typography component='span' sx={{ fontSize: '11px' }}>
                    กรุณารอสักครู่ <CircularProgress color='inherit' size={15} />
                  </Typography>
                }
                sx={{ borderRadius: 2, width: 100, mt: '32px', mb: 'auto' }}
                onClick={(e) => {console.log(e)}}>
                บันทึกรหัส
              </LoadingButton>
            </DialogActions>
          </Box> */}
        </Box>
      </Dialog>
    </Fragment>
  )
}

const InputNumberLayout = (props: InputNumberLayoutProps) => {
  const classes = useStyles();
  const { id, name, value, onChange, children, disable = false, validate, decimal = 0 } = props
  return (
    <Grid container item xs={12} sx={{alignItems: 'center'}}>
      <Grid xs={3} sx={{textAlign: 'right'}}>
        {children}
        { validate && (
          <Typography component='span' color='red'> * </Typography>
        )}
        <Typography component='span'> : </Typography>
      </Grid>
      <Grid xs={9} sx={{pl: '40px'}}>
        <NumberFormat
          id={id}
          name={name}
          value={''+value}
          onChange={(e: any) => onChange(e.target.value)}
          decimalScale={decimal}
          className={classes.MtextFieldNumber}
          disabled={disable}
          customInput={TextField}
          fixedDecimalScale
          autoComplete='off'
          thousandSeparator={true}
        />
      </Grid>
    </Grid>
  )
}

const Details = (props: DetailsProps) => {
  const { detailsData } = props
  return (
    <Grid container rowSpacing={1} columnSpacing={7}>
      <Grid container item md={4} sm={12} xs={12}>
        <Grid xs={4}><b>เลขที่เอกสาร :</b></Grid>
        <Grid xs={8}>{detailsData.docNo}</Grid>
      </Grid>
      <Grid container item md={4} sm={12} xs={12}>
        <Grid xs={4}><b>สาขา :</b></Grid>
        <Grid xs={8}>{detailsData.branch}</Grid>
      </Grid>
      <Grid container item md={4} sm={12} xs={12}>
        <Grid xs={4}><b>วันที่ยอดขาย :</b></Grid>
        <Grid xs={8}>{detailsData.date}</Grid>
      </Grid>
      <Grid container item md={8} sm={12} xs={12}>
        <Grid xs={4}><b>แนบเอกสาร Settlement :</b></Grid>
        <Grid xs={8}>{detailsData.date}</Grid>
      </Grid>
      <Grid container item md={4} sm={12} xs={12}>
        <Grid xs={4}><b>การBypass :</b></Grid>
        <Grid xs={8}>{detailsData.bypass}</Grid>
      </Grid>
    </Grid>
  )
}

/* const SummaryAmoun = (props: InputProps) => {
  const { inputForm, setInputForm } = props
  return (
    <Grid container rowSpacing={1} columnSpacing={7} mt={'10px'}>
      <InputNumberLayout id={'test'} name={'test'} value={inputForm.result} validate
        onChange={(value) => setInputForm(value)}
      >
        มูลค่ายอดประจำวัน
      </InputNumberLayout>
      <InputNumberLayout id={'test'} name={'test'} decimal={2} value={inputForm.result} onChange={(value) => inputForm}>
        เงินฝากขาดเกินจากทางการเงิน
      </InputNumberLayout>
    </Grid>
  )
}

const CashReceived = (props: InputProps) => {
  const { inputForm } = props
  return (
    <Grid container rowSpacing={1} columnSpacing={7} mt={'10px'}>
      <InputNumberLayout id={'result'} name={'result'} value={inputForm.result} onChange={(value) => inputForm}>
        รวม
      </InputNumberLayout>
      <InputNumberLayout id={'boonterm'} name={'boonterm'} value={inputForm.result} onChange={(value) => inputForm}>
        บุญเติม
      </InputNumberLayout>
      <InputNumberLayout id={'AJ'} name={'AJ'} value={inputForm.result} onChange={(value) => inputForm}>
        AJ เติมสบาย
      </InputNumberLayout>
    </Grid>
  )
}

const CashPayment = (props: InputProps) => {
  const { inputForm } = props
  return (
    <Box></Box>
  )
} */