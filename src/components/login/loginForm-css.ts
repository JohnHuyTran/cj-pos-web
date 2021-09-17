import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import bgImage from "../../assets/images/blur-supermarket-aisle-with-empty-red-shopping-cart.png";
import logoImage from "../../assets/images/CJlogo.png";
import theme from '../../styles/theme';


const loginFormStyle = makeStyles({
    root: {
        height: 989,
        backgroundImage: `url(${bgImage})`,
        left: "-59px",
        top: "-155px",
        backgroundRepeat: "no-repeat",
    },
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        width: "25ch",
    },
    welcomeLabel: {
        position: "absolute",
        width: "120px",
        height: "36px",
        left: "623px",
        top: "146px",

        fontStyle: "normal",
        // fontWeight: "fontWeightBold",
        lineHeight: "36px",
    },
    mainBox: {
        position: "absolute",
        marginTop: "-8px",
        padding: "10px 20px",
        borderBottomRightRadius: "4px",
        borderBottomLeftRadius: "4px",
        background: theme.palette.background.default,
        width: "344px",
        height: "425px",
        left: "511px",
        top: "196px",
        boxShadow:
            "-15px -15px 15px rgba(130, 158, 201, 0.05), 15px 15px 15px rgba(130, 158, 201, 0.05)",
        borderRadius: "8px",
    },
    logo: {
        backgroundImage: `url(${logoImage})`,
        height: "40px",
        width: "40px",
        left: "656px",
        top: "229px",
        borderRadius: "0px",
        alignSelf: "center",
    },
    labelLoginBtn: {
        color: "white",
    },
    loginBtn: {
        position: "absolute",
        // width: "textField",
        height: "40px",
        borderRadius: "5px",
    },
});

export { loginFormStyle };