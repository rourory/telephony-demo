import { createAsyncThunk } from "@reduxjs/toolkit";
import { setTokenToLocalStorage } from "../../../utils/jwt-utils";
import {
  fetchAllQuery,
  refreshTokenQuery,
  signInQuery,
} from "../../../api/queries";
import { AxiosError } from "axios";
import { addNotification } from "../notify-slice/notify-slice";
import { convertMessagesArrayToString } from "../../../api/api-util";
import {
  setUserAutocompleteFieldFetchingStatus,
  setUserToAutocompleteField,
} from "./user-slice";
import { AUTH_USERS, PERMISSIONS } from "../../../api/end-points";
import { loadServerSettingsThunk } from "../server-settings-slice/thunks";

/**
 * Sign in with {@link Credentials}. You can see result in signInSlice function at user slice.
 */
export const signIn = createAsyncThunk<
  UserDataResponce,
  { credentials: Credentials; backendSettings: BackendSettings }
>("user/signIn", async ({ credentials, backendSettings }, thunkApi) => {
  let status = 0;
  let response: any = undefined;

  await signInQuery(backendSettings, credentials)
    .then((res) => {
      status = res.status;
      if (status === 403) {
        const forbiddenMessage = "Доступ запрещен";
        thunkApi.dispatch(
          addNotification({ type: "error", message: forbiddenMessage })
        );
        throw new AxiosError(forbiddenMessage, status.toString());
      } else if (status !== 200) {
        response = res.data as ErrorWithMessage;
        thunkApi.dispatch(
          addNotification({
            type: "error",
            message: convertMessagesArrayToString(response),
          })
        );
      } else {
        const data = res.data as UserDataResponce;
        setTokenToLocalStorage(data.token);
        thunkApi.dispatch(setUserToAutocompleteField(null));
        thunkApi.dispatch(
          loadPermissions({
            roleId: data.user.roleId,
            backendSettings: backendSettings,
          })
        );
        thunkApi.dispatch(loadServerSettingsThunk(backendSettings));
        response = res.data;
      }
    })
    .catch((err: AxiosError) => {
      const messages: string[] = [];
      if (err.response) {
        const convertedMessage = convertMessagesArrayToString(
          err.response.data as ErrorWithMessage
        );
        if (convertedMessage.includes("Bad credentials"))
          messages.push("Неверный логин или пароль");
        else messages.push(convertedMessage);
      }

      if (err.code === "ERR_NETWORK")
        messages.push("Ошибка соединения с сервером");
      else messages.push(err.message);
      response = { messages: messages };
      thunkApi.dispatch(
        addNotification({
          type: "error",
          message: convertMessagesArrayToString(response),
        })
      );
    });

  if (status !== 200) {
    return thunkApi.rejectWithValue(response);
  } else {
    return response;
  }
});

/**
 * Refreshes an old token. You can see result in signInSlice function at user slice.
 */
export const refreshToken = createAsyncThunk<
  UserDataResponce,
  { token: string; backendSettings: BackendSettings }
>("user/refreshToken", async ({ token, backendSettings }, thunkApi) => {
  let status = 0;
  let response: any = undefined;

  await refreshTokenQuery(backendSettings, token)
    .then((res) => {
      status = res.status;

      if (status === 403) {
        throw new AxiosError("Доступ запрещен", status.toString());
      } else if (status !== 200) {
        response = res.data as ErrorWithMessage;
      } else {
        const { token } = res.data as UserDataResponce;
        setTokenToLocalStorage(token);
        response = res.data;
      }
    })
    .catch((err: AxiosError) => {
      const messages: string[] = [];
      if (err.code === "ERR_NETWORK")
        messages.push("Ошибка соединения с сервером");
      else messages.push(err.message);
      response = { messages: messages };
    });

  if (status !== 200) {
    return thunkApi.rejectWithValue(response);
  } else {
    return response;
  }
});

export const loadNotArchivedAdministrationDataThunk = createAsyncThunk<
  {
    data: Array<AdministrationEntity>;
  },
  BackendSettings
>("user/loadAdministrationDataThunk", async (backendSettings, thunkApi) => {
  thunkApi.dispatch(setUserAutocompleteFieldFetchingStatus("LOADING"));
  let userData: Array<AdministrationEntity> = [];
  await fetchAllQuery<AdministrationEntity>(
    backendSettings,
    AUTH_USERS,
    `?archived=false`
  )
    .then((res) => {
      userData = res.data;
    })
    .catch((err: Error) => {
      if (err.message.startsWith("Network Error")) {
        thunkApi.dispatch(
          addNotification({
            type: "warning",
            message: "Ошибка подключения к серверу. Проверьте подключение",
          })
        );
      } else {
        thunkApi.dispatch(
          addNotification({ type: "error", message: err.message })
        );
      }
      thunkApi.rejectWithValue(err);
    });
  userData = userData.sort((a, b) => (a.squadNumber > b.squadNumber ? 1 : -1));
  return { data: userData };
});

export const loadPermissions = createAsyncThunk<
  Array<UiPermissionEntity>,
  { roleId: number; backendSettings: BackendSettings }
>("user/loadPermissions", async ({ roleId, backendSettings }, thunkApi) => {
  let permissionsData: Array<UiPermissionEntity> = [];
  await fetchAllQuery<UiPermissionEntity>(
    backendSettings,
    PERMISSIONS,
    `?filter=["roleId","=",${roleId}]`
  )
    .then((res) => (permissionsData = res.data))
    .catch((err) =>
      thunkApi.dispatch(addNotification({ type: "error", message: err }))
    );
  return permissionsData;
});
