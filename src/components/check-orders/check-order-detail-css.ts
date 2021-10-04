import { makeStyles } from '@mui/styles';
import theme from '../../styles/theme';

const useStyles = makeStyles({
    browserBtn: {
        position: "absolute",
        // width: "textField",
        height: "40px",
        width: "100px",
        borderRadius: "5px",
    },
    textField: {
        width: "250px",
        height: "40px",
        border: "10px"
    },
    labelBtnStyle: {
        color: "white",
    },
})

export { useStyles };