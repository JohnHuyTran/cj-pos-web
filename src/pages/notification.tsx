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
  const [listData, setListData] = React.useState<any[]>([]);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);
  const [page, setPage] = React.useState(0);
  const [totalPage, setTotalPage] = React.useState(1);
  const [isFetching, setIsFetching] = React.useState(false);

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
    window.addEventListener("scroll", isScrolling);
    return () => window.removeEventListener("scroll", isScrolling)
  }, []);
  
   const moreData = async ()=> {
    try {
      if(totalPage > page){
        setOpenLoadingModal(true);
        const rs = await get(`${environment.task.notification.url}?page=${page+1}&perPage=10`);
        if (rs && rs.data) {
          setListData([...listData, ...rs.data]);
          setPage(rs.page)
          setTotalPage(rs.totalPage);
          setIsFetching(false)
        }
        setOpenLoadingModal(false);
      }
    } catch (error) {
      console.log(error);
    }
    
    setIsFetching(false)
  }

  const isScrolling =()=>{
    if(window.innerHeight + document.documentElement.scrollTop!==document.documentElement.offsetHeight){
      return;
    }
    setIsFetching(true)
  }

  const onGetData = async () => {
    setOpenLoadingModal(true);
    try {
      const rs = await get(`${environment.task.notification.url}?page=1&perPage=10`);
      if (rs && rs.data) {
        setListData(rs.data);
        setTotalPage(rs.totalPage);
      }
    } catch (error) {
      console.log(error);
    }
    setOpenLoadingModal(false);
  };

  useEffect(() => {
    if (isFetching){
      moreData();
    }
  }, [isFetching]);

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
