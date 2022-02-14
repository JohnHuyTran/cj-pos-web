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
