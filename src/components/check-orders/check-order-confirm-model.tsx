import React, { ReactElement } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Item, OrderApproveCloseJobRequest } from '../../models/order-model'
import { approveOrderShipments, closeOrderShipments } from '../../services/order-shipment'

interface ConfirmOrderShipment {
    open: boolean,
    onClose: () => void,
    shipmentNo: string,
    action: string,
    items: Item[],
    percentDiffType: string,
    percentDiffValue: string,
    imageContent: BinaryData,
}

export default function CheckOrderConfirmModel(props: ConfirmOrderShipment) {
    const { open, onClose, shipmentNo, action, items, percentDiffType, percentDiffValue, imageContent } = props;

    const contentText = () => {
        console.log(`action: ${action}`)
        if (action === 'approve' && items.length > 0) {
            return `ยืนยันการตรวจสอบ <br/> เลขที่เอกสาร ${shipmentNo} show table`
        }

        if (action === 'approve') {
            return `ยืนยันการตรวจสอบ <br/> เลขที่เอกสาร ${shipmentNo}`
        }

        if (action === 'approve' && percentDiffType) {
            return `ไม่สามารถอนุมัติ เลขที่เอกสาร ${shipmentNo} เนื่องจาก จำนวนสินค้าที่รับ < ${percentDiffValue} % กรุณาตรวจสอบอีกครั้งหรือติดต่อ IT  เบอร์โทร 02-111-2222`
        }

        if (action === 'closjob' && !imageContent) {
            return `กรุณาแนบเอกสาร ใบตรวจสการรับสินค้า <br/>พร้อมลายเซ็นต์`
        }

        if (action === 'closjob') {
            return `ปิดงาน <br/> เลขที่เอกสาร ${shipmentNo}`
        }
    }

    const confirmApproveBtn = () => {
        console.log('action', action)
        if (action === 'approve') {
            const payload: OrderApproveCloseJobRequest = {
                shipmentNo: shipmentNo
            }
            approveOrderShipments(payload);
        } else if (action === 'closeJob') {
            const payload: OrderApproveCloseJobRequest = {
                shipmentNo: shipmentNo,
                imageContent: imageContent,
            }
            closeOrderShipments(payload);
        }
    }



    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog
            open={open}
            aria-describedby='alert-dialog-description'
            fullWidth={true}
            maxWidth='xs'
        >
            <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    {contentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='contained'
                    size='small'
                    color='primary'
                    onClick={handleClose}
                >
                    รับทราบ
                </Button>
                <Button
                    variant='contained'
                    size='small'
                    color='primary'
                    onClick={confirmApproveBtn}
                >
                    ยืนยัน
                </Button>
            </DialogActions>
        </Dialog>
    )
}
