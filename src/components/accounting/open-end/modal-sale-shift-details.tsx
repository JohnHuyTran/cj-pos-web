import { ReactNode, ReactElement, Fragment, useState, useEffect, useRef } from "react";
import NumberFormat from 'react-number-format';
import { useTranslation } from 'react-i18next';
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
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  ArrowForwardIos,
  CheckCircleOutline,
  Save
} from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from 'store/store';

// Components
import CardHeader from 'components/card-header'
import AccordionUploadFile from 'components/commons/ui/accordion-upload-file'
import ModalDetailCash from 'components/accounting/open-end/modal-detail-cash';

// Hooks function
import useScrollTop from 'hooks/useScrollTop'

// API call
import { saveOpenEnd, submitApproveOpenEnd } from 'services/accounting';

interface ModalSaleShiftDetailsProps {
  open: boolean;
  onClose: () => void;
}

interface InputNumberLayoutProps {
  title: string,
  id?: string,
  name?: string,
  color?: string,
  value: string | number,
  decimal?: number,
  children?: ReactNode,
  disabled?: boolean,
  validate?: boolean,
  onChange: (value: any) => void
}

interface DetailsProps {
  detailsData: any,
  isDisabledUploadFile: boolean
}

export default function ModalSaleShiftDetails(props: ModalSaleShiftDetailsProps): ReactElement {
  // Props
  const { open, onClose } = props

  // Custom style
  const classes = useStyles();
  const TopLine = { 
    mt:'30px',
    borderTop: '2px solid #EAEBEB',
    paddingTop: '15px'
  }
  
  // Set valiable
  const dispatch = useAppDispatch();
  const viewOpenEndResponse = useAppSelector((state) => state.viewOpenEndSlice.viewOpenEnd);
  const data: any = viewOpenEndResponse.data || null;
  const fileUploadList = useAppSelector((state) => state.uploadFileSlice.state);
  const initialDetailsState = {
    docNo: data?.docNo,
    branchName: data?.branchName,
    shiftDate: data?.shiftDate,
    bypass: data?.bypass
  }
  const initialFormInputState = {
    summarizeCashDeposite: {
      dailyIncomeAmount: '',
      cashOverShortAmount: '',
      totalCashAmount: '',
      cdmAmount: '',
      totalPayAmount: '',
      depositeAmount: '',
      nextCDMAmount: '',
      diffDepositeAmount: '',
      comment: ''
    },
    externalIncome: {
      totalExIncomeAmount: ''
    },
    externalIncomeList: [],
    cashPayment: {
      totalPayAmount: '',
      iceAmount: '',
      yakultAmount: '',
      coffeeExpenseAmount: '',
      frontExpenseAmount: ''
    }
  }

  // Set state data
  const CardContent = useRef<HTMLElement>(null);
  const [summarizeCashDeposite, setSummarizeCashDeposite] = useState(initialFormInputState.summarizeCashDeposite)
  const [externalIncome, setExternalIncome] = useState(initialFormInputState.externalIncome)
  const [externalIncomeList, setExternalIncomeList] = useState<any[]>(initialFormInputState.externalIncomeList)
  const [cashPayment, setCashPayment] = useState(initialFormInputState.cashPayment)
  const [isSaveOpenLoading, setIsSaveOpenLoading] = useState(false);
  const [isSubmitOpenLoading, setIsSubmitOpenLoading] = useState(false);
  const [openModalCashDetail, setOpenModalCashDetail] = useState(false);
  const [scrollTop, scrollProps] = useScrollTop();

  // handle function
  const goTopModal = () => {
    CardContent.current?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }
  
  const number = (value: any) => {
    // function comvert number
    return (+(''+value).replaceAll(',', ''))
  }

  const calculate = () => {
    // รายการเงินสดรับภายนอก (รวม) bussiness logic
    const totalExIncomeAmountCal = (
      externalIncomeList.reduce(( total, num ) => (total.amount + num.amount))
    )
    
    //ยอดรวมเงินสดร้านค้า bussiness logic
    const { cashAmount, diffAmount } = data.income
    const totalCashAmountCal = (
      number(cashAmount) + number(totalExIncomeAmountCal) + number(diffAmount)
    )
    
    // ยอดเงินที่ต้องนำฝาก business logic
    const { cashOverShortAmount, cdmAmount, totalPayAmount } = summarizeCashDeposite
    const depositeAmountCal = (
      number(totalCashAmountCal) + number(cashOverShortAmount) + (number(cdmAmount) - number(totalPayAmount))
    )

    setExternalIncome({...externalIncome, totalExIncomeAmount: totalExIncomeAmountCal})
    setSummarizeCashDeposite({
      ...summarizeCashDeposite,
      totalCashAmount: ''+totalCashAmountCal,
      depositeAmount: ''+depositeAmountCal
    })
  }

  const handleExternalIncomeList = (value: any, code: number) => {
    setExternalIncomeList(prevState => {
      const newState = prevState.map(obj => {
        if (obj.code === code) {
          if (Object.keys(value)[0] === 'amount') {
            // calculate(value.amount)
            return {...obj, amount: number(value.amount)};
          }
          if (Object.keys(value)[0] === 'noItem') {
            if (value.noItem) { // ถ้า checked amount = 0
              return {...obj, amount: 0, noItem: value.noItem};
            }
            return {...obj, noItem: value.noItem};
          }
        }
        return obj;
      })
      return newState
    })
  }

  const handleSave = async () => {
    const payload = {
      docNo: data?.docNo,
      settlementFiles: data?.settlementFiles,
      items: externalIncomeList
    }
    setIsSaveOpenLoading(true)
    try {
      const res = await saveOpenEnd(payload, fileUploadList);
      // handleClose();
    } catch (err) {
      console.log(err)
    } finally {
      setIsSaveOpenLoading(false);
    }
  }

  const handleApprove = async () => {
    const payload = {
      settlementFiles: data?.settlementFiles,
      items: externalIncomeList
    }
    setIsSubmitOpenLoading(true)
    try {
      const res = await submitApproveOpenEnd(data?.docNo, payload, fileUploadList);
      handleClose();
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitOpenLoading(false);
    }
  }

  const handleClose = () => {
    setSummarizeCashDeposite(initialFormInputState.summarizeCashDeposite)
    setExternalIncome(initialFormInputState.externalIncome)
    setCashPayment(initialFormInputState.cashPayment)
    onClose()
  }

  useEffect(() => {
    if (data) {
      const externaleIncome = data.externalIncome
      setSummarizeCashDeposite({
        ...initialFormInputState.summarizeCashDeposite,
        ...data.summarizeCashDeposite,
        comment: data.comment
      })
      setExternalIncome({...initialFormInputState.externalIncome, ...data.externalIncome})
      setCashPayment({...initialFormInputState.cashPayment, ...data.cashPayment})
      if (externaleIncome?.items && externaleIncome?.items.length > 0) {
        setExternalIncomeList([...initialFormInputState.externalIncomeList, ...data.externalIncome.items])
      }
    }
  }, [data])
  
  useEffect(() => {
    if(data && externalIncomeList.length > 0) {
      calculate()
    }
  }, [externalIncomeList])

  return (
    <Fragment>
      <Dialog id='ModalSaveCloseShiftKey' open={open} fullWidth={true} maxWidth='lg'>
        <Box id='Card'>
          <CardHeader
            onClose={handleClose}
            scrollTop={scrollTop}
            isLoading={isSaveOpenLoading || isSubmitOpenLoading}
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
                <Details
                  detailsData={initialDetailsState}
                  isDisabledUploadFile={isSaveOpenLoading || isSubmitOpenLoading}
                />
                <DialogActions sx={{ justifyContent: 'right', marginTop: '10px' }}>
                  <LoadingButton
                    id='btnSave'
                    variant='contained'
                    color='warning'
                    startIcon={<Save />}
                    loading={isSaveOpenLoading}
                    loadingIndicator={
                      <Typography component='span' sx={{ fontSize: '11px' }}>
                        กรุณารอสักครู่ <CircularProgress color='inherit' size={15} />
                      </Typography>
                    }
                    sx={{ borderRadius: 2, height: 40, width: 110}}
                    onClick={handleSave}>
                    บันทึก
                  </LoadingButton>
                  <LoadingButton
                    id='btnSave'
                    variant='contained'
                    color='primary'
                    startIcon={<CheckCircleOutline />}
                    loading={isSubmitOpenLoading}
                    loadingIndicator={
                      <Typography component='span' sx={{ fontSize: '11px' }}>
                        กรุณารอสักครู่ <CircularProgress color='inherit' size={15} />
                      </Typography>
                    }
                    sx={{ borderRadius: 2, height: 40, width: 110}}
                    onClick={handleApprove}>
                    ขออนุมัติ
                  </LoadingButton>
                </DialogActions>
              </Box>

              <Box id='SummarizeCashDepositeSection' sx={TopLine}>
                <Typography component='label' sx={{ fontSize: '18px' }}>
                  <b>สรุปยอดเงินที่ต้องนำฝาก</b>
                </Typography>
                <Grid container rowSpacing={1} columnSpacing={7} mt={'10px'}>
                  <InputNumberLayout id={'DailyIncomeAmount'} name={'dailyIncomeAmount'}
                    title='มูลค่ายอดประจำวัน'
                    disabled
                    value={summarizeCashDeposite.dailyIncomeAmount}
                    onChange={(value) => setSummarizeCashDeposite(
                      {...summarizeCashDeposite, dailyIncomeAmount: value}
                    )}>
                    <LoadingButton
                      id='BtnDetails'
                      variant='contained'
                      color='secondary'
                      sx={{ borderRadius: 2, width: 110}}
                      onClick={() => setOpenModalCashDetail(true)}>
                      ดูรายละเอียด
                    </LoadingButton>
                  </InputNumberLayout>
                  <InputNumberLayout id={'CashOverShortAmount'} name={'cashOverShortAmount'}
                    title='เงินฝากขาดเกินจากทางการเงิน' disabled
                    value={summarizeCashDeposite.cashOverShortAmount}
                    onChange={(value) => setSummarizeCashDeposite({...summarizeCashDeposite, cashOverShortAmount: value})}>
                  </InputNumberLayout>
                  <InputNumberLayout id={'TotalCashAmount'} name={'totalCashAmount'}
                    title='ยอดรวมเงินสดร้านค้า' disabled
                    value={summarizeCashDeposite.totalCashAmount}
                    onChange={(value) => setSummarizeCashDeposite({...summarizeCashDeposite, totalCashAmount: value})}>
                    <Typography color='#AEAEAE'>
                      (เงินสดรับ + เงินสดจากร้านค้าภายนอก)
                    </Typography>
                  </InputNumberLayout>
                  <InputNumberLayout id={'CdmAmount'} name={'cdmAmount'}
                    title='เงินสะสมรอฝากตู้ CDM' disabled
                    value={summarizeCashDeposite.cdmAmount}
                    onChange={(value) => setSummarizeCashDeposite({...summarizeCashDeposite, cdmAmount: value})}>
                    <Typography color='#AEAEAE'>
                      (เงินสะสมจากวันก่อนหน้า)
                    </Typography>
                  </InputNumberLayout>
                  <InputNumberLayout id={'SummarizeCashDepositeTotalPayAmount'}
                    name={'summarizeCashDepositetotalPayAmount'}
                    title='รวมเงินสดจ่าย' disabled
                    value={summarizeCashDeposite.totalPayAmount}
                    onChange={(value) => setSummarizeCashDeposite({...summarizeCashDeposite, totalPayAmount: value})}>
                  </InputNumberLayout>
                  <InputNumberLayout id={'DepositeAmount'} name={'depositeAmount'} color='#BEEDC2'
                    title='ยอดเงินที่ต้องนำฝาก' disabled
                    value={summarizeCashDeposite.depositeAmount}
                    onChange={(value) => setSummarizeCashDeposite({...summarizeCashDeposite, depositeAmount: value})}>
                    <Typography color='#AEAEAE'>
                      (ยอดรวมเงินสดร้านค้า + เงินฝากขาด + เงินสะสมรอฝากตู้ CDM - เงินสดจ่าย)
                    </Typography>
                  </InputNumberLayout>
                  <InputNumberLayout id={'NextCDMAmount'} name={'nextCDMAmount'} color='#E7FFE9'
                    title='เงินรอฝาก CDM วันถัดไป' disabled
                    value={summarizeCashDeposite.nextCDMAmount}
                    onChange={(value) => setSummarizeCashDeposite({...summarizeCashDeposite, nextCDMAmount: value})}>
                    <Typography color='#AEAEAE'>
                      (สำหรับวันถัดไป)
                    </Typography>
                  </InputNumberLayout>
                  <InputNumberLayout id={'DiffDepositeAmount'} name={'diffDepositeAmount'}
                    title='ส่วนต่างเงินฝาก' disabled
                    value={summarizeCashDeposite.diffDepositeAmount}
                    onChange={(value) => setSummarizeCashDeposite({...summarizeCashDeposite, diffDepositeAmount: value})}>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: '110px' }}>
                      <Typography sx={{width: '100px'}} component='label'>หมายเหตุ : </Typography>
                      <TextField
                        id="Comment"
                        name="comment"
                        size="small"
                        disabled
                        value={summarizeCashDeposite.comment}
                        onChange={(e) => setSummarizeCashDeposite({...summarizeCashDeposite, comment: e.target.value})}
                        className={classes.MtextField}
                        fullWidth
                        sx={{ml: 4}}
                      />
                    </Box>
                  </InputNumberLayout>
                </Grid>
              </Box>
              
              <Box id='ExternalIncomeSection' sx={TopLine}>
                <Typography component='label' sx={{ fontSize: '18px' }}>
                  <b>รายการเงินสดรับภายนอก</b>
                </Typography>
                <Grid container rowSpacing={1} columnSpacing={7} mt={'10px'}>
                  <InputNumberLayout id={'result'} name={'result'}
                    title='รวม' disabled
                    value={externalIncome.totalExIncomeAmount}
                    onChange={(value) => setExternalIncome({...externalIncome, totalExIncomeAmount: value})} />
                  { externalIncomeList.length > 0 && (
                    externalIncomeList.map((item: any, index: number) => (
                      <Fragment key={item.code}>
                        <InputNumberLayout id={item.name} name={item.name}
                          title={item.name}
                          disabled={externalIncomeList[index]['noItem'] || (isSaveOpenLoading || isSubmitOpenLoading)}
                          value={externalIncomeList[index]['amount']}
                          onChange={(value) => handleExternalIncomeList(
                            { amount: value }, item.code
                          )}>
                          <FormControlLabel
                            control={
                              <Checkbox id={item.name} name={item.name}
                                checked={externalIncomeList[index]['noItem']}
                                disabled={isSaveOpenLoading || isSubmitOpenLoading}
                                onChange={(e) => handleExternalIncomeList(
                                  { noItem: e.target.checked }, item.code
                                )}
                              />
                            }
                            label='ไม่มีรายการ' 
                          />
                        </InputNumberLayout>
                      </Fragment>
                    ))
                  )}
                </Grid>
              </Box>

              <Box id='CashPaymentSection' sx={TopLine} mb={'20px'}>
                <Typography component='label' sx={{ fontSize: '18px' }}>
                  <b>รายการเงินสดจ่าย</b>
                </Typography>
                <Grid container rowSpacing={1} columnSpacing={7} mt={'10px'}>
                  <InputNumberLayout id={'CashPaymentTotalPayAmount'} name={'cashPaymentTotalPayAmount'}
                    title='รวม' disabled
                    value={cashPayment.totalPayAmount}
                    onChange={(value) => setCashPayment({...cashPayment, totalPayAmount: value})} />
                  <InputNumberLayout id={'IceAmount'} name={'iceAmount'}
                    title='ค่าน้ำแข็ง' disabled
                    value={cashPayment.iceAmount}
                    onChange={(value) => setCashPayment({...cashPayment, iceAmount: value})} />
                  <InputNumberLayout id={'YakultAmount'} name={'yakultAmount'}
                    title='ค่ายาคูลท์' disabled
                    value={cashPayment.yakultAmount}
                    onChange={(value) => setCashPayment({...cashPayment, yakultAmount: value})} />
                  <InputNumberLayout id={'CoffeeExpenseAmount'} name={'coffeeExpenseAmount'}
                    title='เงินอนุมัติสำรองร้านกาแฟ' disabled
                    value={cashPayment.coffeeExpenseAmount}
                    onChange={(value) => setCashPayment({...cashPayment, coffeeExpenseAmount: value})} />
                  <InputNumberLayout id={'FrontExpenseAmount'} name={'frontExpenseAmount'}
                    title='เงินอนุมัติสำรองหน้าร้าน' disabled
                    value={cashPayment.frontExpenseAmount}
                    onChange={(value) => setCashPayment({...cashPayment, frontExpenseAmount: value})} />
                </Grid>
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
              { openModalCashDetail && (
                <ModalDetailCash isOpen={openModalCashDetail} onClose={() => setOpenModalCashDetail(false)}/>
              )}
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
    </Fragment>
  )
}

const InputNumberLayout = (props: InputNumberLayoutProps) => {
  const classes = useStyles();
  const { title, id, name, value, onChange, children, validate, color, disabled = false, decimal = 2 } = props
  return (
    <Grid container item xs={12} sx={{alignItems: 'center'}}>
      <Grid item xs={3} sx={{textAlign: 'right'}}>
        {title}
        { validate && (
          <Typography component='span' color='red'> * </Typography>
        )}
        <Typography component='span'> : </Typography>
      </Grid>
      <Grid item xs='auto' sx={{pl: '40px'}}>
        <NumberFormat
          id={id}
          name={name}
          value={''+value}
          onChange={(e: any) => onChange(e.target.value)}
          decimalScale={decimal}
          className={classes.MtextFieldNumber}
          disabled={disabled}
          customInput={TextField}
          fixedDecimalScale
          autoComplete='off'
          thousandSeparator={true}
          sx={{
            '.MuiOutlinedInput-root': {
              '& input': {
                background: color || 'white',
                borderRadius: '3px'
              }
            },
          }}
          />
      </Grid>
      <Grid ml={3}>
        {children}
      </Grid>
    </Grid>
  )
}

const Details = (props: DetailsProps) => {
  const { detailsData, isDisabledUploadFile } = props
  
  // Set data upload
  const [attachFiles, setAttachFiles] = useState([]);
  const [uploadFileFlag, setUploadFileFlag] = useState(false);
  const { t } = useTranslation(['openEnd']);

  // handle function
  const handleDeleteFile = (item: any) => {
    let attachFileData = {...attachFiles}
    let attachFileDataFilter = attachFileData.filter((it: any) => it.fileKey !== item.fileKey);
    setAttachFiles(attachFileDataFilter);
  };

  return (
    <Grid container rowSpacing={3} columnSpacing={7}>
      <Grid container item md={4} sm={12} xs={12}>
        <Grid item xs={4}><b>เลขที่เอกสาร :</b></Grid>
        <Grid item xs={8}>{detailsData.docNo || '-'}</Grid>
      </Grid>
      <Grid container item md={4} sm={12} xs={12}>
        <Grid item xs={4}><b>สาขา :</b></Grid>
        <Grid item xs={8}>{detailsData.branchName || '-'}</Grid>
      </Grid>
      <Grid container item md={4} sm={12} xs={12}>
        <Grid item xs={4}><b>วันที่ยอดขาย :</b></Grid>
        <Grid item xs={8}>{ detailsData.shiftDate
            ? new Date(detailsData.shiftDate).toLocaleDateString("th-TH")
            : '-' 
          }
        </Grid>
      </Grid>
      <Grid container item md={8} sm={12} xs={12}>
        <Grid item xs={3}><b>แนบเอกสาร Settlement :</b></Grid>
        <Grid item xs={6}>
          <AccordionUploadFile
            title="แนบเอกสาร"
            files={attachFiles}
            docNo={'docNo'}
            docType='OE'
            disabled={isDisabledUploadFile}
            isStatus={uploadFileFlag}
            onChangeUploadFile={(status: boolean) => setUploadFileFlag(status)}
            onDeleteAttachFile={handleDeleteFile}
            enabledControl={true}
          />
        </Grid>
      </Grid>
      <Grid container item md={4} sm={12} xs={12}>
        <Grid item xs={4}><b>การBypass :</b></Grid>
        <Grid item xs={8}>{detailsData.bypass ? t(`statusByPass.${detailsData.bypass}`) : '-'}</Grid>
      </Grid>
    </Grid>
  )
}
