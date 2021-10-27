import React, { ReactElement, useEffect } from 'react'

import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'

import { BootstrapDialogTitle } from '../commons/ui/dialog-title'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import ModalShowPDF from '../check-orders/modal-show-pdf'
import { getPathReportSD } from '../../services/order-shipment'
import { TextField } from '@mui/material'
import DCOrderEntries from './dc-check-order-entries'
import ModelConfirm from './modal-confirm'
import SnackbarStatus from '../commons/ui/snackbar-status'

interface Props {
    isOpen: boolean,
    sdNo: string,
    shipmentNo: string,
    onClickClose: () => void
}

interface State {
    commentDC: string;
}

interface SnackbarProps {
    open: boolean,
    onClose: () => void,
    isSuccess: boolean,
    contentMsg: string

}

function DCOrderDetail({ isOpen, sdNo, shipmentNo, onClickClose }: Props): ReactElement {
    const [values, setValues] = React.useState<State>({
        commentDC: '',
    });

    const [isDisplayActBtn, setIsDisplayActBtn] = React.useState('');
    const [open, setOpen] = React.useState(isOpen);
    const [openModelPreviewDocument, setOpenModelPreviewDocument] = React.useState(false);
    const [openModelConfirm, setOpenModelConfirm] = React.useState(false);

    const [showSnackBar, setShowSnackBar] = React.useState(false);
    const [contentMsg, setContentMsg] = React.useState('');
    const [generateBOStatus, setGenerateBOStatus] = React.useState(false);

    useEffect(() => {
        console.log('dc open', open)
        setOpen(isOpen);
    }, [open]);



    const handleChange = (event: any) => {
        const value = event.target.value;
        setValues({ ...values, [event.target.name]: value });
        console.log(values);
    };


    const handlCheckedButton = () => {
        setOpenModelConfirm(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const handleLinkDocument = () => {
        setOpenModelPreviewDocument(true);
    }

    const handleModelPreviewDocument = () => {
        setOpenModelPreviewDocument(false);
    }

    const handleModelConfirm = () => {
        setOpenModelConfirm(false);
    }


    const handleGenerateBOStatus = (issuccess: boolean, errorMsg: string) => {
        const msg = issuccess ? 'This transaction is success' : errorMsg;
        setShowSnackBar(true);
        setContentMsg(msg)
        setGenerateBOStatus(issuccess);
        // setSnackbarValue({ ...snackbarValue, open: true, onClose: handleCloseSnackBar, isSuccess: issuccess, contentMsg: msg });
    }

    const handleCloseSnackBar = () => {
        setShowSnackBar(false);
    }

    return (
        <div>
            <Dialog open={open} maxWidth='xl' fullWidth={true} >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={onClickClose} >
                    <Typography variant="body1" gutterBottom>ตรวจสอบผลต่าง(DC)</Typography>
                </BootstrapDialogTitle>
                <DialogContent>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>เลขที่เอกสาร LD:</Typography>
                            </Grid>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>LD20211020001644</Typography>
                            </Grid>

                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>เลขที่เอกสาร SD:</Typography>
                            </Grid>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>SD2021D002-21</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>วันที่:</Typography>
                            </Grid>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>11/11/2021</Typography>
                            </Grid>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>สถานะการตรวจสอบผลต่าง:</Typography>
                            </Grid>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>รอการตรวจสอบ</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>ประเภท:</Typography>
                            </Grid>
                            <Grid item lg={9} >
                                <Typography variant="body2" gutterBottom>ลังกระดาษ/ลังพลาสติก</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>หมายเหตุ DC:</Typography>
                            </Grid>
                            <Grid item lg={9} >
                                <TextField id='txbCommentDC' size="small" onChange={handleChange} value={values.commentDC} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>แนบภาพสินค้า/วีดีโอ:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={handleLinkDocument}
                                >
                                    ดูเอกสาร
                                </Link>

                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>แนบเอกสารใบส่วนต่างหลังเซ็นต์:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={handleLinkDocument}
                                >
                                    ดูเอกสาร
                                </Link>

                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent="center" style={{ marginTop: 0.1 }}>
                            <Grid item  >
                                <Box sx={{ display: isDisplayActBtn }}>
                                    <Button
                                        id='btnChecked'
                                        variant='contained'
                                        color='secondary'
                                        onClick={handlCheckedButton}
                                    >ตรวจสอบแล้ว</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <DCOrderEntries sdNo={sdNo} />
                </DialogContent>
            </Dialog>

            <ModelConfirm
                open={openModelConfirm}
                onClose={handleModelConfirm}
                onUpdateAction={handleGenerateBOStatus}
                sdNo={sdNo}
                shipmentNo={shipmentNo}
                comment='comment'
            />
            <ModalShowPDF
                open={openModelPreviewDocument}
                onClose={handleModelPreviewDocument}
                url={getPathReportSD(sdNo)}

            />

            <SnackbarStatus open={showSnackBar} onClose={handleCloseSnackBar} isSuccess={generateBOStatus} contentMsg={contentMsg} />
        </div>
    )
}

export default DCOrderDetail
