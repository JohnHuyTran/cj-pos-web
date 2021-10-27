import React, { ReactElement } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowData } from '@mui/x-data-grid';
import { Entry, ShipmentInfo } from '../../models/order-model';
import { useAppSelector } from '../../store/store';


interface Props {
    shipmentNo: string;
}

const columns: GridColDef[] = [
    { field: "col1", headerName: "ลำดับ", width: 90, disableColumnMenu: true },
    {
        field: "productId",
        headerName: "รหัสสินค้า",
        width: 170,
        disableColumnMenu: true
    },
    { field: "productBarCode", headerName: "บาร์โค้ด", minWidth: 170, disableColumnMenu: true },
    { field: "productDescription", headerName: "รายละเอียดสินค้า", minWidth: 500, },
    { field: "productUnit", headerName: "หน่วย", minWidth: 100, },
    {
        field: "productQuantityRef", headerName: "จำนวนอ้างอิง", width: 135, type: 'number'
    },
    {
        field: "productQuantityRef", headerName: "จำนวนรับจริง", width: 135, type: 'number'
    },
    {
        field: "productQuantityRef", headerName: "จำนวนส่วนต่าง", width: 145, type: 'number'
    },
    {
        field: "productQuantityRef", headerName: "หมายเหตุ", width: 200, type: 'number'
    },
];

export default function DCOrderEntries({ shipmentNo }: Props): ReactElement {
    const res = useAppSelector((state) => state.checkOrderList.orderList);
    const shipmentList: ShipmentInfo[] = res.data.filter(
        (shipmentInfo: ShipmentInfo) => shipmentInfo.shipmentNo === shipmentNo
    )


    const entries: Entry[] = shipmentList[0].entries ? shipmentList[0].entries : [];
    const rows = entries.map((item: Entry, index: number) => {
        return {
            id: `${item.deliveryOrderNo}${item.barcode}`,
            col1: index + 1,
            productId: item.skuCode,
            productBarCode: item.barcode,
            productDescription: item.productName,
            productUnit: item.unitName,
            productQuantityRef: item.qty,
            productQuantityActual: item.actualQty,
            productDifference: item.qtyDiff,
            productComment: item.comment,
        };
    })
    return (
        <Box mt={2} bgcolor='background.paper'>
            <div style={{ height: 400, width: '100%' }} >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableColumnMenu
                    autoPageSize={true}
                    pagination={true}
                    pageSize={5}
                    editMode="row"
                // onEditRowsModelChange={handleEditRowsModelChange}
                // autoHeight
                />
            </div>
        </Box>
    )
}
