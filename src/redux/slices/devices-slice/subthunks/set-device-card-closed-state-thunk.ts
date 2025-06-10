import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setIsRecordingProcessing,
  setIsAudioStreamingProcessing,
} from '../devices-slice';
import { establishAudioStreamingServiceConnection } from '../connections/audio-streaming-connection-thunk';
import { establishPowerManagementServiceConnection } from '../connections/power-management-connection-thunk';
import { establishRecordingServiceConnection } from '../connections/recording-connection-thunk';
import { establishSpeechRecievingServiceConnection } from '../connections/speech_receiving-connection-thunk';
import { establishSpeechRecognizingConnection } from '../connections/speech_recognizing-connection-thunk';
import { establishUiControllingServiceConnection } from '../connections/ui-controlling-connection-thunk';
import { DeviceServiceEnum } from '../../../../@types/enums';

export const setDeviceCardClosedState = createAsyncThunk<
  void,
  {
    ipAddress: string;
    port: number;
    socket: WebSocket | null;
    serviceName: string;
    backendSettings: BackendSettings;
    markedWords?: Array<MarkedWordEntity>;
  }
>('devices/setDeviceCardClosedState', (args, thunkApi) => {
  if (args.serviceName == DeviceServiceEnum.SRVC_RECORDING) {
    thunkApi.dispatch(
      setIsRecordingProcessing({
        address: args.ipAddress,
        booleanResult: false,
      }),
    );
  }
  if (args.serviceName == DeviceServiceEnum.SRVC_AUDIO_STREAMING) {
    thunkApi.dispatch(
      setIsAudioStreamingProcessing({
        address: args.ipAddress,
        booleanResult: false,
        closeAll: false,
      }),
    );
  }
  // Reconnect
  setTimeout(() => {
    const connectionInfo = {
      connection: {
        ipAddress: args.ipAddress,
        port: args.port,
        socket: args.socket,
        serviceName: args.serviceName,
      },
      backendSettings: args.backendSettings,
      markedWords: args.markedWords,
    };
    switch (args.serviceName) {
      case DeviceServiceEnum.SRVC_AUDIO_STREAMING:
        thunkApi.dispatch(
          establishAudioStreamingServiceConnection(connectionInfo),
        );
        break;
      case DeviceServiceEnum.SRVC_POWER_MANAGEMENT:
        thunkApi.dispatch(
          establishPowerManagementServiceConnection(connectionInfo),
        );
        break;
      case DeviceServiceEnum.SRVC_RECORDING:
        thunkApi.dispatch(establishRecordingServiceConnection(connectionInfo));
        break;
      case DeviceServiceEnum.SRVC_SPEECH_RECEIVING:
        thunkApi.dispatch(
          establishSpeechRecievingServiceConnection(connectionInfo),
        );
        break;
      case DeviceServiceEnum.SRVC_SPEECH_RECOGNITION:
        thunkApi.dispatch(establishSpeechRecognizingConnection(connectionInfo));
        break;
      case DeviceServiceEnum.SRVC_UI_CONTROLLING:
        thunkApi.dispatch(
          establishUiControllingServiceConnection(connectionInfo),
        );
        break;

      default:
        break;
    }
  }, 15000);
});
