import { Box, Chip, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowData } from '@mui/x-data-grid';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
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
      field: 'posUser',

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
      field: 'posCode',

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
        const _status = params.getValue(params.id, 'status');
        if (_status === 'DRAFT') {
          return <Chip label={params.value} size='small' sx={{ color: '#FBA600', backgroundColor: '#FFF0CA' }} />;
        } else if (_status === 'CORRECT') {
          return <Chip label={params.value} size='small' sx={{ color: '#20AE79', backgroundColor: '#E7FFE9' }} />;
        } else if (_status === 'CANCELED') {
          return <Chip label={params.value} size='small' sx={{ color: '#F54949', backgroundColor: '#FFD7D7' }} />;
        }
      },
    },
    {
      field: 'shiftAmount',
      headerName: 'ยอดขายปิดรอบ',
      width: 130,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
      renderCell: (params) => {
        return (
          <NumberFormat
            value={String(params.value)}
            type='text'
            fixedDecimalScale
            thousandSeparator={true}
            decimalScale={2}
            // className={classes.MtextFieldNumber}
            disabled={true}
            // customInput={TextField}
          />
        );
      },
    },
    {
      field: 'billAmount',
      headerName: 'ยอดขายในบิลขาย',
      minWidth: 140,
      // flex: 0.3,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'confirmAmount',
      headerName: 'ยอดขายที่สาขากรอก',
      minWidth: 160,
      // flex: 0.25,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
      renderCell: (params) => params.value,
    },
    {
      field: 'shiftKey',
      headerName: 'รหัสปิดรอบ',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
    },
    {
      field: 'noOfSaleBill',
      headerName: 'จำนวนบิลขาย',
      width: 120,
      align: 'right',
      sortable: false,
    },
    {
      field: 'noOfReturnBill',
      headerName: 'จำนวนบิลคืน',
      width: 120,
      align: 'right',
      sortable: false,
    },
    {
      field: 'shiftDate',
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
      posUser: item.posUser,
      posCode: item.posCode,
      shiftCode: item.shiftCode,
      status: item.status,
      statusDisplay: t(`status.${item.status}`),
      shiftAmount: item.shiftAmount,
      billAmount: item.billAmount,
      confirmAmount: item.confirmAmount,
      shiftKey: item.shiftKey,
      noOfSaleBill: item.noOfSaleBill,
      noOfReturnBill: item.noOfReturnBill,
      shiftDate: `${convertUtcToBkkDate(item.shiftDate)} ${moment(item.shiftDate).format('HH:mm ')}`,
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
