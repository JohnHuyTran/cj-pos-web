import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Greeting from '../components/greeting/greeting';
import Newslist from '../components/news/news-list';
import { KeyCloakTokenInfo } from '../models/keycolak-token-info';
import { getUserInfo } from '../store/sessionStore';

export default function Home() {
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
  const userInfo: KeyCloakTokenInfo = getUserInfo();

  return (
    <>
      <Container className={classes.root}>
        <Typography variant="h6"> หน้าหลัก </Typography>
        <div className={classes.greeting}>
          <Greeting userName={userInfo.given_name} />
        </div>
        <div className={classes.news}>
          <Newslist />
        </div>
      </Container>
    </>
  );
}
