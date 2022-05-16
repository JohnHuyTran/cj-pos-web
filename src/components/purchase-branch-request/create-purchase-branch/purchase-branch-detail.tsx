import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Box, Button, DialogTitle, Grid, IconButton } from '@mui/material';
import { AddCircleOutlineOutlined, Cancel, CheckCircle, HighlightOff, Save } from '@mui/icons-material';
import Steppers from '../steppers';
import moment from 'moment';
import { useStyles } from '../../../styles/makeTheme';
import PurchaseBranchListItem from './purchase-branch-list-item';
import TextBoxComment from '../../commons/ui/textbox-comment';

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[400],
          }}>
          <HighlightOff fontSize='large' />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

function purchaseBranchDetail({ isOpen, onClickClose }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const classes = useStyles();
  const { t } = useTranslation(['purchaseBranch', 'common']);

  const handleChkSaveClose = async () => {
    handleClose();
  };

  const handleClose = async () => {
    setOpen(false);
    onClickClose();
  };

  const [brNo, setBRNo] = React.useState('');
  const [createDate, setCreateDate] = React.useState<Date | null>(new Date());
  const [branchCode, setBranchCode] = React.useState('0001');
  const [status, setStatus] = React.useState('SUBMITTED');

  const handleChangeComment = (value: any) => {
    // setFlagSave(true);
    // setCommentOC(value);

    console.log('handleChangeComment:', value);
  };
  return (
    <div>
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleChkSaveClose}>
          <Typography sx={{ fontSize: '1em' }}>สร้างรายการสั่งสินค้า</Typography>
          <Steppers status={status}></Steppers>
        </BootstrapDialogTitle>

        <DialogContent>
          <Grid container spacing={2} mb={2} id='top-item'>
            <Grid item xs={2}>
              เลขที่เอกสาร BR :
            </Grid>
            <Grid item xs={4}>
              {brNo !== '' && brNo}
              {brNo === '' && '-'}
            </Grid>
            <Grid item xs={2}>
              วันที่สร้างรายการ :
            </Grid>
            <Grid item xs={4}>
              {moment(createDate).add(543, 'y').format('DD/MM/YYYY')}
            </Grid>
          </Grid>

          <Grid container spacing={2} mb={2} id='top-item'>
            <Grid item xs={2}>
              สาขาที่สร้างรายการ :
            </Grid>
            <Grid item xs={4}>
              {branchCode}
            </Grid>
            <Grid item xs={2}>
              สถานะ :
            </Grid>
            <Grid item xs={4}>
              {t(`status.${status}`)}
            </Grid>
          </Grid>

          <Box mb={6}>
            <Grid container spacing={2} mt={4} mb={2}>
              <Grid item xs={5}>
                <Button
                  id='btnCreateStockTransferModal'
                  variant='contained'
                  // onClick={handleOpenCreateModal}
                  // sx={{ width: 150, display: `${displayBtnCreate ? 'none' : ''}` }}
                  sx={{ width: 120 }}
                  className={classes.MbtnAdd}
                  startIcon={<AddCircleOutlineOutlined />}
                  color='secondary'>
                  เพิ่มสินค้า
                </Button>
              </Grid>
              <Grid item xs={7} sx={{ textAlign: 'end' }}>
                <Button
                  id='btnCreateStockTransferModal'
                  variant='contained'
                  // onClick={handleOpenCreateModal}
                  // sx={{ width: 150, display: `${displayBtnCreate ? 'none' : ''}` }}
                  sx={{ width: 120 }}
                  className={classes.MbtnAdd}
                  startIcon={<Save />}
                  color='warning'>
                  บันทึก
                </Button>
                <Button
                  id='btnClear'
                  variant='contained'
                  // onClick={onClickClearBtn}
                  sx={{ width: 120, ml: 2 }}
                  className={classes.MbtnClear}
                  startIcon={<CheckCircle />}
                  color='primary'>
                  ส่งรายการ
                </Button>
                <Button
                  id='btnSearch'
                  variant='contained'
                  // onClick={onClickValidateForm}
                  sx={{ width: 120, ml: 2 }}
                  startIcon={<Cancel />}
                  className={classes.MbtnSearch}
                  color='error'>
                  ยกเลิก
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box mb={5}>
            <PurchaseBranchListItem />
          </Box>
          <Box mb={8}>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={3}>
                <TextBoxComment
                  fieldName='หมายเหตุ :'
                  defaultValue='xxxxxx'
                  maxLength={100}
                  onChangeComment={handleChangeComment}
                  isDisable={false}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default purchaseBranchDetail;
