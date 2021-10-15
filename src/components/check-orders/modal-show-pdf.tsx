//@ts-nocheck
import { Dialog, Button } from '@mui/material';
import React, { ReactElement, useRef } from 'react'
import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print'
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import throttle from 'lodash.throttle';
import { useReactToPrint } from 'react-to-print';

interface ModalShowPDFProp {
    open: boolean,
    url: string,
    onClose: () => void,
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
                    id='closeBtn'
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 0,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
            {onPrint ? (
                // <IconButton
                //     aria-label="print"
                //     onClick={onPrint}
                //     sx={{
                //         position: 'absolute',
                //         right: 16,
                //         top: 0,
                //         color: (theme) => theme.palette.grey[500],
                //     }}
                // >
                //     <PrintIcon />
                // </IconButton>
                <Button
                    id='printBtn'
                    variant='contained'
                    color='primary'
                    onClick={onPrint}
                    endIcon={<LocalPrintshopOutlinedIcon />}
                >พิมพ์ใบตรวจการรับสินค้า</Button>
            ) : null}
        </DialogTitle>
    );
};

export default function ModalShowPDF({ open, url, onClose }: ModalShowPDFProp): ReactElement {
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [initialWidth, setInitialWidth] = useState(null);
    const pdfWrapper = useRef(null)

    const setPdfSize = () => {
        if (pdfWrapper && pdfWrapper.current) {
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
    const handleClose = () => {
        onClose();
    }

    // const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => pdfWrapper.current,
    });

    return (

        <Dialog open={open} maxWidth={initialWidth}>
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} onPrint={handlePrint} />

            <div id="placeholderWrapper" style={{ height: '3000vh' }} />
            <div id="pdfWrapper" style={{ width: '45vw' }} ref={pdfWrapper}>
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    {
                        Array.from(
                            new Array(numPages),
                            (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    width={initialWidth}
                                // height={1000}
                                />
                            ),
                        )
                    }
                </Document>
            </div>
        </Dialog >
    );
}
