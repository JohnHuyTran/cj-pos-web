import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function Newslist() {
  const useStyles = makeStyles({
    root: {
      minWidth: 275,
      marginTop: '8px',
    },
  });

  const classes = useStyles();

  return (
    <div>
      <Typography variant='h6'> ข่าวสาร </Typography>
      <Divider />
      <Card className={classes.root}>
        <CardContent>
          <Typography variant='body1'>
            [CJeverybody] ประชาสัมพันธ์ สวัสดิการพนักงานอายุงานครบ 1 ปีขึ้นไป
          </Typography>
          <Typography variant='body2'>
            ฝ่าย บุคลคล | 18-08-2564 17.20 น.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
