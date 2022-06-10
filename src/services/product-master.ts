import { get, post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { FindProductProps } from '../models/product-model';
import { ContentType } from '../utils/enum/common-enum';

export async function getProductMaster(query: string) {
  try {
    const response = await get(`${environment.products.sku.productMaster.search.url}?query=${query}`);
    // const response = await get('http://192.168.110.135:8000/sku/product-master?query=000000000020006559');
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getProductByType(payload: any) {
  try {
    if (payload.isControlStock) {
      return await get(
        `${environment.products.type.productByType.url}?product-type=${payload.productTypeCode}&is-control-stock=${payload.isControlStock}`
      );
    }

    return await get(`${environment.products.type.productByType.url}?product-type=${payload.productTypeCode}`);
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

export async function getAllProductByBarcode(payload: FindProductProps) {
  try {
    const path = `${environment.products.addItem.allitemsList.url}/${payload.search}?limit=10`;

    const body = { ...payload.payload };
    let response = await post(path, body, ContentType.JSON).then();

    if (response === 204) {
      let responseCode: any = {
        ref: '',
        code: response,
        message: '',
        data: [],
      };

      return responseCode;
    }
    return response;
  } catch (error) {
    throw error;
  }
}
