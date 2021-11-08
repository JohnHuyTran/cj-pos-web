import React from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridRowId,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
//import OrderProductList from './order-product-list';
import { ShipmentResponse, ShipmentInfo } from "../../models/order-model";
import { getSdType, getSdStatus } from "../../utils/utils";
import CheckOrderDetail from "./check-order-detail";
import { convertUtcToBkkDate } from "../../utils/date-utill";
import {
  getShipmentStatusText,
  getShipmentTypeText,
} from "../../utils/enum/check-order-enum";
import { useStyles } from "../../styles/makeTheme";
// import { Pagination } from "@mui/material";

function OrderList() {
  const classes = useStyles();
  const items = useAppSelector((state) => state.checkOrderList);
  const res: ShipmentResponse = items.orderList;
  const payload = useAppSelector(
    (state) => state.saveSearchOrder.searchCriteria
  );
  const dispatch = useAppDispatch();
  const [opens, setOpens] = React.useState(false);
  const [shipment, setShipment] = React.useState("");
  const [sdNo, setSdNo] = React.useState("");

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "ลำดับที่",
      minWidth: 120,
      headerAlign: "left",
    },
    {
      field: "shipmentNo",
      headerName: "เลขที่เอกสาร LD",
      minWidth: 200,
      headerAlign: "left",
    },
    {
      field: "sdNo",
      headerName: "เลขที่เอกสาร SD",
      minWidth: 200,
      headerAlign: "left",
    },
    {
      field: "sdType",
      headerName: "ประเภท",
      minWidth: 200,
      headerAlign: "left",
    },
    {
      field: "sdStatus",
      headerName: "สถานะ",
      minWidth: 200,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "boxCnt",
      headerName: "จำนวนลัง",
      minWidth: 150,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "toteCnt",
      headerName: "จำนวน Tote",
      minWidth: 150,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "shipmentDate",
      headerName: "วันที่รับสินค้า",
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "detail",
      headerName: "รายละเอียด",
      minWidth: 200,
      headerAlign: "center",
      align: "left",
    },
  ];
  // console.log('Data Size: ', JSON.stringify(res));
  const rows = res.data.map((data: ShipmentInfo, index: number) => {
    return {
      id: `${data.shipmentNo}_${data.sdNo}`,
      index: index + 1,
      shipmentNo: data.shipmentNo,
      sdNo: data.sdNo,
      sdType: getShipmentTypeText(data.sdType),
      boxCnt: data.boxCnt,
      toteCnt: data.toteCnt,
      shipmentDate: convertUtcToBkkDate(data.shipmentDate),
      sdStatus: getShipmentStatusText(data.sdStatus),
      col10: "desc",
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

  return (
    <div>
      <Box mt={2} bgcolor="background.paper">
        <div className={classes.MdataGrid}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            onCellClick={currentlySelected}
            autoHeight
            pagination
            pageSize={10}
          />
        </div>
      </Box>
      {opens && (
        <CheckOrderDetail
          sdNo={sdNo}
          shipmentNo={shipment}
          defaultOpen={opens}
          onClickClose={isClosModal}
        />
      )}
    </div>
  );
}

export default OrderList;
