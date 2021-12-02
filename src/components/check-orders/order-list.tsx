import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { DataGrid, GridColDef, GridCellParams, GridRowId } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
//import OrderProductList from './order-product-list';
import { ShipmentResponse, ShipmentInfo, ShipmentRequest } from '../../models/order-model';
import { getSdType, getSdStatus } from '../../utils/utils';
import CheckOrderDetail from './check-order-detail';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import { getShipmentStatusText, getShipmentTypeText } from '../../utils/enum/check-order-enum';
import { useStyles } from '../../styles/makeTheme';
import { featchOrderListAsync } from '../../store/slices/check-order-slice';
import { saveSearchCriteria } from '../../store/slices/save-search-order';
import checkOrderDetailSlice, { featchOrderDetailAsync } from '../../store/slices/check-order-detail-slice';
import LoadingModal from '../commons/ui/loading-modal';
import { ApiError } from '../../models/api-error-model';
import { Typography } from '@mui/material';

function OrderList() {
  const classes = useStyles();
  const items = useAppSelector((state) => state.checkOrderList);
  const cuurentPages = useAppSelector((state) => state.checkOrderList.orderList.page);
  const limit = useAppSelector((state) =>
    state.checkOrderList.orderList.perPage ? state.checkOrderList.orderList.perPage : 0
  );

  const res: ShipmentResponse = items.orderList;
  const payload = useAppSelector((state) => state.saveSearchOrder.searchCriteria);
  const dispatch = useAppDispatch();
  const [opens, setOpens] = React.useState(false);
  const [shipment, setShipment] = React.useState('');
  const [sdNo, setSdNo] = React.useState('');
  const [pageSize, setPageSize] = React.useState(limit.toString());

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      // minWidth: 75,
      flex: 0.7,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'shipmentNo',
      headerName: 'เลขที่เอกสาร LD',
      // minWidth: 161,
      flex: 1.3,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'sdNo',
      headerName: 'เลขที่เอกสาร SD',
      // minWidth: 160,
      // flex: 1.3,
      flex: 1.3,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'sdType',
      headerName: 'ประเภท',
      // minWidth: 160,
      flex: 1.4,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'sdStatus',
      headerName: 'สถานะ',
      minWidth: 80,
      flex: 0.65,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
    },
    {
      field: 'boxCnt',
      headerName: 'จำนวนลัง',
      minWidth: 90,
      flex: 0.8,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'toteCnt',
      headerName: 'จำนวนTote',
      minWidth: 100,
      flex: 0.9,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'shipmentDate',
      headerName: 'วันที่รับสินค้า',
      minWidth: 110,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
    },
    {
      field: 'comment',
      headerName: 'อ้างอิง SD โอนลอย',
      minWidth: 150,
      flex: 1.4,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
    },
  ];

  // console.log("res: ", JSON.stringify(res));
  const rows = res.data.map((data: ShipmentInfo, indexs: number) => {
    return {
      id: `${data.shipmentNo}_${data.sdNo}`,
      index: (cuurentPages - 1) * parseInt(pageSize) + indexs + 1,
      shipmentNo: data.shipmentNo,
      sdNo: data.sdNo,
      sdType: getShipmentTypeText(data.sdType),
      boxCnt: data.boxCnt,
      toteCnt: data.toteCnt,
      shipmentDate: convertUtcToBkkDate(data.shipmentDate),
      sdStatus: getShipmentStatusText(data.sdStatus),
      comment: data.comment,
    };
  });

  const currentlySelected = async (params: GridCellParams) => {
    setOpenLoadingModal(true);
    setSdNo(params.row.sdNo);
    setShipment(params.row.shipmentNo);

    await dispatch(featchOrderDetailAsync(params.row.sdNo))
      .then(
        async function (value) {
          setOpens(true);
        },
        function (error: ApiError) {
          console.log('err message : ', error.message);
        }
      )
      .catch((err) => {
        console.log('err : ', err);
      });
    // setOpens(true);
    setOpenLoadingModal(false);
  };

  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);

  // const currentlySelected = async (params: GridCellParams) => {
  //   setOpenLoadingModal(true);
  //   setSdNo(params.row.sdNo);
  //   setShipment(params.row.shipmentNo);

  //   try {
  //     await dispatch(featchOrderDetailAsync(params.row.sdNo));
  //     setOpens(true);
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   setOpenLoadingModal(false);
  // };

  function isClosModal() {
    setOpens(false);
  }

  //pagination

  const [loading, setLoading] = React.useState<boolean>(false);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);

    let page: string = (newPage + 1).toString();

    const payloadNewpage: ShipmentRequest = {
      // limit: payload.limit,
      limit: pageSize,
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

  const handlePageSizeChange = async (pageSize: number) => {
    setPageSize(pageSize.toString());

    setLoading(true);

    const payloadNewpage: ShipmentRequest = {
      // limit: payload.limit,
      limit: pageSize.toString(),
      // page: cuurentPages.toString(),
      page: '1',
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
      {/* <Box mt={2} bgcolor="background.paper"> */}
      <div className={classes.MdataGridPaginationTop} style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          onCellClick={currentlySelected}
          autoHeight
          page={cuurentPages - 1}
          pageSize={parseInt(pageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          rowCount={res.total}
          paginationMode='server'
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          loading={loading}
          pagination
        />
      </div>
      {/* </Box> */}
      {opens && <CheckOrderDetail sdNo={sdNo} shipmentNo={shipment} defaultOpen={opens} onClickClose={isClosModal} />}

      <LoadingModal open={openLoadingModal} />
    </div>
  );
}

export default OrderList;
