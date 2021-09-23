import React from 'react'
import { useAppSelector } from '../../store/store';
import { DataGrid, GridColDef, GridCellParams, GridApi, GridRowParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import OrderProductList from './order-product-list';
import { Order } from '../../models/order';



function OrderList() {
    const items = useAppSelector((state) => state.checkOrderList);
    const res: Order[] = items.orderList;
    const [opens, setOpens] = React.useState(false);
    const [shipment, setShipment] = React.useState('');

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

    const rows = res.map((data: Order, index: number) => {
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

    function currentlySelected(params: GridCellParams) {
        setShipment(params.id.toString());
        setOpens(true);
        console.log("opens", opens);
    }

    function isClosModal() {
        setOpens(false);
    }

    console.log(typeof isClosModal)

    return (
        <div>
            <Box mt={2} bgcolor='background.paper'>
                <div>
                    <DataGrid rows={rows} columns={columns}
                        onCellClick={currentlySelected}
                        autoHeight />
                </div>
            </Box>
            {opens && <OrderProductList shipment={shipment} defaultOpen={opens} onClickClose={isClosModal} />}
        </div>

    )
}

export default OrderList
