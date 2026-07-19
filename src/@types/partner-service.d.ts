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
declare namespace MfInvoiceApi {
  interface PartnerService extends ServiceBase {
    baseUrl: string;
    /**
     * 取引先一覧の取得
     * @param {number} page ページ番号
     * @param {number} perPage 1ページあたりのデータ数
     * @returns {MfInvoiceApi.PartnersResponse} 取引先一覧
     */
    getPartners(page?: number, perPage?: number): MfInvoiceApi.PartnersResponse;
    /**
     * 取引先の作成
     * @param {MfInvoiceApi.PartnerReqBody} 取引先リクエストボディ
     * @returns {MfInvoiceApi.Partner} 取引先
     */
    createNew(
      partnerReqBody: MfInvoiceApi.PartnerReqBody
    ): MfInvoiceApi.Partner;
    /**
     * 取引先の取得
     * @param {string} partnerId 取引先ID
     * @returns {MfInvoiceApi.Partner} 取引先
     */
    getPartner(partnerId: string): MfInvoiceApi.Partner;
    /**
     * 取引先の更新
     * @param {string} partnerId 取引先ID
     * @param {MfInvoiceApi.PartnerReqBody} partnerReqBody 取引先リクエストボディ
     * @returns {MfInvoiceApi.Partner} 取引先
     */
    updatePartner(
      partnerId: string,
      partnerReqBody: MfInvoiceApi.PartnerReqBody
    ): MfInvoiceApi.Partner;
    /**
     * 取引先の削除
     * @param partnerId 取引先ID
     * @returns {boolean} 削除成功時はtrue
     */
    deletePartner(partnerId: string): MfInvoiceApi.Partner;
    /**
     * 全ての取引先を取得
     * @returns {MfInvoiceApi.Partner[]} 取引先一覧
     */
    getAll(): MfInvoiceApi.Partner[];
  }
}
