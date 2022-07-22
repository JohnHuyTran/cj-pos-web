import { useState, useMemo, Fragment } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
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
  TextField,
  Typography
} from '@mui/material';

// Components
import ModalSettingExpense from './modal-settings-expense';

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    width: 80,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component='div' sx={{ margin: 'auto' }}>
        {params.value}
      </Box>
    )
  },
  {
    field: 'typeNameTh',
    headerName: 'ประเภท',
    minWidth: 180,
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
        <Typography variant='body2'>{params.getValue(params.id, 'skuName') || ''}</Typography>
        <Typography color='textSecondary' sx={{ fontSize: 12 }}>
          {params.getValue(params.id, 'skuCode') || ''}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'accountNameTh',
    headerName: 'ชื่อบัญชี',
    minWidth: 140,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'accountCode',
    headerName: 'รหัสบัญชี',
    minWidth: 140,
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
            color: params.value ? '#20AE79' : '#ff0000b0',
            backgroundColor: params.value ? '#93fb9c42' : '#ff000038',
            padding: '5px 20px'}}>
        {params.value ? 'ใช้งาน' : 'ไม่ใช้งาน'}
      </Box>
    )
  },
  {
    field: 'approvalLimit1',
    headerName: 'วงเงินอนุมัติ\nของ ผจก.ส่วน',
    minWidth: 150,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component='div' sx={{ marginLeft: 'auto' }}>
        {(params?.value?.toLocaleString())}
      </Box>
    )
  },
  {
    field: 'approvalLimit2',
    headerName: 'วงเงินอนุมัติ\nของ ผจก.OC',
    minWidth: 150,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component='div' sx={{ marginLeft: 'auto' }}>
        {(params?.value?.toLocaleString())}
      </Box>
    )
  }
]


export default function ReservesDetailTable () {
  const items = useAppSelector((state) => state.searchBranchAccountingConfig);
  const res: any = items.branchAccountingConfigList;
  const rows: any = res.data.map((data: any, indexs: number) => {
    return {
      id: indexs,
      index: indexs + 1,
      ...data
    }
  })
  
  // Set state data
  const classes = useStyles();
  const [pageSize, setPageSize] = useState(10)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const currentlySelected = async (params: GridCellParams) => {
    console.log('value', params.row.index)
    setIsOpenModal(true)
    // const value = params.colDef.field;
  }

  return (
    <Fragment>
      <div
        style={{
          width: '100%',
          height: rows.length >= 8 ? '70vh' : 'auto'
        }}
        className={classes.MdataGridDetail}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          disableColumnMenu
          autoHeight={rows.length >= 8 ? false : true}
          scrollbarSize={10}
          rowHeight={65}
          onCellClick={currentlySelected}
          // onCellFocusOut={handleEditItems}
          // onCellOut={handleEditItems}
          // onCellKeyDown={handleEditItems}
        />
      </div>
  
      <ModalSettingExpense
          isOpen={isOpenModal}
          onClickClose={() => setIsOpenModal(false)} />
    </Fragment>
  )
}