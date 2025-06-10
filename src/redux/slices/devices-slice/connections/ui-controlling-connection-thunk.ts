import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setEstablishingConnection,
  setIsServiceAvailable,
} from '../devices-slice';
import { setDeviceCardClosedState } from '../subthunks/set-device-card-closed-state-thunk';
import { addNotification } from '../../notify-slice/notify-slice';
import { setDeviceCardCallingState } from '../subthunks/set-device-card-calling-state';
import { setDeviceCardNotReadyToCallState } from '../subthunks/set-device-card-not-ready-for-call-state';
import { setDeviceCardReadyToCallState } from '../subthunks/set-device-card-ready-for-call-state-thunk';
import { DeviceServiceEnum, UIControllingServiceResponceCodes } from '../../../../@types/enums';
import { CALL_TRYINGS } from '../../../../api/end-points';
import { insertQuery } from '../../../../api/queries';

export const establishUiControllingServiceConnection = createAsyncThunk<
  ServiceSocketConnection,
  {
    connection: ServiceSocketConnection;
    backendSettings: BackendSettings;
    markedWords?: Array<MarkedWordEntity>;
  }
>(
  'devices/establishUiControllingServiceConnection',
  async ({ connection, backendSettings, markedWords }, thunkApi) => {
    connection.socket = new WebSocket(
      `ws://${connection.ipAddress}:${connection.port}`,
    );
    connection.socket.onopen = () => {
      thunkApi.dispatch(
        setIsServiceAvailable({
          ipAddress: connection.ipAddress,
          port: connection.port,
          isAvailable: true,
        }),
      );
      thunkApi.dispatch(
        setEstablishingConnection({
          address: connection.ipAddress,
          booleanResult: false,
          serviceName: DeviceServiceEnum.SRVC_UI_CONTROLLING,
        }),
      );
    };
    connection.socket.onclose = () => {
      thunkApi.dispatch(
        setIsServiceAvailable({
          ipAddress: connection.ipAddress,
          port: connection.port,
          isAvailable: false,
        }),
      );

      thunkApi.dispatch(
        setDeviceCardClosedState({
          ipAddress: connection.ipAddress,
          port: connection.port,
          serviceName: DeviceServiceEnum.SRVC_UI_CONTROLLING,
          socket: connection.socket,
          backendSettings: backendSettings,
          markedWords: markedWords,
        }),
      );
    };
    // socket.onerror = () => {
    // };
    connection.socket.onmessage = async (ev) => {
      const response = JSON.parse(ev.data) as UIControllingServiceResponce;
      switch (response.Code) {
        case UIControllingServiceResponceCodes.Error:
          thunkApi.dispatch(
            addNotification({ type: 'error', message: response.Message }),
          );
          thunkApi.dispatch(
            setDeviceCardNotReadyToCallState({
              ipAddress: connection.ipAddress,
            }),
          );
          break;
        case UIControllingServiceResponceCodes.UserFound:
          thunkApi.dispatch(
            addNotification({ type: 'success', message: response.Message }),
          );
          thunkApi.dispatch(
            setDeviceCardReadyToCallState({
              ipAddress: connection.ipAddress,
            }),
          );
          break;
        case UIControllingServiceResponceCodes.UserFoundButNotValid:
          thunkApi.dispatch(
            addNotification({ type: 'warning', message: response.Message }),
          );
          thunkApi.dispatch(
            setDeviceCardReadyToCallState({
              ipAddress: connection.ipAddress,
            }),
          );
          break;
        case UIControllingServiceResponceCodes.UserNotFound:
          thunkApi.dispatch(
            addNotification({ type: 'info', message: response.Message }),
          );
          thunkApi.dispatch(
            setDeviceCardNotReadyToCallState({
              ipAddress: connection.ipAddress,
            }),
          );
          break;
        case UIControllingServiceResponceCodes.NotLaunched:
          thunkApi.dispatch(
            addNotification({ type: 'warning', message: response.Message }),
          );
          thunkApi.dispatch(
            setDeviceCardNotReadyToCallState({
              ipAddress: connection.ipAddress,
            }),
          );
          break;
        case UIControllingServiceResponceCodes.CallSucceeded:
          thunkApi.dispatch(
            setDeviceCardCallingState({ ipAddress: connection.ipAddress }),
          );
          if (response.ContactId && response.CallId) {
            const callTrying: CallTryingEntity = {
              contactId: response.ContactId,
              callId: response.CallId,
              tryingDate: new Date(),
            };
            insertQuery(backendSettings, CALL_TRYINGS, callTrying)
              .then((res) =>
                thunkApi.dispatch(
                  addNotification({
                    type: 'success',
                    message: response.Message,
                  }),
                ),
              )
              .catch((err) =>
                thunkApi.dispatch(
                  addNotification({
                    type: 'warning',
                    message: `${response.Message} (${err})`,
                  }),
                ),
              );
          }
          break;
        case UIControllingServiceResponceCodes.CallNotSucceeded:
          thunkApi.dispatch(
            addNotification({ type: 'info', message: response.Message }),
          );
          thunkApi.dispatch(
            setDeviceCardReadyToCallState({
              ipAddress: connection.ipAddress,
            }),
          );
          break;
        case UIControllingServiceResponceCodes.CallFinished:
          thunkApi.dispatch(
            addNotification({ type: 'success', message: response.Message }),
          );
          thunkApi.dispatch(
            setDeviceCardReadyToCallState({
              ipAddress: connection.ipAddress,
            }),
          );
          break;
        default:
          break;
      }
    };
    return {
      socket: connection.socket,
      ipAddress: connection.ipAddress,
      port: connection.port,
      serviceName: DeviceServiceEnum.SRVC_UI_CONTROLLING,
    };
  },
);
