import { Dialog, Button, DialogContent } from '@mui/material';
import React, { ReactElement, useEffect, useRef } from 'react';
import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import throttle from 'lodash.throttle';
import { useReactToPrint } from 'react-to-print';
import AlertError from './alert-error';
import { HighlightOff } from '@mui/icons-material';
import store from '../../../store/store';
import { getAccessToken } from '../../../store/sessionStore';
import { getReport } from '../../../adapters/externalApi';

interface ModalShowPDFProp {
  open: boolean;
  url: string;
  sdImageFile: string;
  statusFile: number;
  fileName: string;
  btnPrintName: string;
  onClose: () => void;
  onPrint?: () => void;
}
export interface DialogTitleProps {
  id: string;
  status: number;
  text: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onPrint?: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, status, text, onClose, onPrint, ...other } = props;
  return (
    <DialogTitle sx={{ m: 1, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[400],
          }}>
          <HighlightOff fontSize='large' />
        </IconButton>
      ) : null}
      {onPrint ? (
        <div>
          {status === 1 && (
            <Button
              id='btnPrint'
              variant='contained'
              color='secondary'
              onClick={onPrint}
              endIcon={<LocalPrintshopOutlinedIcon />}>
              {/* {text && 'พิมพ์เอกสาร'}
              {!text && 'พิมพ์ใบผลต่าง'} */}
              {text}
            </Button>
          )}
        </div>
      ) : null}
    </DialogTitle>
  );
};

export default function ModalShowPDF({
  open,
  url,
  sdImageFile,
  statusFile,
  fileName,
  btnPrintName,
  onClose,
}: ModalShowPDFProp): ReactElement {
  const [numPages, setNumPages] = useState(0);
  // const [pageNumber, setPageNumber] = useState(1);
  const [initialWidth, setInitialWidth] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const pdfWrapper = React.useRef<HTMLDivElement>(null);
  let token = getAccessToken();
  token = token ? `Bearer ${token}` : '';

  const setPdfSize = () => {
    if (pdfWrapper && pdfWrapper.current) {
      // pdfWrapper.current.getBoundingClientRect().width;
      setInitialWidth(pdfWrapper.current.getBoundingClientRect().width);
    }
  };

  function onDocumentLoadSuccess(pdf: any) {
    setNumPages(pdf.numPages);
    window.addEventListener('resize', throttle(setPdfSize, 300));
    setPdfSize();
    return () => {
      window.removeEventListener('resize', throttle(setPdfSize, 300));
    };
  }

  const onDocumentLoadFail = (error: any) => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handlePrint = () => {
    showPrint;
    // setTimeout(() => {
    //     onClose()
    // }, 1000);
  };

  // const componentRef = useRef();
  const showPrint = useReactToPrint({
    documentTitle: fileName,
    content: () => pdfWrapper.current,
    onAfterPrint: () => handleClose(),
  });

  const pdfFile = sdImageFile.substr(5, 15);
  const imgFile = sdImageFile.substr(5, 5);

  React.useEffect(() => {
    if (statusFile === 1) getReport(url);
  }, [open]);

  return (
    <div>
      <Dialog open={open} maxWidth={false}>
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={handleClose}
          onPrint={showPrint}
          status={statusFile}
          text={btnPrintName}
        />
        <DialogContent
          sx={{
            minWidth: 600,
            minHeight: 600,
            textAlign: 'center',
          }}>
          {/* <div id="placeholderWrapper" style={{ height: "3000vh" }} /> */}
          {statusFile === 1 && (
            <div id='pdfWrapper' style={{ width: '50vw' }} ref={pdfWrapper}>
              <Document
                file={{
                  url: url,
                  httpHeaders: {
                    Authorization: token,
                  },
                }}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadFail}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={initialWidth}
                    // height={1000}
                  />
                ))}
              </Document>
            </div>
          )}
          {statusFile === 0 && (
            <div>
              {imgFile !== 'image' && (
                <div id='pdfWrapper' style={{ width: '50vw' }} ref={pdfWrapper}>
                  <Document file={sdImageFile} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadFail}>
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={initialWidth}
                        // height={1000}
                      />
                    ))}
                  </Document>
                </div>
              )}

              {imgFile === 'image' && <img src={sdImageFile} style={{ minWidth: '200px' }} />}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertError open={openAlert} onClose={handleCloseAlert} textError='Failed to load PDF' />
    </div>
  );
}
