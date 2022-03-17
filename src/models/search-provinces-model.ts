export interface ProvincesResponse {
  ref: string;
  code: number;
  message: string;
  data: ProvincesInfo[];
}

export interface ProvincesInfo {
  code: number;
  nameTH: string;
  nameEN: string;
}
