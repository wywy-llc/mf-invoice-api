/**
 * OAuth2Service
 *
 */
declare class OAuth2Service {
  public setAuthorizationBaseUrl(url: string): OAuth2Service;
  public setTokenUrl(url: string): OAuth2Service;
  public setClientId(clientId: string): OAuth2Service;
  public setClientSecret(clientSecret: string): OAuth2Service;
  public setCallbackFunction(callbackFunction: string): OAuth2Service;
  public setPropertyStore(
    propertyStore: GoogleAppsScript.Properties.Properties
  ): OAuth2Service;
  public setScope(scope: string): OAuth2Service;
  public getAuthorizationUrl(): string;
  public getAccessToken(): string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleCallback(request: any): string;
  public reset(): void;
}

// OAuth2.createService
/**
 * OAuth2
 * https://github.com/googleworkspace/apps-script-oauth2
 */
declare class OAuth2 {
  static createService(service_name: string): OAuth2Service;
}
