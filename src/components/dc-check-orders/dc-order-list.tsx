import React from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
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
import { featchorderDetailDCAsync } from "../../store/slices/dc-check-order-detail-slice";
import LoadingModal from "../commons/ui/loading-modal";

interface loadingModalState {
  open: boolean;
}

function DCOrderList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.dcCheckOrderList);
  const res: CheckOrderResponse = items.orderList;
  const payload = useAppSelector(
    (state) => state.saveSearchOrderDc.searchCriteriaDc
  );
  const [opensDCOrderDetail, setOpensDCOrderDetail] = React.useState(false);
  const [shipment, setShipment] = React.useState("");
  const [sdNo, setSdNo] = React.useState("");

  const [idDC, setidDC] = React.useState("");
  const [index, setIndex] = React.useState(1);
  const [currentpage, setCurrentpage] = React.useState(0);

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "ลำดับที่",
      minWidth: 70,
      headerAlign: "center",
    },
    {
      field: "shipmentNo",
      headerName: "เลขที่เอกสาร LD",
      minWidth: 160,
      headerAlign: "center",
    },
    {
      field: "sdNo",
      headerName: "เลขที่เอกสาร SD",
      minWidth: 160,
      headerAlign: "center",
    },
    {
      field: "branchOutNo",
      headerName: "เลขที่เอกสาร BO",
      minWidth: 160,
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
      minWidth: 115,
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
      field: "hasOver",
      headerName: "สินค้าเกิน",
      minWidth: 115,
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
      minWidth: 130,
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
      // index: i + indexs,
      index: currentpage * 10 + indexs + 1,
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

  const featchOrderDCList = async (id: string) => {
    try {
      await dispatch(featchorderDetailDCAsync(id));
    } catch (error) {
      console.log("error : " + error);
    }
  };

  const [openLoadingModal, setOpenLoadingModal] =
    React.useState<loadingModalState>({
      open: false,
    });

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const currentlySelected = async (params: GridCellParams) => {
    handleOpenLoading("open", true);
    setidDC(params.row.id);

    try {
      await dispatch(featchorderDetailDCAsync(params.row.id));
      setOpensDCOrderDetail(true);
    } catch (error) {
      console.log(error);
    }

    handleOpenLoading("open", false);
  };

  function isClosModal() {
    setOpensDCOrderDetail(false);
  }

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
            onCellClick={currentlySelected}
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
      {opensDCOrderDetail && (
        <DCOrderDetail
          idDC={idDC}
          isOpen={opensDCOrderDetail}
          onClickClose={isClosModal}
        />
      )}

      <LoadingModal open={openLoadingModal.open} />
    </div>
  );
}

export default DCOrderList;
