import { Office } from '../@types/mf-invoice-client';
import { ReqMethod, ServiceBase } from './service-base';

export class OfficeService extends ServiceBase {
  baseUrl: string = ServiceBase.API_BASE_URL + '/office';
  getMyOffice(): Office {
    const reqUrl = this.baseUrl;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }
}
