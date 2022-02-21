import React, {ReactElement, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import LoadingModal from '../commons/ui/loading-modal';
import {Box, TextField} from "@mui/material";
import {useStyles} from "../../styles/makeTheme";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {stringNullOrEmpty} from "../../utils/utils";
import {rejectBarcodeDiscount} from "../../services/barcode-discount";
import {updateDataDetail} from "../../store/slices/barcode-discount-slice";
import {BDStatus} from "../../utils/enum/common-enum";

interface Props {
    open: boolean;
    onClose: (confirm : boolean) => void;
    barCode: string;
    id: string;
}

interface loadingModalState {
    open: boolean;
}

export default function ModalReject({open, onClose, barCode, id}: Props): ReactElement {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const approveReject = useAppSelector((state) => state.barcodeDiscount.approveReject);
    const dataDetail = useAppSelector((state) => state.barcodeDiscount.dataDetail);
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
        open: false,
    });

    const handleOpenLoading = (prop: any, event: boolean) => {
        setOpenLoadingModal({...openLoadingModal, [prop]: event});
    };

    const onCloseModal = async () => {
        setReason('');
        setError('');
        onClose(false);
    };

    const handleConfirm = async () => {
        if (stringNullOrEmpty(reason)) {
            setError('กรุณาระบุรายละเอียด');
            return;
        }
        let res = await rejectBarcodeDiscount(id, reason);
        if (res && res.code === 20000) {
            dispatch(
                updateDataDetail({
                    ...dataDetail,
                    status: Number(BDStatus.REJECT),
                })
            );
            onClose(true);
        }
    };

    useEffect(() => {
        setReason(approveReject ? approveReject.approvalNote : '');
    }, [approveReject]);

    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                PaperProps={{sx: {minWidth: 450, height: 365}}}
            >
                <DialogContent sx={{mt: 1, mr: 4, ml: 4}}>
                    <DialogContentText id="alert-dialog-description" sx={{color: '#263238'}}>
                        <Typography variant="h6" align="center" sx={{marginBottom: 2}}>
                            ยืนยันยกเลิกขอส่วนลดสินค้า
                        </Typography>
                        {!!barCode && (
                            <Typography variant="body1" align="left" sx={{marginBottom: 2}}>
                                เลขที่เอกสาร BD{' '}
                                <label
                                    style={{
                                        color: '#AEAEAE',
                                        marginLeft: '10px',
                                        marginRight: '5px',
                                    }}
                                >
                                    |
                                </label>{' '}
                                <label style={{color: '#36C690'}}>
                                    <b>{barCode}</b>
                                </label>
                            </Typography>
                        )}
                        <Box sx={{display: 'flex'}}>
                            <Typography align='left' sx={{display: 'flex', width: '100%'}}>
                                กรุณากรอกเหตุผล
                                <Typography sx={{color: '#F54949', marginRight: '5px'}}> * </Typography> :
                            </Typography>
                            <Typography sx={{
                                width: '100%', color: '#F54949', textAlign: 'right',
                                display: stringNullOrEmpty(error) ? 'none' : undefined
                            }}>
                                {error}
                            </Typography>
                        </Box>
                        <TextField
                            placeholder=" ความยาวไม่เกิน 100 ตัวอักษร"
                            multiline
                            rows={5}
                            className={classes.MTextareaBD}
                            inputProps={{
                                maxLength: '100',
                            }}
                            sx={{width: '345px'}}
                            variant="outlined"
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setError('');
                            }}
                        />
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{justifyContent: 'center', mb: 2, mr: 5, ml: 5}}>
                    <Button
                        id="btnCancle"
                        variant="contained"
                        color="cancelColor"
                        sx={{borderRadius: 2, width: 80, mr: 4}}
                        onClick={onCloseModal}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        id="btnConfirm"
                        variant="contained"
                        color="primary"
                        sx={{borderRadius: 2, width: 80}}
                        onClick={handleConfirm}
                    >
                        ยืนยัน
                    </Button>
                </DialogActions>
            </Dialog>
            <LoadingModal open={openLoadingModal.open}/>
        </div>
    );
}
