// OAuth2.createService
/**
 * OAuth2
 * https://github.com/googleworkspace/apps-script-oauth2
 */
declare namespace OAuth2 {
  export declare function createService(service_name: string): OAuth2Service;
}

/**
 * OAuth2Service
 */
declare namespace OAuth2Service {
  export declare function setAuthorizationBaseUrl(url: string): OAuth2Service;
  export declare function setTokenUrl(url: string): OAuth2Service;
  export declare function setClientId(clientId: string): OAuth2Service;
  export declare function setClientSecret(clientSecret: string): OAuth2Service;
  export declare function setCallbackFunction(
    callbackFunction: string
  ): OAuth2Service;
  export declare function setPropertyStore(
    propertyStore: GoogleAppsScript.Properties.Properties
  ): OAuth2Service;
  export declare function setScope(scope: string): OAuth2Service;
  export declare function getAuthorizationUrl(): string;
  export declare function getAccessToken(): string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export declare function handleCallback(request: any): string;
  export declare function setCache(
    cache: GoogleAppsScript.Cache.Cache
  ): OAuth2Service;
  export declare function setLock(
    lock: GoogleAppsScript.Lock.Lock
  ): OAuth2Service;
  export declare function reset(): void;
}
