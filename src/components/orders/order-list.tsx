import React from 'react'
import { useAppSelector } from '../../store/store';
import { DataGrid, GridColDef, GridRowData } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

function OrderList() {
    const items = useAppSelector((state) => state.checkOrderList);
    console.log("items == ", items.orderList);
    const columns: GridColDef[] = [
        { field: "col1", headerName: "ลำดับ", minWidth: 120 },
        {
            field: "col2",
            headerName: "รหัสสินค้า",
            minWidth: 150,
        },
        { field: "col3", headerName: "บาร์โค้ด", minWidth: 200 },
        { field: "col4", headerName: "รายละเอียดสินค้า", minWidth: 350 },
        { field: "col5", headerName: "หน่วย", minWidth: 150 },
        { field: "col6", headerName: "จำนวนอ้างอิง", minWidth: 200 },
        { field: "col7", headerName: "จำนวนรับจริง", minWidth: 200 },
        { field: "col8", headerName: "ส่วนต่างการรับ", minWidth: 200 },
    ];

    const rows: any = items.orderList?.products.map((data, index) => {
        return {
            id: data.productId,
            col1: index + 1,
            col2: data.productId,
            col3: data.productBarCode,
            col4: data.productDescription,
            col5: data.productUnit,
            col6: data.productQuantityRef,
            col7: data.productQuantityActual,
            col8: data.productDifference,
        };
    });

    return (
        <div>
            <Box mt={2} bgcolor='background.paper'>
                <div>
                    <DataGrid rows={rows} columns={columns} autoHeight />
                </div>
            </Box>
        </div>

    )
}

export default OrderList
