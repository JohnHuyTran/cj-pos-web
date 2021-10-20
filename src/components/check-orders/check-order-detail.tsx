
// @ts-nocheck
import React, { useEffect, useMemo, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/store';
import { featchOrderListAsync, clearDataFilter } from '../../store/slices/check-order-slice';

import { Box, Button, Dialog, DialogContent, Grid, TextField, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams, renderEditInputCell, GridEditRowsModel, useGridApiRef } from '@mui/x-data-grid';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save'
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DoneIcon from '@mui/icons-material/Done';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PreviewIcon from '@mui/icons-material/Preview';

import { useStyles } from './check-order-detail-css'
import { useFilePicker } from 'use-file-picker';

import { saveOrderShipments, getPathReportSD } from '../../services/order-shipment';
import ConfirmOrderShipment from './check-order-confirm-model';
import { ShipmentDeliveryStatusCodeEnum, getShipmentTypeText, getShipmentStatusText } from '../../utils/enum/check-order-enum';
import ModalShowPDF from './modal-show-pdf';
import { ShipmentInfo, ShipmentResponse, SaveDraftSDRequest, Quantity, CheckOrderDetailProps, Entry } from '../../models/order-model';
import { convertUtcToBkkDate } from '../../utils/date-utill'
import { ApiError } from '../../models/api-error-model';



const columns: GridColDef[] = [
    { field: "col1", headerName: "ลำดับ", width: 90, disableColumnMenu: 'true' },
    {
        field: "productId",
        headerName: "รหัสสินค้า",
        width: 170,
        disableColumnMenu: 'true'
    },
    { field: "productBarCode", headerName: "บาร์โค้ด", minWidth: 170, disableColumnMenu: 'true' },
    { field: "productDescription", headerName: "รายละเอียดสินค้า", minWidth: 300, disableColumnMenu: 'true' },
    { field: "productUnit", headerName: "หน่วย", minWidth: 100, disableColumnMenu: 'true' },
    {
        field: "productQuantityRef", headerName: "จำนวนอ้างอิง", width: 135, type: 'number', disableColumnMenu: 'true'

    },
    {
        field: "productQuantityActual", headerName: "จำนวนรับจริง", width: 135, disableColumnMenu: 'true',
        renderCell: (params: GridRenderCellParams) => (
            <TextField variant="outlined" name='txnQuantityActual' type='number' value={params.value} onChange={(e) => {
                params.api.updateRows([{ ...params.row, productQuantityActual: e.target.value }])
            }
            }
                onBlur={(e) =>
                    params.api.updateRows([{ ...params.row, productQuantityActual: getActualQty(e.target.value) }])
                }
                autoComplete='off'
            />
        )

    },
    {
        field: "productDifference", headerName: "ส่วนต่างการรับ", width: 145, type: 'number', disableColumnMenu: 'true',
        valueGetter: (params) => calProductDiff(params),
    },
    {
        field: "productComment", headerName: "หมายเหตุ", minWidth: 200, disableColumnMenu: 'true',
        renderCell: (params: GridRenderCellParams) => (
            < TextField variant="outlined" name='txnComment' value={params.value} onChange={(e) =>
                params.api.updateRows([{ ...params.row, productComment: e.target.value }])
            }
                autoComplete='off'
            />
        )
    },
];

var calProductDiff = function (params: GridValueGetterParams) {
    return params.getValue(params.id, 'productQuantityRef') - params.getValue(params.id, 'productQuantityActual');
};

var getActualQty = function (params: string) {
    return !params ? '0' : params;
}

function useApiRef() {
    const apiRef = useGridApiRef();
    const _columns = useMemo(
        () =>
            columns.concat({
                field: "__HIDDEN__",
                width: 0,
                renderCell: (params) => {
                    apiRef.current = params.api;
                    return null;
                }
            }),
        [columns]
    );

    return { apiRef, columns: _columns };
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
                        color: (theme) => theme.palette.grey[100],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export default function CheckOrderDetail(props: CheckOrderDetailProps) {
    const classes = useStyles();
    const { shipment, defaultOpen } = props;
    const items = useAppSelector((state) => state.checkOrderList);
    const payloadSearchOrder = useAppSelector((state) => state.saveSearchOrder);
    const dispatch = useAppDispatch();
    const res: ShipmentResponse = items.orderList;
    const [open, setOpen] = React.useState(defaultOpen);
    const [fileName, setFileName] = React.useState('');
    const { apiRef, columns } = useApiRef();

    const [disableSaveBtn, setDisableSaveBtn] = React.useState(false);
    const [disableApproveBtn, setDisableApproveBtn] = React.useState(false);
    const [disableCloseJobBtn, setDisableCloseJobBtn] = React.useState(false);
    const [isDisplayActBtn, setIsDisplayActBtn] = React.useState('');

    const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
    const [action, setAction] = React.useState();

    const [showSnackbarSuccess, setShowSnackbarSuccess] = React.useState(false);
    const [showSnackbarFail, setShowSnackbarFail] = React.useState(false);
    const [itemsDiffState, setItemsDiffState] = React.useState([]);

    const [openModelPreviewDocument, setOpenModelPreviewDocument] = React.useState(false);
    const [shipmentStatusText, setShipmentStatusText] = React.useState('');
    const [shipmentTypeText, setShipmentTypeText] = React.useState('');
    const [sdNo, setSdNo] = React.useState('');
    const [shipmentDateFormat, setShipmentDateFormat] = React.useState('');
    const [snackBarFailMsg, setSnackBarFailMsg] = React.useState('');


    useEffect(() => {
        if (shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT) {
            setDisableSaveBtn(false);
            setDisableApproveBtn(false);
            setDisableCloseJobBtn(true);
        }
        if (shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE) {
            setDisableSaveBtn(true);
            setDisableApproveBtn(true);
            setDisableCloseJobBtn(false)
        }

        if (shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB) {
            setIsDisplayActBtn('none');
        }

        setOpen(defaultOpen);
        setShipmentStatusText(getShipmentStatusText(shipmentList[0].sdStatus));
        setShipmentTypeText(getShipmentTypeText(shipmentList[0].sdType))
        setSdNo(shipmentList[0].sdNo);
        setShipmentDateFormat((convertUtcToBkkDate(shipmentList[0].shipmentDate)));
    }, [open, openModelConfirm])

    const handleClose = () => {
        setOpen(false);
        props.onClickClose();
    };


    function handleCloseModelConfirm() {
        setOpenModelConfirm(false);
    }

    function handleModelPreviewDocument() {
        setOpenModelPreviewDocument(false);
    }

    const updateShipmentOrder = () => {
        dispatch(featchOrderListAsync(payloadSearchOrder));
    }

    const handleSaveButton = () => {

        const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
        const itemsList = [];
        rows.forEach((id: GridRowId, data: GridRowData) => {
            const item: Entry = {
                barcode: id.productBarCode,
                deliveryOrderNo: id.doNo,
                actualQty: id.productQuantityActual * 1,
                comment: id.productComment
            }
            itemsList.push(item);

        })


        const payload: SaveDraftSDRequest = {
            shipmentNo: shipment,
            items: itemsList
        }

        saveOrderShipments(payload, sdNo)
            .then((value) => {
                setShowSnackbarSuccess(true);
                updateShipmentOrder()
            })
            .catch((error: ApiError) => {
                setShowSnackbarFail(true);
                setSnackBarFailMsg(error.message);
                updateShipmentOrder()
            })
    };

    const handleApproveBtn = () => {
        setItemsDiffState([]);
        setOpenModelConfirm(true)
        setAction(ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE)
        rows.forEach((id: GridRowId, data: GridRowData) => {
            const diffCount: number = id.productQuantityRef - id.productQuantityActual;
            if (diffCount !== 0) {
                const itemDiff: Entry = {
                    barcode: id.productBarCode,
                    productName: id.productDescription,
                    actualQty: diffCount
                }
                setItemsDiffState(itemsDiffState => [...itemsDiffState, itemDiff]);
            }
        })
    }

    const handleCloseJobBtn = () => {
        setOpenModelConfirm(true)
        setAction(ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB)
    }

    const handlePrintBtn = () => {
        setOpenModelPreviewDocument(true);
    }

    const handleLinkDocument = () => {
        setOpenModelPreviewDocument(true);
    }

    // browser file
    const [openFileSelector, { filesContent, loading, errors, plainFiles, clear }] = useFilePicker({
        multiple: true,
        readAs: 'BinaryString', // availible formats: "Text" | "BinaryString" | "ArrayBuffer" | "DataURL"
        accept: ['.pdf', '.txt'],
        limitFilesConfig: { min: 0.01, max: 3 },
        // minFileSize: 1, // in megabytes
        // maxFileSize: 1,
        // readFilesContent: false, // ignores file content
    });


    if (errors.length > 0) return <p>Error!</p>;

    if (loading) {
        return <div>Loading...</div>;
    }


    // data grid
    const shipmentList: ShipmentInfo[] = res.data.filter(
        (shipmentInfo: ShipmentInfo) => shipmentInfo.shipmentNo === shipment
    )

    const rows = [];
    for (let i = 0; i < shipmentList[0].entries?.length; i++) {
        const item = shipmentList[0].entries[i];
        rows.push({
            id: `${item.deliveryOrderNo}${item.barcode}_${i}`,
            doNo: item.deliveryOrderNo,
            col1: i + 1,
            productId: item.skuCode,
            productBarCode: item.barcode,
            productDescription: item.productName,
            productUnit: item.unitName,
            productQuantityRef: item.qty,
            productQuantityActual: item.actualQty,
            productDifference: item.qtyDiff,
            productComment: item.comment,
        })
    }

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = () => {
        setShowSnackbarFail(false);
        setShowSnackbarSuccess(false);
    }
    // const handleEditRowsModelChange = React.useCallback((model: GridEditRowsModel) => {
    //     console.log(model);
    // }, []);

    const handleShowSnackBar = (issuccess: boolean, errorMsg: any) => {
        if (issuccess) {
            // setDisableSaveBtn(true);
            // setDisableApproveBtn(true);
            // setDisableCloseJobBtn(false)
            setShowSnackbarSuccess(true);
            // updateShipmentOrder()
        } else {
            setShowSnackbarFail(true);
            setSnackBarFailMsg(errorMsg);
            // updateShipmentOrder()
        }
    }


    return (
        <div>
            <Dialog open={open} maxWidth='xl' fullWidth={true} >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <Typography variant="body1" gutterBottom>รายละเอียดใบตรวจสอบการรับ-โอนสินค้า</Typography>
                </BootstrapDialogTitle>
                <DialogContent>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>เลขที่เอกสาร LD:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                <Typography variant="body2" gutterBottom>{shipmentList[0].shipmentNo}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>

                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>เลขที่เอกสาร SD:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                <Typography variant="body2" gutterBottom>{shipmentList[0].sdNo}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>วันที่:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                <Typography variant="body2" gutterBottom>{shipmentDateFormat}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>สถานะ:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                <Typography variant="body2" gutterBottom>{shipmentStatusText}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>ประเภท:</Typography>
                            </Grid>
                            <Grid item lg={9} >
                                <Typography variant="body2" gutterBottom>{shipmentTypeText}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>แนบเอกสารใบตรวจสอบการรับ-โอนสินค้าหลังเซ็นต์:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                {shipmentList[0].sdStatus !== ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && <div>
                                    <TextField name='browserTxf' className={classes.textField} value={!!filesContent.length && filesContent[0].content ? filesContent[0].name : ''} />
                                    <Button
                                        id='btnPrint'
                                        variant='contained'
                                        color='primary'
                                        className={classes.browserBtn}
                                        onClick={() => openFileSelector()}

                                        style={{ marginLeft: 10, textTransform: 'none' }}
                                        endIcon={<UploadFileIcon />}
                                    >Browse</Button></div>
                                }
                                {shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && <div>

                                    <Link
                                        component="button"
                                        variant="body2"
                                        onClick={handleLinkDocument}
                                    >
                                        ดูเอกสาร
                                    </Link>
                                </div>
                                }
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent="center" style={{ marginTop: 0.1 }}>
                            <Grid item  >
                                <Button
                                    id='btnBack'
                                    variant='contained'
                                    color='secondary'
                                    className={classes.browserBtn}
                                    onClick={handleClose}
                                    startIcon={<ArrowBackIosIcon />}
                                >ย้อนกลับ</Button>
                            </Grid>
                            <Grid item  >
                                <Box sx={{ display: isDisplayActBtn }}>
                                    <Button
                                        id='btnSave'
                                        variant='contained'
                                        color='primary'
                                        className={classes.browserBtn}
                                        onClick={handleSaveButton}
                                        disabled={disableSaveBtn}
                                        endIcon={<SaveIcon />}
                                    >บันทึก</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ display: isDisplayActBtn }}>
                        <Grid container spacing={2} display='flex' justifyContent='space-between'>
                            <Grid item xl={2}  >
                                <Button
                                    id='btnApprove'
                                    variant='contained'
                                    color='primary'
                                    className={classes.browserBtn}
                                    onClick={handleApproveBtn}
                                    disabled={disableApproveBtn}
                                    endIcon={<AssignmentTurnedInIcon />}
                                >อนุมัติ</Button>

                                <Button
                                    id='btnClose'
                                    variant='contained'
                                    color='primary'
                                    className={classes.browserBtn}
                                    style={{ marginLeft: 10 }}
                                    onClick={handleCloseJobBtn}
                                    disabled={disableCloseJobBtn}
                                    endIcon={<DoneIcon />}
                                >ปิดงาน</Button>
                            </Grid>

                            <Grid item xl={2} >
                                <Button
                                    id='btnPrint'
                                    variant='contained'
                                    color='secondary'
                                    onClick={handlePrintBtn}
                                    endIcon={<PreviewIcon />}
                                    style={{ textTransform: 'none' }}
                                >Preview ใบตรวจการรับสินค้า</Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box mt={2} bgcolor='background.paper'>
                        <div style={{ height: 400, width: '100%' }} className={classes.rowDataGrid}>
                            <DataGrid rows={rows}
                                columns={columns}
                                autoPageSize={true}
                                pagination={true}
                                pageSize={5}
                                editMode="row"
                                getRowClassName={(params) =>
                                    `row-style--${(params.getValue(params.id, 'productQuantityRef') - params.getValue(params.id, 'productQuantityActual')) != 0 ? 'diff' : ''}`
                                }
                            // onEditRowsModelChange={handleEditRowsModelChange}
                            // autoHeight

                            />
                        </div>
                    </Box>
                </DialogContent>

            </Dialog>
            <ConfirmOrderShipment
                open={openModelConfirm}
                onClose={handleCloseModelConfirm}
                onUpdateShipmentStatus={handleShowSnackBar}
                shipmentNo={shipment}
                sdNo={sdNo}
                action={action}
                items={itemsDiffState}
                percentDiffType={false}
                percentDiffValue='0'
                imageContent={!!filesContent.length && filesContent[0].content}

            />

            <ModalShowPDF
                open={openModelPreviewDocument}
                onClose={handleModelPreviewDocument}
                url={getPathReportSD(shipment)}

            />

            <Snackbar open={showSnackbarSuccess} onClose={handleCloseSnackBar} autoHideDuration={6000} anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
                <Alert severity="success" sx={{ width: '100%' }} onClose={handleCloseSnackBar}>
                    This transaction is success
                </Alert>
            </Snackbar>

            <Snackbar open={showSnackbarFail} onClose={handleCloseSnackBar} autoHideDuration={6000} anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
                <Alert severity="error" sx={{ width: '100%' }} onClose={handleCloseSnackBar} >
                    {snackBarFailMsg}
                </Alert>
            </Snackbar>
        </div >
    )
}
