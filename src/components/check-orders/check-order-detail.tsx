
// @ts-nocheck
import React, { useEffect, useMemo, useRef } from 'react'
import { useAppSelector } from '../../store/store';

import { Box, Button, Dialog, DialogContent, Grid, TextField, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams, renderEditInputCell, GridEditRowsModel, useGridApiRef } from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { useStyles } from './check-order-detail-css'
import { useFilePicker } from 'use-file-picker';

import { saveOrderShipments, getPathReportSD } from '../../services/order-shipment';
import ConfirmOrderShipment from './check-order-confirm-model';
import { CheckOrderCodeValue } from '../../utils/enum/check-order-enum';
import ModalShowPDF from './modal-show-pdf';
import { ShipmentInfo, ShipmentResponse, Item, OrderSubmitRequest, Quantity, CheckOrderDetailProps, Entry, } from '../../models/order-model';


const columns: GridColDef[] = [
    { field: "col1", headerName: "ลำดับ", width: 100, disableColumnMenu: 'true' },
    {
        field: "productId",
        headerName: "รหัสสินค้า",
        width: 200,
        disableColumnMenu: 'true'
    },
    { field: "productBarCode", headerName: "บาร์โค้ด", minWidth: 200, disableColumnMenu: 'true' },
    { field: "productDescription", headerName: "รายละเอียดสินค้า", minWidth: 350, disableColumnMenu: 'true' },
    { field: "productUnit", headerName: "หน่วย", minWidth: 100, disableColumnMenu: 'true' },
    {
        field: "productQuantityRef", headerName: "จำนวนอ้างอิง", width: 100, type: 'number', disableColumnMenu: 'true', editable: true

    },
    {
        field: "productQuantityActual", headerName: "จำนวนรับจริง", width: 100, disableColumnMenu: 'true',
        renderCell: (params: GridRenderCellParams) => (
            <TextField variant="outlined" name='txnQuantityActual' type='number' value={params.value} onChange={(e) => {
                params.api.updateRows([{ ...params.row, productQuantityActual: e.target.value }])
            }
            }
            />
        )

    },
    {
        field: "productDifference", headerName: "ส่วนต่างการรับ", width: 100, type: 'number', disableColumnMenu: 'true',
        valueGetter: calProductDiff
    },
    {
        field: "productComment", headerName: "หมายเหตุ", minWidth: 200, disableColumnMenu: 'true',
        renderCell: (params: GridRenderCellParams) => (
            <TextField variant="outlined" name='txnComment' value={params.value} onChange={(e) =>
                params.api.updateRows([{ ...params.row, productComment: e.target.value }])
            } />
        )
    },
];

// const updateRows = (value, id, field) => {
//     const item = rows.find((item) => item.id === id);
//     item[field] = value;
// };

var calProductDiff = function (params) {
    return params.data.productQuantityRef - params.data.productQuantityActual;
};


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

export default function CheckOrderDetail(props: CheckOrderDetailProps) {
    const classes = useStyles();
    const { shipment, defaultOpen } = props;
    const items = useAppSelector((state) => state.checkOrderList);
    const res: ShipmentResponse = items.orderList;
    const [open, setOpen] = React.useState(defaultOpen);
    const [fileName, setFileName] = React.useState('');
    const { apiRef, columns } = useApiRef();

    const [disableSaveBtn, setDisableSaveBtn] = React.useState(false);
    const [disableApproveBtn, setDisableApproveBtn] = React.useState(false);
    const [disableCloseJobBtn, setDisableCloseJobBtn] = React.useState(false);
    const [isDisplayActBtn, setIsDisplayActBtn] = React.useState('');

    const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
    const [action, setAction] = React.useState('');

    const [showSnackbarSuccess, setShowSnackbarSuccess] = React.useState(false);
    const [showSnackbarFail, setShowSnackbarFail] = React.useState(false);
    const [itemsDiffState, setItemsDiffState] = React.useState([]);

    const [openModelPreviewDocument, setOpenModelPreviewDocument] = React.useState(false);


    useEffect(() => {
        if (shipmentList[0].sdStatus === CheckOrderCodeValue.STATUS_DRAFT_CODE) {
            setDisableSaveBtn(false);
            setDisableApproveBtn(false);
            setDisableCloseJobBtn(true)
        }
        if (shipmentList[0].sdStatus === CheckOrderCodeValue.STATUS_APPROVE_CODE) {
            setDisableSaveBtn(true);
            setDisableApproveBtn(true);
            setDisableCloseJobBtn(false)
        }

        if (shipmentList[0].sdStatus === CheckOrderCodeValue.STATUS_CLOSEJOB_CODE) {
            setIsDisplayActBtn('none');
        }

        setOpen(defaultOpen);
    }, [open])

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


    const handleSaveButton = () => {
        setItemsDiffState([]);
        const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
        const itemsList = [];
        rows.forEach((id: GridRowId, data: GridRowData) => {
            const quantity: Quantity = {
                actualQty: id.productQuantityActual * 1
            }
            const item: Item = {
                barcode: id.productBarCode,
                quantity: quantity,
                comment: id.productComment
            }
            const diffCount: number = id.productQuantityRef - id.productQuantityActual;
            if (diffCount !== 0) {
                const quantityDiff: Quantity = {
                    qtyDiff: diffCount
                }
                const itemDiff: Item = {
                    barcode: id.productBarCode,
                    productName: id.productDescription,
                    quantity: quantityDiff
                }
                setItemsDiffState(itemsDiffState => [...itemsDiffState, itemDiff]);
            }
            itemsList.push(item);

        })

        const payload: OrderSubmitRequest = {
            shipmentNo: shipment,
            items: itemsList,
        }

        saveOrderShipments(payload)
            .then((value) => {
                setShowSnackbarSuccess(true);
                // setItemsDiffState[itemsDiff];
            })
            .catch((error) => {
                setShowSnackbarFail(true);
                // setItemsDiffState[itemsDiff];
            })
    };

    const handleApproveBtn = () => {
        setOpenModelConfirm(true)
        setAction(CheckOrderCodeValue.STATUS_APPROVE_VALUE)
    }

    const handleCloseJobBtn = () => {
        setOpenModelConfirm(true)
        setAction(CheckOrderCodeValue.STATUS_CLOSEJOB_VALUE)
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
    let index: number = 1;
    for (let i = 0; i < shipmentList[0].entries.length; i++) {
        const items = shipmentList[0].entries[i].items;
        for (let j = 0; j < items.length; j++) {
            rows.push({
                id: items[j].barcode,
                col1: index,
                productId: items[j].sku.code,
                productBarCode: items[j].barcode,
                productDescription: items[j].productName,
                productUnit: items[j].unit.name,
                productQuantityRef: items[j].quantity.qty,
                productQuantityActual: items[j].quantity.actualQty,
                productDifference: items[j].quantity.qtyDiff,
                productComment: ''
            })
            index++;
        }

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

    const handleStatusShipmentToJobClose = (issuccess: boolean) => {
        if (issuccess) {
            setDisableSaveBtn(true);
            setDisableApproveBtn(true);
            setDisableCloseJobBtn(false)
            setShowSnackbarSuccess(true);
        } else {
            setShowSnackbarFail(true);
        }

    }
    const handleShowSnackBar = (issuccess: boolen) => {
        if (issuccess) {

        } else {
            setShowSnackbarFail(true);
        }


    }

    return (
        <div>
            <Dialog open={open} maxWidth='xl' fullWidth={true} >
                <DialogContent>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item lg={2}  >
                                <Typography variant="body2" gutterBottom>เลขที่เอกสาร LD:</Typography>
                            </Grid>
                            <Grid item lg={1}  >
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
                                <Typography variant="body2" gutterBottom>{shipmentList[0].shipmentDate}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>สถานะ:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                <Typography variant="body2" gutterBottom>{shipmentList[0].sdStatus}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>ประเภท:</Typography>
                            </Grid>
                            <Grid item lg={9} >
                                <Typography variant="body2" gutterBottom>{shipmentList[0].sdType}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>แนบเอกสารใบส่วนต่างหลังเซ็นต์:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                {shipmentList[0].sdStatus !== CheckOrderCodeValue.STATUS_CLOSEJOB_CODE && <div>
                                    <TextField name='browserTxf' className={classes.textField} />
                                    <Button
                                        id='printBtb'
                                        variant='contained'
                                        color='primary'
                                        className={classes.browserBtn}
                                        onClick={() => openFileSelector()}
                                        value={fileName}
                                        style={{ marginLeft: 10 }}
                                    >BROWSE</Button></div>
                                }
                                {shipmentList[0].sdStatus === CheckOrderCodeValue.STATUS_CLOSEJOB_CODE && <div>

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
                        <Grid container spacing={2}>
                            <Grid item lg={12}  >
                                Files name:
                                {/* If readAs is set to DataURL, You can display an image */}
                                {/* {!!filesContent.length && <img src={filesContent[0].content} />} */}
                                {plainFiles.map(file => (
                                    file.name
                                ))}
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent="center" style={{ marginTop: 0.1 }}>
                            <Grid item >
                                <Box sx={{ display: isDisplayActBtn }}>
                                    <Button
                                        id='printBtb'
                                        variant='contained'
                                        color='primary'
                                        className={classes.browserBtn}
                                        onClick={handleSaveButton}
                                        disabled={disableSaveBtn}

                                    >บันทึก</Button>
                                </Box>
                            </Grid>
                            <Grid item  >
                                <Button
                                    id='printBtb'
                                    variant='contained'
                                    color='primary'
                                    className={classes.browserBtn}
                                    onClick={handleClose}
                                >ย้อนกลับ</Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ display: isDisplayActBtn }}>
                        <Grid container spacing={2} display='flex' justifyContent='space-between'>
                            <Grid item xl={2}  >
                                <Button
                                    id='printBtb'
                                    variant='contained'
                                    color='primary'
                                    className={classes.browserBtn}
                                    onClick={handleApproveBtn}
                                    disabled={disableApproveBtn}
                                >อนุมัติ</Button>

                                <Button
                                    id='printBtb'
                                    variant='contained'
                                    color='primary'
                                    className={classes.browserBtn}
                                    style={{ marginLeft: 10 }}
                                    onClick={handleCloseJobBtn}
                                    disabled={disableCloseJobBtn}
                                >ปิดงาน</Button>
                            </Grid>

                            <Grid item xl={2} >
                                <Button
                                    id='printBtb'
                                    variant='contained'
                                    color='primary'
                                    onClick={handlePrintBtn}
                                >พิมพ์ใบตรวจการรับสินค้า</Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box mt={2} bgcolor='background.paper'>
                        <DataGrid rows={rows}
                            columns={columns}
                            editMode="row"
                            // onEditRowsModelChange={handleEditRowsModelChange}
                            autoHeight />
                    </Box>
                </DialogContent>

            </Dialog>
            <ConfirmOrderShipment
                open={openModelConfirm}
                onClose={handleCloseModelConfirm}
                onUpdateShipmentStatus={handleStatusShipmentToJobClose}
                shipmentNo={shipment}
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
                    This transaction is error
                </Alert>
            </Snackbar>
        </div >
    )
}
