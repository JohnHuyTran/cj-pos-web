import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Typography } from '@mui/material';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { useStyles } from '../../../styles/makeTheme';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { PurChaseBranchInfo, PurchaseBranchSearchRequest } from '../../../models/purchase-branch-request-model';
import { convertUtcToBkkDate } from '../../../utils/date-utill';
import LoadingModal from '../../commons/ui/loading-modal';
import { featchSearchPurchaseBranchRequestAsync } from '../../../store/slices/purchase-branch-request-slice';
import { saveSearchPurchaseBranch } from '../../../store/slices/save-search-purchase-branch-request-slice';

interface loadingModalState {
  open: boolean;
}

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    width: 70,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params) => (
      <Box component="div" sx={{ paddingLeft: '20px' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'docNo',
    headerName: 'เลขที่เอกสาร',
    minWidth: 160,
    flex: 0.7,
    headerAlign: 'center',
    sortable: false,
  },
  {
    field: 'createdDate',
    headerName: 'วันที่สร้างรายการ',
    minWidth: 150,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: (params) => {
      return (
        <div
          style={{
            textAlign: 'center',
          }}
        >
          {params.value}
        </div>
      );
    },
  },
  {
    field: 'branchCode',
    headerName: 'สาขาที่สร้างรายการ',
    minWidth: 210,
    flex: 1,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params) => (
      <div>
        <Typography variant="body2" sx={{ lineHeight: '120%' }}>
          {params.value}-{params.getValue(params.id, 'branchName') || ''}
        </Typography>
      </div>
    ),
  },
  {
    field: 'createByFullName',
    headerName: 'ผู้สร้างรายการ',
    minWidth: 145,
    headerAlign: 'center',
    align: 'left',
    sortable: false,
  },
  {
    field: 'status',
    headerName: 'สถานะ',
    minWidth: 90,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: (params) => {
      if (params.value === 'DRAFT' || params.value === 'CREATED_PO' || params.value === 'WAITING_BRANCH_EXAMINE') {
        return (
          <Chip
            label={params.getValue(params.id, 'statusText')}
            size="small"
            sx={{ color: '#FBA600', backgroundColor: '#FFF0CA' }}
          />
        );
      } else if (params.value === 'SUBMITTED') {
        return (
          <Chip
            label={params.getValue(params.id, 'statusText')}
            size="small"
            sx={{ color: '#20AE79', backgroundColor: '#E7FFE9' }}
          />
        );
      } else if (params.value === 'CLOSED') {
        return (
          <Chip
            label={params.getValue(params.id, 'statusText')}
            size="small"
            sx={{ color: '#F54949', backgroundColor: '#FFD7D7' }}
          />
        );
      }
    },
  },
];

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

export default function PurchaseBranchRequestList() {
  const { t } = useTranslation(['purchaseBranch', 'common']);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.purchaseBranchRequestSlice);
  const payload = useAppSelector((state) => state.saveSearchPurchaseBranchRequest.searchPurchaseBranchRequest);
  const res = items.orderList;
  const dataList = items.orderList.data;

  const cuurentPage = useAppSelector((state) => state.purchaseBranchRequestSlice.orderList.page);
  const limit = useAppSelector((state) => state.purchaseBranchRequestSlice.orderList.perPage);
  const [pageSize, setPageSize] = React.useState(limit.toString());

  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const rows = dataList.map((data: PurChaseBranchInfo, indexs: number) => {
    return {
      id: `${data.docNo}_${indexs}`,
      index: (cuurentPage - 1) * parseInt(pageSize) + indexs + 1,
      docNo: data.docNo,
      branchCode: data.branchCode,
      branchName: data.branchName,
      status: data.status,
      statusText: t(`status.${data.status}`),
      createdBy: data.createdBy,
      createByFullName: data.createByFullName,
      createdDate: convertUtcToBkkDate(data.createdDate),
      lastModifiedBy: data.lastModifiedBy,
      lastModifiedDate: data.lastModifiedDate,
    };
  });

  const [loading, setLoading] = React.useState<boolean>(false);
  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    let page: string = (newPage + 1).toString();

    const payloadNewpage: PurchaseBranchSearchRequest = {
      limit: pageSize,
      page: page,
      docNo: payload.docNo,
      branchCode: payload.branchCode,
      status: payload.status,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      clearSearch: false,
    };

    await dispatch(featchSearchPurchaseBranchRequestAsync(payloadNewpage));
    await dispatch(saveSearchPurchaseBranch(payloadNewpage));

    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    setPageSize(pageSize.toString());

    setLoading(true);

    const payloadNewpage: PurchaseBranchSearchRequest = {
      limit: pageSize.toString(),
      page: '1',
      docNo: payload.docNo,
      branchCode: payload.branchCode,
      status: payload.status,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      clearSearch: false,
    };

    await dispatch(featchSearchPurchaseBranchRequestAsync(payloadNewpage));
    await dispatch(saveSearchPurchaseBranch(payloadNewpage));

    setLoading(false);
  };

  return (
    <div>
      <Box mt={2} bgcolor="background.paper">
        <div className={classes.MdataGridPaginationTop} style={{ height: rows.length >= 10 ? '80vh' : 'auto' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            // onCellClick={currentlySelected}
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
    </div>
  );
}
