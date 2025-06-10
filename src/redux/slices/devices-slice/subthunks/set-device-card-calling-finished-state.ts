import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setPersonData,
  setRelativeValue,
  setContactValue,
  setIsRecordingProcessing,
  setIsRecordProcessingStarting,
  setRecordingServiceStartTime,
} from '../devices-slice';

export const setDeviceCardcallingFinishedState = createAsyncThunk<
  void,
  { ipAddress: string }
>('devices/setDeviceCardcallingFinishedState', (args, thunkApi) => {
  thunkApi.dispatch(
    setPersonData({
      ipAddress: args.ipAddress,
      personData: null,
    }),
  );
  thunkApi.dispatch(
    setRelativeValue({
      ipAddress: args.ipAddress,
      relativeValue: null,
    }),
  );
  thunkApi.dispatch(
    setContactValue({
      ipAddress: args.ipAddress,
      contactValue: null,
    }),
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
    setRecordingServiceStartTime({
      ipAddress: args.ipAddress,
      startTime: null,
    }),
  );
});
