export const env: any = {
  backEnd: {
    url: process.env.REACT_APP_POS_BACK_BE_URL,
    timeout: process.env.REACT_APP_POS_BACK_BE_TIME_OUT,
  },

  keycloak: {
    url: process.env.REACT_APP_KEYCLOAK_URL,
    grantType: process.env.REACT_APP_KEYCLOAK_GRANT_TYPE,
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET,
    timeout: process.env.REACT_APP_KEYCLOAK_TIME_OUT,
  },
  ownBranch: {
    code: process.env.REACT_APP_OWN_BRANCH_CODE,
    name: process.env.REACT_APP_OWN_BRANCH_NAME,
  },
};
