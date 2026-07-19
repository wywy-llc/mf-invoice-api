/**
 * Copyright 2026 wywy LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
