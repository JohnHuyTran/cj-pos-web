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
import {BarcodeDiscountSearchRequest} from "../../models/barcode-discount-model";
import AlertError from "../../components/commons/ui/alert-error";
import ModalCreateBarcodeDiscount from "../../components/barcode-discount/modal-create-barcode-discound";
import BarcodeDiscountPopup from "../../components/barcode-discount/barcode-discount-popup";
import moment from "moment";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {barcodeDiscountSearch} from "../../store/slices/barcode-discount-search-slice";
import {saveSearchCriteriaBD} from "../../store/slices/barcode-discount-criteria-search-slice";
import LoadingModal from "../../components/commons/ui/loading-modal";
import {Action} from "../../utils/enum/common-enum";

interface State {
    documentNumber: string;
    branch: string;
    status: string;
    fromDate: any | Date | number | string;
    toDate: any | Date | number | string;
}

interface loadingModalState {
    open: boolean;
}

const BarcodeDiscountSearch = () => {
    const classes = useStyles();
    const {t} = useTranslation(["barcodeDiscount", "common"]);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [textError, setTextError] = React.useState('');
    const [popupMsg, setPopupMsg] = React.useState<string>('');
    const [lstStatus, setLstStatus] = React.useState([]);
    const [openPopup, setOpenPopup] = React.useState<boolean>(false);
    const [values, setValues] = React.useState<State>({
        documentNumber: "",
        branch: "ALL",
        status: "ALL",
        fromDate: new Date(),
        toDate: new Date()
    });

    const dispatch = useAppDispatch();
    const page = '1';
    const limit = useAppSelector((state) => state.barcodeDiscountSearchSlice.bdSearchResponse.perPage);
    const barcodeDiscountSearchSlice = useAppSelector((state) => state.barcodeDiscountSearchSlice);
    const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
        open: false,
    });

    const [openModal, setOpenModal] = React.useState(false)
    const handleOpenLoading = (prop: any, event: boolean) => {
        setOpenLoadingModal({...openLoadingModal, [prop]: event});
    };

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

    const handleClosePopup = () => {
        setOpenPopup(false)
    }

    const onClear = async () => {
        handleOpenLoading('open', true);
        setFlagSearch(false);
        setValues({
            documentNumber: "",
            branch: "ALL",
            status: "ALL",
            fromDate: new Date(),
            toDate: new Date()
        });

        const payload: BarcodeDiscountSearchRequest = {
            perPage: limit.toString(),
            page: page,
            query: values.documentNumber,
            branch: values.branch,
            status: values.status,
            startDate: moment(values.fromDate).startOf('day').toISOString(),
            endDate: moment(values.toDate).endOf('day').toISOString(),
            clearSearch: true
        };

        dispatch(barcodeDiscountSearch(payload));
        setTimeout(() => {
            handleOpenLoading('open', false);
        }, 300);
    };

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

        let limits;
        if (limit === 0) {
            limits = '10';
        } else {
            limits = limit ? limit.toString() : '10';
        }
        const payload: BarcodeDiscountSearchRequest = {
            perPage: limits,
            page: page,
            query: values.documentNumber.trim(),
            branch: values.branch,
            status: values.status,
            startDate: moment(values.fromDate).startOf('day').toISOString(),
            endDate: moment(values.toDate).endOf('day').toISOString(),
        };

        handleOpenLoading('open', true);
        await dispatch(barcodeDiscountSearch(payload));
        await dispatch(saveSearchCriteriaBD(payload));
        setFlagSearch(true);
        handleOpenLoading('open', false);
    };

    let dataTable;
    const res = barcodeDiscountSearchSlice.bdSearchResponse;
    const [flagSearch, setFlagSearch] = React.useState(false);
    if (flagSearch) {
        if (res && res.data && res.data.length > 0) {
            dataTable = <BarcodeDiscountList/>;
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
        <LoadingModal open={openLoadingModal.open} />
        <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
        {openModal && (
          <ModalCreateBarcodeDiscount
            isOpen={openModal}
            onClickClose={handleCloseModal}
            setOpenPopup={setOpenPopup}
            setPopupMsg={setPopupMsg}
            action={Action.INSERT}
          />
        )}
        <BarcodeDiscountPopup open={openPopup} onClose={handleClosePopup} contentMsg={popupMsg} />
      </>
    );
}

export default BarcodeDiscountSearch;