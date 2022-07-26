import { Fragment, ReactElement, useState } from "react";
import { useStyles } from 'styles/makeTheme';
import { HighlightOff } from '@mui/icons-material';
import {
  // Grid,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
  CircularProgress } from '@mui/material'
import { LoadingButton } from "@mui/lab";
import {
  DataGrid,
  GridColDef,
} from '@mui/x-data-grid';
import { formatNumber } from 'utils/utils'

interface ModalSaveCloseShiftKeyProps {
  open: boolean;
  payload: any;
  onClose: () => void;
}

export default function ModalSaveCloseShiftKey(props: ModalSaveCloseShiftKeyProps): ReactElement {
  // Props
  const { open, payload, onClose } = props;

  const classes = useStyles();
  
  // Set state data
  const [barcode, setBarcode] = useState('')
  const [isVerifiedBarcode, setIsVerifiedBarcode] = useState<boolean>()
  const [isValidate, setIsValidate] = useState(false)
  const [isOpenLoading, setIsOpenLoading] = useState(false)
  
  const handleSave = () => {
    // setIsValidate(true)
    setIsVerifiedBarcode(false)
    
    if (barcode) {
      setIsOpenLoading(true)
      setTimeout(() => {
        setIsOpenLoading(false)
        // setIsValidate(false)
        
        if (isVerifiedBarcode) {
          console.log('save')
          setBarcode('')
          onClose()
        }
      }, 500)
    }
  }

  const handleClose = () => {
    setIsOpenLoading(false)
    setIsVerifiedBarcode(false)
    setBarcode('')
    onClose()
  }

  return(
    <Fragment>
      <Dialog
      id="ModalSaveCloseShiftKey"
      open={open}
      fullWidth={true} 
      maxWidth="md"
      >
        <Box id="Card" sx={{ m: '10px 10px 20px'}}>
          <DialogContent 
            id="CloseButton"
            sx={{ textAlign: 'right', padding: 0 }}>
            <IconButton ria-label="close" onClick={handleClose} disabled={isOpenLoading} sx={{color: '#bdbdbd'}} >
              <HighlightOff fontSize="large" />
            </IconButton>
          </DialogContent>

          <TableSaveCloseShiftKey />

          <DialogActions sx={{ justifyContent: 'center'}}>
            <Box sx={{ textAlign: 'center',mr: '30px', maxWidth: '450px'}}>
              <Typography component='span' color='primary'>
                กรุณาสแกน Barcode เพื่อเพิ่มรหัสปิดรอบ
              </Typography>
              <TextField
                name="accountNameTh"
                size="small"
                error={isVerifiedBarcode === false}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className={classes.MtextField}
                sx={{mt: 1}}
                fullWidth
              />
              {isVerifiedBarcode === false && (
                <Typography component='div' color='error' sx={{mt: 1}}>ข้อมูลรหัสปิดรอบไม่ถูกต้อง</Typography>
              )}
            </Box>
            <LoadingButton
              id='btnSave'
              variant='contained'
              color='primary'
              disabled={!barcode}
              loading={isOpenLoading}
              loadingIndicator={
                <Typography component='span' sx={{ fontSize: '11px' }}>
                  กรุณารอสักครู่ <CircularProgress color='inherit' size={15} />
                </Typography>
              }
              sx={{ borderRadius: 2, width: 100, mt: '32px', mb:  'auto'}}
              onClick={handleSave}>
              บันทึกรหัส
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
    </Fragment>
  )
}

const TableSaveCloseShiftKey = () => {
  const classes = useStyles();
  const columns: GridColDef[] = [
    {
      field: 'userName',
      headerName: 'รหัสพนักงาน',
      minWidth: 120,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'posName',
      headerName: 'เครื่องขาย',
      minWidth: 120,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'shiftCode',
      headerName: 'เลขรหัสรอบขาย',
      minWidth: 140,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'sellAmountSum',
      headerName: 'ยอดขายปิดรอบ',
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
      headerName: 'ยอดขายในบิลขาย',
      minWidth: 140,
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

  const row = [{
    id: 1,
    userName: 'CJG2203322',
    posName: '001',
    shiftCode: '20220620001-001',
    sellAmountSum: 0,
    approvalLimit2: 0
  }]

  return(
    <Box
      style={{
        width: '75%',
        margin: 'auto',
        textAlign: 'center'
      }}
      className={classes.MdataGridNoPagination}
    >
      <Typography component='div' sx={{ mt:1, mb:2, fontWeight: 600 }}>
        บันทึกรหัสปิดรอบ
      </Typography>
      <DataGrid
        rows={row}
        columns={columns}
        autoHeight={true}
        scrollbarSize={10}
        rowHeight={65}
        disableColumnMenu
        hideFooter

      />
    </Box>
  )
}
