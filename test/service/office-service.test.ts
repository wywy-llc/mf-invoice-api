import { OfficeService } from '../../src/service/office-service';
import { officeFactory } from '../factories';
import { stubUrlFetchJson } from '../helpers/gas-mock';

const ACCESS_TOKEN = 'test_access_token';
const BASE_URL = 'https://invoice.moneyforward.com/api/v3/office';

describe('OfficeService', () => {
  let officeService: OfficeService;

  beforeEach(() => {
    vi.clearAllMocks();
    officeService = new OfficeService(() => ACCESS_TOKEN);
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
});
