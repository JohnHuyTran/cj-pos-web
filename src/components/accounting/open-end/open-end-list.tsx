import React, { useState } from 'react';
import moment from 'moment';
import { DataGrid, GridCellParams, GridColDef, GridRowData } from '@mui/x-data-grid';
import NumberFormat from 'react-number-format';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../../../store/store';

//css
import { useStyles } from '../../../styles/makeTheme';
import { Box, Chip, Link, TextField } from '@mui/material';
import { OpenEndSearchInfo } from '../../../models/branch-accounting-model';
import { featchOpenEndDeatilAsync } from '../../../store/slices/accounting/open-end/open-end-slice';

//utils
import { convertUtcToBkkDate } from '../../../utils/date-utill';

function OpenEndList() {
  const { t } = useTranslation(['openEnd', 'common']);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const payloadOpenEndSearch = useAppSelector((state) => state.searchOpenEndSlice.payloadOpenEndSearch);
  const items = useAppSelector((state) => state.searchOpenEndSlice.openEndSearchList);
  const cuurentPage = useAppSelector((state) => state.searchOpenEndSlice.openEndSearchList.page);
  const limit = useAppSelector((state) => state.searchOpenEndSlice.openEndSearchList.perPage);
  const [pageSize, setPageSize] = useState(limit.toString());
  const [openLoadingModal, setOpenLoadingModal] = useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      width: 80,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'branchName',
      headerName: 'สาขา',
      minWidth: 120,
      flex: 1.2,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'docNo',
      headerName: 'เลขที่เอกสาร',
      minWidth: 120,
      flex: 1.2,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => {
        return <Link color="secondary">{params.value}</Link>;
      },
    },
    {
      field: 'shiftDate',
      headerName: 'วันที่ยอดขาย',
      minWidth: 120,
      flex: 1.2,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'noOfSaleBill',
      headerName: 'จำนวนรอบขาย',
      minWidth: 120,
      flex: 1.2,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'dailyIncomeAmount',
      headerName: 'มูลค่ารวมยอดขาย',
      minWidth: 120,
      flex: 1.2,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => {
        return (
          <NumberFormat
            value={String(params.value)}
            thousandSeparator={true}
            decimalScale={2}
            disabled={true}
            customInput={TextField}
            sx={{
              '.MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#000',
                textAlign: 'end',
                fontSize: '14px',
              },
              '.MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            fixedDecimalScale
            type="text"
          />
        );
      },
    },
    {
      field: 'depositeAmount',
      headerName: 'ยอดที่ต้องนำฝาก',
      minWidth: 120,
      flex: 1.2,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => {
        return (
          <NumberFormat
            value={String(params.value)}
            thousandSeparator={true}
            decimalScale={2}
            disabled={true}
            customInput={TextField}
            sx={{
              '.MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#000',
                textAlign: 'end',
                fontSize: '14px',
              },
              '.MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            fixedDecimalScale
            type="text"
          />
        );
      },
    },
    {
      field: 'diffDepositeAmount',
      headerName: 'ส่วนต่างเงินฝาก',
      minWidth: 120,
      flex: 1.2,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => {
        return (
          <NumberFormat
            value={String(params.value)}
            thousandSeparator={true}
            decimalScale={2}
            disabled={true}
            customInput={TextField}
            sx={{
              '.MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#000',
                textAlign: 'end',
                fontSize: '14px',
              },
              '.MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            fixedDecimalScale
            type="text"
          />
        );
      },
    },
    {
      field: 'status',
      headerName: 'สถานะ',
      minWidth: 70,
      flex: 0.65,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
      renderCell: (params) => {
        if (params.value === 'DRAFT' || params.value === 'REQUEST_APPROVE') {
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
        }
      },
    },
  ];

  let rows: any = items.data.map((item: OpenEndSearchInfo, indexs: number) => {
    return {
      id: indexs,
      index: (cuurentPage - 1) * parseInt(pageSize) + indexs + 1,
      branchName: item.branchName,
      docNo: item.docNo,
      shiftDate: convertUtcToBkkDate(item.shiftDate),
      noOfSaleBill: item.noOfSaleBill,
      dailyIncomeAmount: item.dailyIncomeAmount,
      depositeAmount: item.depositeAmount,
      diffDepositeAmount: item.diffDepositeAmount,
      status: item.status,
    };
  });

  console.log('items data: ', items.data);
  console.log('rows: ', rows);

  const currentlySelected = async (params: GridCellParams) => {
    const docNo = params.row.docNo;
    console.log('params: ', docNo);
    await dispatch(featchOpenEndDeatilAsync('mock-003'));
  };

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
        pageSize={parseInt(pageSize)}
        rowsPerPageOptions={[10, 20, 50, 100]}
        rowCount={items.total}
        paginationMode="server"
        // onPageChange={handlePageChange}
        // onPageSizeChange={handlePageSizeChange}
        onCellClick={currentlySelected}
        loading={loading}
        rowHeight={65}
      />
    </div>
  );
}

export default OpenEndList;
