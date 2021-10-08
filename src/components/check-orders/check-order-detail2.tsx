import React from 'react';
import { Box, Button, Dialog, DialogContent, Grid, TextField, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams, renderEditInputCell, GridEditRowsModel, useGridApiRef } from '@mui/x-data-grid';


import { CheckOrderDetailProps, Entry, Item, ShipmentInfo, ShipmentResponse } from "../../models/order-model";
import { useAppSelector } from '../../store/store';
import { useStyles } from './check-order-detail-css';

const columns: GridColDef[] = [
    { field: "col1", headerName: "ลำดับ", width: 100, disableColumnMenu: true },
    {
        field: "productId",
        headerName: "รหัสสินค้า",
        width: 150,
        disableColumnMenu: true
    },
    { field: "productBarCode", headerName: "บาร์โค้ด", minWidth: 200, disableColumnMenu: true },
    { field: "productDescription", headerName: "รายละเอียดสินค้า", minWidth: 350, disableColumnMenu: true },
    { field: "productUnit", headerName: "หน่วย", minWidth: 100, disableColumnMenu: true },
    {
        field: "productQuantityRef", headerName: "จำนวนอ้างอิง", width: 100, type: 'number', disableColumnMenu: true, editable: true

    },
    {
        field: "productQuantityActual", headerName: "จำนวนรับจริง", width: 100, disableColumnMenu: true,
        // renderCell: (params: GridRenderCellParams) => (
        //     <TextField variant="outlined" name='txnQuantityActual' type='number' value={params.value} onChange={(e) => {
        //         params.api.updateRows([{ ...params.row, productQuantityActual: e.target.value }])
        //     }
        //     }
        //     />
        // )

    },
    {
        field: "productDifference", headerName: "ส่วนต่างการรับ", width: 100, type: 'number', disableColumnMenu: true,
        //valueGetter: calProductDiff

    },
    {
        field: "productComment", headerName: "หมายเหตุ", minWidth: 200, disableColumnMenu: true,
        // renderCell: (params: GridRenderCellParams) => (
        //     <TextField variant="outlined" name='txnComment' value={params.value} onChange={(e) =>
        //         params.api.updateRows([{ ...params.row, productComment: e.target.value }])
        //     } />
        // )
    },
];

var calProductDiff = function (params: any) {
    return params.data.productQuantityRef - params.data.productQuantityActual;
};




export default function CheckOrderDetail2(props: CheckOrderDetailProps) {
    const classes = useStyles();
    const { shipment, defaultOpen } = props;
    const items = useAppSelector((state) => state.checkOrderList);
    const res: ShipmentResponse = items.orderList;
    const [open, setOpen] = React.useState(defaultOpen);

    const shipmentList: ShipmentInfo[] = res.data.filter(
        (shipmentInfo: ShipmentInfo) => shipmentInfo.shipmentNo === shipment
    )
    const rows = shipmentList[0].entries.map((roList: Entry) => {
        console.log('DO:', roList.deliveryOrderNo);
        console.log('items size: ', roList.items.length);

        [{
            id: roList.deliveryOrderNo,
            col1: roList.items.length,
            productBarCode: "barcode",
            productDescription: "productName",
            productUnit: "name",
            productQuantityRef: "qty",
            productQuantityActual: "actual",
            productDifference: "diff",
            productComment: '',
        }]


        // roList.items.map((item: Item, index: number) => {
        //     console.log(`${item.itemNo} ${item.barcode} ${item.productName} ${item.unit.name} ${item.quantity.qty} ${item.quantity.actualQty} ${item.quantity.qtyDiff}`);
        //     return {
        //         id: `${roList.deliveryOrderNo}${item.barcode}`,
        //         col1: index + 1,
        //         // productId: item.itemNo,
        //         // productBarCode: item.barcode,
        //         // productDescription: item.productName,
        //         // productUnit: item.unit.name,
        //         // productQuantityRef: item.quantity.qty,
        //         // productQuantityActual: item.quantity.actualQty,
        //         // productDifference: item.quantity.qtyDiff,
        //         // productComment: ''
        //         productId: "itemNo",
        //         productBarCode: "barcode",
        //         productDescription: "productName",
        //         productUnit: "name",
        //         productQuantityRef: "qty",
        //         productQuantityActual: "actual",
        //         productDifference: "diff",
        //         productComment: ''
        //     }
        // })

    })

    // const rows: GridRowsProp = [
    //     { id: 1, col1: 'Hello', col2: 'World' },
    //     { id: 2, col1: 'XGrid', col2: 'is Awesome' },
    //     { id: 3, col1: 'Material-UI', col2: 'is Amazing' },
    // ];
    const map2 = shipmentList[0].entries.map((roList: Entry, index) => ({

        id: index,
        col1: 'c1',
        productBarCode: "barcode",
        productDescription: "productName",
        productUnit: "name",
        productQuantityRef: "qty",
        productQuantityActual: "actual",
        productDifference: "diff",
        productComment: '',
    })
    );
    console.log(map2);
    const map4 = [];
    for (let i = 0; i < shipmentList[0].entries.length; i++) {
        const items = shipmentList[0].entries[i].items;
        for (let j = 0; j < items.length; j++) {
            map4.push({
                id: j,
                col1: 'c1',
                productBarCode: "barcode",
                productDescription: "productName",
                productUnit: "name",
                productQuantityRef: "qty",
                productQuantityActual: "actual",
                productDifference: "diff",
                productComment: '',
            })
        }

    }
    const map3 = shipmentList[0].entries.map((roList: Entry, index) => ({
        id: index,
        col1: 'c1',
        productBarCode: "barcode",
        productDescription: "productName",
        productUnit: "name",
        productQuantityRef: "qty",
        productQuantityActual: "actual",
        productDifference: "diff",
        productComment: '',
    })

    );
    console.log(map2);

    return (
        <div>
            <Dialog open={open} maxWidth='xl' fullWidth={true} >
                <DialogContent>
                    <Box mt={2} bgcolor='background.paper'>
                        <DataGrid rows={map4}
                            columns={columns}
                            // editMode="row"
                            // onEditRowsModelChange={handleEditRowsModelChange}
                            autoHeight />
                    </Box>
                </DialogContent>
            </Dialog></div>
    )
}