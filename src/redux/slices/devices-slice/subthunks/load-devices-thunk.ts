import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { DeviceServiceEnum } from '../../../../@types/enums';
import { DEVICES } from '../../../../api/end-points';
import { fetchAllQuery } from '../../../../api/queries';


export const loadDevicesThunk = createAsyncThunk<
  Array<DeviceState>,
  BackendSettings
>('devices/loadDevicesThunk', async (backendSettings, thunkApi) => {
  let machines: Array<DeviceEntity> = [];
  let error: AxiosError | undefined = undefined;
  await fetchAllQuery<DeviceEntity>(
    backendSettings,
    DEVICES,
    '?requireTotalCount=true&sort=[{"selector":"number","desc":false}]',
  )
    .then((res) => {
      machines = res.data;
    })
    .catch((err: AxiosError) => {
      error = err;
    });
  if (error) return thunkApi.rejectWithValue(error);
  //Define devices
  const devices: Array<DeviceState> = [];
  machines.forEach((machine) => {
    devices.push({
      number: machine.number,
      ipAddress: machine.ip,
      devicePassword: machine.devicePassword,
      isTurnedOn: false,
      speechRecognizingEnabled: machine.speechRecognizingEnabled,
      recordingService: {
        establishingConnection: false,
        callId: null,
        serviceName: DeviceServiceEnum.SRVC_RECORDING,
        isAvailable: false,
        isProcessing: false,
        port: machine.recordingServicePort,
        startTime: null,
        personData: null,
        relative: null,
        contact: null,
        videoPath: machine.recordingServiceVideoPath,
        socket: null,
        isRecordProcessingStarting: false,
      },
      recognitionService: {
        establishingConnection: false,
        serviceName: DeviceServiceEnum.SRVC_SPEECH_RECOGNITION,
        isAvailable: false,
        isProcessing: false,
        port: machine.speechRecognitionServicePort,
        socket: null,
      },
      services: [
        {
          establishingConnection: false,
          serviceName: DeviceServiceEnum.SRVC_AUDIO_STREAMING,
          isAvailable: false,
          isProcessing: false,
          port: machine.audioStreamingServicePort,
          socket: null,
        },
        {
          establishingConnection: false,
          serviceName: DeviceServiceEnum.SRVC_SPEECH_RECEIVING,
          isAvailable: false,
          isProcessing: false,
          port: machine.speechStreamingServicePort,
          socket: null,
        },
        {
          establishingConnection: false,
          serviceName: DeviceServiceEnum.SRVC_UI_CONTROLLING,
          isAvailable: false,
          isProcessing: false,
          port: machine.uiControllingServicePort,
          socket: null,
        },
        {
          establishingConnection: false,
          serviceName: DeviceServiceEnum.SRVC_POWER_MANAGEMENT,
          isAvailable: false,
          isProcessing: false,
          port: machine.powerManagementServicePort,
          socket: null,
        },
      ],
      vncService: {
        address: '127.0.0.1',
        port: machine.vncServicePort,
        username: machine.vncUsername,
        password: machine.vncPassword,
        viewOnly: machine.vncViewOnly,
      },
      personDataAutocompleteField: { open: false, loading: false },
      relativeValueAutocompleteField: { open: false, loading: false },
      contactValueAutocompleteField: {
        open: false,
        loading: false,
        disabled: false,
      },
      doCallButtonDisabled: true,
      cancelCallButtonDisabled: true,
      reloadButtonDisabled: false,
      commitSessionButtonDisabled: false,
      doCallButtonLoading: false,
      cancelCallButtonLoading: false,
      commitSessionButtonLoading: false,
      availableSessions: [],
      audioRetranslationSocketConnected: false,
      speechRetranslationSocketConnected: false,
    });
  });

  return devices;
});
