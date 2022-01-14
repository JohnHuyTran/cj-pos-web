import {Box, Tooltip, Typography} from "@mui/material";
import {DataGrid, GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import React from "react";
import {useStyles} from "../../styles/makeTheme";
import {useTranslation} from "react-i18next";
import {
    BarcodeDiscount,
    BarcodeDiscountSearchRequest,
    BarcodeDiscountSearchResponse
} from "../../models/barcode-discount-model";
import {convertUtcToBkkDate} from "../../utils/date-utill";
import {BDStatus, DateFormat} from "../../utils/enum/common-enum";
import {genColumnValue} from "../../utils/utils";

type BarcodeDiscountListProps = {
    bdSearchRequest: BarcodeDiscountSearchRequest,
    bdSearchResponse: BarcodeDiscountSearchResponse,
};

const BarcodeDiscountList: React.FC<BarcodeDiscountListProps> = (props) => {
    const classes = useStyles();
    const {t} = useTranslation(["barcodeDiscount"]);
    const [pageSize, setPageSize] = React.useState(props.bdSearchResponse.perPage.toString());
    const [loading, setLoading] = React.useState<boolean>(false);

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
            sortable: false
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
            // renderCell: (params) => {
            //     return (
            //         <HtmlTooltip title={<React.Fragment>{params.value}</React.Fragment>}>
            //             <Typography variant='body2' noWrap>
            //                 {params.value}
            //             </Typography>
            //         </HtmlTooltip>
            //     );
            // },
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
            <Tooltip title={statusLabel}>
                <Typography className={classes.MLabelBDStatus}
                            sx={styleCustom}>{statusLabel}</Typography>
            </Tooltip>
        );
    }

    const currentPage = props.bdSearchResponse.page;
    const rows = props.bdSearchResponse.data.map((data: BarcodeDiscount, index: number) => {
        return {
            id: index + 1,
            index: (currentPage - 1) * parseInt(pageSize) + index + 1,
            documentNumber: data.documentNumber,
            status: data.status,
            totalAmount: data.totalAmount,
            unit: data.unit,
            sumOfPrice: data.sumOfPrice,
            sumOfCashDiscount: data.sumOfCashDiscount,
            sumOfPriceAfterDiscount: data.sumOfPriceAfterDiscount,
            branch: data.branch,
            createdDate: convertUtcToBkkDate(data.createdDate, DateFormat.DATE_FORMAT),
            approvedDate: convertUtcToBkkDate(data.approvedDate, DateFormat.DATE_FORMAT),
            requesterNote: data.requesterNote
        };
    });

    const handlePageChange = async (newPage: number) => {
        setLoading(true);

        let page: string = (newPage + 1).toString();

        const payloadNewPage: BarcodeDiscountSearchRequest = {
            limit: pageSize,
            page: page,
            documentNumber: props.bdSearchRequest.documentNumber,
            branch: props.bdSearchRequest.branch,
            status: props.bdSearchRequest.status,
            fromDate: props.bdSearchRequest.fromDate,
            toDate: props.bdSearchRequest.toDate,
        };
        //call api
        setLoading(false);
    };

    const handlePageSizeChange = async (pageSize: number) => {
        setPageSize(pageSize.toString());
        setLoading(true);
        const payloadNewPage: BarcodeDiscountSearchRequest = {
            limit: pageSize.toString(),
            page: "1",
            documentNumber: props.bdSearchRequest.documentNumber,
            branch: props.bdSearchRequest.branch,
            status: props.bdSearchRequest.status,
            fromDate: props.bdSearchRequest.fromDate,
            toDate: props.bdSearchRequest.toDate,
        };
        //call api
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
                        rowCount={props.bdSearchResponse.total}
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