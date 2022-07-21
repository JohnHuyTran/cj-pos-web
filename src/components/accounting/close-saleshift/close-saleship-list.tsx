import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';

function CloseSaleShiftSearchList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['expese', 'error']);

  const columns: GridColDef[] = [
    {
      field: 'userName',
      headerClassName: 'columnHeaderTitle',
      headerName: 'รหัสพนักงาน',
      width: 65,
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
      headerClassName: 'columnHeaderTitle',
      headerName: 'เครื่องขาย',
      minWidth: 148,
      // flex: 0.35,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'shiftCode',
      headerClassName: 'columnHeaderTitle',
      headerName: 'เลขรหัสรอบขาย',
      minWidth: 145,
      flex: 0.35,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'status',
      headerClassName: 'columnHeaderTitle',
      headerName: 'สถานะ',
      width: 70,
      headerAlign: 'center',
      sortable: false,
      align: 'right',
      renderCell: (params) => {
        return params.value;
      },
    },
    {
      field: 'sellAmountSum',
      headerClassName: 'columnHeaderTitle',
      headerName: 'ยอดขายปิดรอบ',
      // width: 100,
      flex: 0.65,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
    },
    {
      field: 'billAmountSum',
      headerClassName: 'columnHeaderTitle',
      headerName: 'ยอดขายในบิลขาย',
      minWidth: 140,
      // flex: 0.3,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'saleAmountInput',
      headerClassName: 'columnHeaderTitle',
      headerName: 'ยอดขายที่สาขากรอก',
      minWidth: 115,
      // flex: 0.25,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
      renderCell: (params) => params.value,
    },
    {
      field: 'closeShiftKey',
      headerClassName: 'columnHeaderTitle',
      headerName: 'รหัสปิดรอบ',
      width: 70,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'shiftBillNoCount',
      headerName: 'จำนวนบิลขาย',
      width: 20,
      align: 'center',
      sortable: false,
    },
    {
      field: 'returnBillCount',
      headerName: 'จำนวนบิลคืน',
      width: 20,
      align: 'center',
      sortable: false,
    },
    {
      field: 'businessDate',
      headerName: 'วันที่บันทึก',
      width: 20,
      align: 'center',
      sortable: false,
    },
  ];

  return <div>CloseSaleShiftSearchList</div>;
}

export default CloseSaleShiftSearchList;
