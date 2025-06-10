import axios, { AxiosError } from 'axios';
// import { LOCAL_HOST } from './constants';
import { convertMessagesArrayToString } from './api-util';
import { AUTH, IMAGE } from './end-points';
import {
  getTokenFromLocalStorage,
  setTokenToLocalStorage,
} from '../utils/jwt-utils';

/**
 * http://hostname:PORT/{point}
 * @param backendSettings - protocol, addres, port
 * @param point - entity entry point '/api/v1/point'
 * @param params - filter parameters
 * @returns - data of type {@type DataResponce<T>}
 */
export async function fetchAllQuery<T extends Entity | AuditionEntity>(
  backendSettings: BackendSettings,
  point: string,
  params?: string,
  withPlus?: boolean,
) {
  let uri = encodeURI(
    `${backendSettings.backendProtocol}://${backendSettings.backendAddress}:${backendSettings.backendPort}` +
      point +
      (params ? params : ''),
  );
  if (withPlus) uri = uri.replace('+', '%2B');
  return axios
    .get<DataResponce<T>>(uri, {
      headers: { Authorization: getTokenFromLocalStorage() },
    })
    .then((res) => {
      if (res.headers.authorization)
        setTokenToLocalStorage(res.headers.authorization);
      return res.data;
    })
    .catch((err: AxiosError) => {
      if (err.response?.headers.authorization)
        setTokenToLocalStorage(err.response?.headers.authorization);
      const errorData = (err.response?.data as ErrorWithMessage) || undefined;
      throw new Error(`${err.message} (${errorData?.messages})`);
    });
}

/**
 * http://hostname:PORT/{ponint}/{id}
 * @param backendSettings - protocol, addres, port
 * @param point - entity entry point
 * @param id - entity key
 * @returns - data of type {@type T extends Entity}
 */
export async function fetchOneQuery<T extends Entity | AuditionEntity>(
  backendSettings: BackendSettings,
  point: string,
  id: number,
) {
  return axios
    .get<T>(
      encodeURI(
        `${backendSettings.backendProtocol}://${backendSettings.backendAddress}:${backendSettings.backendPort}` +
          point +
          '/' +
          id,
      ),
      {
        headers: { Authorization: getTokenFromLocalStorage() },
      },
    )
    .then((res) => {
      setTokenToLocalStorage(res.headers.authorization || '');
      return res.data;
    })
    .catch((err: AxiosError) => {
      setTokenToLocalStorage(err.response?.headers.authorization || '');
      const errorData = (err.response?.data as ErrorWithMessage) || undefined;
      throw new Error(`${err.message} (${errorData?.messages})`);
    });
}

/**
 * http://hostname:PORT/{point}/?id={id}
 * @param backendSettings - protocol, addres, port
 * @param point - entity entry point
 * @param id - entity key
 * @returns boolean if error or entity key if done
 */
export async function deleteQuery(
  backendSettings: BackendSettings,
  point: string,
  id: number,
) {
  return axios
    .delete<number | boolean | ErrorWithMessage | void>(
      `${backendSettings.backendProtocol}://${backendSettings.backendAddress}:${backendSettings.backendPort}` +
        point +
        `?id=${id}`,
      { headers: { Authorization: getTokenFromLocalStorage() } },
    )
    .then((res) => {
      setTokenToLocalStorage(res.headers.authorization || '');
      if (res.status !== 200)
        throw convertMessagesArrayToString(res.data as ErrorWithMessage);
    })
    .catch((err: AxiosError) => {
      setTokenToLocalStorage(err.response?.headers.authorization || '');
      const errorData = (err.response?.data as ErrorWithMessage) || undefined;
      throw new Error(`${err.message} (${errorData?.messages})`);
    });
}

export async function insertQuery<T extends Entity | AuditionEntity>(
  backendSettings: BackendSettings,
  point: string,
  entity: T,
) {
  return axios
    .post<T | Violations | ErrorWithMessage>(
      `${backendSettings.backendProtocol}://${backendSettings.backendAddress}:${backendSettings.backendPort}` +
        point,
      entity,
      {
        headers: {
          Authorization: getTokenFromLocalStorage(),
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      setTokenToLocalStorage(res.headers.authorization || '');
      if (res.status === 200 || res.status === 203) return res;
      else throw convertMessagesArrayToString(res.data as ErrorWithMessage);
    })
    .catch((err: AxiosError) => {
      setTokenToLocalStorage(err.response?.headers.authorization || '');
      const errorData = (err.response?.data as ErrorWithMessage) || undefined;
      throw new Error(`${err.message} (${errorData?.messages})`);
    });
}

export async function updateQuery<T extends Entity | AuditionEntity>(
  backendSettings: BackendSettings,
  point: string,
  entity: T,
) {
  return axios
    .put<T | Violations | ErrorWithMessage>(
      `${backendSettings.backendProtocol}://${backendSettings.backendAddress}:${backendSettings.backendPort}` +
        point,
      entity,
      {
        headers: {
          Authorization: getTokenFromLocalStorage(),
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      setTokenToLocalStorage(res.headers.authorization || '');
      if (res.status === 200 || res.status === 203) return res;
      else {
        const error = res.data as ErrorWithMessage;
        throw convertMessagesArrayToString(error);
      }
    })
    .catch((err: AxiosError) => {
      setTokenToLocalStorage(err.response?.headers.authorization || '');
      const errorData = (err.response?.data as ErrorWithMessage) || undefined;
      throw new Error(`${err.message} (${errorData?.messages})`);
    });
}

/**
 * Метод отправки данных пользователя для авторизации.
 * @param username - user name
 * @param password - user password
 * @returns - данные пользователя после регистрации или ошибку
 */
export async function signInQuery(
  backendSettings: BackendSettings,
  { username, password }: Credentials,
) {
  return axios.post<UserDataResponce | ErrorWithMessage>(
    `${backendSettings.backendProtocol}://${backendSettings.backendAddress}:${backendSettings.backendPort}` +
      AUTH +
      '/authenticate',
    {
      username,
      password,
    },
  );
}

/**
 * Метод отправки данных пользователя для авторизации через токен.
 * @param token - токен пользователя
 * @returns - данные пользователя после регистрации или ошибку
 */
export async function refreshTokenQuery(
  backendSettings: BackendSettings,
  token: string,
) {
  return axios.post<UserDataResponce | ErrorWithMessage>(
    `${backendSettings.backendProtocol}://${backendSettings.backendAddress}:${backendSettings.backendPort}` +
      AUTH +
      '/refresh',
    token,
  );
}

export async function fetchImage(
  backendSettings: BackendSettings,
  point: string,
  id: number,
) {
  return axios
    .get<Blob>(
      encodeURI(
        `${backendSettings.backendProtocol}://${backendSettings.backendAddress}:${backendSettings.backendPort}${point}/${id}${IMAGE}`,
      ),
      {
        responseType: 'blob',
        headers: {
          Authorization: getTokenFromLocalStorage(),
        },
      },
    )
    .then((res) => {
      setTokenToLocalStorage(res.headers.authorization || '');
      if (res.status !== 200) {
        return undefined;
      }
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

/**
 * Delete image
 * @param point rntry point
 * @param id entity id
 * @returns boolean result. true if deleting was successful. false if it wasn't.
 */
export async function deleteImage(
  backendSettings: BackendSettings,
  point: string,
  id: number,
) {
  return axios
    .delete<boolean>(
      encodeURI(
        `${backendSettings.backendProtocol}://${backendSettings.backendAddress}:${backendSettings.backendPort}${point}/${id}${IMAGE}`,
      ),
      {
        headers: {
          Authorization: getTokenFromLocalStorage(),
        },
      },
    )
    .then((res) => {
      setTokenToLocalStorage(res.headers.authorization || '');
      return res.data;
    })
    .catch((err: Error) => {
      throw err;
    });
}

export async function uploadImage(
  backendSettings: BackendSettings,
  point: string,
  id: number,
  formData: FormData,
) {
  return await axios
    .post<ArrayBuffer>(
      encodeURI(
        `${backendSettings.backendProtocol}://${backendSettings.backendAddress}:${backendSettings.backendPort}${point}/${id}${IMAGE}`,
      ),
      formData,
      {
        responseType: 'arraybuffer',
        headers: {
          Authorization: getTokenFromLocalStorage(),
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    .then((res) => {
      setTokenToLocalStorage(res.headers.authorization || '');
      if (res.status !== 200) {
        const error = JSON.parse(
          new TextDecoder('utf-8').decode(res.data as ArrayBuffer),
        ) as ErrorWithMessage;
        throw new Error(convertMessagesArrayToString(error));
      }
      return res.data as ArrayBuffer;
    })
    .catch((err) => {
      throw err;
    });
}
