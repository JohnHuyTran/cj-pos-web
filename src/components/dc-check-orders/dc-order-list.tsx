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
//import CheckOrderDetail from './check-order-detail';

function DCOrderList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.dcCheckOrderList);
  const res: CheckOrderResponse = items.orderList;
  const payload = useAppSelector(
    (state) => state.saveSearchOrderDc.searchCriteriaDc
  );
  // const [opens, setOpens] = React.useState(false);
  // const [shipment, setShipment] = React.useState("");
  // const [sdNo, setSdNo] = React.useState("");
  const [index, setIndex] = React.useState(1);
  const [currentpage, setCurrentpage] = React.useState(0);

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
    },
    {
      field: "sdNo",
      headerName: "เลขที่เอกสาร SD",
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "branchOutNo",
      headerName: "เลขที่เอกสาร BO",
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "branchDesc",
      headerName: "สาขาปลายทาง",
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "sdType",
      headerName: "ประเภท",
      minWidth: 170,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "verifyDCStatus",
      headerName: "สถานะการตรวจสอบผลต่าง",
      minWidth: 220,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hasBelow",
      headerName: "สินค้าขาด",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.value === true) {
          return <Done fontSize="large" sx={{ color: "#F54949" }} />;
        } else if (params.value === false) {
          return "-";
        }
      },
    },
    {
      field: "hasOver",
      headerName: "สินค้าเกิน",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.value === true) {
          return <Done fontSize="large" sx={{ color: "#F54949" }} />;
        } else if (params.value === false) {
          return "-";
        }
      },
    },
    {
      field: "receivedDate",
      headerName: "วันที่รับสินค้า",
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    // { field: "detail", headerName: "รายละเอียด", minWidth: 200 },
  ];
  // console.log("Data Size: ", JSON.stringify(res));

  let i: number = index;
  const rows = res.data.map((data: CheckOrderInfo, indexs: number) => {
    return {
      id: data.id,
      index: i + indexs,
      // index: (currentpage - 1) * 10 + (indexs + 1),
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
    setCurrentpage(newPage);

    let page: string = "1";

    if (newPage > currentpage) {
      setIndex(index + 10);
      page = (newPage + 1).toString();
    } else if (newPage < currentpage) {
      setIndex(index - 10);
      page = (newPage - 1).toString();
    }

    const payloadNewpage: CheckOrderRequest = {
      limit: payload.limit,
      page: page,
      shipmentNo: payload.shipmentNo,
      branchCode: payload.branchCode,
      verifyDCStatus: payload.verifyDCStatus,
      dateFrom: payload.dateTo,
      dateTo: payload.dateFrom,
      sdType: payload.sdType,
      sortBy: payload.sortBy,
    };

    await dispatch(featchOrderListDcAsync(payloadNewpage));
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
            pageSize={10}
            rowsPerPageOptions={[10]}
            rowCount={res.total}
            paginationMode="server"
            onPageChange={handlePageChange}
            loading={loading}
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
