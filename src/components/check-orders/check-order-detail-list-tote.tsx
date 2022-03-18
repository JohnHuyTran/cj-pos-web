import React, { useMemo } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams, useGridApiRef } from '@mui/x-data-grid';
import { useAppSelector } from '../../store/store';
import { ShipmentDeliveryStatusCodeEnum } from '../../utils/enum/check-order-enum';
import { useStyles } from '../../styles/makeTheme';

function CheckOrderDetailListTote() {
  const classes = useStyles();
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const orderDetails = useAppSelector((state) => state.checkOrderDetail.orderDetail);
  const orderDetail: any = orderDetails.data ? orderDetails.data : null;

  const columns: GridColDef[] = [
    {
      field: 'rowOrder',
      headerName: 'ลำดับ',
      width: 80,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'barcode',
      headerName: 'บาร์โค้ด',
      minWidth: 135,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'productName',
      headerName: 'รายละเอียดสินค้า',
      headerAlign: 'center',
      minWidth: 160,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Typography variant="body2">{params.value}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.getValue(params.id, 'skuCode') || ''}
          </Typography>
        </div>
      ),
    },
    {
      field: 'unitName',
      headerName: 'หน่วย',
      width: 90,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'qtyRef',
      headerName: 'จำนวนอ้างอิง',
      width: 130,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'actualQty',
      headerName: 'จำนวนรับจริง',
      width: 135,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <TextField
          variant="outlined"
          name="txnQuantityActual"
          type="number"
          inputProps={{ style: { textAlign: 'right' } }}
          value={params.value}
          onChange={(e) => {
            var value = e.target.value ? parseInt(e.target.value, 10) : '';
            if (value < 0) value = 0;

            params.api.updateRows([{ ...params.row, actualQty: value }]);
          }}
          onBlur={(e) => {
            // isAllowActualQty(params, parseInt(e.target.value, 10));
            params.api.updateRows([{ ...params.row, actualQty: e.target.value }]);
          }}
          disabled={isDisable(params) ? true : false}
          autoComplete="off"
        />
      ),
    },
    {
      field: 'qtyDiff',
      headerName: 'ส่วนต่างการรับ',
      width: 140,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
      renderCell: (params) => calProductDiff(params),
    },
    {
      field: 'comment',
      headerName: 'หมายเหตุ',
      headerAlign: 'center',
      minWidth: 120,
      // flex: 0.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <TextField
          variant="outlined"
          name="txnComment"
          value={params.value}
          onChange={(e) => params.api.updateRows([{ ...params.row, comment: e.target.value }])}
          disabled={isDisable(params) ? true : false}
          autoComplete="off"
        />
      ),
    },
    {
      field: 'canAddTote',
      headerName: 'รับสินค้าใน Tote',
      width: 140,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            size="small"
            className={classes.MbtnApprove}
            sx={{ minWidth: 110 }}
            // onClick={() => handleOpenReturnModal(params.row.piNo, 'button')}
          >
            รับสินค้าใน Tote
          </Button>
        );

        // if (params.getValue(params.id, 'piStatus') === 1) {
        //   if (params.getValue(params.id, 'pnState') === 0) {
        //     //check Create PN
        //     return (
        //       <Button
        //         variant="contained"
        //         color="warning"
        //         size="small"
        //         className={classes.MbtnSearch}
        //         sx={{ minWidth: 90 }}
        //         onClick={() => handleOpenReturnModal(params.row.piNo, 'button')}
        //       >
        //         คืนสินค้า
        //       </Button>
        //     );
        //   } else {
        //     //PN Number 'บันทึก pnState=1, อนุมัติpnState=2'
        //     return (
        //       <Typography
        //         color="secondary"
        //         variant="body2"
        //         sx={{ textDecoration: 'underline' }}
        //         onClick={() => handleOpenReturnModal(params.row.piNo, 'button')}
        //       >
        //         {params.value}
        //       </Typography>
        //     );
        //   }
        // } else {
        //   return (
        //     <Box
        //       sx={{ height: '100%', width: '100px' }}
        //       onClick={() => handleOpenReturnModal(params.row.piNo, 'blank')}
        //     ></Box>
        //   );
        // }
      },
    },
  ];

  var calProductDiff = function (params: GridValueGetterParams) {
    let diff = Number(params.getValue(params.id, 'actualQty')) - Number(params.getValue(params.id, 'qtyRef'));

    if (diff > 0) return <label style={{ color: '#446EF2', fontWeight: 700 }}> +{diff} </label>;
    if (diff < 0) return <label style={{ color: '#F54949', fontWeight: 700 }}> {diff} </label>;
    return diff;
  };

  function useApiRef() {
    const apiRef = useGridApiRef();
    const _columns = useMemo(
      () =>
        columns.concat({
          field: '',
          width: 0,
          minWidth: 0,
          sortable: false,
          renderCell: (params) => {
            apiRef.current = params.api;
            return null;
          },
        }),
      [columns]
    );

    return { apiRef, columns: _columns };
  }

  const isDisable = (params: GridRenderCellParams) => {
    return params.row.sdStatus;
  };

  let rowsEntries: any = [];
  if (Object.keys(payloadAddItem).length !== 0) {
    rowsEntries = payloadAddItem.map((item: any, index: number) => {
      let qtyRef: number = 0;
      let actualQty: number = 0;

      if (item.id !== null && item.id !== undefined) {
        qtyRef = Number(item.qtyRef) ? Number(item.qtyRef) : 0;
        actualQty = Number(item.qty) ? Number(item.qty) : Number(item.actualQty) ? Number(item.actualQty) : 0;
      } else {
        qtyRef = Number(item.qty);
        actualQty = Number(item.actualQty);
      }

      return {
        rowOrder: index + 1,
        id: `${item.deliveryOrderNo}${item.barcode}_${index}`,
        deliveryOrderNo: item.deliveryOrderNo,
        isTote: item.isTote ? item.isTote : false,
        sdStatus: orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT ? false : true,
        skuCode: item.skuCode,
        barcode: item.barcode,
        productName: item.productName,
        unitName: item.unitName,
        qtyRef: qtyRef,
        actualQty: actualQty,
        qtyDiff: item.qtyDiff,
        comment: item.comment,
        canAddTote: item.canAddTote ? item.canAddTote : false,
        sdNo: item.sdNo ? item.sdNo : '',
      };
    });
  }

  return (
    <div
      style={{ width: '100%', height: rowsEntries.length >= 8 ? '70vh' : 'auto' }}
      className={classes.MdataGridDetail}
    >
      <DataGrid
        rows={rowsEntries}
        columns={columns}
        // pageSize={pageSize}
        // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 20, 50, 100]}
        pagination
        disableColumnMenu
        autoHeight={rowsEntries.length >= 8 ? false : true}
        scrollbarSize={10}
        // onCellFocusOut={handleEditItems}
        // onCellOut={handleEditItems}
        // onCellKeyDown={handleEditItems}
        // onCellBlur={handleEditItems}
      />
    </div>
  );
}

export default CheckOrderDetailListTote;
