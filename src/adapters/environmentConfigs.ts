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
  branch: {
    default: {
      dc: {
        group: process.env.REACT_APP_BRANCH_GROUP_DC,
        location: process.env.REACT_APP_BRANCH_LOCATION_DC,
      },
      oc: {
        group: process.env.REACT_APP_BRANCH_GROUP_OC,
        location: process.env.REACT_APP_BRANCH_LOCATION_OC,
      },
    },
    code: process.env.REACT_APP_OWN_BRANCH_CODE,
    name: process.env.REACT_APP_OWN_BRANCH_NAME,
  },
};
