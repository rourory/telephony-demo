import { createAsyncThunk } from '@reduxjs/toolkit';
import { playAudio } from '.././audio';
import { DeviceServiceEnum, SoundTypeEnum } from '../../../../@types/enums';
import {
  setIsServiceAvailable,
  setEstablishingConnection,
} from '.././devices-slice';
import { setDeviceCardClosedState } from '.././subthunks/set-device-card-closed-state-thunk';

export const establishAudioStreamingServiceConnection = createAsyncThunk<
  ServiceSocketConnection,
  {
    connection: ServiceSocketConnection;
    backendSettings: BackendSettings;
    markedWords?: Array<MarkedWordEntity>;
  }
>(
  'devices/establishAudioStreamingServiceConnection',
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
          serviceName: DeviceServiceEnum.SRVC_AUDIO_STREAMING,
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
          serviceName: DeviceServiceEnum.SRVC_AUDIO_STREAMING,
          socket: connection.socket,
          backendSettings: backendSettings,
          markedWords: markedWords,
        }),
      );
    };
    // socket.onerror = () => {
    // };
    connection.socket.onmessage = async (ev) => {
      const arrayBuffer: ArrayBuffer = await ev.data.arrayBuffer();
      // The first value of the array is an information about what kind of sound data we've received
      const soundType = new Uint8Array(arrayBuffer.slice(0, 1)).at(0) || 0;
      // The rest bytes are mp3 header and data
      const data = arrayBuffer.slice(1, arrayBuffer.byteLength);
      playAudio(
        data,
        data.byteLength > 0
          ? soundType
          : Number.parseInt(SoundTypeEnum.SILENCE),
      );
    };
    return {
      socket: connection.socket,
      ipAddress: connection.ipAddress,
      port: connection.port,
      serviceName: DeviceServiceEnum.SRVC_AUDIO_STREAMING,
    };
  },
);
