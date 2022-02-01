import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { DataGrid, GridCellParams, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { convertUtcToBkkDate } from '../../utils/date-utill';
// import { makeStyles } from '@mui/styles';
import { useStyles } from '../../styles/makeTheme';
import Done from '@mui/icons-material/Done';

import LoadingModal from '../commons/ui/loading-modal';
import { Chip, Typography } from '@mui/material';
import { StockTransferInfo, StockTransferRequest, StockTransferResponse } from '../../models/stock-transfer-model';
import { DeleteForever } from '@mui/icons-material';
import { featchSearchStockTransferRtAsync } from '../../store/slices/stock-transfer-rt-slice';
import { saveSearchStockTransferRt } from '../../store/slices/save-search-stock-transfer-rt-slice';
import ModalDetailStockTransfer from './stock-request-detail';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { featchTransferReasonsListAsync } from '../../store/slices/transfer-reasons-slice';
import { featchStockRequestDetailAsync } from '../../store/slices/stock-request-detail-slice';

interface loadingModalState {
  open: boolean;
}

function StockTransferRtList() {
  const { t } = useTranslation(['stockTransfer', 'common']);
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.searchStockTrnasferRt);
  const cuurentPage = useAppSelector((state) => state.searchStockTrnasferRt.orderList.page);
  const limit = useAppSelector((state) => state.searchStockTrnasferRt.orderList.perPage);
  const res: StockTransferResponse = items.orderList;
  const payload = useAppSelector((state) => state.saveSearchStockRt.searchStockTransferRt);
  // const [opensDCOrderDetail, setOpensDCOrderDetail] = React.useState(false);

  const [pageSize, setPageSize] = React.useState(limit.toString());

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      width: 70,
      // flex: 0.7,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'rtNo',
      headerName: 'เลขที่เอกสารร้องขอ RT',
      minWidth: 180,
      // flex: 1.3,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'startDate',
      headerName: 'วันที่ต้องการโอน',
      width: 160,
      // minWidth: 200,
      // flex: 1,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
      renderCell: (params) => (
        <div>
          <Typography variant="body2" sx={{ lineHeight: '120%' }}>
            {params.value} - {params.getValue(params.id, 'endDate') || ''}
          </Typography>
        </div>
      ),
    },
    {
      field: 'branchFromName',
      headerName: 'สาขาต้นทาง',
      minWidth: 128,
      width: 200,
      // flex: 1.2,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'branchToName',
      headerName: 'สาขาปลายทาง',
      // minWidth: 128,
      width: 200,
      // flex: 0.,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'createdBy',
      headerName: 'ผู้สร้างรายการ',
      minWidth: 120,
      // flex: 0.75,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
    },
    {
      field: 'status',
      headerName: 'สถานะ RT',
      minWidth: 80,
      // flex: 0.7,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => {
        if (
          params.value === 'DRAFT' ||
          params.value === 'WAIT_FOR_APPROVAL_1' ||
          params.value === 'WAIT_FOR_APPROVAL_2' ||
          params.value === 'AWAITING_FOR_REQUESTER'
        ) {
          return (
            <Chip
              label={t(`status.${params.value}`)}
              size="small"
              sx={{ color: '#FBA600', backgroundColor: '#FFF0CA' }}
            />
          );
        } else if (params.value === 'APPROVED') {
          return (
            <Chip
              label={t(`status.${params.value}`)}
              size="small"
              sx={{ color: '#20AE79', backgroundColor: '#E7FFE9' }}
            />
          );
        } else if (params.value === 'CANCELED') {
          return (
            <Chip
              label={t(`status.${params.value}`)}
              size="small"
              sx={{ color: '#F54949', backgroundColor: '#FFD7D7' }}
            />
          );
        }
      },
    },
    // {
    //   field: 'button',
    //   headerName: ' ',
    //   width: 60,
    //   minWidth: 0,
    //   align: 'center',
    //   sortable: false,
    //   renderCell: () => {
    //     return <DeleteForever fontSize='medium' sx={{ color: '#F54949' }} />;
    //   },
    // },
  ];

  const rows = res.data.map((data: StockTransferInfo, indexs: number) => {
    return {
      id: data.id,
      index: (cuurentPage - 1) * parseInt(pageSize) + indexs + 1,
      rtNo: data.rtNo,
      startDate: convertUtcToBkkDate(data.startDate),
      endDate: convertUtcToBkkDate(data.endDate),
      branchFromName: data.branchFromName,
      branchToName: data.branchToName,
      createdBy: data.createdBy,
      status: data.status,
    };
  });

  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });

  const [loading, setLoading] = React.useState<boolean>(false);
  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    console.log('newPage: ', newPage);
    let page: string = (newPage + 1).toString();

    const payloadNewpage: StockTransferRequest = {
      limit: pageSize,
      page: page,
      docNo: payload.docNo,
      branchFrom: payload.branchFrom,
      branchTo: payload.branchTo,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      statuses: payload.statuses,
      transferReason: payload.transferReason,
    };

    await dispatch(featchSearchStockTransferRtAsync(payloadNewpage));
    await dispatch(saveSearchStockTransferRt(payloadNewpage));
    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    // console.log("pageSize: ", pageSize);
    setPageSize(pageSize.toString());

    setLoading(true);

    const payloadNewpage: StockTransferRequest = {
      limit: pageSize.toString(),
      page: '1',
      docNo: payload.docNo,
      branchFrom: payload.branchFrom,
      branchTo: payload.branchTo,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      statuses: payload.statuses,
      transferReason: payload.transferReason,
    };

    await dispatch(featchSearchStockTransferRtAsync(payloadNewpage));
    await dispatch(saveSearchStockTransferRt(payloadNewpage));

    setLoading(false);
  };

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };
  const currentlySelected = async (params: GridCellParams) => {
    handleOpenLoading('open', true);
    await handleOpenDetailModal(params.row.rtNo);
    handleOpenLoading('open', false);
  };

  const [openDetailModal, setOpenDetailModal] = React.useState(false);
  const [typeDetailModal, setTypeDetailModal] = React.useState('View');
  const handleOpenDetailModal = async (rtNo: string) => {
    await dispatch(updateAddItemsState({}));
    setTypeDetailModal('View');
    await dispatch(featchStockRequestDetailAsync(rtNo));
    setOpenDetailModal(true);
  };

  function handleCloseDetailModal() {
    setOpenDetailModal(false);
  }
  return (
    <div>
      <Box mt={2} bgcolor="background.paper">
        <div className={classes.MdataGridPaginationTop} style={{ height: rows.length >= 10 ? '80vh' : 'auto' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            onCellClick={currentlySelected}
            autoHeight={rows.length >= 10 ? false : true}
            scrollbarSize={10}
            page={cuurentPage - 1}
            pageSize={parseInt(pageSize)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            rowCount={res.total}
            paginationMode="server"
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
            rowHeight={65}
            pagination
          />
        </div>
      </Box>

      <LoadingModal open={openLoadingModal.open} />

      {openDetailModal && (
        <ModalDetailStockTransfer
          type={typeDetailModal}
          isOpen={openDetailModal}
          onClickClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
}

export default StockTransferRtList;
