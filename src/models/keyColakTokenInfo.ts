export interface KeyCloakTokenInfo {
    exp: number;
    iat: number;
    jti: string;
    iss: string;
    sub: string;
    typ: string;
    azp: string;
    session_state: string;
    acr: string;
    scope: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    acl: ACL;
    given_name: string;
    branch: string;
    family_name: string;
    email: string;
}

export interface ACL {
    "service.newposback": string[];
}