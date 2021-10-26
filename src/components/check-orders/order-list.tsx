import React from 'react';
import { useAppSelector } from '../../store/store';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
//import OrderProductList from './order-product-list';
import { ShipmentResponse, ShipmentInfo } from '../../models/order-model';
import { getSdType, getSdStatus } from '../../utils/utils';
import CheckOrderDetail from './check-order-detail';
import { convertUtcToBkkDate } from '../../utils/date-utill'

function OrderList() {
  const items = useAppSelector((state) => state.checkOrderList);
  const res: ShipmentResponse = items.orderList;
  const [opens, setOpens] = React.useState(false);
  const [shipment, setShipment] = React.useState('');
  const [sdNo, setSdNo] = React.useState('');

  const columns: GridColDef[] = [
    { field: 'index', headerName: 'ลำดับที่', minWidth: 120 },
    {
      field: 'shipmentNo',
      headerName: 'เลขที่เอกสาร LD',
      minWidth: 200,
    },
    { field: 'sdNo', headerName: 'เลขที่เอกสาร SD', minWidth: 200 },
    { field: 'sdType', headerName: 'ประเภท', minWidth: 200 },
    { field: 'sdStatus', headerName: 'สถานะ', minWidth: 200 },
    { field: 'boxCnt', headerName: 'จำนวนลัง', minWidth: 150 },
    { field: 'toteCnt', headerName: 'จำนวน Tote', minWidth: 150 },
    { field: 'shipmentDate', headerName: 'วันที่รับสินค้า', minWidth: 200 },
    { field: 'detail', headerName: 'รายละเอียด', minWidth: 200 },
  ];
  console.log('Data Size: ', JSON.stringify(res));
  const rows = res.data.map((data: ShipmentInfo, index: number) => {
    return {
      id: `${data.shipmentNo}_${data.sdNo}`,
      index: index + 1,
      shipmentNo: data.shipmentNo,
      sdNo: data.sdNo,
      sdType: getSdType(data.sdType),
      boxCnt: data.boxCnt,
      toteCnt: data.toteCnt,
      shipmentDate: convertUtcToBkkDate(data.shipmentDate),
      sdStatus: getSdStatus(data.sdStatus),
      col10: 'desc',
    };
  });

  function currentlySelected(params: GridCellParams) {
    setSdNo(params.row.sdNo);
    setShipment(params.row.shipmentNo);
    setOpens(true);
  }

  function isClosModal() {
    setOpens(false);
  }

  console.log(typeof isClosModal);

  return (
    <div>
      <Box mt={2} bgcolor='background.paper'>
        <div>
          <DataGrid
            rows={rows}
            columns={columns}
            onCellClick={currentlySelected}
            autoHeight
          />
        </div>
      </Box>
      {opens && <CheckOrderDetail sdNo={sdNo} shipmentNo={shipment} defaultOpen={opens} onClickClose={isClosModal} />}
    </div>
  );
}

export default OrderList;
