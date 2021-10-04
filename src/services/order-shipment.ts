import { post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { OrderSubmitRequest } from '../models/order-model'

export async function saveOrderShipments(payload: OrderSubmitRequest) {
    try {
        const response = await post(environment.orders.shipment.submit.url, payload)
            .then((result: any) => result);
        return response;
    } catch (error) {
        console.log("error = ", error);
        throw error;
    }
}

export async function approveOrderShipments(payload: any) {
    try {
        const response = await post(environment.orders.shipment.approve.url, payload)
            .then((result: any) => result);
        return response;
    } catch (error) {
        console.log("error = ", error);
        throw error;
    }
}

export async function closeOrderShipments(payload: any) {
    try {
        const response = await post(environment.orders.shipment.closejob.url, payload)
            .then((result: any) => result);
        return response;
    } catch (error) {
        console.log("error = ", error);
        throw error;
    }
}

