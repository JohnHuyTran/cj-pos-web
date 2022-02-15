import { get } from '../adapters/posback-adapter';
import { environment } from '../environment-base';

export async function getAllProductByType(productTypeCode: string) {
  try {
    return await get(`${environment.products.type.productByType.url}?product-type=${productTypeCode}`);
  } catch (error) {
    throw error;
  }
}
