import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
  GridRowId,
  GridRowData,
  GridValueGetterParams,
  GridCellParams,
} from "@mui/x-data-grid";
import {
  Box,
  createStyles,
  makeStyles,
  TextareaAutosize,
} from "@material-ui/core";
import { Button, TextField, Typography } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import { useStyles } from "../../styles/makeTheme";
import { DiscountDetail } from "../../models/barcode-discount";
import DatePickerComponent from "../../components/commons/ui/date-picker";
export interface DataGridProps {
  id: string;
  typeDiscount: string;
  // onClose?: () => void;
}
export const ModalTransferItem = (props: DataGridProps) => {
  const { typeDiscount } = props;

  const classes = useStyles();
  const payloadAddItem = useAppSelector((state) => state.addItems.state);

  const [dtTable, setDtTable] = React.useState<Array<DiscountDetail>>([]);
  useEffect(() => {
    if (Object.keys(payloadAddItem).length !== 0) {
      let rows = payloadAddItem.map((item: any, index: number) => {
        console.log("item:", JSON.stringify(item));
        const price = Math.floor(Math.random() * 101);
        let discount = 0;
        const cashDiscount =
          typeDiscount === "percent" ? (discount * price) / 100 : discount;

        const priceAffterDicount = price - cashDiscount;
        return {
          id: `${item.barcode}-${index + 1}`,
          index: index + 1,
          barCode: item.barcode,
          productName: item.barcodeName,
          unit: item.unitName,
          price: price,
          discount: 0,
          qty: item.qty ? item.qty : 0,
          empiryDate: new Date(),
          cashDiscount: cashDiscount || 0,
          priceAffterDicount: priceAffterDicount,
          numberOfDiscounted: 0,
        };
      });
      setDtTable(rows);
    }
  }, [payloadAddItem, typeDiscount]);

  const handleChangeDiscount = (event: any, index: number) => {
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      data[index - 1].discount = parseInt(event.target.value);
      console.log(data[index - 1].discount);

      if (typeDiscount === "percent") {
        const number = data[index - 1].price * (data[index - 1].discount / 100);

        data[index - 1].cashDiscount = Math.trunc(number) || 0;
      } else {
        data[index - 1].cashDiscount = data[index - 1].discount || 0;
      }
      data[index - 1].priceAffterDicount =
        data[index - 1].price - data[index - 1].cashDiscount;
      return data;
    });
  };

  const handleChangeNumberOfDiscount = (event: any, index: number) => {
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      data[index - 1].numberOfDiscounted = event.target.value;
      return data;
    });
  };

  const handleChangeExpiry = (e: any, index: number) => {
    setDtTable((preData: Array<DiscountDetail>) => {
      const data = [...preData];
      console.log(e);

      data[index - 1].empiryDate = e;
      return data;
    });
  };

  const demo = (e: any, id: any) => {
    console.log(e);
  };

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "ลำดับ",
      minWidth: 60,
      headerAlign: "center",
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: "20px" }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "barCode",
      headerName: "บาร์โค้ด",
      minWidth: 122,
      headerAlign: "center",
      disableColumnMenu: false,
      sortable: false,
    },
    {
      field: "productName",
      headerName: "รายละเอียดสินค้า",
      minWidth: 250,
      headerAlign: "center",
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Typography variant="body2">{params.value}</Typography>
          <Typography color="textSecondary" sx={{ fontSize: 12 }}>
            {params.getValue(params.id, "skuCode") || ""}
          </Typography>
        </div>
      ),
    },
    {
      field: "unit",
      headerName: "หน่วย",
      minWidth: 77,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "price",
      headerName: "ราคาปกติ",
      minWidth: 80,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "discount",
      headerName: typeDiscount === "percent" ? "ยอดลด (%)" : "ยอดลด (บาท)",
      resizable: true,
      minWidth: 130,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) =>
        typeDiscount === "percent" ? (
          <TextField
            type="number"
            value={params.value}
            inputProps={{ min: 0, max: 100 }}
            onChange={(e) => {
              handleChangeDiscount(e, params.row.index);
            }}
          />
        ) : (
          <TextField
            type="number"
            inputProps={{ min: 0, max: 100 }}
            onChange={(e) => {
              handleChangeDiscount(e, params.row.index);
            }}
          />
        ),
    },
    {
      field: "cashDiscount",
      headerName: "ส่วนลด",
      minWidth: 73,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "priceAffterDicount",
      headerName: "ราคาหลังลด",
      minWidth: 120,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "numberOfDiscounted",
      headerName: "จำนวนที่ขอลด",
      minWidth: 119,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <TextField
          type="number"
          value={params.value}
          onChange={(e) => {
            handleChangeNumberOfDiscount(e, params.row.index);
          }}
        />
      ),
    },
    {
      field: "numberOfApproved",
      headerName: "จำนวน<br>ที่อนุมัติ",
      minWidth: 150,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      renderCell: () => <TextField type="number" disabled />,
    },
    {
      field: "approvedDiscount",
      headerName: "รวมส่วนลดที่อนุมัติ",
      minWidth: 153,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "empiryDate",
      headerName: "วันที่หมดอายุ",
      minWidth: 180,
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DatePickerComponent
            onClickDate={(e: any) => {
              handleChangeExpiry(e, params.row.index);
            }}
            value={params.value}
          />
        );
      },
    },
    {
      field: "delete",
      headerName: "ลบ",
      flex: 0.2,
      align: "center",
      sortable: false,
      renderCell: () => {
        return (
          <Button>
            <DeleteForever fontSize="medium" sx={{ color: "#F54949" }} />
          </Button>
        );
      },
    },
  ];
  const [pageSize, setPageSize] = React.useState<number>(10);
  return (
    <div
      style={{ width: "100%", height: dtTable.length >= 8 ? "70vh" : "auto" }}
      className={classes.MdataGridDetail}
    >
      <DataGrid
        rows={dtTable}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 20, 50, 100]}
        pagination
        disableColumnMenu
        autoHeight={dtTable.length >= 8 ? false : true}
        scrollbarSize={10}
        rowHeight={80}
        // onCellClick={currentlySelected}
        // onCellFocusOut={handleCalculateItems}
      />
      <Box display="flex" justifyContent="space-between" paddingTop="30px">
        <Box>
          <Typography fontSize="14px" lineHeight="21px" height="24px">
            หมายเหตุจากสาขา :{" "}
          </Typography>
          <TextareaAutosize
            placeholder="ความยาวไม่เกิน 100 ตัวอักษร"
            style={{
              width: "339px",
              height: "115px",
              border: "1px solid #C1C1C1",
              borderRadius: "10px",
              backgroundColor: "transparent",
            }}
          />
        </Box>
        <Box width="350px" marginTop="20px">
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize="14px" lineHeight="21px" height="24px">
              ขอส่วนลดทั้งหมด
            </Typography>
            <TextField
              style={{
                backgroundColor: "#EAEBEB",
                border: "1px solid #C1C1C1",
                borderRadius: "6px",
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" marginTop="10px">
            <Typography fontSize="14px" fontWeight="700" marginTop="6px">
              ส่วนลดที่อนุมัติทั้งหมด
            </Typography>
            <TextField
              style={{
                backgroundColor: "#E7FFE9",
                border: "1px solid #C1C1C1",
                borderRadius: "6px",
              }}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ModalTransferItem;
