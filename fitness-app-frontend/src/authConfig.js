// export const authConfig = {
//   clientId: 'oauth2-pkce-client',
//   authorizationEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/auth',
//   tokenEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/token',
//   redirectUri: 'http://localhost:5173/',
//   scope: 'openid profile email offline_access',
//   onRefreshTokenExpire: (event) => event.logIn(),
// }   


export const authConfig = {
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/token',
  redirectUri: 'http://localhost:5173/',           // must exactly match Keycloak
  scope: 'openid profile email offline_access',

  onRefreshTokenExpire: () => {
    // Call your login function when token expires
    window.location.href = '/';   // or use your custom logIn()
  },
};
