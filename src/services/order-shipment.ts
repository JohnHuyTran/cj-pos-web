import { post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';

export async function saveOrderShipments() {
    try {
        const response = await post(environment.orders.shipment.save.url, "")
            .then((result: any) => result);
        return response;
    } catch (error) {
        console.log("error = ", error);
        throw error;
    }
}