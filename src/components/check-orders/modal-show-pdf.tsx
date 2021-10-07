import { Dialog, DialogContent } from '@mui/material';
import React, { ReactElement } from 'react'
import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface ModalShowPDFProp {
    open: boolean,
    url: string,
    onClose: () => void,
}
export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose?: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export default function ModalShowPDF({ open, url, onClose }: ModalShowPDFProp): ReactElement {
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess(numPages: number) {
        setNumPages(numPages);
    }
    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={open} maxWidth='xl' fullWidth={true} >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} />
            <DialogContent>
                <div>
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        externalLinkTarget="_blank"
                    >
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <p>Page {pageNumber} of {numPages}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
