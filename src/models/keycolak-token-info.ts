export interface KeyCloakTokenInfo {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  scope: string;
  email_verified: boolean;
  name: string;
  groups: string[];
  preferred_username: string;
  acl: ACL;
  given_name: string;
  family_name: string;
  email: string;
}

export interface ACL {
  'service.posback-purchase': string[];
  'service.posback-supplier': string[];
  'service.posback-stock': string[];
  'service.posback-authority': string[];
  'service.posback-order': string[];
  'service.posback-product': string[];
}
