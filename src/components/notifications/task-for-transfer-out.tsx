import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { Grid } from '@mui/material';
import React from 'react';
import { Action, TOStatus } from '../../utils/enum/common-enum';
import SnackbarStatus from '../commons/ui/snackbar-status';
import { useAppDispatch, useAppSelector } from '../../store/store';
import LoadingModal from '../commons/ui/loading-modal';
import { getTransferOutDetail } from '../../store/slices/transfer-out-detail-slice';
import ModalCreateTransferOut from '../transfer-out/modal-create-transfer-out';

type TaskType = {
  permission: string;
  userPermission: any[];
  payload: any;
  onSearch: () => void;
};

export default function TaskForTransferOut(props: TaskType) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);
  const transferOutDetail = useAppSelector((state) => state.transferOutDetailSlice.transferOutDetail);
  const status = props.payload.status;

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const currentlySelected = async () => {
    setOpenLoadingModal(true);
    try {
      await dispatch(getTransferOutDetail(props.payload._id));
      if (transferOutDetail.data.length > 0 || transferOutDetail.data) {
        setOpenDetail(true);
      }
    } catch (error) {
      console.log(error);
    }
    setOpenLoadingModal(false);
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: '-5px -5px 8px rgba(0, 0, 0, 0.03), 5px 5px 10px rgba(0, 0, 0, 0.03)',
          cursor: 'pointer',
          border: '1px solid #EAEBEB',
          borderRadius: '8px',
          height: 'auto',
          paddingRight: '20px',
          mb: 2,
        }}
        onClick={currentlySelected}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={11} sx={{ display: 'flex', marginTop: '8px' }}>
              <span style={{ fontSize: '16px' }}>
                {status === TOStatus.WAIT_FOR_APPROVAL || status === TOStatus.APPROVED ? '[งานของฉัน]' : '[แจ้งเตือน]'}
              </span>
              <span style={{ marginLeft: 15, marginRight: 5, color: theme.palette.primary.main }}>
                เบิก : ใช้ในการทำกิจกรรม
              </span>
              <span style={{ marginLeft: 5, marginRight: 5 }}>{props.payload.documentNumber}</span> {'|'}
              <span style={{ marginLeft: 5 }}>
                {props.payload.branch}-{props.payload.branchName}
              </span>
              <span style={{ marginLeft: '15px', color: theme.palette.primary.main }}>กำหนดดำเนินการ</span>
              <b style={{ marginLeft: '1rem', color: theme.palette.primary.main }}>
                {moment(props.payload.createdDate).add(543, 'y').format('DD/MM/YYYY')}
              </b>
            </Grid>
            <Grid item xs={1} sx={{ marginTop: '8px' }}>
              <Typography
                sx={{
                  backgroundColor:
                    status === TOStatus.WAIT_FOR_APPROVAL
                      ? '#FFE9B1'
                      : status === TOStatus.APPROVED
                      ? '#E7FFE9'
                      : status === TOStatus.REJECTED
                      ? '#FFD7D7'
                      : status === TOStatus.CLOSED
                      ? '#EAEBEB'
                      : '',
                  color:
                    status === TOStatus.WAIT_FOR_APPROVAL
                      ? 'rgba(251, 166, 0, 1)'
                      : status === TOStatus.APPROVED
                      ? '#36C690'
                      : status === TOStatus.REJECTED
                      ? '#F54949'
                      : status === TOStatus.CLOSED
                      ? '#676767'
                      : '',
                  textAlign: 'center',
                  paddingTop: '4px',
                  paddingBottom: '5px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                {status === TOStatus.WAIT_FOR_APPROVAL
                  ? 'รออนุมัติ'
                  : status === TOStatus.APPROVED
                  ? 'อนุมัติ'
                  : status === TOStatus.REJECTED
                  ? 'ไม่อนุมัติ'
                  : status === TOStatus.CLOSED
                  ? 'ปิดงาน'
                  : null}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {openDetail && (
        <ModalCreateTransferOut
          isOpen={openDetail}
          onClickClose={handleCloseDetail}
          action={Action.UPDATE}
          setPopupMsg={setPopupMsg}
          setOpenPopup={setOpenPopup}
          userPermission={props.userPermission}
          onSearchMain={props.onSearch}
        />
      )}
      <SnackbarStatus open={openPopup} onClose={handleClosePopup} isSuccess={true} contentMsg={popupMsg} />
      <LoadingModal open={openLoadingModal} />
    </>
  );
}
