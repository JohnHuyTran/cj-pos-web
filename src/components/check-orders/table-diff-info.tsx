import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Item } from '../../models/order-model'

interface DataDiffInfyProps {
    items: Item[],
}

export default function DataDiffInfo(props: DataDiffInfyProps) {
    const { items } = props;

    return (
        <TableContainer component={Paper} id='tblItemDifferance'>
            <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell align="right">บาร์โค้ด</TableCell>
                        <TableCell align="right">รายละเอียดสินค้า</TableCell>
                        <TableCell align="right">จำนวนส่วนต่าง</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((row, index: number) => (
                        <TableRow
                            key={row.barcode}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell align="right">{row.barcode}</TableCell>
                            <TableCell align="right">{row.productName}</TableCell>
                            <TableCell align="right">{row.quantity.qtyDiff}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
