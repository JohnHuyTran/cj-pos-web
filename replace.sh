#REACT_APP_KEYCLOAK_URL=`echo "$REACT_APP_KEYCLOAK_URL" | awk -F/ '{print $3}'`

#find /usr/share/nginx/html/ -type f -exec sed -i "s/REACT_APP_KEYCLOAK_URL_VALUE/https:\/\/$REACT_APP_KEYCLOAK_URL/g" {} \;

# find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_KEYCLOAK_URL_VALUE,$REACT_APP_KEYCLOAK_URL,g" {} \;
# find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_KEYCLOAK_PATH_AUTHEN_VALUE,$REACT_APP_KEYCLOAK_PATH_AUTHEN,g" {} \;
# find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_KEYCLOAK_PATH_ACCESS_TOKEN_VALUE,$REACT_APP_KEYCLOAK_PATH_ACCESS_TOKEN,g" {} \;
# find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_KEYCLOAK_PATH_REFRESH_ACCESS_TOKEN_VALUE,$REACT_APP_KEYCLOAK_PATH_REFRESH_ACCESS_TOKEN,g" {} \;

find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_KEYCLOAK_URL_VALUE,$REACT_APP_KEYCLOAK_URL,g" {} \;
find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_KEYCLOAK_GRANT_TYPE_VALUE,$REACT_APP_KEYCLOAK_GRANT_TYPE,g" {} \;
find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_KEYCLOAK_CLIENT_ID_VALUE,$REACT_APP_KEYCLOAK_CLIENT_ID,g" {} \;
find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_KEYCLOAK_CLIENT_SECRET_VALUE,$REACT_APP_KEYCLOAK_CLIENT_SECRET,g" {} \;
find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_KEYCLOAK_TIME_OUT_VALUE,$REACT_APP_KEYCLOAK_TIME_OUT,g" {} \;

find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_POS_BACK_BE_URL_VALUE,$REACT_APP_POS_BACK_BE_URL,g" {} \;
find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_POS_BACK_BE_TIME_OUT_VALUE,$REACT_APP_POS_BACK_BE_TIME_OUT,g" {} \;
find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_POS_BACK_VERSION_VALUE,$REACT_APP_POS_BACK_VERSION,g" {} \;
find /usr/share/nginx/html/ -type f -exec sed -i "s,REACT_APP_OWN_BRANCH_CODE_VALUE,$REACT_APP_OWN_BRANCH_CODE,g" {} \;







