import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridRowId,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
//import OrderProductList from './order-product-list';
import {
  ShipmentResponse,
  ShipmentInfo,
  ShipmentRequest,
} from "../../models/order-model";
import { getSdType, getSdStatus } from "../../utils/utils";
import CheckOrderDetail from "./check-order-detail";
import { convertUtcToBkkDate } from "../../utils/date-utill";
import {
  getShipmentStatusText,
  getShipmentTypeText,
} from "../../utils/enum/check-order-enum";
import { useStyles } from "../../styles/makeTheme";
import { featchOrderListAsync } from "../../store/slices/check-order-slice";
import { saveSearchCriteria } from "../../store/slices/save-search-order";

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
  const [index, setIndex] = React.useState(1);
  const [currentpage, setCurrentpage] = React.useState(0);

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "ลำดับที่",
      minWidth: 50,
      headerAlign: "center",
    },
    {
      field: "shipmentNo",
      headerName: "เลขที่เอกสาร LD",
      minWidth: 180,
      headerAlign: "center",
    },
    {
      field: "sdNo",
      headerName: "เลขที่เอกสาร SD",
      minWidth: 180,
      headerAlign: "center",
    },
    {
      field: "sdType",
      headerName: "ประเภท",
      minWidth: 180,
      headerAlign: "center",
    },
    {
      field: "sdStatus",
      headerName: "สถานะ",
      minWidth: 120,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "boxCnt",
      headerName: "จำนวนลัง",
      minWidth: 120,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "toteCnt",
      headerName: "จำนวน Tote",
      minWidth: 130,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "shipmentDate",
      headerName: "วันที่รับสินค้า",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "comment",
      headerName: "อ้างอิง SD โอนลอย",
      minWidth: 180,
      headerAlign: "center",
      align: "left",
    },
  ];
  // console.log('Data Size: ', JSON.stringify(res));
  let i: number = index;
  const rows = res.data.map((data: ShipmentInfo, indexs: number) => {
    return {
      id: `${data.shipmentNo}_${data.sdNo}`,
      index: i + indexs,
      shipmentNo: data.shipmentNo,
      sdNo: data.sdNo,
      sdType: getShipmentTypeText(data.sdType),
      boxCnt: data.boxCnt,
      toteCnt: data.toteCnt,
      shipmentDate: convertUtcToBkkDate(data.shipmentDate),
      sdStatus: getShipmentStatusText(data.sdStatus),
      // col10: "desc",
      comment: data.comment,
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

  //pagination

  const [loading, setLoading] = React.useState<boolean>(false);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    setCurrentpage(newPage);

    let page: string = "1";

    if (newPage > currentpage) {
      setIndex(index + 5);
      page = (newPage + 1).toString();
    } else if (newPage < currentpage) {
      setIndex(index - 5);
      page = (newPage - 1).toString();
    }

    const payloadNewpage: ShipmentRequest = {
      limit: payload.limit,
      page: page,
      paramQuery: payload.paramQuery,
      sdNo: payload.sdNo,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      sdStatus: payload.sdStatus,
      sdType: payload.sdType,
      clearSearch: false,
    };

    await dispatch(featchOrderListAsync(payloadNewpage));
    await dispatch(saveSearchCriteria(payloadNewpage));

    setLoading(false);
  };

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
            pageSize={5}
            rowsPerPageOptions={[5]}
            rowCount={res.total}
            paginationMode="server"
            onPageChange={handlePageChange}
            loading={loading}
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
