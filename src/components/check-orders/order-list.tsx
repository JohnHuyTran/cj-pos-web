import React from 'react'
import { useAppSelector } from '../../store/store';
import { DataGrid, GridColDef, GridCellParams, GridApi, GridRowParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CheckOrderDetail from './check-order-detail';
import { ShipmentInfo, ShipmentResponse } from '../../models/order-model';



function OrderList() {
    const items = useAppSelector((state) => state.checkOrderList);
    const res: ShipmentResponse = items.orderList;
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
    console.log('res:', res);

    const rows = res.data.map((data: ShipmentInfo, index: number) => {
        return {
            id: data.shipmentNo,
            index: index + 1,
            orderShipment: data.shipmentNo,
            orderNo: data.sdNo,
            orderType: data.sdType,
            orderTotal: data.boxCnt,
            orderTote: data.toteCnt,
            orderCreateDate: data.shipmentDate,
            orderStatus: data.sdStatus,
            col10: "desc"
        };
    });

    function currentlySelected(params: GridCellParams) {
        setShipment(params.id.toString());
        setOpens(true);
        console.log("shipment No", params.id.toString());
    }

    function isClosModal() {
        setOpens(false);
    }

    return (
        <div>
            <Box mt={2} bgcolor='background.paper'>
                <div>
                    <DataGrid rows={rows} columns={columns}
                        onCellClick={currentlySelected}
                        autoHeight />
                </div>
            </Box>
            {opens && <CheckOrderDetail shipment={shipment} defaultOpen={opens} onClickClose={isClosModal} />}
        </div>

    )
}

export default OrderList
