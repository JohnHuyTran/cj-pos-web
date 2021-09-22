import React from 'react'
import { useAppSelector } from '../../store/store';
import { DataGrid, GridColDef, GridRowsProp, GridRowData } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import OrderProductList from './order-product-list';
import { CheckOrderResponse, Order } from '../../models/order';



function OrderList() {
    const items = useAppSelector((state) => state.checkOrderList);
    const res: any = items.orderList;
    const [open, setOpen] = React.useState(false);

    const columns: GridColDef[] = [
        { field: "index", headerName: "ลำดับ", minWidth: 120 },
        {
            field: "orderShipment", headerName: "SHIPMENT"
        },


        { field: "orderNo", headerName: "เลขที่เอกสาร", minWidth: 150 },
        { field: "orderType", headerName: "TYPE", minWidth: 150 },
        { field: "orderTotal", headerName: "จำนวนลัง", minWidth: 200 },
        { field: "orderTote", headerName: "จำนวนTOTE", minWidth: 200 },
        { field: "orderCreateDate", headerName: "วันที่", minWidth: 200 },
        { field: "orderStatus", headerName: "สถานะ", minWidth: 200 },
        { field: "col10", headerName: "รายละเอียด", minWidth: 200 },
    ];

    const rows: any = res.map((data: any, index: any) => {
        return {
            id: data.orderShipment,
            index: index + 1,
            orderShipment: data.orderShipment,
            orderNo: data.orderNo,
            orderType: data.orderType,
            orderTotal: data.orderTotal,
            orderTote: data.orderTote,
            orderCreateDate: data.orderCreateDate,
            orderStatus: data.orderStatus,
            col10: "desc"
        };
    });

    return (
        <div>
            <Box mt={2} bgcolor='background.paper'>
                <div>
                    <DataGrid rows={rows} columns={columns}
                        // onRowClick={(params, Event) => {
                        //     { setOpen(true) }
                        // }}

                        autoHeight />
                </div>
            </Box>
            {/* {open && <OrderProductList />} */}
        </div>

    )
}

export default OrderList
