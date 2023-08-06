/**
 * OAuth2
 * https://github.com/googleworkspace/apps-script-oauth2
 */
declare namespace OAuth2 {
  export declare function createService(service_name: string): OAuth2Service;
  /**
   * OAuth2Service
   */
  interface OAuth2Service {
    setAuthorizationBaseUrl(url: string): OAuth2Service;
    setTokenUrl(url: string): OAuth2Service;
    setClientId(clientId: string): OAuth2Service;
    setClientSecret(clientSecret: string): OAuth2Service;
    setCallbackFunction(callbackFunction: string): OAuth2Service;
    setPropertyStore(
      propertyStore: GoogleAppsScript.Properties.Properties
    ): OAuth2Service;
    setScope(scope: string): OAuth2Service;
    getAuthorizationUrl(): string;
    getAccessToken(): string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleCallback(request: any): string;
    setCache(cache: GoogleAppsScript.Cache.Cache): OAuth2Service;
    setLock(lock: GoogleAppsScript.Lock.Lock): OAuth2Service;
    reset(): void;
  }
}
