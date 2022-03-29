import React, { useEffect } from 'react';
import { useAppDispatch } from '../../store/store';
import { DataGrid, GridApi, GridCellValue, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { useStyles } from '../../styles/makeTheme';
import moment from 'moment';
import { DateFormat } from '../../utils/enum/common-enum';
import { Button, Divider, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import { MoreVertOutlined } from '@mui/icons-material';

export interface DataGridProps {
  billNo: string;
}

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    width: 80,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component='div' sx={{ paddingLeft: '20px' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'name',
    headerName: 'ชื่อผู้ทำรายการ',
    minWidth: 150,
    flex: 0.4,
    headerAlign: 'center',
    align: 'left',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'position',
    headerName: 'ตำแหน่ง',
    minWidth: 150,
    flex: 0.2,
    headerAlign: 'center',
    align: 'left',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'type',
    headerName: 'ประเภท',
    minWidth: 150,
    flex: 0.2,
    headerAlign: 'center',
    align: 'left',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'printNo',
    headerName: 'พิมพ์ครั้งที่',
    minWidth: 120,
    headerAlign: 'center',
    align: 'right',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'date',
    headerName: 'พิมพ์วันที่/เวลา',
    minWidth: 150,
    headerAlign: 'center',
    align: 'left',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'action',
    headerName: ' ',
    width: 40,
    align: 'center',
    sortable: false,
    renderCell: () => handleModelAction(),
  },
];

const handleModelAction = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuClose = async () => {
    setAnchorEl(null);
  };
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuList sx={{ width: 200 }}>
        <MenuItem>
          <Typography variant='body1'>เอกสารแนบ</Typography>
        </MenuItem>
        <Divider />

        <MenuItem>
          <Typography variant='body2'>format_number.jpg</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant='body2'>format_number.jpg</Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <>
      <Button onClick={handleMenuOpen}>
        <MoreVertOutlined sx={{ color: '#263238' }} />
      </Button>

      {renderMenu}
    </>
  );
};

export default function TaxInvoiceHistory({ billNo }: DataGridProps) {
  const dispatch = useAppDispatch();
  const _ = require('lodash');
  const classes = useStyles();
  let rows: any = [];

  for (let i = 0; i < 20; i++) {
    console.log('i === ', i);
    let item: any = {
      id: `index-${i}`,
      index: i,
      name: `ซีเจ-${i}`,
      position: 'ผู้จัดการสาขา',
      type: 'ต้นฉบับ',
      printNo: '1',
      date: moment(new Date()).format(DateFormat.DATE_TIME_DISPLAY_FORMAT),
      action: '',
    };

    rows.push(item);
  }

  useEffect(() => {}, []);

  const [pageSize, setPageSize] = React.useState<number>(10);

  return (
    <>
      <Typography ml={1} mb={2} variant='h6'>
        ประวัติการพิมพ์ใบกำกับภาษี
      </Typography>
      <div style={{ width: '100%', height: rows.length >= 8 ? '80vh' : 'auto' }} className={classes.MdataGridDetail}>
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
        />
      </div>
    </>
  );
}
