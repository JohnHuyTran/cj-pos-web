import { Box, Button, Chip, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import {
  PurchaseInfo,
  PurchaseInvoiceSearchCriteriaRequest,
  PurchaseInvoiceSearchCriteriaResponse,
} from "../../models/supplier-check-order-model";
import { saveSearchCriteriaSup } from "../../store/slices/save-search-order-supplier-slice";
import { featchOrderListSupAsync } from "../../store/slices/supplier-check-order-slice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useStyles } from "../../styles/makeTheme";
import { convertUtcToBkkDate } from "../../utils/date-utill";

export default function SupplierOrderList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.supplierCheckOrderSlice);
  const res: PurchaseInvoiceSearchCriteriaResponse = items.orderList;

  const cuurentPage = useAppSelector(
    (state) => state.supplierCheckOrderSlice.orderList.page
  );
  const limit = useAppSelector(
    (state) => state.supplierCheckOrderSlice.orderList.perPage
  );

  const payload = useAppSelector(
    (state) => state.saveSearchOrderSup.searchCriteria
  );
  const [pageSize, setPageSize] = React.useState(limit.toString());

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "ลำดับที่",
      //   minWidth: 75,
      flex: 0.5,
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "createdDate",
      headerName: "วันที่รับสินค้า",
      //   minWidth: 170,
      flex: 0.8,
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "supplierName",
      headerName: "ผู้จำหน่าย",
      //   minWidth: 170,
      flex: 1.9,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <div>
          <Typography variant="body2">{params.value}</Typography>
          <Typography color="textSecondary" variant="body2">
            {params.getValue(params.id, "supplierCode") || ""}
          </Typography>
        </div>
      ),
    },
    {
      field: "piNo",
      headerName: "เลขที่เอกสาร PI",
      //   minWidth: 170,
      flex: 1,
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "docNo",
      headerName: "เลขที่ใบสั่งซื้อ PO",
      //   minWidth: 190,
      flex: 1,
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "piStatus",
      headerName: "สถานะ",
      //   minWidth: 160,
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        if (params.value === 0) {
          return (
            <Chip
              label="บันทึก"
              size="small"
              sx={{ color: "#FBA600", backgroundColor: "#FFF0CA" }}
            />
          );
        } else if (params.value === 1) {
          return (
            <Chip
              label="อนุมัติ"
              size="small"
              sx={{ color: "#20AE79", backgroundColor: "#E7FFE9" }}
            />
          );
        }
      },
    },
    {
      field: "comment",
      headerName: "หมายเหตุ",
      //   minWidth: 195,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <Tooltip
            title={
              <span style={{ whiteSpace: "pre-line" }}>{params.value}</span>
            }
          >
            <Typography variant="body2" noWrap>
              {params.value}
            </Typography>
          </Tooltip>
        );
      },
    },
  ];

  const rows = res.data.map((data: PurchaseInfo, indexs: number) => {
    return {
      id: data.id,
      index: (cuurentPage - 1) * parseInt(pageSize) + indexs + 1,
      createdDate: convertUtcToBkkDate(data.createdDate),
      supplierName: data.supplierName,
      supplierCode: data.supplierCode,
      piNo: data.piNo,
      docNo: data.docNo,
      piStatus: data.piStatus,
      comment: data.comment,
    };
  });

  const [loading, setLoading] = React.useState<boolean>(false);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);

    let page: string = (newPage + 1).toString();

    const payloadNewpage: PurchaseInvoiceSearchCriteriaRequest = {
      limit: pageSize,
      page: page,
      paramQuery: payload.paramQuery,
      piStatus: payload.piStatus,
      piType: payload.piType,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
    };

    await dispatch(featchOrderListSupAsync(payloadNewpage));
    await dispatch(saveSearchCriteriaSup(payloadNewpage));
    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    // console.log("pageSize: ", pageSize);
    setPageSize(pageSize.toString());

    setLoading(true);

    const payloadNewpage: PurchaseInvoiceSearchCriteriaRequest = {
      limit: pageSize.toString(),
      // page: cuurentPages.toString(),
      page: "1",
      paramQuery: payload.paramQuery,
      piStatus: payload.piStatus,
      piType: payload.piType,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
    };

    await dispatch(featchOrderListSupAsync(payloadNewpage));
    await dispatch(saveSearchCriteriaSup(payloadNewpage));

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
    </div>
  );
}
