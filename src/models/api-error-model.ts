// export class ApiError {
//     code: number,
//     httpStatus: number,
//     message: string
// }
export class ApiError {
  code: number;
  httpStatus: number;
  message: string;

  constructor(httpStatus: number, code: any, message: string) {
    this.code = code;
    this.httpStatus = httpStatus;
    this.message = message ? message : 'This transaction is error';
  }
}

export class ApiUploadError {
  code: number;
  httpStatus: number;
  message: string;
  data: {
    base64EncodeFile: string;
    errorCount: number;
  } | null;

  constructor(httpStatus: number, code: any, message: string, data: any) {
    this.code = code;
    this.httpStatus = httpStatus;
    this.message = message ? message : 'This transaction is error';
    this.data = data ? data : null;
  }
}
