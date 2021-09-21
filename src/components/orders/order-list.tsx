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
        { field: "col3", headerName: "SHIPMENT", minWidth: 200 },
        { field: "col4", headerName: "เลขที่เอกสาร", minWidth: 350 },
        { field: "col5", headerName: "TYPE", minWidth: 150 },
        { field: "col6", headerName: "จำนวนลัง", minWidth: 200 },
        { field: "col7", headerName: "จำนวนTOTE", minWidth: 200 },
        { field: "col8", headerName: "วันที่", minWidth: 200 },
        { field: "col9", headerName: "สถานะ", minWidth: 200 },
        { field: "col10", headerName: "รายละเอียด", minWidth: 200 },
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
