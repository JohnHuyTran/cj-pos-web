import {Box, Button, Grid, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import TextField from "@mui/material/TextField";
import React, {useEffect} from "react";
import {useStyles} from "../../styles/makeTheme";
import {onChange, onChangeDate, stringNullOrEmpty} from "../../utils/utils";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import DatePickerComponent from "../../components/commons/ui/date-picker";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import {PrintSharp, SearchOff} from "@mui/icons-material";
import BarcodeDiscountList from "./barcode-discount-list";
import {
    BarcodeDiscountSearchRequest,
    BarcodeDiscountSearchResponse
} from "../../models/barcode-discount-model";
import AlertError from "../../components/commons/ui/alert-error";
import ModalCreateBarcodeDiscount from "../../components/barcode-discount/modal-create-barcode-discound";

interface State {
    documentNumber: string;
    branch: string;
    status: string;
    fromDate: any | Date | number | string;
    toDate: any | Date | number | string;
}

const BarcodeDiscountSearch = () => {
    const classes = useStyles();
    const {t} = useTranslation(["barcodeDiscount", "common"]);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [textError, setTextError] = React.useState('');
    const [lstStatus, setLstStatus] = React.useState([]);
    const [values, setValues] = React.useState<State>({
        documentNumber: "",
        branch: "ALL",
        status: "ALL",
        fromDate: new Date(),
        toDate: new Date()
    });
    const [bdSearchRequest, setBDSearchRequest] = React.useState<BarcodeDiscountSearchRequest>({
        limit: "0",
        page: "0",
        documentNumber: "",
        branch: "",
        status: "",
        fromDate: "",
        toDate: ""
    });
    const [bdSearchResponse, setBDSearchResponse] = React.useState<BarcodeDiscountSearchResponse>({
        ref: "",
        code: 0,
        message: "",
        data: [],
        total: 0,
        page: 0,
        perPage: 0,
        prev: 0,
        next: 0,
        totalPage: 0,
    });

    const [openModal, setOpenModal] = React.useState(false)

    useEffect(() => {
        setLstStatus(t("lstStatus", {returnObjects: true}));
    }, []);

    const getStatusText = (key: string) => {
        if (lstStatus === null || lstStatus.length === 0) {
            return "";
        }
        let item: any = lstStatus.find((item: any) => item.value === key);
        return item.label;
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const onClear = () => {
        setValues({
            documentNumber: "",
            branch: "ALL",
            status: "ALL",
            fromDate: new Date(),
            toDate: new Date()
        });
    }

    const validateSearch = () => {
        let isValid = true;
        if (stringNullOrEmpty(values.fromDate) || stringNullOrEmpty(values.toDate)) {
            isValid = false;
            setOpenAlert(true);
            setTextError(t("msg.inputDateSearch"));
        }
        return isValid;
    }

    const onSearch = async () => {
        if (!validateSearch()) {
            return;
        }

        //mock data
        let bdSearchResponse = {
            ref: "",
            code: 0,
            message: "",
            data: [
                {
                    documentNumber: "BD21110276-000001",
                    status: "1",
                    totalAmount: 3,
                    unit: t("list"),
                    sumOfPrice: 132.00,
                    sumOfCashDiscount: 65.00,
                    sumOfPriceAfterDiscount: 67.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "",
                    requesterNote: "abc",
                },
                {
                    documentNumber: "BD21110276-000002",
                    status: "2",
                    totalAmount: 3,
                    unit: t("list"),
                    sumOfPrice: 132.00,
                    sumOfCashDiscount: 65.00,
                    sumOfPriceAfterDiscount: 67.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "",
                    requesterNote: "abc",
                },
                {
                    documentNumber: "BD21110276-000003",
                    status: "3",
                    totalAmount: 3,
                    unit: t("list"),
                    sumOfPrice: 132.00,
                    sumOfCashDiscount: 65.00,
                    sumOfPriceAfterDiscount: 67.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "01/01/2022",
                    requesterNote: "abcc",
                },
                {
                    documentNumber: "BD21110276-000004",
                    status: "4",
                    totalAmount: 3,
                    unit: t("list"),
                    sumOfPrice: 132.00,
                    sumOfCashDiscount: 65.00,
                    sumOfPriceAfterDiscount: 67.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "01/01/2022",
                    requesterNote: "abc",
                }, {
                    documentNumber: "BD21110276-000005",
                    status: "5",
                    totalAmount: 3,
                    unit: t("list"),
                    sumOfPrice: 132.00,
                    sumOfCashDiscount: 65.00,
                    sumOfPriceAfterDiscount: 67.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "01/01/2022",
                    requesterNote: "abc",
                },
                {
                    documentNumber: "BD21110276-000006",
                    status: "1",
                    totalAmount: 3,
                    unit: t("list"),
                    sumOfPrice: 132.00,
                    sumOfCashDiscount: 65.00,
                    sumOfPriceAfterDiscount: 67.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "",
                    requesterNote: "abc",
                },
                {
                    documentNumber: "BD21110276-000007",
                    status: "1",
                    totalAmount: 3,
                    unit: t("list"),
                    sumOfPrice: 132.00,
                    sumOfCashDiscount: 65.00,
                    sumOfPriceAfterDiscount: 67.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "",
                    requesterNote: "abc",
                },
                {
                    documentNumber: "BD21110276-000008",
                    status: "1",
                    totalAmount: 10,
                    unit: t("list"),
                    sumOfPrice: 200.00,
                    sumOfCashDiscount: 100.00,
                    sumOfPriceAfterDiscount: 100.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "",
                    requesterNote: "abc",
                },
                {
                    documentNumber: "BD21110276-000009",
                    status: "1",
                    totalAmount: 10,
                    unit: t("list"),
                    sumOfPrice: 200.00,
                    sumOfCashDiscount: 100.00,
                    sumOfPriceAfterDiscount: 100.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "",
                    requesterNote: "abc",
                },
                {
                    documentNumber: "BD21110276-000010",
                    status: "1",
                    totalAmount: 10,
                    unit: t("list"),
                    sumOfPrice: 200.00,
                    sumOfCashDiscount: 100.00,
                    sumOfPriceAfterDiscount: 100.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "",
                    requesterNote: "abc",
                },
                {
                    documentNumber: "BD21110276-000011",
                    status: "1",
                    totalAmount: 10,
                    unit: t("list"),
                    sumOfPrice: 160.00,
                    sumOfCashDiscount: 80.00,
                    sumOfPriceAfterDiscount: 80.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "",
                    requesterNote: "abc",
                },
                {
                    documentNumber: "BD21110276-000012",
                    status: "1",
                    totalAmount: 10,
                    unit: t("list"),
                    sumOfPrice: 160.00,
                    sumOfCashDiscount: 80.00,
                    sumOfPriceAfterDiscount: 80.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "",
                    requesterNote: "abc",
                },
                {
                    documentNumber: "BD21110276-000013",
                    status: "1",
                    totalAmount: 10,
                    unit: t("list"),
                    sumOfPrice: 160.00,
                    sumOfCashDiscount: 80.00,
                    sumOfPriceAfterDiscount: 80.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "",
                    requesterNote: "abc",
                },
                {
                    documentNumber: "BD21110276-000014",
                    status: "1",
                    totalAmount: 10,
                    unit: t("list"),
                    sumOfPrice: 160.00,
                    sumOfCashDiscount: 80.00,
                    sumOfPriceAfterDiscount: 80.00,
                    branch: "Branch A",
                    createdDate: "01/01/2022",
                    approvedDate: "",
                    requesterNote: "abc",
                }
            ],
            total: 20,
            page: 1,
            perPage: 10,
            prev: 0,
            next: 0,
            totalPage: 2,
        }
        setBDSearchResponse(bdSearchResponse);
        setFlagSearch(true);
        // handleOpenLoading('open', false);
    };

    let dataTable;
    const [flagSearch, setFlagSearch] = React.useState(false);
    if (flagSearch) {
        if (bdSearchResponse.data.length > 0) {
            dataTable = <BarcodeDiscountList bdSearchRequest={bdSearchRequest} bdSearchResponse={bdSearchResponse}/>;
        } else {
            dataTable = (
                <Grid item container xs={12} justifyContent="center">
                    <Box color="#CBD4DB">
                        <h2>
                            {t("noData")} <SearchOff fontSize="large"/>
                        </h2>
                    </Box>
                </Grid>
            );
        }
    }

    return (
        <>
            <Box sx={{flexGrow: 1}} mb={3}>
                <Grid container rowSpacing={3} columnSpacing={6} mt={0.1}>
                    <Grid item xs={4}>
                        <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                            {t("documentSearch")}
                        </Typography>
                        <TextField
                            id="documentNumber"
                            name="documentNumber"
                            size="small"
                            value={values.documentNumber}
                            onChange={onChange.bind(this, setValues, values)}
                            className={classes.MtextField}
                            fullWidth
                            placeholder={t("bdDocumentNumber")}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                            {t("branch")}
                        </Typography>
                        <FormControl fullWidth className={classes.Mselect}>
                            <Select
                                id="branch"
                                name="branch"
                                value={values.branch}
                                onChange={onChange.bind(this, setValues, values)}
                                inputProps={{'aria-label': 'Without label'}}
                            >
                                <MenuItem value={'ALL'} selected={true}>
                                    {t("all")}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                            {t("status")}
                        </Typography>
                        <FormControl fullWidth className={classes.Mselect}>
                            <Select
                                id="status"
                                name="status"
                                value={values.status}
                                onChange={onChange.bind(this, setValues, values)}
                                inputProps={{'aria-label': 'Without label'}}
                            >
                                <MenuItem value={'ALL'} selected={true}>
                                    {t("all")}
                                </MenuItem>
                                <MenuItem value={'1'}>{getStatusText("1")}</MenuItem>
                                <MenuItem value={'2'}>{getStatusText("2")}</MenuItem>
                                <MenuItem value={'3'}>{getStatusText("3")}</MenuItem>
                                <MenuItem value={'4'}>{getStatusText("4")}</MenuItem>
                                <MenuItem value={'5'}>{getStatusText("5")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container rowSpacing={3} columnSpacing={6} mt={1}>
                    <Grid item xs={4}>
                        <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                            {t("fromDate")}
                        </Typography>
                        <DatePickerComponent onClickDate={onChangeDate.bind(this, setValues, values, "fromDate")}
                                             value={values.fromDate}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                            {t("toDate")}
                        </Typography>
                        <DatePickerComponent onClickDate={onChangeDate.bind(this, setValues, values, "toDate")}
                                             type={'TO'}
                                             minDateTo={values.fromDate}
                                             value={values.toDate}/>
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                </Grid>
                <Grid container rowSpacing={3} columnSpacing={6} mt={1}>
                    <Grid item xs={3} style={{textAlign: "left"}}>
                        <Button
                            id="btnPrint"
                            variant="contained"
                            sx={{width: '200px'}}
                            className={classes.MbtnPrint}
                            color="cancelColor"
                            startIcon={<PrintSharp/>}
                        >
                            {t("button.printBarcode")}
                        </Button>
                    </Grid>
                    <Grid item xs={9} style={{textAlign: "right"}}>
                        <Button
                            id="btnCreate"
                            variant="contained"
                            sx={{width: '220px'}}
                            className={classes.MbtnSearch}
                            color="secondary"
                            startIcon={<AddCircleOutlineOutlinedIcon/>}
                            onClick={handleOpenModal}
                        >
                            {t("button.createNewDocument")}
                        </Button>
                        <Button
                            id="btnClear"
                            variant="contained"
                            sx={{width: '150px', ml: 2}}
                            className={classes.MbtnClear}
                            color="cancelColor"
                            onClick={onClear}
                        >
                            {t("common:button.clear")}
                        </Button>
                        <Button
                            id="btnSearch"
                            variant="contained"
                            color="primary"
                            sx={{width: '150px', ml: 2}}
                            className={classes.MbtnSearch}
                            onClick={onSearch}
                        >
                            {t("common:button.search")}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            {dataTable}

            <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError}/>
            {openModal && <ModalCreateBarcodeDiscount isOpen={openModal} onClickClose={handleCloseModal} />}
        </>
    );
}

export default BarcodeDiscountSearch;