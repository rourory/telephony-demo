import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setAudioRetranslationSocketConnectedState,
  setEstablishingConnection,
  setIsServiceAvailable,
  setSpeechRetranslationSocketConnectedState,
} from '../devices-slice';
import { setDeviceCardClosedState } from '../subthunks/set-device-card-closed-state-thunk';
import { putMarkedWordInRecognizedSpeech } from '../../recognized-speech-slice.ts/recognized-speech-slice';
import { DeviceServiceEnum, SoundTypeEnum } from '../../../../@types/enums';
import { CALLS, RECOGNIZED_SPEECH } from '../../../../api/end-points';
import { fetchOneQuery, insertQuery } from '../../../../api/queries';
import { findMarkedWord } from '../../../../utils/find-marked-word';

export const establishSpeechRecognizingConnection = createAsyncThunk<
  ServiceSocketConnection,
  {
    connection: ServiceSocketConnection;
    backendSettings: BackendSettings;
    markedWords?: Array<MarkedWordEntity>;
  }
>(
  'devices/establishSpeechRecognizingConnection',
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
          serviceName: DeviceServiceEnum.SRVC_SPEECH_RECOGNITION,
        }),
      );
      thunkApi.dispatch(
        setIsServiceAvailable({
          ipAddress: connection.ipAddress,
          port: connection.port,
          isAvailable: true,
          serviceName: DeviceServiceEnum.SRVC_SPEECH_RECOGNITION,
        }),
      );
      thunkApi.dispatch(
        setAudioRetranslationSocketConnectedState({
          address: connection.ipAddress,
          connected: true,
        }),
      );
      thunkApi.dispatch(
        setSpeechRetranslationSocketConnectedState({
          address: connection.ipAddress,
          connected: true,
        }),
      );
    };
    connection.socket.onclose = () => {
      thunkApi.dispatch(
        setAudioRetranslationSocketConnectedState({
          address: connection.ipAddress,
          connected: false,
        }),
      );
      thunkApi.dispatch(
        setSpeechRetranslationSocketConnectedState({
          address: connection.ipAddress,
          connected: false,
        }),
      );
      thunkApi.dispatch(
        setIsServiceAvailable({
          ipAddress: connection.ipAddress,
          port: connection.port,
          isAvailable: false,
          serviceName: DeviceServiceEnum.SRVC_SPEECH_RECOGNITION,
        }),
      );

      thunkApi.dispatch(
        setDeviceCardClosedState({
          ipAddress: connection.ipAddress,
          port: connection.port,
          serviceName: DeviceServiceEnum.SRVC_SPEECH_RECOGNITION,
          socket: connection.socket,
          backendSettings: backendSettings,
          markedWords: markedWords,
        }),
      );
    };
    // socket.onerror = () => {
    // };
    connection.socket.onmessage = async (ev) => {
      const audioChunkMessage = JSON.parse(ev.data) as AudioChunkMessage;
      const recognizedSpeech: ReconizedSpeechEntity = {
        convictedId: 0,
        callId: Number.parseInt(audioChunkMessage.CallId),
        relativeSaid:
          audioChunkMessage.SoundType == SoundTypeEnum.AUDIO_TYPE
            ? audioChunkMessage.RecognizedText
            : '',
        convictedSaid:
          audioChunkMessage.SoundType == SoundTypeEnum.SPEECH_TYPE
            ? audioChunkMessage.RecognizedText
            : '',
      };
      if (markedWords) {
        const foundWords = findMarkedWord(
          audioChunkMessage.RecognizedText,
          markedWords,
        );
        if (foundWords.length > 0) {
          thunkApi.dispatch(
            putMarkedWordInRecognizedSpeech({
              deviceAddress: connection.ipAddress,
              recognized: {
                text: audioChunkMessage.RecognizedText,
                recognizedWord: foundWords[0].word,
              },
            }),
          );
        }
      }

      fetchOneQuery<CallEntity>(backendSettings, CALLS, recognizedSpeech.callId)
        .then((res) => {
          if (res) {
            recognizedSpeech.convictedId = res.convictedId;
            insertQuery(
              backendSettings,
              RECOGNIZED_SPEECH,
              recognizedSpeech,
            ).catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    };
    return {
      socket: connection.socket,
      ipAddress: connection.ipAddress,
      port: connection.port,
      serviceName: DeviceServiceEnum.SRVC_SPEECH_RECOGNITION,
    };
  },
);
