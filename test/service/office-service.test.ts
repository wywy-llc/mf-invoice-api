import { OfficeService } from '../../src/service/office-service';
import {
  officeFactory,
  officeReqBodyFactory,
  registrationCodeResponseFactory,
} from '../factories';
import { stubUrlFetchJson, stubUrlFetchEmpty } from '../helpers/gas-mock';

const ACCESS_TOKEN = 'test_access_token';
const BASE_URL = 'https://invoice.moneyforward.com/api/v3/office';

describe('OfficeService', () => {
  let officeService: OfficeService;

  beforeEach(() => {
    vi.clearAllMocks();
    officeService = new OfficeService(ACCESS_TOKEN);
  });

  describe('getMyOffice', () => {
    it('呼び出すと、事業者情報を返す', () => {
      const office = officeFactory.build();
      const fetchMock = stubUrlFetchJson(office);

      expect(officeService.getMyOffice()).toEqual(office);
      expect(fetchMock).toHaveBeenCalledWith(
        BASE_URL,
        expect.objectContaining({ method: 'get' })
      );
    });
  });

  describe('updateOffice', () => {
    it('officeReqBodyを指定すると、更新後の事業者情報を返し、PUTリクエストを送信する', () => {
      const office = officeFactory.build();
      const reqBody = officeReqBodyFactory.build();
      const fetchMock = stubUrlFetchJson(office);

      expect(officeService.updateOffice(reqBody)).toEqual(office);
      expect(fetchMock).toHaveBeenCalledWith(
        BASE_URL,
        expect.objectContaining({
          method: 'put',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });

    it('officeReqBody未指定だと、"officeReqBody is required."エラー', () => {
      expect(() =>
        officeService.updateOffice(
          undefined as unknown as MfInvoiceApi.OfficeReqBody
        )
      ).toThrow('officeReqBody is required.');
    });
  });

  describe('updateRegistrationCode', () => {
    it('registrationCodeを指定すると、登録番号レスポンスを返し、PUTリクエストを送信する', () => {
      const response = registrationCodeResponseFactory.build({
        registration_code: 'T1234567890123',
      });
      const fetchMock = stubUrlFetchJson(response);

      expect(officeService.updateRegistrationCode('T1234567890123')).toEqual(
        response
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/registration_code`,
        expect.objectContaining({
          method: 'put',
          payload: JSON.stringify({
            registration_code: 'T1234567890123',
          }),
          contentType: 'application/json',
        })
      );
    });

    it('registrationCode未指定だと、"registrationCode is required."エラー', () => {
      expect(() => officeService.updateRegistrationCode('')).toThrow(
        'registrationCode is required.'
      );
    });
  });

  describe('deleteRegistrationCode', () => {
    it('呼び出すと、trueを返し、DELETEリクエストを送信する', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(officeService.deleteRegistrationCode()).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/registration_code`,
        expect.objectContaining({ method: 'delete' })
      );
    });
  });
});
