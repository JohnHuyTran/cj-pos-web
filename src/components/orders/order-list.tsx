import React from 'react'
import { useAppSelector } from '../../store/store';
import { DataGridPro } from '@mui/x-data-grid-pro';
import Box from '@mui/material/Box';

function OrderList() {
    const items = useAppSelector((state) => state.checkOrderList);
    console.log("items == ", items.orderList);
    const columns = [
        { field: "col1", headerName: "ลำดับ", minWidth: 130, flex: 0.5 },
        {
            field: "col2",
            headerName: "เลขที่เอกสาร",
            minWidth: 270,
            align: "left",
        },
        { field: "col3", headerName: "สถานะ", minWidth: 320 },
        { field: "col4", headerName: "ประเภท", minWidth: 150 },
        { field: "col5", headerName: "วันที่", minWidth: 150 },
        { field: "col6", headerName: "รายละเอียด", minWidth: 150 },
    ];
    const rows = items.data.map((data, index) => {
        return {
            id: data.id,
            col1: index + 1,
            col2: data.barcode,
            col3: data.name,
            col4: data.price,
            delete: data.price,
        };
    });

    return (
        <div>
            <Box mt={2} bgcolor='background.paper'>
                <div>
                    <DataGridPro rows={rows} columns={columns} autoHeight />
                </div>
            </Box>
        </div>

    )
}

export default OrderList
