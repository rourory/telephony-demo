import { createAsyncThunk } from '@reduxjs/toolkit';
import { DeviceServiceEnum } from '../../../../@types/enums';
import {
  setIsServiceAvailable,
  setEstablishingConnection,
} from '.././devices-slice';
import { setDeviceCardClosedState } from '../subthunks/set-device-card-closed-state-thunk';
import { addNotification } from '../../notify-slice/notify-slice';
import { setDeviceCardNotReadyToCallState } from '../subthunks/set-device-card-not-ready-for-call-state';

export const establishPowerManagementServiceConnection = createAsyncThunk<
  ServiceSocketConnection,
  {
    connection: ServiceSocketConnection;
    backendSettings: BackendSettings;
    markedWords?: Array<MarkedWordEntity>;
  }
>(
  'devices/establishPowerManagementServiceConnection',
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
          serviceName: DeviceServiceEnum.SRVC_POWER_MANAGEMENT,
        }),
      );
    };
    connection.socket.onclose = () => {
      {
        thunkApi.dispatch(
          setIsServiceAvailable({
            ipAddress: connection.ipAddress,
            port: connection.port,
            isAvailable: false,
          }),
        );
      }
      thunkApi.dispatch(
        setDeviceCardClosedState({
          ipAddress: connection.ipAddress,
          port: connection.port,
          serviceName: DeviceServiceEnum.SRVC_POWER_MANAGEMENT,
          socket: connection.socket,
          backendSettings: backendSettings,
          markedWords: markedWords,
        }),
      );
    };
    connection.socket.onmessage = (ev) => {
      thunkApi.dispatch(addNotification({ type: 'warning', message: ev.data }));
      thunkApi.dispatch(
        setDeviceCardNotReadyToCallState({
          ipAddress: connection.ipAddress,
        }),
      );
    };
    return {
      socket: connection.socket,
      ipAddress: connection.ipAddress,
      port: connection.port,
      serviceName: DeviceServiceEnum.SRVC_POWER_MANAGEMENT,
    };
  },
);
