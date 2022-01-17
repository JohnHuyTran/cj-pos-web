import {Box, Typography} from "@mui/material";
import {DataGrid, GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import React from "react";
import {useStyles} from "../../styles/makeTheme";
import {useTranslation} from "react-i18next";
import {
    BarcodeDiscount, BarcodeDiscountProductDetail,
    BarcodeDiscountSearchRequest,
    BarcodeDiscountSearchResponse
} from "../../models/barcode-discount-model";
import {convertUtcToBkkDate} from "../../utils/date-utill";
import {BDStatus, DateFormat} from "../../utils/enum/common-enum";
import {genColumnValue} from "../../utils/utils";
import HtmlTooltip from "../../components/commons/ui/html-tooltip";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {saveSearchCriteriaSup} from "../../store/slices/save-search-order-supplier-slice";
import {barcodeDiscountSearch} from "../../store/slices/barcode-discount-search-slice";

const _ = require("lodash");

const BarcodeDiscountList = () => {
    const classes = useStyles();
    const {t} = useTranslation(["barcodeDiscount"]);
    const [loading, setLoading] = React.useState<boolean>(false);

    const dispatch = useAppDispatch();
    const barcodeDiscountSearchSlice = useAppSelector((state) => state.barcodeDiscountSearchSlice);
    const bdSearchResponse: BarcodeDiscountSearchResponse = barcodeDiscountSearchSlice.bdSearchResponse;
    const currentPage = useAppSelector((state) => state.barcodeDiscountSearchSlice.bdSearchResponse.page);
    const limit = useAppSelector((state) => state.barcodeDiscountSearchSlice.bdSearchResponse.perPage);
    const [pageSize, setPageSize] = React.useState(limit.toString());
    const payload = useAppSelector((state) => state.barcodeDiscountCriteriaSearchSlice.searchCriteria);

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: t("numberOrder"),
            flex: 0.6,
            headerAlign: 'center',
            align: 'center',
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
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => genRowStatus(params)
        },
        {
            field: 'totalAmount',
            headerName: t("totalAmount"),
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            sortable: false,
        },
        {
            field: 'unit',
            headerName: t("unit"),
            flex: 0.8,
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
        },
        {
            field: 'sumOfCashDiscount',
            headerName: t("sumOfCashDiscount"),
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            sortable: false
        },
        {
            field: 'sumOfPriceAfterDiscount',
            headerName: t("sumOfPriceAfterDiscount"),
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            sortable: false,
        },
        {
            field: 'branch',
            headerName: t("branch"),
            flex: 1,
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => {
                return (
                    <HtmlTooltip title={<React.Fragment>{params.value}</React.Fragment>}>
                        <Typography variant='body2' noWrap>
                            {params.value}
                        </Typography>
                    </HtmlTooltip>
                );
            },
        },
        {
            field: 'createdDate',
            headerName: t("createDate"),
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
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
            renderCell: (params) => {
                return (
                    <HtmlTooltip title={<React.Fragment>{params.value}</React.Fragment>}>
                        <Typography variant='body2' noWrap>
                            {params.value}
                        </Typography>
                    </HtmlTooltip>
                );
            },
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
            return item.price
        });
    };

    const genTotalCashDiscount = (percentDiscount: boolean, products: BarcodeDiscountProductDetail[]) => {
        return _.sumBy(products, (item: BarcodeDiscountProductDetail) => {
            if (percentDiscount)
                return (item.price * item.requestedDiscount) / 100;
            else
                return item.requestedDiscount;
        });
    };

    const genTotalPriceAfterDiscount = (percentDiscount: boolean, products: BarcodeDiscountProductDetail[]) => {
        let totalPriceAfterDiscount = genTotalPrice(products) - genTotalCashDiscount(percentDiscount, products);
        return totalPriceAfterDiscount < 0 ? 0 : totalPriceAfterDiscount;
    };

    const rows = bdSearchResponse.data.map((data: BarcodeDiscount, index: number) => {
        return {
            id: index + 1,
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
            approvedDate: (BDStatus.APPROVED === data.status || BDStatus.BARCODE_PRINTED === data.status) ? convertUtcToBkkDate(data.approvedDate, DateFormat.DATE_FORMAT) : "",
            requesterNote: data.requesterNote
        };
    });

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

    return (
        <div>
            <Box mt={2} bgcolor='background.paper'>
                <div className={classes.MdataGridPaginationTop} style={{height: rows.length >= 10 ? '60vh' : 'auto'}}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        disableColumnMenu
                        checkboxSelection={true}
                        // onCellClick={currentlySelected}
                        autoHeight={rows.length < 10}
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
        </div>
    );
}

export default BarcodeDiscountList;