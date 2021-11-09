import { Dialog, Button } from "@mui/material";
import React, { ReactElement, useRef } from "react";
import { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import throttle from "lodash.throttle";
import { useReactToPrint } from "react-to-print";
import AlertError from "../commons/ui/alert-error";

interface ModalShowPDFProp {
  open: boolean;
  url: string;
  onClose: () => void;
}
export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onPrint?: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, onPrint, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          id="closeBtn"
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 0,
            color: (theme) => theme.palette.grey[100],
          }}
        >
          <CloseIcon sx={{ color: "#676767" }} />
        </IconButton>
      ) : null}
      {onPrint ? (
        <Button
          id="btnPrint"
          variant="contained"
          color="secondary"
          onClick={onPrint}
          endIcon={<LocalPrintshopOutlinedIcon />}
        >
          พิมพ์ใบตรวจการรับสินค้า
        </Button>
      ) : null}
    </DialogTitle>
  );
};

export default function ModalShowPDF({
  open,
  url,
  onClose,
}: ModalShowPDFProp): ReactElement {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
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
    window.addEventListener("resize", throttle(setPdfSize, 300));
    setPdfSize();
    return () => {
      window.removeEventListener("resize", throttle(setPdfSize, 300));
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

  // const componentRef = useRef();
  const showPrint = useReactToPrint({
    content: () => pdfWrapper.current,
    onAfterPrint: () => handleClose(),
  });

  const handlePrint = () => {
    showPrint;
    // setTimeout(() => {
    //     onClose()
    // }, 1000);
  };

  return (
    <div>
      <Dialog open={open} maxWidth={false}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          onPrint={showPrint}
        />

        <div id="placeholderWrapper" style={{ height: "3000vh" }} />
        <div id="pdfWrapper" style={{ width: "50vw" }} ref={pdfWrapper}>
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadFail}
          >
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
      </Dialog>

      <AlertError
        open={openAlert}
        onClose={handleCloseAlert}
        titleError="Failed"
        textError="Failed to load PDF"
      />
    </div>
  );
}
