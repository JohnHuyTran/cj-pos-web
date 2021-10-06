import { CheckOrderRequest } from "../models/order-model"
export const orders = [
    {
        orderShipment: "LD1111",
        orderNo: "SD2021-001",
        orderTotal: 210,
        orderTote: 78,
        orderType: "PAPER",
        orderStatus: "1",
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
        orderShipment: "LD2222",
        orderNo: "SD2021-002",
        orderTotal: 210,
        orderTote: 78,
        orderStatus: "0",
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
    },
    {
        orderShipment: "LD3333",
        orderNo: "SD2021-002",
        orderTotal: 210,
        orderTote: 78,
        orderStatus: "3",
        orderType: "DRINK",
        orderCreateDate: '16/09/2012',
        products: [
            {
                productId: "0021",
                productBarCode: "0000111122223334",
                productDescription: "คาราบาว 150ml",
                productUnit: "Pack",
                productQuantityRef: 1,
                productQuantityActual: 1,
                productDifference: 0
            },
            {
                productId: "0022",
                productBarCode: "0000111122224445",
                productDescription: "คาราบาวเอเนอร์จี้ดริงก์ 330 ml",
                productUnit: "Pack",
                productQuantityRef: 10,
                productQuantityActual: 9,
                productDifference: 1
            },
            {
                productId: "0023",
                productBarCode: "0000111122225556",
                productDescription: "เครื่องดื่ม วู้ดดี้ ซี+ ล็อค 140ml ",
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

        if (!payload.orderNo && !payload.orderStatus && !payload.orderType) {
            reject('data not found')
        }

        const foundOrders = orders.filter(
            (order) => (!payload.orderNo ? true : payload.orderNo && order.orderNo.search(payload.orderNo) > -1) &&
                (!payload.orderStatus ? true : payload.orderStatus && payload.orderStatus === order.orderStatus) &&
                (!payload.orderType ? true : payload.orderType && payload.orderType === order.orderType)
        )


        setTimeout(() => {
            if (foundOrders) {
                resolve(foundOrders)
            } else {
                reject('data not found')
            }
        }, 100)
    })
}
