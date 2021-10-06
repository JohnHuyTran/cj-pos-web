import React, { ReactElement } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import { Item, OrderApproveCloseJobRequest } from '../../models/order-model'
import { approveOrderShipments, closeOrderShipments } from '../../services/order-shipment'
import { CheckOrderEnum } from '../../utils/enum/check-order-enum';

interface ConfirmOrderShipment {
    open: boolean,
    onClose: () => void,
    onUpdateShipmentStatus: (value: boolean) => void,
    shipmentNo: string,
    action: string,
    items: Item[],
    percentDiffType: string,
    percentDiffValue: string,
    imageContent: BinaryData,
}

export default function CheckOrderConfirmModel(props: ConfirmOrderShipment) {
    const { open, onClose, onUpdateShipmentStatus, shipmentNo, action, items, percentDiffType, percentDiffValue, imageContent } = props;

    const confirmApproveBtn = () => {
        if (action === CheckOrderEnum.STATUS_APPROVE_VALUE) {
            const payload: OrderApproveCloseJobRequest = {
                shipmentNo: shipmentNo
            }

            approveOrderShipments(payload)
                .then(
                    function (value) {
                        console.log("value, ", value);
                        onUpdateShipmentStatus(true);
                        onClose();
                    },
                    function (error) {
                        console.log("err, ", error);
                        onUpdateShipmentStatus(true);
                        onClose();
                    }
                );


        } else if (action === CheckOrderEnum.STATUS_CLOSEJOB_VALUE) {
            const payload: OrderApproveCloseJobRequest = {
                shipmentNo: shipmentNo,
                imageContent: imageContent,
            }
            closeOrderShipments(payload)
                .then(
                    function (value) {
                        console.log("value, ", value);
                    },
                    function (error) {
                        console.log("err, ", error);
                    }
                )
                .catch(err => {
                    console.log(err)
                })
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
            {action === CheckOrderEnum.STATUS_APPROVE_VALUE && items.length > 0 && <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    <Typography variant="body2" gutterBottom>ยืนยันการตรวจสอบ <br /> เลขที่เอกสาร {shipmentNo} show table</Typography>
                </DialogContentText>
            </DialogContent>
            }
            {action === CheckOrderEnum.STATUS_APPROVE_VALUE && items.length <= 0 && <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    <Typography variant="body2" gutterBottom>ยืนยันการตรวจสอบ <br /> เลขที่เอกสาร {shipmentNo}</Typography>
                </DialogContentText>
            </DialogContent>
            }

            {/* {action === CheckOrderEnum.STATUS_APPROVE_VALUE && percentDiffType && <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    <Typography variant="body2" gutterBottom>ไม่สามารถอนุมัติ เลขที่เอกสาร {shipmentNo} เนื่องจาก จำนวนสินค้าที่รับ  {percentDiffValue}  กรุณาตรวจสอบอีกครั้งหรือติดต่อ IT  เบอร์โทร 02-111-2222</Typography>
                </DialogContentText>
            </DialogContent>

            } */}

            {action === CheckOrderEnum.STATUS_CLOSEJOB_VALUE && !imageContent && <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    <Typography variant="body2" gutterBottom>กรุณาแนบเอกสาร ใบตรวจสการรับสินค้า <br />พร้อมลายเซ็นต์</Typography>
                </DialogContentText>
            </DialogContent>

            }

            {action === CheckOrderEnum.STATUS_CLOSEJOB_VALUE && imageContent && <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    <Typography variant="body2" gutterBottom>ปิดงาน <br /> เลขที่เอกสาร {shipmentNo}</Typography>
                </DialogContentText>
            </DialogContent>

            }

            {((action === CheckOrderEnum.STATUS_CLOSEJOB_VALUE && !imageContent)) && <DialogActions>
                <Button
                    variant='contained'
                    size='small'
                    color='primary'
                    onClick={handleClose}
                >
                    รับทราบ
                </Button>
            </DialogActions>
            }

            {
                ((action === CheckOrderEnum.STATUS_APPROVE_VALUE) || (action === CheckOrderEnum.STATUS_CLOSEJOB_VALUE && imageContent)) && <DialogActions><Button
                    variant='contained'
                    size='small'
                    color='primary'
                    onClick={confirmApproveBtn}
                >
                    ยืนยัน
                </Button>
                    <Button
                        variant='contained'
                        size='small'
                        color='primary'
                        onClick={handleClose}
                    >
                        ยกเลิก
                    </Button></DialogActions>
            }

        </Dialog>
    )
}
