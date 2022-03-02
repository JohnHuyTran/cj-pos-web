import React, { ReactElement, useEffect } from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { Button, DialogTitle, Grid, IconButton, TextField, Typography } from '@mui/material';
import { Download, HighlightOff } from '@mui/icons-material';
import { useStyles } from '../../styles/makeTheme';
import { useAppDispatch } from '../../store/store';
import DatePickerComponent from '../commons/ui/date-picker-detail';
import ReasonsListDropDown from './transfer-reasons-list-dropdown';
import { fetchDownloadTemplateRT } from '../../services/stock-transfer';
import moment from 'moment';
import LoadingModal from '../commons/ui/loading-modal';

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

interface State {
  branchFrom: string;
  branchTo: string;
  dateFrom: string;
  dateTo: string;
  transferReason: string;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[400],
          }}
        >
          <HighlightOff fontSize="large" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

function stockRequestUploadFile({ isOpen, onClickClose }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [values, setValues] = React.useState<State>({
    branchFrom: '',
    branchTo: '',
    dateFrom: '',
    dateTo: '',
    transferReason: '',
  });

  useEffect(() => {
    setOpen(isOpen);
  }, [open]);

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  if (endDate != null && startDate != null) {
    if (endDate < startDate) {
      setEndDate(null);
    }
  }

  const handleChangeReasons = (ReasonsCode: string) => {
    if (ReasonsCode !== null) {
      let codes = JSON.stringify(ReasonsCode);
      setValues({ ...values, transferReason: JSON.parse(codes) });
    } else {
      setValues({ ...values, transferReason: '' });
    }
  };

  const handleDownloadTemplate = async () => {
    setOpenLoadingModal(true);
    await fetchDownloadTemplateRT()
      .then((value) => {
        console.log('value:', value);
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(value.data);
        a.download = `RT_TEMPLATE_${moment(new Date()).format('YYYYMMDDhhmmss')}.xlsx`;
        a.click();
      })
      .catch((error: any) => {
        console.log('fetchDownloadTemplateRT:', error);
      });

    // console.log('fetchDownloadTemplateRT response headers: ', (await response).headers['content-disposition']);
    // // const headerval = (await response).headers['content-disposition'])
    // // var filename = headerval.split(';')[1].split('=')[1].replace('"', '').replace('"', '');
    // console.log('fetchDownloadTemplateRT response data: ', (await response).data);

    setOpenLoadingModal(false);
  };

  return (
    <div>
      <Dialog open={open} maxWidth="sm" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClickClose}></BootstrapDialogTitle>

        <DialogContent>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 7 }}>
            <Grid item xs={12} mt={2} sx={{ textAlign: 'end' }}>
              <Button
                id="btnImport"
                variant="contained"
                color="primary"
                startIcon={<Download />}
                onClick={handleDownloadTemplate}
                className={classes.MbtnSearch}
              >
                Download Template
              </Button>
            </Grid>
          </Grid>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 4 }}>
            <Grid item xs={6}>
              <Typography gutterBottom variant="subtitle1" component="div">
                วันที่โอน
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                ตั้งแต่*
              </Typography>
              <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom variant="subtitle1" component="div" sx={{ mt: 3.5 }}>
                ถึง*
              </Typography>
              <DatePickerComponent
                onClickDate={handleEndDatePicker}
                value={endDate}
                type={'TO'}
                minDateTo={startDate}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                สาเหตุการโอน*
              </Typography>
              <ReasonsListDropDown onChangeReasons={handleChangeReasons} isClear={clearBranchDropDown} />
            </Grid>

            <Grid item xs={10} mt={2}>
              <TextField
                id="txtDocNo"
                name="docNo"
                size="small"
                // value={values.docNo}
                // onChange={handleChange}
                className={classes.MtextUpLoadFile}
                fullWidth
                placeholder="เอกสารแนบ"
              />
            </Grid>
            <Grid item xs={2} mt={2} sx={{ paddingLeft: '10px !important' }}>
              <Button
                id="btnImport"
                variant="contained"
                color="primary"
                // onClick={handleOpenUploadFileModal}
                className={classes.MbtnSearch}
                sx={{ width: '100%' }}
              >
                แนบไฟล์
              </Button>
            </Grid>

            <Grid item xs={12} mt={2} sx={{ textAlign: 'center' }}>
              <Button
                id="btnImport"
                variant="contained"
                color="cancelColor"
                // onClick={handleOpenUploadFileModal}
                sx={{ width: '20%', mr: 2 }}
                className={classes.MbtnClear}
              >
                ยกเลิก
              </Button>
              <Button
                id="btnImport"
                variant="contained"
                color="primary"
                startIcon={<Download />}
                // onClick={handleOpenUploadFileModal}
                className={classes.MbtnSearch}
                sx={{ width: '27%' }}
              >
                อัพโหลดเอกสาร
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <LoadingModal open={openLoadingModal} />
    </div>
  );
}

export default stockRequestUploadFile;
