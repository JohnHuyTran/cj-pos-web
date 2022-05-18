import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/store';
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
import ModalAddItems from '../../commons/ui/modal-add-items';
import { getBranchName } from '../../../utils/utils';
import { getUserInfo } from '../../../store/sessionStore';
import { PurchaseBRRequest } from '../../../models/purchase-branch-request-model';
import { savePurchaseBR } from '../../../services/purchase';
import { ApiError } from '../../../models/api-error-model';

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

  const [docNo, setDocNo] = React.useState('');
  const [createDate, setCreateDate] = React.useState<Date | null>(new Date());
  const [status, setStatus] = React.useState('SUBMITTED');
  const [branchName, setBranchName] = React.useState('');
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [items, setItems] = React.useState([]);

  useEffect(() => {
    const strBranchName = getBranchName(branchList, getUserInfo().branch);
    setBranchName(strBranchName ? `${getUserInfo().branch}-${strBranchName}` : getUserInfo().branch);
  }, [branchList]);

  const handleChangeComment = (value: any) => {
    // setFlagSave(true);
    // setCommentOC(value);

    console.log('handleChangeComment:', value);
  };

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };
  const handleModelAddItems = async () => {
    setOpenModelAddItems(false);
  };

  const handleSaveBR = async () => {
    const payloadSave: any = await handleMapPayloadSave();
    console.log('payloadSave:', JSON.stringify(payloadSave));

    await savePurchaseBR(payloadSave)
      .then((value) => {
        console.log('value:', JSON.stringify(value));
      })
      .catch((error: ApiError) => {
        console.log('error:', JSON.stringify(error));
      });
  };

  const handleMapPayloadSave = async () => {
    const itemsList: any = [];
    if (items.length > 0) {
      await items.forEach((data: any) => {
        const item: any = {
          barcode: data.barcode,
          orderMaxQty: data.orderMaxQty ? data.orderMaxQty : 0,
          orderQty: data.orderQty ? data.orderQty : 0,
        };
        itemsList.push(item);
      });
    }

    if (docNo === '') {
      const payload: PurchaseBRRequest = {
        docNo: docNo,
        remark: 'testttt',
        items: itemsList,
      };

      return await payload;
    } else {
      const payload: PurchaseBRRequest = {
        remark: 'testttt',
        items: itemsList,
      };

      return await payload;
    }
  };

  const handleChangeItems = async (items: any) => {
    console.log('handleChangeItems:', JSON.stringify(items));
    setItems(items);
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
              {docNo !== '' && docNo}
              {docNo === '' && '-'}
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
              {branchName}
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
                  onClick={handleOpenAddItems}
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
                  onClick={handleSaveBR}
                  // sx={{ width: 150, display: `${displayBtnCreate ? 'none' : ''}` }}
                  sx={{ width: 120 }}
                  className={classes.MbtnAdd}
                  startIcon={<Save />}
                  color='warning'
                  disabled={items.length === 0}>
                  บันทึก
                </Button>
                <Button
                  id='btnClear'
                  variant='contained'
                  // onClick={onClickClearBtn}
                  sx={{ width: 120, ml: 2 }}
                  className={classes.MbtnClear}
                  startIcon={<CheckCircle />}
                  color='primary'
                  disabled={items.length === 0}>
                  ส่งรายการ
                </Button>
                <Button
                  id='btnSearch'
                  variant='contained'
                  // onClick={onClickValidateForm}
                  sx={{ width: 120, ml: 2 }}
                  startIcon={<Cancel />}
                  className={classes.MbtnSearch}
                  color='error'
                  disabled={items.length === 0}>
                  ยกเลิก
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box mb={5}>
            <PurchaseBranchListItem onChangeItems={handleChangeItems} />
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

          <ModalAddItems
            open={openModelAddItems}
            onClose={handleModelAddItems}
            requestBody={{
              skuCodes: [],
              skuTypes: [3, 6],
              isOrderable: true,
            }}></ModalAddItems>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default purchaseBranchDetail;
