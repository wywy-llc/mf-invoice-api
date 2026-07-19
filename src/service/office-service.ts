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
import { ReqMethod, ServiceBase } from './service-base';

/**
 * OfficeService
 */
export class OfficeService extends ServiceBase {
  /**
   * baseUrl
   */
  baseUrl: string = ServiceBase.API_BASE_URL + '/office';

  /**
   * 事業者情報の取得
   * @returns {MfInvoiceApi.Office} 事業者情報
   */
  getMyOffice(): MfInvoiceApi.Office {
    const reqUrl = this.baseUrl;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }
}
