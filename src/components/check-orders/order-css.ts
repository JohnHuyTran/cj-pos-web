import { makeStyles } from '@mui/styles';
import theme from '../../styles/theme';

const useStyles = makeStyles({
    searchBtn: {
        position: "absolute",
        // width: "textField",
        height: "40px",
        borderRadius: "5px",
    },
    textField: {
        width: "250px",
        height: "40px",
    },
})

export { useStyles };