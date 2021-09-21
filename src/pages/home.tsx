import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Greeting from '../components/greeting/greeting';
import Tasklist from '../components/mytask/task-list';
import Newslist from '../components/news/news-list';

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

  return (
    <Container className={classes.root}>
      <Typography variant='h6'> หน้าหลัก </Typography>
      <div className={classes.greeting}>
        <Greeting userName='Patumwan' />
      </div>
      <div className={classes.myTask}>
        <Tasklist />
      </div>
      <div className={classes.news}>
        <Newslist />
      </div>
    </Container>
  );
}
