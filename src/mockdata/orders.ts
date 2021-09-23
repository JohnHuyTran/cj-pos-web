import { CheckOrderRequest } from "../models/order"
export const orders = [
    {
        orderShipment: "LD234587",
        orderNo: "SD2021-001",
        orderTotal: 210,
        orderTote: 78,
        orderType: "PAPER",
        orderStatus: "PENDING",
        orderCreateDate: '16/09/2012',
        products: [
            {
                productId: "0001",
                productBarCode: "0000111122223333",
                productDescription: "กระดาษถ่ายเอกสาร Double A A4 80 แกรม",
                productUnit: "Pack",
                productQuantityRef: 1,
                productQuantityActual: 1,
                productDifference: 0
            },
            {
                productId: "0002",
                productBarCode: "0000111122224444",
                productDescription: "กระดาษถ่ายเอกสาร ไอเดีย เวิร์ค A4 80แกรม",
                productUnit: "Pack",
                productQuantityRef: 10,
                productQuantityActual: 9,
                productDifference: 1
            },
            {
                productId: "0003",
                productBarCode: "0000111122225555",
                productDescription: "กระดาษถ่ายเอกสาร ONE Green A4 70 แกรม 450",
                productUnit: "Pack",
                productQuantityRef: 10,
                productQuantityActual: 9,
                productDifference: 1
            }
        ]
    },
    {
        orderShipment: "LD234999",
        orderNo: "SD2021-002",
        orderTotal: 210,
        orderTote: 78,
        orderStatus: "COMPLETE",
        orderType: "WASHING-POWER",
        orderCreateDate: '16/09/2012',
        products: [
            {
                productId: "0021",
                productBarCode: "0000111122223334",
                productDescription: "เปา วินวอช ผงซักฟอก ขนาด 1,700 กรัม",
                productUnit: "Pack",
                productQuantityRef: 1,
                productQuantityActual: 1,
                productDifference: 0
            },
            {
                productId: "0022",
                productBarCode: "0000111122224445",
                productDescription: "บรีส เอกเซล ผงซักฟอก สูตรเข้มข้น 4500 กรัม",
                productUnit: "Pack",
                productQuantityRef: 10,
                productQuantityActual: 9,
                productDifference: 1
            },
            {
                productId: "0023",
                productBarCode: "0000111122225556",
                productDescription: "แอทแทค ผงซักฟอก 3D คลีน แอคชั่น 4500 กรัม",
                productUnit: "Pack",
                productQuantityRef: 10,
                productQuantityActual: 9,
                productDifference: 1
            }
        ]
    }
]



export function getOrderList(payload: CheckOrderRequest) {
    return new Promise((resolve, reject) => {
        const foundOrders = orders.filter(
            (order) => (payload.orderNo && order.orderNo.search(payload.orderNo) > -1) ||
                (payload.orderStatus && payload.orderStatus === order.orderStatus) ||
                (payload.orderType && payload.orderType === order.orderType)
        )

        setTimeout(() => {
            if (foundOrders) {
                resolve(foundOrders)
            } else {
                reject('Email or password is invalid')
            }
        }, 100)
    })
}
