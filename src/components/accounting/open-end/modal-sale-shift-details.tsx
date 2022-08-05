import { ReactNode, ReactElement, Fragment, useState, useRef } from "react";
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
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Components
import CardHeader from 'components/card-header'

// Hooks func
import useScrollTop from 'hooks/useScrollTop'

interface ModalSaleShiftDetailsProps {
  open: boolean;
  payload?: any;
  onClose: () => void;
}

interface InputProps {
  inputForm: any
}

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
    borderTop: '2px solid #e1e1e1',
    paddingTop: '15px'
  }
  
  // Set valiable
  const state = {
    docNo: '0E22060412-20',
    branch: '412 นครชื่นชุ่ม',
    date: '20/06/2565',
    bypass: 'ไม่มี'
  }

  // Set state data
  const CardContent = useRef<HTMLElement>(null);
  const [inputForm, setInputForm] = useState({
    summaryAmoun: {
      test: 'test'
    },
    cashReceived: {
      test2: 'test2'
    },
    cashPayment: {
      test3: 'test3'
    }
  })
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
      <Dialog id='ModalSaveCloseShiftKey' open={open} fullWidth={true} maxWidth='xl'>
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
            sx={{ maxHeight: '99ch', padding: 0 }}
          >
            <Box ref={CardContent} sx={{ display: 'flex', flexDirection: 'column', padding: '20px 24px' }}>
              <Box id='DetailsSection'>
                <Details detailsData={state} />
                <DialogActions sx={{ justifyContent: 'right', marginTop: '15px' }}>
                  <LoadingButton
                    id='btnSave'
                    variant='contained'
                    color='warning'
                    loading={isOpenLoading}
                    loadingIndicator={
                      <Typography component='span' sx={{ fontSize: '11px' }}>
                        กรุณารอสักครู่ <CircularProgress color='inherit' size={15} />
                      </Typography>
                    }
                    sx={{ borderRadius: 2, width: 100}}
                    onClick={(e) => {console.log(e)}}>
                    บันทึก
                  </LoadingButton>
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
                    sx={{ borderRadius: 2, width: 100}}
                    onClick={(e) => {console.log(e)}}>
                    ขออนุมัติ
                  </LoadingButton>
                </DialogActions>
              </Box>

              <Box id='SummaryAmounSection' sx={TopLine}>
                <Typography component='label' sx={{ fontSize: '18px' }}>
                  <b>สรุปยอดเงินที่ต้องนำฝาก</b>
                </Typography>
                <SummaryAmoun inputForm={inputForm.summaryAmoun} />
              </Box>
              
              <Box id='CashReceived' sx={TopLine}>
                <Typography component='label' sx={{ fontSize: '18px' }}>
                  <b>รายการเงินสดรับภายนอก</b>
                </Typography>
                <CashReceived inputForm={inputForm.cashReceived} />
              </Box>

              <Box id='CashPayment' sx={TopLine}>
                <Typography component='label' sx={{ fontSize: '18px' }}>
                  <b>รายการเงินสดจ่าย</b>
                </Typography>
                <CashPayment inputForm={inputForm.cashPayment} />
              </Box>

              { !!scrollTop && (
                <DialogActions sx={{
                  display: 'grid',
                  position: 'absolute',
                  right: '40px',
                  bottom: '15px'}}>
                  <IconButton sx={{width: 'fit-content', margin: 'auto'}} onClick={goTopModal}>
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

const SummaryAmoun = (props: InputProps) => {
  const { inputForm } = props
  return (
    <Box></Box>
  )
}

const CashReceived = (props: InputProps) => {
  const { inputForm } = props
  return (
    <Box></Box>
  )
}

const CashPayment = (props: InputProps) => {
  const { inputForm } = props
  return (
    <Box></Box>
  )
}