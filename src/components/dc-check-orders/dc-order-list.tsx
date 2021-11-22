import moment from "moment";
import React from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {
  CheckOrderResponse,
  CheckOrderInfo,
  CheckOrderRequest,
} from "../../models/dc-check-order-model";
import { featchOrderListDcAsync } from "../../store/slices/dc-check-order-slice";
import { convertUtcToBkkDate } from "../../utils/date-utill";
import { getSdType, getDCStatus } from "../../utils/utils";
import DCOrderDetail from "./dc-ckeck-order-detail";
import { useStyles } from "../../styles/makeTheme";
import Done from "@mui/icons-material/Done";

import { PanoramaSharp } from "@mui/icons-material";
import { saveSearchCriteriaDc } from "../../store/slices/save-search-order-dc-slice";
import { Typography } from "@mui/material";
import { ShipmentRequest } from "../../models/order-model";
//import CheckOrderDetail from './check-order-detail';

function DCOrderList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.dcCheckOrderList);
  const cuurentPage = useAppSelector(
    (state) => state.dcCheckOrderList.orderList.page
  );
  const limit = useAppSelector(
    (state) => state.dcCheckOrderList.orderList.perPage
  );
  const res: CheckOrderResponse = items.orderList;
  const payload = useAppSelector(
    (state) => state.saveSearchOrderDc.searchCriteriaDc
  );
  const [pageSize, setPageSize] = React.useState(limit.toString());
  // const [opens, setOpens] = React.useState(false);
  // const [shipment, setShipment] = React.useState("");
  // const [sdNo, setSdNo] = React.useState("");

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "ลำดับที่",
      minWidth: 75,
      // flex: 0.7,
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "shipmentNo",
      headerName: "เลขที่เอกสาร LD",
      minWidth: 170,
      flex: 1.3,
      headerAlign: "center",
      sortable: false,
      // renderCell: (params) => (
      //   <div>
      //     <Typography color="textSecondary">{params.value}</Typography>
      //     <Typography>{params.getValue(params.id, "sdNo") || ""}</Typography>
      //   </div>
      // ),
    },
    {
      field: "sdNo",
      headerName: "เลขที่เอกสาร SD",
      minWidth: 170,
      // flex: 1.2,
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "branchOutNo",
      headerName: "เลขที่เอกสาร BO",
      minWidth: 170,
      // flex: 1.2,
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "branchDesc",
      headerName: "สาขาปลายทาง",
      minWidth: 190,
      // flex: 1,
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "sdType",
      headerName: "ประเภท",
      minWidth: 160,
      // flex: 1,
      headerAlign: "center",
      align: "left",
      sortable: false,
    },
    {
      field: "verifyDCStatus",
      headerName: "สถานะการตรวจสอบผลต่าง",
      minWidth: 195,
      // flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "hasBelow",
      headerName: "สินค้าขาด",
      minWidth: 120,
      // flex: 0.8,
      headerAlign: "center",
      sortable: false,
      align: "center",
      renderCell: (params) => {
        if (params.value === true) {
          return <Done fontSize="small" sx={{ color: "#F54949" }} />;
        } else if (params.value === false) {
          return "-";
        }
      },
    },
    {
      field: "hasOver",
      headerName: "สินค้าเกิน",
      minWidth: 120,
      // flex: 0.7,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.value === true) {
          return <Done fontSize="small" sx={{ color: "#F54949" }} />;
        } else if (params.value === false) {
          return "-";
        }
      },
    },
    {
      field: "receivedDate",
      headerName: "วันที่รับสินค้า",
      minWidth: 180,
      // flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    // { field: "detail", headerName: "รายละเอียด", minWidth: 200 },
  ];
  // console.log("Data Size: ", JSON.stringify(res));

  const rows = res.data.map((data: CheckOrderInfo, indexs: number) => {
    return {
      id: data.id,
      index: (cuurentPage - 1) * parseInt(pageSize) + indexs + 1,
      shipmentNo: data.shipmentNo,
      sdNo: data.sdNo,
      branchOutNo: data.branchOutNo,
      branchDesc: data.branchDesc,
      sdType: getSdType(data.sdType),
      verifyDCStatus: getDCStatus(data.verifyDCStatus),
      hasBelow: data.hasBelow,
      hasOver: data.hasOver,
      receivedDate: convertUtcToBkkDate(data.receivedDate),

      // sdType: getSdType(data.sdType),
      // sdStatus: getSdStatus(data.sdStatus),
    };
  });

  // function currentlySelected(params: GridCellParams) {
  //   setSdNo(params.row.sdNo);
  //   setShipment(params.row.shipmentNo);
  //   setOpens(true);
  //   console.log("opens", opens);
  // }

  // function isClosModal() {
  //   setOpens(false);
  // }

  // console.log(typeof isClosModal);

  //pagination

  const [loading, setLoading] = React.useState<boolean>(false);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);

    let page: string = (newPage + 1).toString();

    const payloadNewpage: CheckOrderRequest = {
      limit: pageSize,
      page: page,
      docNo: payload.docNo,
      branchCode: payload.branchCode,
      verifyDCStatus: payload.verifyDCStatus,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      sdType: payload.sdType,
      sortBy: payload.sortBy,
    };

    await dispatch(featchOrderListDcAsync(payloadNewpage));
    await dispatch(saveSearchCriteriaDc(payloadNewpage));
    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    // console.log("pageSize: ", pageSize);
    setPageSize(pageSize.toString());

    setLoading(true);

    const payloadNewpage: CheckOrderRequest = {
      limit: pageSize.toString(),
      // page: cuurentPages.toString(),
      page: "1",
      docNo: payload.docNo,
      branchCode: payload.branchCode,
      verifyDCStatus: payload.verifyDCStatus,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      sdType: payload.sdType,
      sortBy: payload.sortBy,
    };

    await dispatch(featchOrderListDcAsync(payloadNewpage));
    await dispatch(saveSearchCriteriaDc(payloadNewpage));

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
            // onCellClick={currentlySelected}
            autoHeight
            pagination
            page={cuurentPage - 1}
            pageSize={parseInt(pageSize)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            rowCount={res.total}
            paginationMode="server"
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
            // rowHeight={80}
          />
        </div>
      </Box>
      {/* {opens && (
        <DCOrderDetail
          shipmentNo={shipment}
          sdNo={sdNo}
          isOpen={opens}
          onClickClose={isClosModal}
        />
      )} */}
    </div>
  );
}

export default DCOrderList;
