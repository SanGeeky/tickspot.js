import axios from 'axios';
import tickspot from '#src/index';
import responseFactory from '#test/v2/factories/responseFactory';
import userInfo from '#test/v2/fixture/client';
import successfulResponseData from '#test/v2/fixture/tasks/openedTasksFixture';
import authenticationErrorTests from '#test/v2/shared/authentication';
import {
  badResponseCallbackTests,
  validResponseCallbackTests,
} from '#test/v2/shared/responseCallback';
import wrongParamsTests from '#test/v2/shared/wrongParams';

jest.mock('axios');
const client = tickspot({ apiVersion: 2, ...userInfo });
const URL = `${client.baseURL}/projects/123/tasks.json`;

describe('#listOpenedTasks', () => {
  beforeEach(() => {
    axios.get.mockClear();
  });

  describe('when API call is successful', () => {
    const requestResponse = responseFactory({
      requestData: {},
      responseType: 'successful',
      responseData: successfulResponseData,
      URL,
    });

    beforeEach(() => {
      axios.get.mockResolvedValueOnce(requestResponse);
    });

    it('should return all opened tasks for the project', async () => {
      const response = await client.projects.listOpenedTasks(123);
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(response).toBe(requestResponse.data);
    });
  });

  authenticationErrorTests({
    requestToExecute: async () => {
      await client.projects.listOpenedTasks(123);
    },
    URL,
  });

  badResponseCallbackTests({
    requestToExecute: async () => {
      await client.projects.listOpenedTasks(123, {});
    },
  });

  validResponseCallbackTests({
    requestToExecute: async () => {
      const dataCallback = jest
        .fn()
        .mockImplementation((data) => ({ newStructure: { ...data } }));
      const response = await client.projects.listOpenedTasks(123, dataCallback);
      return [response, dataCallback];
    },
    responseData: successfulResponseData,
    URL,
  });

  wrongParamsTests({
    requestToExecute: async () => {
      await client.projects.listOpenedTasks();
    },
    URL,
    paramsList: ['projectId'],
    positionalParam: true,
  });
});