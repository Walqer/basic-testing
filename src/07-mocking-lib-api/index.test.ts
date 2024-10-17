import axios, { AxiosResponse } from 'axios';
import { throttledGetDataFromApi } from './index';

export const mockedResponse = {
  userId: 1,
  id: 1,
  title: 'delectus aut autem',
  completed: false,
};
jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));
describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.create = jest.fn(() => axios);
    (axios.get as jest.Mock).mockImplementation(() =>
      Promise.resolve({ data: mockedResponse } as AxiosResponse<
        typeof mockedResponse
      >),
    );
  });
  const relativePath = '/todos/1';
  test('should create instance with provided base url', async () => {
    throttledGetDataFromApi(relativePath);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    throttledGetDataFromApi(relativePath);
    expect(axios.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const response = throttledGetDataFromApi(relativePath);
    expect(response).resolves.toEqual(mockedResponse);
  });
});
