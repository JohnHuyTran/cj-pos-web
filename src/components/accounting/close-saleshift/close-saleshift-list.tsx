import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowData } from '@mui/x-data-grid';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CloseSaleShiftInfo } from '../../../models/branch-accounting-model';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import { convertUtcToBkkDate } from '../../../utils/date-utill';
import LoadingModal from '../../commons/ui/loading-modal';

function CloseSaleShiftSearchList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['expense', 'common']);
  const items = useAppSelector((state) => state.closeSaleShiftSlice.closeSaleShift);
  const cuurentPage = useAppSelector((state) => state.closeSaleShiftSlice.closeSaleShift.page);
  const limit = useAppSelector((state) => state.closeSaleShiftSlice.closeSaleShift.perPage);
  const [pageSize, setPageSize] = React.useState(limit);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<{ open: boolean }>({
    open: false,
  });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };
  const columns: GridColDef[] = [
    {
      field: 'userName',

      headerName: 'รหัสพนักงาน',
      width: 120,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'posID',

      headerName: 'เครื่องขาย',
      minWidth: 100,
      // flex: 0.35,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
    },
    {
      field: 'shiftCode',

      headerName: 'เลขรหัสรอบขาย',
      minWidth: 145,

      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'statusDisplay',

      headerName: 'สถานะ',
      width: 70,
      headerAlign: 'center',
      sortable: false,
      align: 'center',
      renderCell: (params) => {
        return params.value;
      },
    },
    {
      field: 'sellAmountSum',
      headerName: 'ยอดขายปิดรอบ',
      width: 130,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'billAmountSum',
      headerName: 'ยอดขายในบิลขาย',
      minWidth: 140,
      // flex: 0.3,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'sellAmountInput',
      headerName: 'ยอดขายที่สาขากรอก',
      minWidth: 160,
      // flex: 0.25,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
      renderCell: (params) => params.value,
    },
    {
      field: 'closeShiftKey',
      headerName: 'รหัสปิดรอบ',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
    },
    {
      field: 'shiftBillNoCount',
      headerName: 'จำนวนบิลขาย',
      width: 120,
      align: 'right',
      sortable: false,
    },
    {
      field: 'returnBillCount',
      headerName: 'จำนวนบิลคืน',
      width: 120,
      align: 'right',
      sortable: false,
    },
    {
      field: 'businessDate',
      headerName: 'วันที่บันทึก',
      width: 150,
      align: 'left',
      sortable: false,
    },
  ];

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    setPageSize(pageSize);
    setLoading(true);

    setLoading(false);
  };
  const currentlySelected = () => {};
  let rows: any = items.data.map((item: CloseSaleShiftInfo, index: number) => {
    return {
      id: index,
      userName: item.userName,
      posID: item.posID,
      shiftCode: item.shiftCode,
      status: item.status,
      statusDisplay: t(`status.${item.status}`),
      sellAmountSum: item.sellAmountSum,
      billAmountSum: item.billAmountSum,
      sellAmountInput: item.sellAmountInput,
      closeShiftKey: item.closeShiftKey,
      shiftBillNoCount: item.shiftBillNoCount,
      returnBillCount: item.returnBillCount,
      businessDate: `${convertUtcToBkkDate(item.businessDate)} ${moment(item.businessDate).format('HH:mm ')}`,
    };
  });
  return (
    <div className={classes.MdataGridPaginationTop} style={{ height: rows.length >= 10 ? '80vh' : 'auto' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnMenu
        autoHeight={rows.length >= 10 ? false : true}
        scrollbarSize={10}
        pagination
        page={cuurentPage - 1}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50, 100]}
        rowCount={items.total}
        paginationMode='server'
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onCellClick={currentlySelected}
        loading={loading}
        rowHeight={65}
      />
      <LoadingModal open={openLoadingModal.open} />
    </div>
  );
}

export default CloseSaleShiftSearchList;
