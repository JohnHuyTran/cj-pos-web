
// @ts-nocheck
import React, { useEffect, useMemo, useRef } from 'react'
import axios from "axios";
import { useAppSelector } from '../../store/store';

import { Box, Button, Dialog, DialogContent, Grid, TextField, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams, renderEditInputCell, GridEditRowsModel, useGridApiRef } from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { CheckOrderDetailProps, Order, Product } from '../../models/order-model';
import { useStyles } from './check-order-detail-css'
import { useFilePicker } from 'use-file-picker';
import { Item, OrderSubmitRequest } from '../../models/order-model';
import { saveOrderShipments, fetchShipmentDeliverlyPDF } from '../../services/order-shipment';
import ConfirmOrderShipment from './check-order-confirm-model';
import { CheckOrderEnum } from '../../utils/enum/check-order-enum';


const columns: GridColDef[] = [
    { field: "col1", headerName: "ลำดับ", minWidth: 120 },
    {
        field: "productId",
        headerName: "รหัสสินค้า",
        minWidth: 150,
    },
    { field: "productBarCode", headerName: "บาร์โค้ด", minWidth: 200 },
    { field: "productDescription", headerName: "รายละเอียดสินค้า", minWidth: 350 },
    { field: "productUnit", headerName: "หน่วย", minWidth: 150 },
    {
        field: "productQuantityRef", headerName: "จำนวนอ้างอิง", minWidth: 200, type: 'number'

    },
    {
        field: "productQuantityActual", headerName: "จำนวนรับจริง", minWidth: 200,
        renderCell: (params: GridRenderCellParams) => (
            <TextField variant="outlined" name='txnQuantityActual' value={params.value} onChange={(e) => {
                params.api.updateRows([{ ...params.row, productQuantityActual: e.target.value }])
            }
            }
            />
        )

    },
    {
        field: "productDifference", headerName: "ส่วนต่างการรับ", minWidth: 200, type: 'number',
        valueGetter: calProductDiff
    },
    {
        field: "productComment", headerName: "หมายเหตุ", minWidth: 200,
        renderCell: (params: GridRenderCellParams) => (
            <TextField variant="outlined" name='txnComment' value={params.value} onChange={(e) =>
                params.api.updateRows([{ ...params.row, productComment: e.target.value }])
            } />
        )
    },
];

const updateRows = (value, id, field) => {
    const item = rows.find((item) => item.id === id);
    item[field] = value;
};

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
    const res: Order[] = items.orderList;
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

    useEffect(() => {
        if (productsFilter[0].orderStatus === CheckOrderEnum.STATUS_DRAFT_CODE) {
            setDisableSaveBtn(false);
            setDisableApproveBtn(false);
            setDisableCloseJobBtn(true)
        }
        if (productsFilter[0].orderStatus === CheckOrderEnum.STATUS_APPROVE_CODE) {
            setDisableSaveBtn(true);
            setDisableApproveBtn(true);
            setDisableCloseJobBtn(false)
        }

        if (productsFilter[0].orderStatus === CheckOrderEnum.STATUS_CLOSEJOB_CODE) {
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

    const handleSaveButton = () => {
        const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
        const items = [];
        rows.forEach((id: GridRowId, data: GridRowData) => {
            const item: Item = {
                barcode: id.productBarCode,
                ActualQty: id.productQuantityActual,
                comment: id.productComment
            }
            items.push(item);
        })

        const payload: OrderSubmitRequest = {
            shipmentNo: shipment,
            items: items,
        }

        saveOrderShipments(payload)
            .then(
                function (value) {
                    setShowSnackbarSuccess(true);
                }
            )
            .catch(
                function (error) {
                    setShowSnackbarFail(true);
                }

            )
    };

    const handleApproveBtn = () => {
        setOpenModelConfirm(true)
        setAction(CheckOrderEnum.STATUS_APPROVE_VALUE)
    }

    const handleCloseJobBtn = () => {
        setOpenModelConfirm(true)
        setAction(CheckOrderEnum.STATUS_CLOSEJOB_VALUE)
    }

    const handlePrintBtn = () => {
        fetchShipmentDeliverlyPDF(shipment);
        window.open('https://docs.marklogic.com/8.0/guide/rest-dev.pdf')
    }

    const handleLinkDocument = () => {
        fetchShipmentDeliverlyPDF(shipment);
        window.open('https://docs.marklogic.com/8.0/guide/rest-dev.pdf')
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
    const productsFilter: Order[] = res.filter(
        (orders: Order) => orders.orderShipment === shipment
    )
    const rows = productsFilter[0].products?.map((product: Product, index: number) => {
        return {
            id: product.productBarCode,
            col1: index + 1,
            productId: product.productId,
            productBarCode: product.productBarCode,
            productDescription: product.productDescription,
            productUnit: product.productUnit,
            productQuantityRef: product.productQuantityRef,
            productQuantityActual: product.productQuantityActual,
            productDifference: product.productDifference,
            productComment: ''
        }
    })

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
                                <Typography variant="body2" gutterBottom></Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>

                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>เลขที่เอกสาร SD:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                <Typography variant="body2" gutterBottom>{productsFilter[0].orderNo}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>วันที่:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                <Typography variant="body2" gutterBottom>{productsFilter[0].orderCreateDate}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>สถานะ:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                <Typography variant="body2" gutterBottom>{productsFilter[0].orderStatus}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>ประเภท:</Typography>
                            </Grid>
                            <Grid item lg={9} >
                                <Typography variant="body2" gutterBottom>{productsFilter[0].orderType}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3}  >
                                <Typography variant="body2" gutterBottom>แนบเอกสารใบส่วนต่างหลังเซ็นต์:</Typography>
                            </Grid>
                            <Grid item lg={9}  >
                                {productsFilter[0].orderStatus !== CheckOrderEnum.STATUS_CLOSEJOB_CODE && <div>
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
                                {productsFilter[0].orderStatus === CheckOrderEnum.STATUS_CLOSEJOB_CODE && <div>

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
                        <DataGrid rows={rows ? rows : []}
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
                items={[]}
                percentDiffType={false}
                percentDiffValue='0'
                imageContent={!!filesContent.length && filesContent[0].content}

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
