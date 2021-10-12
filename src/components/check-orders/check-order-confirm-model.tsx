import React, { ReactElement } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Item, OrderApproveCloseJobRequest } from '../../models/order-model'
import { approveOrderShipments, closeOrderShipments } from '../../services/order-shipment'
import { ShipmentDeliveryStatusCodeEnum } from '../../utils/enum/check-order-enum';
import DataDiffInfo from './table-diff-info';

interface ConfirmOrderShipment {
    open: boolean,
    onClose: () => void,
    onUpdateShipmentStatus: (value: boolean) => void,
    shipmentNo: string,
    sdNo: string,
    action: number,
    items: Item[],
    percentDiffType: string,
    percentDiffValue: string,
    imageContent: BinaryData,
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

export default function CheckOrderConfirmModel(props: ConfirmOrderShipment) {
    const { open, onClose, onUpdateShipmentStatus, shipmentNo, sdNo, action, items, percentDiffType, percentDiffValue, imageContent } = props;
    const confirmApproveBtn = () => {
        if (action === ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE) {
            approveOrderShipments(sdNo)
                .then(
                    function (value) {
                        console.log("value, ", value);
                        onUpdateShipmentStatus(true);
                        onClose();
                    },
                    function (error) {
                        console.log("err, ", error);
                        onUpdateShipmentStatus(false);
                        onClose();
                    }
                );


        } else if (action === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB) {
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
            aria-labelledby="alert-dialog-title"
            aria-describedby='alert-dialog-description'
            fullWidth={true}
            maxWidth='sm'
        >
            {/* {action === CheckOrderEnum.STATUS_APPROVE_VALUE && items.length > 0 && <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    <Typography variant="body2" gutterBottom>ยืนยันการตรวจสอบ <br /> เลขที่เอกสาร {shipmentNo} show table</Typography>
                </DialogContentText>
            </DialogContent>
            } */}

            {action === ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE && <div><BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                <Typography variant="body1" gutterBottom>ยืนยันการตรวจสอบ</Typography>
            </BootstrapDialogTitle><DialogContent dividers>
                    <DialogContentText id='alert-dialog-description'>
                        <Typography variant="body2" gutterBottom align='center'>ยืนยันการตรวจสอบ </Typography>
                        <Typography variant="body2" gutterBottom align='center'>เลขที่เอกสาร {shipmentNo}</Typography>
                        {items.length > 0 && <DataDiffInfo items={items} />}
                    </DialogContentText>
                </DialogContent>
            </div>
            }

            {/* {action === CheckOrderEnum.STATUS_APPROVE_VALUE && percentDiffType && <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    <Typography variant="body2" gutterBottom>ไม่สามารถอนุมัติ เลขที่เอกสาร {shipmentNo} เนื่องจาก จำนวนสินค้าที่รับ  {percentDiffValue}  กรุณาตรวจสอบอีกครั้งหรือติดต่อ IT  เบอร์โทร 02-111-2222</Typography>
                </DialogContentText>
            </DialogContent>

            } */}

            {
                action === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && !imageContent && <div><DialogTitle id="alert-dialog-title">
                    <Typography variant="body1" gutterBottom>แจ้งเตือนแนบเอกสาร ใบตรวจสการรับสินค้า</Typography>
                </DialogTitle>  <DialogContent dividers>
                        <DialogContentText id='alert-dialog-description'>
                            <Typography variant="body2" gutterBottom align='center' >กรุณาแนบเอกสาร ใบตรวจสการรับสินค้า </Typography>
                            <Typography variant="body2" gutterBottom align='center'>พร้อมลายเซ็นต์</Typography>
                        </DialogContentText>
                    </DialogContent>
                </div>
            }

            {
                action === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && imageContent && <div><DialogTitle id="alert-dialog-title">
                    <Typography variant="body1" gutterBottom>ปิดงาน</Typography>
                </DialogTitle>  <DialogContent dividers>
                        <DialogContentText id='alert-dialog-description'>
                            <Typography variant="body2" gutterBottom align='center'>ปิดงาน </Typography>
                            <Typography variant="body2" gutterBottom align='center'>เลขที่เอกสาร {shipmentNo}</Typography>
                        </DialogContentText>
                    </DialogContent>
                </div>
            }

            {
                ((action === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && !imageContent)) && <DialogActions>
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
                ((action === ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE) || (action === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && imageContent)) && <DialogActions><Button
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

        </Dialog >
    )
}
