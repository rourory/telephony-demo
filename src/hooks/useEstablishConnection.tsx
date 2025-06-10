import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeviceServiceEnum } from '../@types/enums';
import { appSettingsStateSelector } from '../redux/slices/app-settings-slice/app-settings-slice';
import { establishAudioStreamingServiceConnection } from '../redux/slices/devices-slice/connections/audio-streaming-connection-thunk';
import { establishPowerManagementServiceConnection } from '../redux/slices/devices-slice/connections/power-management-connection-thunk';
import { establishRecordingServiceConnection } from '../redux/slices/devices-slice/connections/recording-connection-thunk';
import { establishSpeechRecievingServiceConnection } from '../redux/slices/devices-slice/connections/speech_receiving-connection-thunk';
import { establishSpeechRecognizingConnection } from '../redux/slices/devices-slice/connections/speech_recognizing-connection-thunk';
import { establishUiControllingServiceConnection } from '../redux/slices/devices-slice/connections/ui-controlling-connection-thunk';
import { setEstablishingConnection } from '../redux/slices/devices-slice/devices-slice';
import { AppDispatch } from '../redux/store';


export const useEstablishConeection = (
  device: DeviceState,
  markedWords: Array<MarkedWordEntity>,
) => {
  const dispatch = useDispatch<AppDispatch>();
  const backendSettings = useSelector(appSettingsStateSelector);

  React.useEffect(() => {
    // Every time when device becomes turned on/off
    if (device.isTurnedOn == true) {
      //SpeechRecognition service
      if (
        device.recognitionService.isAvailable == false &&
        device.speechRecognizingEnabled &&
        device.recognitionService.establishingConnection == false
      ) {
        dispatch(
          setEstablishingConnection({
            address: device.ipAddress,
            booleanResult: true,
            serviceName: DeviceServiceEnum.SRVC_SPEECH_RECOGNITION,
          }),
        );
        dispatch(
          establishSpeechRecognizingConnection({
            connection: {
              ipAddress: device.ipAddress,
              port: device.recognitionService.port,
              socket: device.recognitionService.socket,
              serviceName: device.recognitionService.serviceName,
            },
            backendSettings,
            markedWords: markedWords,
          }),
        );
      }
      //Recorging service
      if (
        device.recordingService.isAvailable == false &&
        device.recordingService.establishingConnection == false
      ) {
        dispatch(
          setEstablishingConnection({
            address: device.ipAddress,
            booleanResult: true,
            serviceName: DeviceServiceEnum.SRVC_RECORDING,
          }),
        );
        dispatch(
          establishRecordingServiceConnection({
            connection: {
              ipAddress: device.ipAddress,
              port: device.recordingService.port,
              socket: device.recordingService.socket,
              serviceName: device.recordingService.serviceName,
            },
            backendSettings,
          }),
        );
      }
      // Establish connection to other services of each device
      device.services.forEach((service) => {
        if (
          service.isAvailable == false &&
          service.establishingConnection == false
        ) {
          dispatch(
            setEstablishingConnection({
              address: device.ipAddress,
              booleanResult: true,
              serviceName: service.serviceName as DeviceServiceEnum,
            }),
          );
          const connectionInfo = {
            connection: {
              ipAddress: device.ipAddress,
              port: service.port,
              socket: service.socket,
              serviceName: service.serviceName,
            },
            backendSettings: backendSettings,
          };
          switch (service.serviceName) {
            case DeviceServiceEnum.SRVC_AUDIO_STREAMING:
              dispatch(
                establishAudioStreamingServiceConnection(connectionInfo),
              );
              break;
            case DeviceServiceEnum.SRVC_POWER_MANAGEMENT:
              dispatch(
                establishPowerManagementServiceConnection(connectionInfo),
              );
              break;
            case DeviceServiceEnum.SRVC_SPEECH_RECEIVING:
              dispatch(
                establishSpeechRecievingServiceConnection(connectionInfo),
              );
              break;
            case DeviceServiceEnum.SRVC_UI_CONTROLLING:
              dispatch(establishUiControllingServiceConnection(connectionInfo));
              break;

            default:
              break;
          }
        }
      });
    }
  }, [device.isTurnedOn]);
};
