import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setDoCallButtonDisabled,
  setCancelCallButtonDisabled,
  setContactValueFieldDisabled,
  setReloadContactButtonDisabled,
  setCommitSessionButtonDisabled,
  setDoCallButtonLoading,
} from '../devices-slice';

export const setDeviceCardCallingState = createAsyncThunk<
  void,
  { ipAddress: string }
>('devices/setDeviceCardCallingState', (args, thunkApi) => {
  thunkApi.dispatch(
    setDoCallButtonLoading({ address: args.ipAddress, loading: false }),
  );
  thunkApi.dispatch(
    setDoCallButtonDisabled({
      address: args.ipAddress,
      disabled: true,
    }),
  );
  thunkApi.dispatch(
    setCancelCallButtonDisabled({
      address: args.ipAddress,
      disabled: false,
    }),
  );
  thunkApi.dispatch(
    setContactValueFieldDisabled({
      address: args.ipAddress,
      disabled: true,
    }),
  );
  thunkApi.dispatch(
    setReloadContactButtonDisabled({
      address: args.ipAddress,
      disabled: true,
    }),
  );
  thunkApi.dispatch(
    setCommitSessionButtonDisabled({
      address: args.ipAddress,
      disabled: true,
    }),
  );
});
