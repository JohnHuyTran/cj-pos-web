import { Dialog, Button, DialogContent } from '@mui/material';
import React, { ReactElement, useRef } from 'react';
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

interface ModalShowPDFProp {
  open: boolean;
  url: string;
  sdImageFile: string;
  statusFile: number;
  fileName: string;
  onClose: () => void;
  onPrint?: () => void;
}
export interface DialogTitleProps {
  id: string;
  status: number;
  children?: React.ReactNode;
  onClose?: () => void;
  onPrint?: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, status, onClose, onPrint, ...other } = props;
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
              {/* {status === 0 && "พิมพ์เอกสาร"} */}
              {/* {status === 1 && "พิมพ์ใบผลต่าง"} */}
              พิมพ์ใบผลต่าง
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
  onClose,
}: ModalShowPDFProp): ReactElement {
  const [numPages, setNumPages] = useState(0);
  // const [pageNumber, setPageNumber] = useState(1);
  const [initialWidth, setInitialWidth] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const pdfWrapper = React.useRef<HTMLDivElement>(null);

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

  return (
    <div>
      <Dialog open={open} maxWidth={false}>
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={handleClose}
          onPrint={showPrint}
          status={statusFile}
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
                    Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwbmZJNmF1MXZ5LWhRQ0s3ODJ1V2E3cWIzQVFYY1FfNnZYOWZwdE5FaHR3In0.eyJleHAiOjE2MzE3NzY3OTUsImlhdCI6MTYzMTc3NjQ5NSwianRpIjoiYjA5ZGM0ZmQtMTRlMS00M2UwLThkNTItMzU0YTBlMjU2NzM0IiwiaXNzIjoiaHR0cHM6Ly9hZG1pbi5hdXRoLWRldi5jamV4cHJlc3MuaW8vYXV0aC9yZWFsbXMvY2pleHByZXNzIiwic3ViIjoiOWY2ZDEyODEtOTJhOS00N2EzLTk0NWQtNWJkMTg0MjkzMjBjIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXBwLm5ld3Bvc2JhY2siLCJzZXNzaW9uX3N0YXRlIjoiMGM2ODkwMjMtZWI3ZC00MTQyLTgwOWMtYzRjNWFmODdiOTRmIiwiYWNyIjoiMSIsInNjb3BlIjoic2NvcGUubmV3cG9zYmFjayBlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoicG9zMiBwb3MyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicG9zMiIsImFjbCI6eyJzZXJ2aWNlLm5ld3Bvc2JhY2siOlsiQ0FTSERSQVdFUi5ERVBPU0lUIiwiU0FMRS5JVEVNLkNBTkNFTCIsIkZFQVRVUkUuQURNSU4uU0VBUkNILkRBVEEiLCJDQVNIRFJBV0VSLldJVEhEUkFXIl19LCJnaXZlbl9uYW1lIjoicG9zMiIsImJyYW5jaCI6IjAwMDIiLCJmYW1pbHlfbmFtZSI6InBvczIiLCJlbWFpbCI6InBvczJAdGVzdC5jb20ifQ.myRuJJxraId5ZptOahCJl2lt3YQczXDbatKGrEoquzuyRz4ID1QYOi2IZT6ND4Gpa8CCvtIjWKNuUrYQbRrjG8o1dJMzSAi5pt40HXbEiBvN2QDCuCF2NMPcBYZPMlPfMyNGTAafolpJYGHhjZy_4oGGZiUSbTzgQ91iVoY_WUHgdNTk9H8c-nvKxNRXIWos92AMox6-tlLkjksQsMusu9JZWEQ2v7Fmex_oIBghxPr-r9JGstm0_f16bbvMTyPskaDoOUehKNbw6V3I1IsfJgUnbUFbOlMXuCDsGmOtKbpouycPXJvj2BJJQ11PY28W4g7w3ddffLyVm4i8_OJRBg`,
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
