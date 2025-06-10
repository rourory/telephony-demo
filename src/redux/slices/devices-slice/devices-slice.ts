import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
  AudioServiceCommandProtocolEnum,
  DeviceServiceEnum,
  RecordingRequestCodes,
} from '../../../@types/enums';
import {
  recMic,
  restoreAudioStartTime,
  restoreSpeechStartTime,
  stopRec,
} from './audio';
import { AxiosError } from 'axios';
import { loadAvailableExtraCallPermissionsThunk } from './subthunks/load-available-extra-call-permissions-thunk';
import { loadContactByIdThunk } from './subthunks/load-contact-by-id-thunk';
import { loadContactTypeValuesThunk } from './subthunks/load-contact-type-values-thunk';
import { loadContactValuesThunk } from './subthunks/load-contact-values-thunk';
import { loadDevicesThunk } from './subthunks/load-devices-thunk';
import { loadPersonByIdThunk } from './subthunks/load-person-by-id-thunk';
import { loadPersonDataThunk } from './subthunks/load-person-data-thunk';
import { loadRelationTypeValuesThunk } from './subthunks/load-relation-type-values-thunk';
import { loadRelativeByIdThunk } from './subthunks/load-relative-by-id-thunk';
import { loadRelativeValuesThunk } from './subthunks/load-relative-values-thunk';
import { loadMarkedWordsThunk } from './subthunks/load-marked-words';
import { establishAudioStreamingServiceConnection } from './connections/audio-streaming-connection-thunk';
import { establishPowerManagementServiceConnection } from './connections/power-management-connection-thunk';
import { establishRecordingServiceConnection } from './connections/recording-connection-thunk';
import { establishSpeechRecievingServiceConnection } from './connections/speech_receiving-connection-thunk';
import { establishSpeechRecognizingConnection } from './connections/speech_recognizing-connection-thunk';
import { establishUiControllingServiceConnection } from './connections/ui-controlling-connection-thunk';

const initialState: DevicesSliceType = {
  fetching: 'LOADING',
  devices: [],
  personDataOptions: [],
  personDataOptionsLoadedAt: undefined,
  relativeValueOptions: [],
  contactValueOptions: [],
  contactTypeValueOptions: [],
  relationTypeValueOptions: [],
  markedWords: undefined,
};

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    // _______________________ Common reducers _______________________
    // _______________________________________________________________
    setEstablishingConnection(
      state,
      action: PayloadAction<
        BooleanResultType & { serviceName: DeviceServiceEnum }
      >,
    ) {
      const index = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      const device = state.devices[index];
      if (action.payload.serviceName == DeviceServiceEnum.SRVC_RECORDING) {
        device.recordingService.establishingConnection =
          action.payload.booleanResult;
      } else if (
        action.payload.serviceName == DeviceServiceEnum.SRVC_SPEECH_RECOGNITION
      ) {
        device.recognitionService.establishingConnection =
          action.payload.booleanResult;
      } else {
        const service = device.services.find(
          (service) => service.serviceName == action.payload.serviceName,
        );
        if (service) {
          service.establishingConnection = action.payload.booleanResult;
        }
      }
    },
    setIsAlive(state, action: PayloadAction<BooleanResultType>) {
      const index = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      const device = state.devices[index];
      device.isTurnedOn = action.payload.booleanResult;
      state.devices.splice(index, 1, device);
    },
    setIsServiceAvailable(
      state,
      action: PayloadAction<{
        ipAddress: string;
        port: number;
        isAvailable: boolean;
        serviceName?: DeviceServiceEnum;
      }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      const srvcIndex = state.devices[deviceIndex].services.findIndex(
        (srvc) => srvc.port == action.payload.port,
      );
      if (srvcIndex >= 0) {
        state.devices[deviceIndex].services[srvcIndex].isAvailable =
          action.payload.isAvailable;
      } else {
        if (action.payload.serviceName == DeviceServiceEnum.SRVC_RECORDING) {
          state.devices[deviceIndex].recordingService.isAvailable =
            action.payload.isAvailable;
        } else if (
          action.payload.serviceName ==
          DeviceServiceEnum.SRVC_SPEECH_RECOGNITION
        ) {
          state.devices[deviceIndex].recognitionService.isAvailable =
            action.payload.isAvailable;
        }
      }
    },
    // _______________________ Rocignition service reducers _______________________
    // __________________________________________________________________________
    setIsRecognitionProcessing(
      state,
      action: PayloadAction<BooleanResultType>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].recognitionService.isProcessing =
        action.payload.booleanResult;
    },
    // _______________________ Recording service reducers _______________________
    // __________________________________________________________________________
    setIsRecordProcessingStarting(
      state,
      action: PayloadAction<BooleanResultType>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].recordingService.isRecordProcessingStarting =
        action.payload.booleanResult;
    },
    setIsRecordingProcessing(state, action: PayloadAction<BooleanResultType>) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].recordingService.isProcessing =
        action.payload.booleanResult;
    },
    // Set call id after inserting into DB
    setCallId(
      state,
      action: PayloadAction<{ ipAddress: string; id: number | null }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].recordingService.callId = action.payload.id;
      if (action.payload.id)
        state.devices[deviceIndex].recordingService.socket?.send(
          JSON.stringify({
            code: RecordingRequestCodes.SET_CALL_ID,
            settings: { callId: action.payload.id },
          }),
        );
    },
    setCurrentCallDuration(
      state,
      action: PayloadAction<{ ipAddress: string; duration?: number }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].currentCallDuration = action.payload.duration;
    },
    // Set person data in device's autocomplete field
    setPersonData(
      state,
      action: PayloadAction<{
        ipAddress: string;
        personData: PersonEntity | null;
      }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].recordingService.personData =
        action.payload.personData;
    },
    // Set contact value in device's autocomplete field
    setContactValue(
      state,
      action: PayloadAction<{
        ipAddress: string;
        contactValue: ContactEntity | null;
      }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].recordingService.contact =
        action.payload.contactValue;
      if (action.payload.contactValue)
        state.devices[deviceIndex].recordingService.socket?.send(
          JSON.stringify({
            code: RecordingRequestCodes.SET_CONTACT_ID,
            settings: { contactId: action.payload.contactValue?.id },
          }),
        );
    },
    setRelativeValue(
      state,
      action: PayloadAction<{
        ipAddress: string;
        relativeValue: RelativeEntity | null;
      }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].recordingService.relative =
        action.payload.relativeValue;
      if (action.payload.relativeValue)
        state.devices[deviceIndex].recordingService.socket?.send(
          JSON.stringify({
            code: RecordingRequestCodes.SET_RELATIVE_ID,
            settings: { relativeId: action.payload.relativeValue?.id },
          }),
        );
    },
    setRecordingServiceVideoPath(
      state,
      action: PayloadAction<{ ipAddress: string; path: string }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].recordingService.videoPath =
        action.payload.path;
    },
    setPersonDataFieldOpen(
      state,
      action: PayloadAction<{ ipAddress: string; open: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].personDataAutocompleteField.open =
        action.payload.open;
    },
    setPersonDataFieldLoading(
      state,
      action: PayloadAction<{ ipAddress: string; loading: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].personDataAutocompleteField.loading =
        action.payload.loading;
    },
    setContactValueFieldOpen(
      state,
      action: PayloadAction<{ ipAddress: string; open: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].contactValueAutocompleteField.open =
        action.payload.open;
    },
    setContactValueFieldLoading(
      state,
      action: PayloadAction<{ ipAddress: string; loading: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].contactValueAutocompleteField.loading =
        action.payload.loading;
    },
    setRelativeValueFieldOpen(
      state,
      action: PayloadAction<{ ipAddress: string; open: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].relativeValueAutocompleteField.open =
        action.payload.open;
    },
    setRelativeValueFieldLoading(
      state,
      action: PayloadAction<{ ipAddress: string; loading: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].relativeValueAutocompleteField.loading =
        action.payload.loading;
    },
    setRecordingServiceStartTime(
      state,
      action: PayloadAction<{ ipAddress: string; startTime: Date | null }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].recordingService.startTime =
        action.payload.startTime;
    },
    setPersonDataOptions(state, action: PayloadAction<Array<PersonEntity>>) {
      state.personDataOptions = action.payload;
    },
    setRelativeValueOptions(
      state,
      action: PayloadAction<Array<RelativeEntity>>,
    ) {
      state.relativeValueOptions = action.payload;
    },
    setContactValueOptions(state, action: PayloadAction<Array<ContactEntity>>) {
      state.contactValueOptions = action.payload;
    },
    setContactValueFieldDisabled(
      state,
      action: PayloadAction<{ address: string; disabled: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].contactValueAutocompleteField.disabled =
        action.payload.disabled;
    },
    // _______________________ Audio streaming service reducers _______________________
    // ________________________________________________________________________________
    setIsAudioStreamingProcessing(
      state,
      action: PayloadAction<BooleanResultType & { closeAll: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      const srvcAudioStreamingIndex = state.devices[
        deviceIndex
      ].services.findIndex(
        (srvc) => srvc.serviceName == DeviceServiceEnum.SRVC_AUDIO_STREAMING,
      );
      const srvcSpeechReceivingIndex = state.devices[
        deviceIndex
      ].services.findIndex(
        (srvc) => srvc.serviceName == DeviceServiceEnum.SRVC_SPEECH_RECEIVING,
      );
      if (action.payload.closeAll) {
        restoreAudioStartTime();
        restoreSpeechStartTime();
        // Stop receiving and recording for all of devices excepting used device
        state.devices.forEach((device) => {
          if (device.ipAddress != action.payload.address) {
            if (device.services[srvcAudioStreamingIndex].isProcessing == true) {
              device.services[srvcAudioStreamingIndex].socket?.send(
                AudioServiceCommandProtocolEnum.NOT_READY_TO_RECEIVE_DATA,
              );
              device.services[srvcAudioStreamingIndex].isProcessing = false;
              //2
            }
            if (
              device.services[srvcSpeechReceivingIndex].isProcessing == true
            ) {
              stopRec(device.ipAddress);
              device.services[srvcSpeechReceivingIndex].isProcessing = false;
            }
          }
        });
      }

      if (action.payload.booleanResult) {
        // restoreAudioStartTime();
        // restoreSpeechStartTime();
        if (
          state.devices[deviceIndex].services[srvcAudioStreamingIndex].socket
            ?.readyState == 1
        ) {
          state.devices[deviceIndex].services[
            srvcAudioStreamingIndex
          ].socket?.send(AudioServiceCommandProtocolEnum.READY_TO_RECEIVE_DATA);
        }
        state.devices[deviceIndex].services[
          srvcAudioStreamingIndex
        ].isProcessing = true;
      } else if (!action.payload.booleanResult) {
        if (
          state.devices[deviceIndex].services[srvcAudioStreamingIndex]
            .isProcessing == true
        ) {
        }
        if (
          state.devices[deviceIndex].services[srvcAudioStreamingIndex].socket
            ?.readyState == 1
        ) {
          state.devices[deviceIndex].services[
            srvcAudioStreamingIndex
          ].socket?.send(
            AudioServiceCommandProtocolEnum.NOT_READY_TO_RECEIVE_DATA,
          );
        }
        state.devices[deviceIndex].services[
          srvcAudioStreamingIndex
        ].isProcessing = false;
        if (
          state.devices[deviceIndex].services[srvcSpeechReceivingIndex]
            .isProcessing == true
        ) {
          state.devices[deviceIndex].services[
            srvcSpeechReceivingIndex
          ].isProcessing = false;
          stopRec(action.payload.address);
        }
      }
    },
    // _______________________ Speech receiving service reducers _______________________
    // _________________________________________________________________________________
    setIsMicRecordingProcessing(
      state,
      action: PayloadAction<BooleanResultType>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      const srvcSpeechReceivingIndex = state.devices[
        deviceIndex
      ].services.findIndex(
        (srvc) => srvc.serviceName == DeviceServiceEnum.SRVC_SPEECH_RECEIVING,
      );
      const srvcAudioStreamingIndex = state.devices[
        deviceIndex
      ].services.findIndex(
        (srvc) => srvc.serviceName == DeviceServiceEnum.SRVC_AUDIO_STREAMING,
      );
      //Stop recording for all of devices excepting used device
      state.devices.forEach((device) => {
        if (device.ipAddress != action.payload.address) {
          device.services[srvcSpeechReceivingIndex].isProcessing = false;
          stopRec(device.ipAddress);
        }
      });
      // Start recording for used device
      if (action.payload.booleanResult) {
        recMic(state.devices[deviceIndex].ipAddress);
        state.devices[deviceIndex].services[
          srvcSpeechReceivingIndex
        ].isProcessing = true;
        // We don't need audio from sound card of used device so we notify the device of this
        state.devices[deviceIndex].services[
          srvcAudioStreamingIndex
        ].socket?.send(
          AudioServiceCommandProtocolEnum.NOT_READY_TO_RECEIVE_AUDIO,
        );
        restoreAudioStartTime();
        // Stop recording for used device
      } else if (!action.payload.booleanResult) {
        state.devices[deviceIndex].services[
          srvcSpeechReceivingIndex
        ].isProcessing = false;
        state.devices[deviceIndex].services[
          srvcAudioStreamingIndex
        ].socket?.send(AudioServiceCommandProtocolEnum.READY_TO_RECEIVE_DATA);
        stopRec(action.payload.address);
      }
    },
    // _____________________________ Button state reducers _____________________________
    // _________________________________________________________________________________
    setCallActionButtonsDisabled(
      state,
      action: PayloadAction<{ address: string; disabled: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].doCallButtonDisabled = action.payload.disabled;
      state.devices[deviceIndex].cancelCallButtonDisabled =
        action.payload.disabled;
    },
    setDoCallButtonDisabled(
      state,
      action: PayloadAction<{ address: string; disabled: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].doCallButtonDisabled = action.payload.disabled;
    },
    setCancelCallButtonDisabled(
      state,
      action: PayloadAction<{ address: string; disabled: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].cancelCallButtonDisabled =
        action.payload.disabled;
    },
    setReloadContactButtonDisabled(
      state,
      action: PayloadAction<{ address: string; disabled: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].reloadButtonDisabled = action.payload.disabled;
    },
    setCommitSessionButtonDisabled(
      state,
      action: PayloadAction<{ address: string; disabled: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].commitSessionButtonDisabled =
        action.payload.disabled;
    },
    setDoCallButtonLoading(
      state,
      action: PayloadAction<{ address: string; loading: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].doCallButtonLoading = action.payload.loading;
    },
    setCancelCallButtonLoading(
      state,
      action: PayloadAction<{ address: string; loading: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].cancelCallButtonLoading =
        action.payload.loading;
    },
    setCommitSessionButtonLoading(
      state,
      action: PayloadAction<{ address: string; loading: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].commitSessionButtonLoading =
        action.payload.loading;
    },
    setAudioRetranslationSocketConnectedState(
      state,
      action: PayloadAction<{ address: string; connected: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].audioRetranslationSocketConnected =
        action.payload.connected;
    },
    setSpeechRetranslationSocketConnectedState(
      state,
      action: PayloadAction<{ address: string; connected: boolean }>,
    ) {
      const deviceIndex = state.devices.findIndex(
        (val) => val.ipAddress == action.payload.address,
      );
      state.devices[deviceIndex].speechRetranslationSocketConnected =
        action.payload.connected;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      establishUiControllingServiceConnection.fulfilled,
      (state, action) => {
        if (action.payload != undefined) {
          const deviceIndex = state.devices.findIndex(
            (device) => device.ipAddress == action.payload.ipAddress,
          );
          const srvcIndex = state.devices[deviceIndex].services.findIndex(
            (srvc) => srvc.port == action.payload.port,
          );
          state.devices[deviceIndex].services[srvcIndex].socket =
            action.payload.socket;
        }
      },
    );
    builder.addCase(
      establishSpeechRecognizingConnection.fulfilled,
      (state, action) => {
        if (action.payload != undefined) {
          const deviceIndex = state.devices.findIndex(
            (device) => device.ipAddress == action.payload.ipAddress,
          );
          state.devices[deviceIndex].recognitionService.socket =
            action.payload.socket;
        }
      },
    );
    builder.addCase(
      establishSpeechRecievingServiceConnection.fulfilled,
      (state, action) => {
        if (action.payload != undefined) {
          const deviceIndex = state.devices.findIndex(
            (device) => device.ipAddress == action.payload.ipAddress,
          );
          const srvcIndex = state.devices[deviceIndex].services.findIndex(
            (srvc) => srvc.port == action.payload.port,
          );
          state.devices[deviceIndex].services[srvcIndex].socket =
            action.payload.socket;
        }
      },
    );
    builder.addCase(
      establishRecordingServiceConnection.fulfilled,
      (state, action) => {
        if (action.payload != undefined) {
          const deviceIndex = state.devices.findIndex(
            (device) => device.ipAddress == action.payload.ipAddress,
          );
          state.devices[deviceIndex].recordingService.socket =
            action.payload.socket;
        }
      },
    );
    builder.addCase(
      establishPowerManagementServiceConnection.fulfilled,
      (state, action) => {
        if (action.payload != undefined) {
          const deviceIndex = state.devices.findIndex(
            (device) => device.ipAddress == action.payload.ipAddress,
          );
          const srvcIndex = state.devices[deviceIndex].services.findIndex(
            (srvc) => srvc.port == action.payload.port,
          );
          state.devices[deviceIndex].services[srvcIndex].socket =
            action.payload.socket;
        }
      },
    );
    builder.addCase(
      establishAudioStreamingServiceConnection.fulfilled,
      (state, action) => {
        if (action.payload != undefined) {
          const deviceIndex = state.devices.findIndex(
            (device) => device.ipAddress == action.payload.ipAddress,
          );
          const srvcIndex = state.devices[deviceIndex].services.findIndex(
            (srvc) => srvc.port == action.payload.port,
          );
          state.devices[deviceIndex].services[srvcIndex].socket =
            action.payload.socket;
        }
      },
    );
    builder.addCase(loadPersonDataThunk.fulfilled, (state, action) => {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].personDataAutocompleteField.loading = false;
      state.personDataOptions = action.payload.data;
      state.personDataOptionsLoadedAt = action.payload.lastLoaded;
    });
    builder.addCase(loadRelativeValuesThunk.fulfilled, (state, action) => {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].relativeValueAutocompleteField.loading = false;
      state.relativeValueOptions = action.payload.data;
    });
    builder.addCase(loadContactValuesThunk.fulfilled, (state, action) => {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].contactValueAutocompleteField.loading = false;
      state.contactValueOptions = action.payload.data;
    });
    builder.addCase(loadContactTypeValuesThunk.fulfilled, (state, action) => {
      state.contactTypeValueOptions = action.payload.data;
    });
    builder.addCase(loadRelationTypeValuesThunk.fulfilled, (state, action) => {
      state.relationTypeValueOptions = action.payload.data;
    });
    builder.addCase(loadMarkedWordsThunk.fulfilled, (state, action) => {
      state.markedWords = action.payload.data;
    });
    builder.addCase(loadPersonByIdThunk.fulfilled, (state, action) => {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].personDataAutocompleteField.loading = false;
      state.devices[deviceIndex].recordingService.personData =
        action.payload.data;
    });
    builder.addCase(loadRelativeByIdThunk.fulfilled, (state, action) => {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].relativeValueAutocompleteField.loading = false;
      state.devices[deviceIndex].recordingService.relative =
        action.payload.data;
    });
    builder.addCase(loadContactByIdThunk.fulfilled, (state, action) => {
      const deviceIndex = state.devices.findIndex(
        (device) => device.ipAddress == action.payload.ipAddress,
      );
      state.devices[deviceIndex].contactValueAutocompleteField.loading = false;
      state.devices[deviceIndex].recordingService.contact = action.payload.data;
    });
    builder.addCase(loadDevicesThunk.pending, (state) => {
      state.fetching = 'LOADING';
      state.devices = [];
    });
    builder.addCase(loadDevicesThunk.fulfilled, (state, action) => {
      const devicesForRetranslationServers: [
        { port: number; targetAddress: string; targetPort: number }?,
      ] = [];
      action.payload.forEach((device) => {
        devicesForRetranslationServers.push({
          port: device.vncService.port,
          targetAddress: device.ipAddress,
          targetPort: 5900,
        });
      });
      window.electron.ipcRenderer.sendMessage(
        'devices.create.retranslation.server',
        devicesForRetranslationServers,
      );
      state.fetching = 'SUCCESS';
      state.devices = action.payload;
    });
    builder.addCase(loadDevicesThunk.rejected, (state, action) => {
      const err = action.payload as AxiosError;
      state.fetching = 'ERROR';
    });
    builder.addCase(
      loadAvailableExtraCallPermissionsThunk.fulfilled,
      (state, action) => {
        const deviceIndex = state.devices.findIndex(
          (device) => device.ipAddress == action.payload.ipAddress,
        );
        state.devices[deviceIndex].availableSessions = action.payload.data;
      },
    );
  },
});

export default devicesSlice.reducer;
// __________________________ Selectors ____________________________
// _________________________________________________________________
export const devicesSliceSelector = (state: RootState) => state.devicesSlice;
// export const deviceSelector = (state: RootState, ipAddress: string) =>
//   state.devicesSlice.devices.find((device) => device.ipAddress == ipAddress);
export const deviceRecordingServiceSelector = (
  state: RootState,
  ipAddress: string,
) =>
  state.devicesSlice.devices.find((device) => device.ipAddress == ipAddress)
    ?.recordingService;

export const recognitionServiceSelector = (
  state: RootState,
  ipAddress: string,
) =>
  state.devicesSlice.devices.find((device) => device.ipAddress == ipAddress)
    ?.recognitionService;
export const deviceServiceSelector = (
  state: RootState,
  ipAddress: string,
  serviceName: DeviceServiceEnum,
) =>
  state.devicesSlice.devices
    .find((device) => device.ipAddress == ipAddress)
    ?.services.find((service) => service.serviceName == serviceName);
export const devicePersonDataAutocompleteFieldStateSelector = (
  state: RootState,
  ipAddress: string,
) =>
  state.devicesSlice.devices.find((device) => device.ipAddress == ipAddress)
    ?.personDataAutocompleteField;
export const deviceRelativeValueAutocompleteFieldStateSelector = (
  state: RootState,
  ipAddress: string,
) =>
  state.devicesSlice.devices.find((device) => device.ipAddress == ipAddress)
    ?.relativeValueAutocompleteField;
export const deviceContactValueAutocompleteFieldStateSelector = (
  state: RootState,
  ipAddress: string,
) =>
  state.devicesSlice.devices.find((device) => device.ipAddress == ipAddress)
    ?.contactValueAutocompleteField;
export const deviceAvailableExtraCallPermissionSelector = (
  state: RootState,
  ipAddress: string,
) =>
  state.devicesSlice.devices.find((device) => device.ipAddress == ipAddress)
    ?.availableSessions;

export const deviceCurrentCallDurationSelector = (
  state: RootState,
  ipAddress: string,
) =>
  state.devicesSlice.devices.find((device) => device.ipAddress == ipAddress)
    ?.currentCallDuration;
export const personDataOptionsSelector = (state: RootState) =>
  state.devicesSlice.personDataOptions;
export const relativeValueOptionsSelector = (state: RootState) =>
  state.devicesSlice.relativeValueOptions;
export const contactValueOptionsSelector = (state: RootState) =>
  state.devicesSlice.contactValueOptions;
export const contactTypeValueOptionsSelector = (state: RootState) =>
  state.devicesSlice.contactTypeValueOptions;
export const relationTypeValueOptionsSelector = (state: RootState) =>
  state.devicesSlice.relationTypeValueOptions;
export const personDataLoadedAtSelector = (state: RootState) =>
  state.devicesSlice.personDataOptionsLoadedAt;

export const {
  setIsAlive,
  setIsMicRecordingProcessing,
  setIsAudioStreamingProcessing,
  setIsRecordingProcessing,
  setPersonData,
  setContactValue,
  setRelativeValue,
  setIsServiceAvailable,
  setPersonDataFieldOpen,
  setPersonDataFieldLoading,
  setContactValueFieldOpen,
  setContactValueFieldLoading,
  setRelativeValueFieldOpen,
  setRelativeValueFieldLoading,
  setRecordingServiceStartTime,
  setPersonDataOptions,
  setRelativeValueOptions,
  setContactValueOptions,
  setRecordingServiceVideoPath,
  setCallId,
  setCallActionButtonsDisabled,
  setReloadContactButtonDisabled,
  setDoCallButtonDisabled,
  setCancelCallButtonDisabled,
  setContactValueFieldDisabled,
  setCommitSessionButtonDisabled,
  setIsRecordProcessingStarting,
  setCurrentCallDuration,
  setDoCallButtonLoading,
  setCancelCallButtonLoading,
  setCommitSessionButtonLoading,
  setAudioRetranslationSocketConnectedState,
  setSpeechRetranslationSocketConnectedState,
  setIsRecognitionProcessing,
  setEstablishingConnection,
} = devicesSlice.actions;
