import { useState, useMemo, Fragment } from 'react';
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
    field: 'type',
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
        <Typography variant='body2'>{params.value}</Typography>
        <Typography color='textSecondary' sx={{ fontSize: 12 }}>
          {params.getValue(params.id, 'skuCode') || ''}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'bookName',
    headerName: 'ชื่อบัญชี',
    minWidth: 140,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'bookNumber',
    headerName: 'รหัสบัญชี',
    minWidth: 140,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'status',
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
            color: params.value === 'ใช้งาน' ? '#3fc995' : '#ff0000b0',
            backgroundColor: params.value === 'ใช้งาน' ? '#3fc99533' : '#ff000038',
            padding: '5px 20px'}}>
        {params.value}
      </Box>
    )
  },
  {
    field: 'approveLimit1',
    headerName: 'วงเงินอนุมัติ\nของ ผจก.ส่วน',
    minWidth: 150,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component='div' sx={{ marginLeft: 'auto' }}>
        {params.value}
      </Box>
    )
  },
  {
    field: 'approveLimit2',
    headerName: 'วงเงินอนุมัติ\nของ ผจก.OC',
    minWidth: 150,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component='div' sx={{ marginLeft: 'auto' }}>
        {params.value}
      </Box>
    )
  }
]


export default function ReservesDetailTable () {
  let rows: any = [
    { id: 1, index: 1, type: 'ค่าใช้จ่ายหน้าร้าน', barcodeName: 'ค่าน้ำดื่ม',
      bookName: 'ค่าน้ำดื่ม', bookNumber: '61120090', status: 'ใช้งาน',
      approveLimit1: '1,000.00', approveLimit2: '5,000.00'  },
      { id: 2, index: 2, type: 'ค่าใช้จ่ายหน้าร้าน', barcodeName: 'ค่าน้ำดื่ม',
      bookName: 'ค่าน้ำดื่ม', bookNumber: '61120091', status: 'ไม่ใช้งาน',
      approveLimit1: '2,000.00', approveLimit2: '6,000.00'  }
  ];
  
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
          // sx={{
          //   '& .MuiDataGrid-columnHeaderTitle': {
          //       textOverflow: "clip",
          //       whiteSpace: "break-spaces",
          //       lineHeight: 1
          //   }
          // }}
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