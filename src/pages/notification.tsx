import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingModal from '../components/commons/ui/loading-modal';
import Tasklist from '../components/mytask/task-list';
import React, { useEffect } from 'react';
import { objectNullOrEmpty } from '../utils/utils';
import { KeyCloakTokenInfo } from '../models/keycolak-token-info';
import { getUserInfo } from '../store/sessionStore';
import { makeStyles } from '@mui/styles';
import { getNotificationData } from '../services/notification';
import InfiniteScroll from 'react-infinite-scroll-component';
 
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
  const [listData, setListData] = React.useState<any[]>([]);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);
  const [page, setPage] = React.useState(0);
  const [totalPage, setTotalPage] = React.useState(1);

  const userInfo: KeyCloakTokenInfo = getUserInfo();

  const userPermission =
    !objectNullOrEmpty(userInfo) &&
    !objectNullOrEmpty(userInfo.acl) &&
    userInfo.acl['service.posback-campaign'] != null &&
    userInfo.acl['service.posback-campaign'].length > 0
      ? userInfo.acl['service.posback-campaign']
      : [];

  useEffect(() => {
    moreData();
  }, []);

  const moreData = async () => {
    try {
      if (totalPage > page) {
        setOpenLoadingModal(true);
        const rs = await getNotificationData(page);
        if (rs && rs.data) {
          setListData([...listData, ...rs.data]);
          setPage(rs.page);
          setTotalPage(rs.totalPage);
        }
        setOpenLoadingModal(false);
      }
    } catch (error) {
      console.log(error);
      setOpenLoadingModal(false);
    }
  };

  const onGetData = async () => {
    setOpenLoadingModal(true);
    try {
      const rs = await getNotificationData(0);
      if (rs) {
        if (rs.data){
          setListData(rs.data);
          setTotalPage(rs.totalPage);
        } else {
          setListData([])
        }
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
          <InfiniteScroll
            dataLength={listData.length}
            refreshFunction={moreData}
            next={moreData}
            hasMore={true}
            loader={null}
            pullDownToRefresh
          >
            <Tasklist onSearch={onGetData} listData={listData} userPermission={userPermission} />
          </InfiniteScroll>
        </div>
      </Container>
      <LoadingModal open={openLoadingModal} />
    </>
  );
}
