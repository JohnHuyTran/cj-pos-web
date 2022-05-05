import { environment } from '../environment-base';
import { get } from '../adapters/posback-adapter';
import { ApiError } from '../models/api-error-model';
import { stringNullOrEmpty } from "../utils/utils";
import { getUserInfo } from "../store/sessionStore";
import { env } from "../adapters/environmentConfigs";

export async function getFileUrlHuawei(filekey: string) {
  const branchCode = getUserInfo().branch;
  return await get(environment.master.file.huawei.pathFile.url +
    (stringNullOrEmpty(branchCode) ? ('/' + env.branch.code) : `/${branchCode}`) + `/${filekey}`)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
}
