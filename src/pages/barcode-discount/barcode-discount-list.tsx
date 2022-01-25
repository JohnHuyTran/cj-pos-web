import {Box, Checkbox, FormControl, FormControlLabel, FormGroup, Typography} from "@mui/material";
import {DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridValueGetterParams} from "@mui/x-data-grid";
import React, {useEffect} from "react";
import {useStyles} from "../../styles/makeTheme";
import {useTranslation} from "react-i18next";
import {
    BarcodeDiscount,
    BarcodeDiscountProductDetail,
    BarcodeDiscountSearchRequest,
    BarcodeDiscountSearchResponse
} from "../../models/barcode-discount-model";
import {convertUtcToBkkDate} from "../../utils/date-utill";
import {Action, BDStatus, DateFormat} from "../../utils/enum/common-enum";
import {genColumnValue, numberWithCommas, stringNullOrEmpty} from "../../utils/utils";
import HtmlTooltip from "../../components/commons/ui/html-tooltip";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {saveSearchCriteriaSup} from "../../store/slices/save-search-order-supplier-slice";
import {barcodeDiscountSearch} from "../../store/slices/barcode-discount-search-slice";
import ModalCreateBarcodeDiscount from "../../components/barcode-discount/modal-create-barcode-discound";
import BarcodeDiscountPopup from "../../components/barcode-discount/barcode-discount-popup";
import {getBarcodeDiscountDetail} from "../../store/slices/barcode-discount-detail-slice";

const _ = require("lodash");

interface loadingModalState {
    open: boolean;
}

const BarcodeDiscountList = () => {
    const classes = useStyles();
    const {t} = useTranslation(["barcodeDiscount"]);
    const [lstBarcodeDiscount, setLstBarcodeDiscount] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({open: false});
    const [popupMsg, setPopupMsg] = React.useState<string>('');
    const [openDetail, setOpenDetail] = React.useState(false);
    const [openPopup, setOpenPopup] = React.useState<boolean>(false);
    const [checkAll, setCheckAll] = React.useState<boolean>(false);

    const dispatch = useAppDispatch();
    const barcodeDiscountSearchSlice = useAppSelector((state) => state.barcodeDiscountSearchSlice);
    const bdSearchResponse: BarcodeDiscountSearchResponse = barcodeDiscountSearchSlice.bdSearchResponse;
    const currentPage = useAppSelector((state) => state.barcodeDiscountSearchSlice.bdSearchResponse.page);
    const limit = useAppSelector((state) => state.barcodeDiscountSearchSlice.bdSearchResponse.perPage);
    const [pageSize, setPageSize] = React.useState(limit.toString());
    const payload = useAppSelector((state) => state.barcodeDiscountCriteriaSearchSlice.searchCriteria);

    useEffect(() => {
        const lstBarcodeDiscount = bdSearchResponse.data;
        if (lstBarcodeDiscount != null && lstBarcodeDiscount.length > 0) {
            let rows = lstBarcodeDiscount.map((data: BarcodeDiscount, index: number) => {
                return {
                    checked: false,
                    id: data.id,
                    index: (currentPage - 1) * parseInt(pageSize) + index + 1,
                    documentNumber: data.documentNumber,
                    status: data.status,
                    totalAmount: data.products.length,
                    unit: t("list"),
                    sumOfPrice: genTotalPrice(data.products),
                    sumOfCashDiscount: genTotalCashDiscount(data.percentDiscount, data.products),
                    sumOfPriceAfterDiscount: genTotalPriceAfterDiscount(data.percentDiscount, data.products),
                    branch: data.branchName,
                    createdDate: convertUtcToBkkDate(data.createdDate, DateFormat.DATE_FORMAT),
                    approvedDate: (BDStatus.APPROVED === data.status || BDStatus.BARCODE_PRINTED === data.status) ? convertUtcToBkkDate(data.approvedDate, DateFormat.DATE_FORMAT) : '',
                    requesterNote: stringNullOrEmpty(data.requesterNote) ? '' : data.requesterNote
                };
            });
            setLstBarcodeDiscount(rows);
            setCheckAll(false);
        }
    }, [bdSearchResponse]);

    const handleOpenLoading = (prop: any, event: boolean) => {
        setOpenLoadingModal({...openLoadingModal, [prop]: event});
    };

    const handleCloseDetail = () => {
        setOpenDetail(false)
    }

    const handleClosePopup = () => {
        setOpenPopup(false)
    }

    const onCheckCell = async (params: GridRenderCellParams, event: any) => {
        await setLstBarcodeDiscount((prevData: any[]) => {
            const data = [...prevData];
            data[params.row.index - 1].checked = event.target.checked;
            return data;
        });
        let lstUnCheck = lstBarcodeDiscount.filter(it => !it.checked && BDStatus.APPROVED == it.status);
        if (lstUnCheck != null && lstUnCheck.length > 0)
            setCheckAll(false);
        else
            setCheckAll(true);
    }

    const onCheckAll = (event: any) => {
        setCheckAll(event.target.checked);
        for (let item of lstBarcodeDiscount) {
            if (BDStatus.APPROVED == item.status) {
                item.checked = event.target.checked;
            }
        }
    }

    const renderCell = (value: any) => {
        return (
            <HtmlTooltip title={<React.Fragment>{value}</React.Fragment>}>
                <Typography variant='body2' noWrap>
                    {value}
                </Typography>
            </HtmlTooltip>
        );
    };

    const addTwoDecimalPlaces = (value: any) => {
        if (stringNullOrEmpty(value)) return '0.00';
        else return value.toFixed(2);
    };

    const onDisabledCheckAll = () => {
        let disabled = true;
        if (lstBarcodeDiscount != null && lstBarcodeDiscount.length > 0) {
            let lstBarcodeDiscountApproved = lstBarcodeDiscount.filter(it => BDStatus.APPROVED == it.status);
            disabled = lstBarcodeDiscountApproved == null || lstBarcodeDiscountApproved.length == 0;
        }
        return disabled;
    }

    const columns: GridColDef[] = [
        {
            field: 'checked',
            headerName: t("numberOrder"),
            width: 100,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderHeader: (params) => (
                <FormControl component="fieldset" sx={{marginLeft: "-15px"}}>
                    <FormGroup aria-label="position" row>
                        <FormControlLabel className={classes.MFormControlLabel}
                                          value="top"
                                          control={<Checkbox checked={checkAll} onClick={onCheckAll.bind(this)}
                                                             disabled={onDisabledCheckAll()}/>}
                                          label={t('selectAll')}
                                          labelPlacement="top"
                        />
                    </FormGroup>
                </FormControl>
            ),
            renderCell: (params) => (
                <Checkbox checked={Boolean(params.value)} disabled={BDStatus.APPROVED != params.row.status}
                          onClick={onCheckCell.bind(this, params)}/>
            ),
        },
        {
            field: 'index',
            headerName: t("numberOrder"),
            flex: 0.6,
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => (
                <Box component='div' sx={{paddingLeft: '20px'}}>
                    {params.value}
                </Box>
            ),
        },
        {
            field: 'documentNumber',
            headerName: t("bdDocumentNumber"),
            flex: 1.5,
            headerAlign: 'center',
            sortable: false,
        },
        {
            field: 'status',
            headerName: t("status"),
            flex: 1.2,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => genRowStatus(params)
        },
        {
            field: 'totalAmount',
            headerName: t("totalAmount"),
            flex: 0.9,
            headerAlign: 'center',
            align: 'right',
            sortable: false,
            renderHeader: (params) => {
                return (
                    <div style={{color:"#36C690"}}>
                        <Typography variant='body2' noWrap>
                            <b>{t('headerName.quantity')}</b>
                        </Typography>
                        <Typography variant='body2' noWrap>
                            <b>{t('headerName.total')}</b>
                        </Typography>
                    </div>
                );
            }
        },
        {
            field: 'unit',
            headerName: t("unit"),
            flex: 0.6,
            headerAlign: 'center',
            sortable: false
        },
        {
            field: 'sumOfPrice',
            headerName: t("sumOfPrice"),
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            sortable: false,
            renderCell: (params) => renderCell(numberWithCommas(addTwoDecimalPlaces(params.value))),
            renderHeader: (params) => {
                return (
                    <div style={{color:"#36C690"}}>
                        <Typography variant='body2' noWrap>
                            <b>{t('headerName.price')}</b>
                        </Typography>
                        <Typography variant='body2' noWrap>
                            <b>{t('headerName.total')}</b>
                        </Typography>
                    </div>
                );
            }
        },
        {
            field: 'sumOfCashDiscount',
            headerName: t("sumOfCashDiscount"),
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            sortable: false,
            renderCell: (params) => renderCell(numberWithCommas(addTwoDecimalPlaces(params.value))),
            renderHeader: (params) =>{
                return (
                    <div style={{color:"#36C690"}}>
                        <Typography variant='body2' noWrap>
                            <b>{t('headerName.discount')}</b>
                        </Typography>
                        <Typography variant='body2' noWrap>
                            <b>{t('headerName.total')}</b>
                        </Typography>
                    </div>
                );
            }
        },
        {
            field: 'sumOfPriceAfterDiscount',
            headerName: t("sumOfPriceAfterDiscount"),
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            sortable: false,
            renderCell: (params) => renderCell(numberWithCommas(addTwoDecimalPlaces(params.value))),
            renderHeader: (params) =>{
                return (
                    <div style={{color:"#36C690"}}>
                        <Typography variant='body2' noWrap>
                            <b>{t('headerName.priceAfterDiscount')}</b>
                        </Typography>
                        <Typography variant='body2' noWrap>
                            <b>{t('headerName.total')}</b>
                        </Typography>
                    </div>
                );
            }
        },
        {
            field: 'branch',
            headerName: t("branch"),
            flex: 1,
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => renderCell(params.value)
        },
        {
            field: 'createdDate',
            headerName: t("createDate"),
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderHeader: (params) =>{
                return (
                    <div style={{color:"#36C690"}}>
                        <Typography variant='body2' noWrap>
                            <b>{t('headerName.requestedDate')}</b>
                        </Typography>
                        <Typography variant='body2' noWrap>
                            <b>{t('headerName.discount')}</b>
                        </Typography>
                    </div>
                );
            }
        },
        {
            field: 'approvedDate',
            headerName: t("approvedDate"),
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            sortable: false
        },
        {
            field: 'requesterNote',
            headerName: t("remark"),
            flex: 1.2,
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => renderCell(params.value)
        },
    ];

    const genRowStatus = (params: GridValueGetterParams) => {
        let statusDisplay;
        let status = params.value ? params.value.toString() : "";
        const statusLabel = genColumnValue("label", "value", status, t("lstStatus", {returnObjects: true}));
        switch (status) {
            case BDStatus.DRAFT:
                statusDisplay = genRowStatusValue(statusLabel, {color: "#FBA600", backgroundColor: "#FFF0CA"});
                break;
            case BDStatus.WAIT_FOR_APPROVAL:
                statusDisplay = genRowStatusValue(statusLabel, {color: "#FBA600", backgroundColor: "#FFF0CA"});
                break;
            case BDStatus.APPROVED:
                statusDisplay = genRowStatusValue(statusLabel, {color: "#20AE79", backgroundColor: "#E7FFE9"});
                break;
            case BDStatus.BARCODE_PRINTED:
                statusDisplay = genRowStatusValue(statusLabel, {color: "#4465CD", backgroundColor: "#C8E8FF"});
                break;
            case BDStatus.REJECT:
                statusDisplay = genRowStatusValue(statusLabel, {color: "#F54949", backgroundColor: "#FFD7D7"});
                break;
        }
        return statusDisplay;
    }

    const genRowStatusValue = (statusLabel: string, styleCustom: any) => {
        return (
            <HtmlTooltip title={<React.Fragment>{statusLabel}</React.Fragment>}>
                <Typography className={classes.MLabelBDStatus}
                            sx={styleCustom}>{statusLabel}</Typography>
            </HtmlTooltip>
        );
    }

    const genTotalPrice = (products: BarcodeDiscountProductDetail[]) => {
        return _.sumBy(products, (item: BarcodeDiscountProductDetail) => {
            if (stringNullOrEmpty(item.price) || stringNullOrEmpty(item.numberOfDiscounted)) {
                return 0;
            }
            return item.price * item.numberOfDiscounted;
        });
    };

    const genTotalCashDiscount = (percentDiscount: boolean, products: BarcodeDiscountProductDetail[]) => {
        return _.sumBy(products, (item: BarcodeDiscountProductDetail) => {
            if (stringNullOrEmpty(item.price) || stringNullOrEmpty(item.requestedDiscount) || stringNullOrEmpty(item.numberOfDiscounted)) {
                return 0;
            }
            if (percentDiscount)
                return ((item.price * item.requestedDiscount) / 100) * item.numberOfDiscounted;
            else
                return item.requestedDiscount * item.numberOfDiscounted;
        });
    };

    const genTotalPriceAfterDiscount = (percentDiscount: boolean, products: BarcodeDiscountProductDetail[]) => {
        let totalPriceAfterDiscount = genTotalPrice(products) - genTotalCashDiscount(percentDiscount, products);
        return totalPriceAfterDiscount < 0 ? 0 : totalPriceAfterDiscount;
    };

    const handlePageChange = async (newPage: number) => {
        setLoading(true);
        let page: string = (newPage + 1).toString();

        const payloadNewPage: BarcodeDiscountSearchRequest = {
            perPage: pageSize,
            page: page,
            query: payload.query,
            branch: payload.branch,
            status: payload.status,
            startDate: payload.startDate,
            endDate: payload.endDate,
        };

        await dispatch(barcodeDiscountSearch(payloadNewPage));
        await dispatch(saveSearchCriteriaSup(payloadNewPage));
        setLoading(false);
    };

    const handlePageSizeChange = async (pageSize: number) => {
        setPageSize(pageSize.toString());
        setLoading(true);
        const payloadNewPage: BarcodeDiscountSearchRequest = {
            perPage: pageSize.toString(),
            page: "1",
            query: payload.query,
            branch: payload.branch,
            status: payload.status,
            startDate: payload.startDate,
            endDate: payload.endDate,
        };

        await dispatch(barcodeDiscountSearch(payloadNewPage));
        await dispatch(saveSearchCriteriaSup(payloadNewPage));
        setLoading(false);
    };

    const barcodeDiscountDetail = useAppSelector((state) => state.barcodeDiscountDetailSlice.barcodeDiscountDetail);
    const currentlySelected = async (params: GridCellParams) => {
        const chkPN = params.colDef.field;
        handleOpenLoading('open', true);
        if (chkPN !== 'checked') {
            try {
                await dispatch(getBarcodeDiscountDetail(params.row.id));
                if (barcodeDiscountDetail.data.length > 0 || barcodeDiscountDetail.data) {
                    setOpenDetail(true);
                }
            } catch (error) {
                console.log(error);
            }
        }
        handleOpenLoading('open', false);
    };

    return (
        <div>
            <Box mt={2} bgcolor='background.paper'>
                <div className={classes.MdataGridPaginationTop}
                     style={{height: lstBarcodeDiscount.length >= 10 ? '60vh' : 'auto'}}>
                    <DataGrid
                        rows={lstBarcodeDiscount}
                        columns={columns}
                        disableColumnMenu
                        hideFooterSelectedRowCount={true}
                        // onCellClick={currentlySelected}
                        autoHeight={lstBarcodeDiscount.length < 10}
                        scrollbarSize={10}
                        pagination
                        page={currentPage - 1}
                        pageSize={parseInt(pageSize)}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        rowCount={bdSearchResponse.total}
                        paginationMode='server'
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        loading={loading}
                        rowHeight={45}
                    />
                </div>
            </Box>
            {openDetail && <ModalCreateBarcodeDiscount isOpen={openDetail} onClickClose={handleCloseDetail} action={Action.UPDATE}
                                                       setPopupMsg={setPopupMsg}
                                                       setOpenPopup={setOpenPopup}/>}
            <BarcodeDiscountPopup open={openPopup} onClose={handleClosePopup} contentMsg={popupMsg} />
        </div>
    );
}

export default BarcodeDiscountList;