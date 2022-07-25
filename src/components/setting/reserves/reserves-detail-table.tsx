import { Fragment, useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from 'store/store';
import { useStyles } from 'styles/makeTheme';
import { formatNumber } from 'utils/utils'
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridEditCellValueParams,
  GridRenderCellParams,
  GridRowData,
  GridRowId,
  useGridApiRef,
} from '@mui/x-data-grid';
import {
  Box,
  Typography
} from '@mui/material';

// Components
import ModalSettingExpense from './modal-settings-expense';
import Mock from './mock.json'

// Call API
import {
  featchBranchAccountingConfigListAsync,
} from 'store/slices/accounting/accounting-search-config-slice';
import { ExpenseSearchCofigRequest } from 'models/branch-accounting-model';

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    width: 80,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component="div" sx={{ margin: 'auto' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'typeNameTh',
    headerName: 'ประเภท',
    minWidth: 200,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'barcodeName',
    headerName: 'สินค้า',
    headerAlign: 'center',
    minWidth: 180,
    flex: 2,
    sortable: false,
    renderCell: (params) => (
      <Box>
        <Typography variant="body2">{params.getValue(params.id, 'skuName') || ''}</Typography>
        <Typography color="textSecondary" sx={{ fontSize: 12 }}>
          {params.getValue(params.id, 'skuCode') || ''}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'accountNameTh',
    headerName: 'ชื่อบัญชี',
    minWidth: 160,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'accountCode',
    headerName: 'รหัสบัญชี',
    minWidth: 130,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'isActive',
    headerName: 'สถานะ',
    minWidth: 120,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component='div'
           sx={{ 
            margin: 'auto', 
            borderRadius: '8px',
            color: params.value ? '#36C690' : '#F54949',
            backgroundColor: params.value ? '#E7FFE9' : '#FFD7D7',
            padding: '5px 20px'}}>
        {params.value ? 'ใช้งาน' : 'ไม่ใช้งาน'}
      </Box>
    ),
  },
  {
    field: 'approvalLimit1',
    headerName: 'วงเงินอนุมัติ\nของ ผจก.ส่วน',
    minWidth: 130,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component='div' sx={{ marginLeft: 'auto' }}>
        {formatNumber(params.value, 2)}
      </Box>
    ),
  },
  {
    field: 'approvalLimit2',
    headerName: 'วงเงินอนุมัติ\nของ ผจก.OC',
    minWidth: 130,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component='div' sx={{ marginLeft: 'auto' }}>
        {formatNumber(params.value, 2)}
      </Box>
    )
  }
]

export default function ReservesDetailTable () {
  // const payload = useAppSelector((state) => state.ExpenseSearchCofigRequest.searchExpense);
  const items = useAppSelector((state) => state.searchBranchAccountingConfig);
  const res: any = items.branchAccountingConfigList;
  // const res: any = Mock.branchAccountingConfigList;
  const rows: any = res.data.map((data: any, indexs: number) => {
    return {
      id: indexs,
      index: indexs + 1,
      ...data,
    };
  });

  // Set state data
  const classes = useStyles();
  const [pageSize, setPageSize] = useState(10);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSelect, setDataSelect] = useState({});
  const [isStatus, setIsStatus] = useState('');

  const currentlySelected = async (params: GridCellParams) => {
    setIsStatus('Update');
    setDataSelect(params.row);
    setIsOpenModal(true);
  };

  // Handle function
  const handlePageChange = async (newPage: number) => {
    setIsLoading(true)
    /* const payload: ExpenseSearchCofigRequest = {
      limit: '10',
      page: '1',
      ...payload
    }

    try {
      await featchBranchAccountingConfigListAsync(payload)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    } catch {
      setIsLoading(false)
    } */
    
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  return (
    <Fragment>
      <Box
        style={{
          width: '100%',
          height: `${110 + (Math.min(pageSize, rows.length) * 65)}px`,
          maxHeight: 'calc(100vh - 360px)'
        }}
        className={classes.MdataGridDetail}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          disableColumnMenu
          autoHeight={rows.length >= 10 ? false : true}
          scrollbarSize={10}
          rowHeight={65}
          onCellClick={currentlySelected}
          loading={isLoading}
          style={{ minHeight: pageSize > 10 && rows.length > 10 ? 'calc(100vh - 355px)' : ''}}
          // onCellFocusOut={handleEditItems}
          // onCellOut={handleEditItems}
          // onCellKeyDown={handleEditItems}
        />
      </Box>
      
      <ModalSettingExpense
        isOpen={isOpenModal}
        isStatus={isStatus}
        dataSelect={dataSelect}
        onClickClose={() => setIsOpenModal(false)}
      />
    </Fragment>
  );
}
