import { get, post, postTest } from '../adapters/posback-adapter';
import axios from "axios";
import { environment } from '../environment-base';
import { OrderSubmitRequest, FeatchDataPDFRequest } from '../models/order-model'

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
        console.log("cache error = ", error);
        throw error;
    }
}

export async function closeOrderShipments(payload: any) {
    try {
        const response = await post(environment.orders.shipment.closejob.url, payload)
            .then((result: any) => result);
        return response;
    } catch (error) {
        console.log("cache error = ", error);
        throw error;
    }
}

export async function fetchShipmentDeliverlyPDF(shipmentNo: string) {
    try {
        const path = `/api/stock-diff/${shipmentNo}/export`;
        const response = await get(path)
            .then((result: any) => result);
        return response


    } catch (error) {
        console.log("error = ", error);
        throw error;
    }
}


