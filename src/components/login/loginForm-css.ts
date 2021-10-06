import { makeStyles } from '@mui/styles';
import bgImage from "../../assets/images/blur-supermarket-aisle-with-empty-red-shopping-cart.png";
import logoImage from "../../assets/images/CJlogo.png";
import theme from '../../styles/theme';

const loginFormStyle = makeStyles({
    root: {
        textAlign: "center", 
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        "background-size": "cover",
        height: "100vh",
    },
    textField: {
        width: "25ch",
    },
    welcomeLabel: {
        fontStyle: "normal",
        minWidth: 400,
        minHeight: 50,
    },
    gridBox: {
        position: "absolute",
        top: "15%",
    },
    mainBox: {
        padding: "20px",
        minWidth: 400,
        height: 450,
        background: theme.palette.background.default,
        boxShadow:
            "-15px -15px 15px rgba(130, 158, 201, 0.05), 15px 15px 15px rgba(130, 158, 201, 0.05)",
        borderRadius: "8px"
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