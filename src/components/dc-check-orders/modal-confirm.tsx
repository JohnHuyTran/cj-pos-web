import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { ApiError } from '../../models/api-error-model'
import { GenerateBORequest } from '../../models/order-model'
import { generateBO } from '../../services/order-shipment'

interface Props {
    open: boolean,
    onClose: () => void,
    onUpdateAction: (value: boolean, errorMsg: any) => void,
    shipmentNo: string,
    sdNo: string,
    comment: string,
}

export default function ModelConfirm({ open, onClose, onUpdateAction, shipmentNo, comment }: Props): ReactElement {
    const handleConfirm = () => {
        const payload: GenerateBORequest = {
            comment: comment,
        }
        generateBO(shipmentNo, payload)
            .then(
                function (value) {
                    setTimeout(() => {
                        onUpdateAction(true, '');

                    }, 3000);
                },
                function (error: ApiError) {
                    onUpdateAction(false, error.message);
                }
            );
        onClose();
    }
    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby='alert-dialog-description'
            fullWidth={true}
        >
            <DialogTitle>
                <Typography variant="body1" gutterBottom >ยืนยันการตรวจสอบ </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Typography variant="body2" gutterBottom align='center'>ยืนยันการตรวจสอบ </Typography>
                    <Typography variant="body2" gutterBottom align='center'>เลขที่เอกสาร {shipmentNo}</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                    id='btnConfirm'
                    variant='contained'
                    color='secondary'
                    onClick={handleConfirm}
                >
                    ยืนยัน
                </Button>
                <Button
                    id='btnCancle'
                    variant='contained'
                    color='cancelColor'
                    onClick={onClose}
                >
                    ยกเลิก
                </Button>
            </DialogActions>
        </Dialog>
    )
}
