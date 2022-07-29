import React, { ReactElement, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import LoadingModal from '../../commons/ui/loading-modal';
import { useStyles } from 'styles/makeTheme';
import { BootstrapDialogTitle } from 'components/commons/ui/dialog-title';
import { Grid, TextField, Typography } from '@mui/material';
import { Download } from '@mui/icons-material';
import { fetchDownloadTemplateRT } from 'services/stock-transfer';
import moment from 'moment';
import { ApiUploadError } from 'models/api-error-model';
import { importCashStatement } from 'services/accounting';

interface Props {
  open: boolean;
  onClickClose: () => void;
  onConfirm: (files: any) => void;
}
interface loadingModalState {
  open: boolean;
}

export default function ModalCashStatementImport({ open, onClickClose, onConfirm }: Props): ReactElement {
  const classes = useStyles();
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);

  useEffect(() => {
    console.log('open:', open);
  }, [open === true]);

  const handleDownloadTemplate = async () => {
    setOpenLoadingModal(true);
    await fetchDownloadTemplateRT()
      .then((value) => {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(value.data);
        a.download = `FINANCE_RESULT_${moment(new Date()).format('YYYYMMDDhhmmss')}.xlsx`;
        a.click();
      })
      .catch((error: any) => {
        console.log('fetchDownloadTemplateRT:', error);
      });

    setOpenLoadingModal(false);
  };

  const [errorUploadFile, setErrorUploadFile] = React.useState(false);
  const [errorBrowseFile, setErrorBrowseFile] = React.useState(false);
  const [msgErrorBrowseFile, setMsgErrorBrowseFile] = React.useState('');
  const [validationFile, setValidationFile] = React.useState(false);
  const [file, setFile] = React.useState<File>();
  const [fileName, setFileName] = React.useState('');

  const handleFileInputChange = (e: any) => {
    // setFlagEdit(true);
    setValidationFile(false);
    setErrorBrowseFile(false);
    setMsgErrorBrowseFile('');
    // checkSizeFile(e);

    let file: File = e.target.files[0];
    // let file: File = e.target.files;
    setFileName(file.name);
    const chkValidation = chkValidationFile(file.name);
    if (chkValidation) setFile(file);

    // let fileType = file.type.split('/');
    // const fileName = `${sdNo}-01.${fileType[1]}`;
  };

  const chkValidationFile = (fileName: string) => {
    let parts = fileName.split('.');
    let length = parts.length - 1;

    if (parts[length].toLowerCase() !== 'xlsx') {
      setValidationFile(true);
      setErrorBrowseFile(true);
      setMsgErrorBrowseFile('กรุณาแนบไฟล์.xlsx เท่านั้น');
      return false;
    }

    setValidationFile(false);
    setErrorBrowseFile(false);
    setMsgErrorBrowseFile('');
    return true;
  };

  const handleUpLoadFile = async () => {
    return onConfirm(file ? file : null);

    // setOpenLoadingModal(true);

    // if (file) {
    // await importCashStatement(file)
    //   .then((value) => {
    //     // setErrorUploadFile(false);

    //     alert('คุณได้Importข้อมูลเรียบร้อยแล้ว');

    //     setTimeout(() => {
    //       onClickClose();
    //     }, 1000);
    //   })
    //   .catch((error: ApiUploadError) => {
    //     setFile(undefined);
    //     setFileName('');

    //     if (errorUploadFile) setErrorUploadFile(false);
    //     else if (!errorUploadFile) setErrorUploadFile(true);

    //     // if (error.code === 40000) {
    //     //   setOpenAlertFile(true);
    //     //   setOpenAlert(true);
    //     //   setTitelError('ไม่สามารถ import file ได้');
    //     //   setTextError('รูปแบบไฟล์ต้องเป็น excel format (.xlsx)');
    //     //   setBase64EncodeFile('');
    //     //   setLinkFileError(false);
    //     // } else if (error.code === 40001) {
    //     //   setOpenAlertFile(true);
    //     //   setOpenAlert(true);
    //     //   setTitelError('ไม่สามารถ import file ได้');
    //     //   setTextError(error.message);
    //     //   setBase64EncodeFile('');
    //     //   setLinkFileError(false);
    //     // } else if (error.code === 40013) {
    //     //   setOpenAlertFile(true);
    //     //   setOpenAlert(true);
    //     //   setTitelError('ไม่สามารถ import file ได้');
    //     //   setTextError('');

    //     //   const b64Data = error.data?.base64EncodeFile;
    //     //   if (b64Data) {
    //     //     setBase64EncodeFile(b64Data);
    //     //     setLinkFileError(true);
    //     //   }
    //     // } else {
    //     //   setOpenAlertFile(true);
    //     //   setOpenAlert(true);
    //     //   setTitelError('ไม่สามารถ import file ได้');
    //     //   setTextError('');
    //     //   setBase64EncodeFile('');
    //     //   setLinkFileError(false);
    //     // }
    //   });
    // }

    // setOpenLoadingModal(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='lg'
        PaperProps={{ sx: { minWidth: 700 } }}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={onClickClose}>
          <Typography variant='subtitle1'>นำเข้าเอกสาร</Typography>
        </BootstrapDialogTitle>
        <DialogContent sx={{ mr: 3, ml: 3 }}>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 7 }}>
            <Grid item xs={12} sx={{ textAlign: 'end' }}>
              <Button
                id='btnImport'
                variant='contained'
                color='primary'
                startIcon={<Download />}
                onClick={handleDownloadTemplate}
                className={classes.MbtnSearch}
                style={{ minWidth: 150 }}>
                Download Template
              </Button>
            </Grid>
          </Grid>

          {/* <Grid container mt={2} rowSpacing={2} columnSpacing={{ xs: 7 }}>
            <Grid item xs={6} sx={{ textAlign: 'start' }}>
              xxx
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'end' }}>
              <Button
                id='btnImport'
                variant='contained'
                color='primary'
                startIcon={<Download />}
                onClick={handleDownloadTemplate}
                className={classes.MbtnSearch}
                style={{ minWidth: 150 }}>
                Download Template
              </Button>
            </Grid>
          </Grid> */}

          <Grid item xs={12} mt={2} mb={4}>
            <div>
              {errorBrowseFile === true && (
                <>
                  <TextField
                    error
                    name='browserTxf'
                    className={classes.MtextFieldUpload}
                    value={fileName}
                    placeholder='แนบไฟล์ .xlsx'
                    helperText={msgErrorBrowseFile}
                  />
                </>
              )}

              {errorBrowseFile === false && (
                <>
                  <TextField
                    name='browserTxf'
                    className={classes.MtextFieldUpload}
                    value={fileName}
                    placeholder='กรุณาเลือกไฟล์ที่ต้องการนำเข้า'
                    helperText='แนบไฟล์ .xlsx'
                  />
                </>
              )}

              {errorUploadFile === true && (
                <>
                  <input
                    id='btnBrowse'
                    type='file'
                    accept='.xlsx'
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />
                </>
              )}

              {errorUploadFile === false && (
                <>
                  <input
                    id='btnBrowse'
                    type='file'
                    accept='.xlsx'
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />
                </>
              )}

              <label htmlFor={'btnBrowse'}>
                <Button
                  id='btnPrint'
                  color='primary'
                  variant='contained'
                  component='span'
                  startIcon={<Download />}
                  className={classes.MbtnSearch}
                  style={{ marginLeft: 10, textTransform: 'none', minWidth: 200 }}>
                  แนบไฟล์
                </Button>

                {/* <TextField
                  name='browserTxf'
                  className={classes.MtextFieldUpload}
                  placeholder='กรุณาเลือกไฟล์ที่ต้องการนำเข้า'
                  helperText='แนบไฟล์ .xlsx'
                  disabled={true}
                /> */}
                {/* <Button
                  id='btnImport'
                  variant='contained'
                  color='primary'
                  startIcon={<Download />}
                  style={{ marginLeft: 10, minWidth: 200 }}
                  className={classes.MbtnSearch}>
                  Import
                </Button> */}
              </label>
            </div>
          </Grid>

          <Grid item xs={12} mt={2} sx={{ textAlign: 'center' }}>
            <Button
              id='btnImport'
              variant='contained'
              color='primary'
              startIcon={<Download />}
              onClick={handleUpLoadFile}
              className={classes.MbtnSearch}
              sx={{ width: '27%' }}>
              อัพโหลดเอกสาร
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>

      <LoadingModal open={openLoadingModal} />
    </div>
  );
}
