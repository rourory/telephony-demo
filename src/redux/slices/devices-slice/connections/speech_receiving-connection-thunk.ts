import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setEstablishingConnection,
  setIsServiceAvailable,
} from '../devices-slice';
import { setDeviceCardClosedState } from '../subthunks/set-device-card-closed-state-thunk';
import { DeviceServiceEnum } from '../../../../@types/enums';

export const establishSpeechRecievingServiceConnection = createAsyncThunk<
  ServiceSocketConnection,
  {
    connection: ServiceSocketConnection;
    backendSettings: BackendSettings;
    markedWords?: Array<MarkedWordEntity>;
  }
>(
  'devices/establishSpeechRecievingServiceConnection',
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
          serviceName: DeviceServiceEnum.SRVC_SPEECH_RECEIVING,
        }),
      );
      // window.electron.ipcRenderer.removeAllListeners(
      //   `audio.recording.${connection.ipAddress}`,
      // );
      // window.electron.ipcRenderer.on(
      //   `audio.recording.${connection.ipAddress}`,
      //   (args: Buffer) => connection.socket?.send(args.buffer),
      // );
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
          serviceName: DeviceServiceEnum.SRVC_SPEECH_RECEIVING,
          socket: connection.socket,
          backendSettings: backendSettings,
          markedWords: markedWords,
        }),
      );
    };
    // socket.onerror = () => {
    // };
    // connection.socket.onmessage = async (ev) => {
    // };
    return {
      socket: connection.socket,
      ipAddress: connection.ipAddress,
      port: connection.port,
      serviceName: DeviceServiceEnum.SRVC_SPEECH_RECEIVING,
    };
  },
);
