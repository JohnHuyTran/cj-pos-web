import React, { useEffect } from "react";

import { Box, Button, Snackbar, IconButton, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { BootstrapButton } from "../product/product-list-css";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { useAppSelector, useAppDispatch } from "../../store/store";
import {
  fetchGetProductList,
  fetchDeleteItemById,
  deleteItemAction,
} from "../../store/slices/productSlice";
import { ItemProduct } from "../../models/product-model";
import { deleteData } from "../../adapters/posback-adapter";
import { environment } from "../../environment-base";
import DialogConfirm from "../../components/dialog-confirm";

interface Data {}

function ProductListComponent() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchGetProductList());
  }, []);

  const items: ItemProduct[] = useAppSelector((state) => state.product.item);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const columns: GridColDef[] = [
    { field: "col1", headerName: "ลำดับ", width: 150 },
    {
      field: "col2",
      headerName: "รหัสสินค้า/บาร์โค้ด",
      width: 270,
      align: "left",
    },
    { field: "col3", headerName: "รายละเอียด", width: 360 },
    { field: "col4", headerName: "ราคา", width: 150 },
    {
      field: "delete",
      headerName: "delete",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <BootstrapButton
            startIcon={<DeleteIcon />}
            variant="contained"
            size="small"
            color="error"
            onClick={(event) => {
              deleteItem(event, cellValues);
            }}
          >
            Delete
          </BootstrapButton>
        );
      },
    },
  ];

  const rows = items.map((data: ItemProduct, index: number) => {
    return {
      id: data.id,
      col1: index + 1,
      col2: data.barcode,
      col3: data.name,
      col4: data.price,
    };
  });

  const [openDialogConfirm, setOpenDialogConfirm] = React.useState(false);
  const [rowId, setRowId] = React.useState(0);

  const deleteItem = (events: any, cellValues: any) => {
    events.stopPropagation();
    const id = cellValues.row.id;
    setRowId(id);

    showDialogConfirm();
  };

  const showDialogConfirm = () => {
    setOpenDialogConfirm(true);
  };

  const closeDialogConfirm = (value: string) => {
    setOpenDialogConfirm(false);
    if (value === "OK") {
      const res = dispatch(fetchDeleteItemById(rowId));
      if (res !== null) {
        setOpenSnackBar(true);
        dispatch(fetchGetProductList());
      }
    } else {
      setOpenSnackBar(false);
    }
  };

  const handleCloseSnackBar = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const actionSnackBar = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Box mt={2}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            autoHeight
          />
        </div>
      </Box>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        action={actionSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Delete Success
        </Alert>
      </Snackbar>

      <DialogConfirm open={openDialogConfirm} onClose={closeDialogConfirm} />
    </div>
  );
}

export default ProductListComponent;
