import { Fragment, ReactElement, useState } from "react";
import { HighlightOff, Save  } from '@mui/icons-material';
import {
  // Grid,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  CircularProgress } from '@mui/material'
import { LoadingButton } from "@mui/lab";

interface ModalSettingExpenseProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalSettingExpense(props: ModalSettingExpenseProps): ReactElement {
  // Props
  const { open, onClose, ...other } = props;
  
  // Set state data
  const [isOpenLoading, setIsOpenLoading] = useState(false)
  
  const handleSave = () => {
    setIsOpenLoading(true)
    
    setTimeout(() => {
      setIsOpenLoading(false)
      console.log('save')
      onClose()
    }, 500)
  }

  const handleClose = () => {
    onClose()
  }

  return(
    <Fragment>
      <Dialog
      id="ModalSettingsExpense"
      open={open}
      fullWidth={true} 
      maxWidth="lg"
      >
        <Box id="Card" sx={{ m: 4}}>
          <DialogContent 
            id="TopicCard"
            sx={{
              display: 'flex',
              overflowY: 'hidden',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 0
            }}>
            <Box id="Title">
              <Typography component='label' variant="h5">
                รายละเอียดตั้งค่ารายการค่าใช้จ่าย
              </Typography>
            </Box>
            <Box id="CloseButton">
              <IconButton ria-label="close" onClick={handleClose} disabled={isOpenLoading} sx={{color: '#bdbdbd'}} >
                <HighlightOff fontSize="large" />
              </IconButton>
            </Box>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'right'}}>
            <LoadingButton
              id='btnSave'
              variant='contained'
              color='warning'
              startIcon={<Save />}
              loading={isOpenLoading}
              loadingIndicator={
                <Typography component='span' sx={{ fontSize: '11px' }}>
                  กรุณารอสักครู่ <CircularProgress color='inherit' size={15} />
                </Typography>
              }
              sx={{ borderRadius: 2, width: 140 }}
              onClick={handleSave}>
              บันทึก
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
    </Fragment>
  )
}