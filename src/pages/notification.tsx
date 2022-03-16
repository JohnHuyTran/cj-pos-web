import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingModal from '../components/commons/ui/loading-modal';
import Tasklist from '../components/mytask/task-list';
import { environment } from '../environment-base';
import React, { useEffect } from 'react';
import { objectNullOrEmpty } from '../utils/utils';
import { KeyCloakTokenInfo } from '../models/keycolak-token-info';
import { getUserInfo } from '../store/sessionStore';
import { makeStyles } from '@mui/styles';
import { get } from '../adapters/posback-adapter';

export default function Notification() {
  const useStyles = makeStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    greeting: {
      alignSelf: 'center',
    },
    myTask: {
      marginTop: '16px',
    },
    news: {
      marginTop: '16px',
    },
  });
  const classes = useStyles();
  const [listData, setListData] = React.useState([]);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);

  const userInfo: KeyCloakTokenInfo = getUserInfo();

  const userPermission =
    !objectNullOrEmpty(userInfo) &&
    !objectNullOrEmpty(userInfo.acl) &&
    userInfo.acl['service.posback-campaign'] != null &&
    userInfo.acl['service.posback-campaign'].length > 0
      ? userInfo.acl['service.posback-campaign']
      : [];

  useEffect(() => {
    onGetData();
  }, []);

  const onGetData = async () => {
    setOpenLoadingModal(true);
    try {
      const rs = await get(`/task/notifications?page=1&perPage=10`);
      if (rs && rs.data) {
        setListData(rs.data);
      }
    } catch (error) {
      console.log(error);
    }
    setOpenLoadingModal(false);
  };

  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h6" paddingBottom="40px" mt={3}>
          {' '}
          หน้าหลัก{' '}
        </Typography>

        <div className={classes.myTask}>
          <Tasklist onSearch={onGetData} listData={listData} userPermission={userPermission} />
        </div>
      </Container>
      <LoadingModal open={openLoadingModal} />
    </>
  );
}
