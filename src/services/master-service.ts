import { environment } from '../environment-base';
import { get } from '../adapters/posback-adapter';
import { ApiError } from '../models/api-error-model';

export async function getFileUrlHuawei(filekey: string) {
  const response = await get(environment.master.file.huawei.pathFile.url + `/${filekey}`)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}
