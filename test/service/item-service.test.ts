import { ItemService } from '../../src/service/item-service';
import {
  itemFactory,
  itemsResponseFactory,
  itemReqBodyFactory,
} from '../factories';
import { stubUrlFetchJson, stubUrlFetchEmpty } from '../helpers/gas-mock';

const ACCESS_TOKEN = 'test_access_token';
const BASE_URL = 'https://invoice.moneyforward.com/api/v3/items';

describe('ItemService', () => {
  let itemService: ItemService;

  beforeEach(() => {
    vi.clearAllMocks();
    itemService = new ItemService(ACCESS_TOKEN);
  });

  describe('getItems', () => {
    it('引数を指定しないと、品目一覧を返し、デフォルト値でリクエストを送信する', () => {
      const response = itemsResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      expect(itemService.getItems()).toEqual(response);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=1&per_page=100`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('page/perPageを指定すると、クエリに反映したリクエストを送信する', () => {
      const response = itemsResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      itemService.getItems(2, 50);

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=2&per_page=50`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('name/codeを指定すると、クエリに反映したリクエストを送信する', () => {
      const response = itemsResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      itemService.getItems(1, 100, '商品A', 'CODE-1');

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=1&per_page=100&name=${encodeURIComponent(
          '商品A'
        )}&code=CODE-1`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('name/codeを指定しないと、クエリに付与されない', () => {
      const response = itemsResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      itemService.getItems();

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=1&per_page=100`,
        expect.objectContaining({ method: 'get' })
      );
    });
  });

  describe('createNew', () => {
    it('itemReqBodyを指定すると、作成した品目を返し、POSTリクエストを送信する', () => {
      const item = itemFactory.build();
      const reqBody = itemReqBodyFactory.build();
      const fetchMock = stubUrlFetchJson(item);

      expect(itemService.createNew(reqBody)).toEqual(item);
      expect(fetchMock).toHaveBeenCalledWith(
        BASE_URL,
        expect.objectContaining({
          method: 'post',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });

    it('itemReqBody未指定だと、"itemReqBody is required."エラー', () => {
      expect(() =>
        itemService.createNew(undefined as unknown as MfInvoiceApi.ItemReqBody)
      ).toThrow('itemReqBody is required.');
    });
  });

  describe('getItem', () => {
    it('itemIdを指定すると、該当する品目を返す', () => {
      const item = itemFactory.build({ id: 'item_1' });
      const fetchMock = stubUrlFetchJson(item);

      expect(itemService.getItem('item_1')).toEqual(item);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/item_1`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('itemId未指定だと、"itemId is required."エラー', () => {
      expect(() => itemService.getItem('')).toThrow('itemId is required.');
    });
  });

  describe('deleteItem', () => {
    it('itemIdを指定すると、trueを返し、DELETEリクエストを送信する', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(itemService.deleteItem('item_1')).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/item_1`,
        expect.objectContaining({ method: 'delete' })
      );
    });

    it('itemId未指定だと、"itemId is required."エラー', () => {
      expect(() => itemService.deleteItem('')).toThrow('itemId is required.');
    });
  });

  describe('updateItem', () => {
    it('itemIdとitemReqBodyを指定すると、更新後の品目を返し、PUTリクエストを送信する', () => {
      const item = itemFactory.build({ id: 'item_1' });
      const reqBody = itemReqBodyFactory.build();
      const fetchMock = stubUrlFetchJson(item);

      expect(itemService.updateItem('item_1', reqBody)).toEqual(item);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/item_1`,
        expect.objectContaining({
          method: 'put',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });

    it('itemIdまたはitemReqBodyが未指定だと、"itemId and itemReqBody are required."エラー', () => {
      const reqBody = itemReqBodyFactory.build();
      expect(() => itemService.updateItem('', reqBody)).toThrow(
        'itemId and itemReqBody are required.'
      );
      expect(() =>
        itemService.updateItem(
          'item_1',
          undefined as unknown as MfInvoiceApi.ItemReqBody
        )
      ).toThrow('itemId and itemReqBody are required.');
    });

    it('priceのみのような部分的なリクエストボディでも、PUTリクエストを送信する(部分更新可)', () => {
      const item = itemFactory.build({ id: 'item_1' });
      const reqBody: MfInvoiceApi.ItemUpdateReqBody = { price: 2000 };
      const fetchMock = stubUrlFetchJson(item);

      expect(itemService.updateItem('item_1', reqBody)).toEqual(item);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/item_1`,
        expect.objectContaining({
          method: 'put',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });
  });
});
