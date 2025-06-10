import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setCallId,
  setCancelCallButtonDisabled,
  setCancelCallButtonLoading,
  setCommitSessionButtonDisabled,
  setCommitSessionButtonLoading,
  setContactValue,
  setContactValueFieldDisabled,
  setDoCallButtonDisabled,
  setDoCallButtonLoading,
  setIsRecordingProcessing,
  setIsRecordProcessingStarting,
  setPersonData,
  setRecordingServiceStartTime,
  setRelativeValue,
  setReloadContactButtonDisabled,
} from '../devices-slice';

export const restoreDeviceCardInitialState = createAsyncThunk<
  void,
  { ipAddress: string }
>('devices/restoreDeviceCardInitialState', (args, thunkApi) => {
  thunkApi.dispatch(
    setDoCallButtonLoading({ address: args.ipAddress, loading: false }),
  );
  thunkApi.dispatch(
    setCancelCallButtonLoading({ address: args.ipAddress, loading: false }),
  );
  thunkApi.dispatch(
    setCommitSessionButtonLoading({ address: args.ipAddress, loading: false }),
  );
  thunkApi.dispatch(
    setIsRecordingProcessing({
      address: args.ipAddress,
      booleanResult: false,
    }),
  );
  thunkApi.dispatch(
    setIsRecordProcessingStarting({
      address: args.ipAddress,
      booleanResult: false,
    }),
  );
  thunkApi.dispatch(
    setCallId({
      ipAddress: args.ipAddress,
      id: null,
    }),
  );
  thunkApi.dispatch(
    setRecordingServiceStartTime({
      ipAddress: args.ipAddress,
      startTime: null,
    }),
  );
  thunkApi.dispatch(
    setPersonData({ ipAddress: args.ipAddress, personData: null }),
  );
  thunkApi.dispatch(
    setContactValue({
      ipAddress: args.ipAddress,
      contactValue: null,
    }),
  );
  thunkApi.dispatch(
    setRelativeValue({
      ipAddress: args.ipAddress,
      relativeValue: null,
    }),
  );
  thunkApi.dispatch(
    setCommitSessionButtonDisabled({
      address: args.ipAddress,
      disabled: false,
    }),
  );
  thunkApi.dispatch(
    setCancelCallButtonDisabled({
      address: args.ipAddress,
      disabled: true,
    }),
  );
  thunkApi.dispatch(
    setDoCallButtonDisabled({
      address: args.ipAddress,
      disabled: true,
    }),
  );
  thunkApi.dispatch(
    setReloadContactButtonDisabled({
      address: args.ipAddress,
      disabled: false,
    }),
  );
  thunkApi.dispatch(
    setContactValueFieldDisabled({
      address: args.ipAddress,
      disabled: false,
    }),
  );
});
