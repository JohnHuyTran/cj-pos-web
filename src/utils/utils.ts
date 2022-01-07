import jwtDecode from 'jwt-decode';
import { KeyCloakTokenInfo } from '../models/keycolak-token-info';

export const getDecodedAccessToken = (accessToken: string) => {
  return jwtDecode<KeyCloakTokenInfo>(accessToken);
};

export function getActionLists(): string[] {
  const tokenInfo = getDecodedAccessToken(
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwbmZJNmF1MXZ5LWhRQ0s3ODJ1V2E3cWIzQVFYY1FfNnZYOWZwdE5FaHR3In0.eyJleHAiOjE2MzE3NzY3OTUsImlhdCI6MTYzMTc3NjQ5NSwianRpIjoiYjA5ZGM0ZmQtMTRlMS00M2UwLThkNTItMzU0YTBlMjU2NzM0IiwiaXNzIjoiaHR0cHM6Ly9hZG1pbi5hdXRoLWRldi5jamV4cHJlc3MuaW8vYXV0aC9yZWFsbXMvY2pleHByZXNzIiwic3ViIjoiOWY2ZDEyODEtOTJhOS00N2EzLTk0NWQtNWJkMTg0MjkzMjBjIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXBwLm5ld3Bvc2JhY2siLCJzZXNzaW9uX3N0YXRlIjoiMGM2ODkwMjMtZWI3ZC00MTQyLTgwOWMtYzRjNWFmODdiOTRmIiwiYWNyIjoiMSIsInNjb3BlIjoic2NvcGUubmV3cG9zYmFjayBlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoicG9zMiBwb3MyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicG9zMiIsImFjbCI6eyJzZXJ2aWNlLm5ld3Bvc2JhY2siOlsiQ0FTSERSQVdFUi5ERVBPU0lUIiwiU0FMRS5JVEVNLkNBTkNFTCIsIkZFQVRVUkUuQURNSU4uU0VBUkNILkRBVEEiLCJDQVNIRFJBV0VSLldJVEhEUkFXIl19LCJnaXZlbl9uYW1lIjoicG9zMiIsImJyYW5jaCI6IjAwMDIiLCJmYW1pbHlfbmFtZSI6InBvczIiLCJlbWFpbCI6InBvczJAdGVzdC5jb20ifQ.myRuJJxraId5ZptOahCJl2lt3YQczXDbatKGrEoquzuyRz4ID1QYOi2IZT6ND4Gpa8CCvtIjWKNuUrYQbRrjG8o1dJMzSAi5pt40HXbEiBvN2QDCuCF2NMPcBYZPMlPfMyNGTAafolpJYGHhjZy_4oGGZiUSbTzgQ91iVoY_WUHgdNTk9H8c-nvKxNRXIWos92AMox6-tlLkjksQsMusu9JZWEQ2v7Fmex_oIBghxPr-r9JGstm0_f16bbvMTyPskaDoOUehKNbw6V3I1IsfJgUnbUFbOlMXuCDsGmOtKbpouycPXJvj2BJJQ11PY28W4g7w3ddffLyVm4i8_OJRBg'
  );
  return tokenInfo.acl['service.newposback'];
}

export function isAllowPermission(action: string): boolean {
  return getActionLists().indexOf(action) > -1;
}

export function getSdType(codeType: number): string {
  if (codeType === 0) {
    return 'ลังกระดาษ /Tote';
  } else if (codeType === 1) {
    return 'สินค้าภายใน Tote';
  }
  return 'undefined';
}

export function getSdStatus(codeStatus: number): string {
  if (codeStatus === 0) {
    return 'บันทึก';
  } else if (codeStatus === 1) {
    return 'อนุมัติ';
  }
  return 'undefined';
}

export function getDCStatus(codeStatus: number): string {
  if (codeStatus === 0) {
    return 'รอการตรวจสอบ';
  } else if (codeStatus === 1) {
    return 'ตรวจสอบแล้ว';
  }
  return '-';
}

export const numberWithCommas = (num: any) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
