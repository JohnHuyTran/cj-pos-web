import { get } from '../adapters/posback-adapter';
import { environment } from '../environment-base';

export async function getProductMaster(query: string) {
  try {
    const response = await get(`${environment.products.sku.productMaster.search.url}?query=${query}`);
    // const response = await get('http://192.168.110.135:8000/sku/product-master?query=000000000020006559');
    return response;
  } catch (error) {
    throw error;
  }
}
export async function searchProductItem(query: string) {
  try {
    const response = await get(
      `${environment.products.sku.productMaster.searchItem.url}?query=${query}&limit=10&offset=0`
    );
    return response;
  } catch (error) {
    throw error;
  }
}
