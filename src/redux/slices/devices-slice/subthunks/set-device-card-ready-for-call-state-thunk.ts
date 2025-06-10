import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setDoCallButtonDisabled,
  setCancelCallButtonDisabled,
  setContactValueFieldDisabled,
  setReloadContactButtonDisabled,
  setCommitSessionButtonDisabled,
  setDoCallButtonLoading,
  setCancelCallButtonLoading,
} from '../devices-slice';

export const setDeviceCardReadyToCallState = createAsyncThunk<
  void,
  { ipAddress: string }
>('devices/setDeviceCardReadyToCallState', (args, thunkApi) => {
  thunkApi.dispatch(
    setDoCallButtonDisabled({
      address: args.ipAddress,
      disabled: false,
    }),
  );
  thunkApi.dispatch(
    setCancelCallButtonLoading({ address: args.ipAddress, loading: false }),
  );
  thunkApi.dispatch(
    setDoCallButtonLoading({ address: args.ipAddress, loading: false }),
  );
  thunkApi.dispatch(
    setCancelCallButtonDisabled({
      address: args.ipAddress,
      disabled: true,
    }),
  );
  thunkApi.dispatch(
    setContactValueFieldDisabled({
      address: args.ipAddress,
      disabled: false,
    }),
  );
  thunkApi.dispatch(
    setReloadContactButtonDisabled({
      address: args.ipAddress,
      disabled: false,
    }),
  );
  thunkApi.dispatch(
    setCommitSessionButtonDisabled({
      address: args.ipAddress,
      disabled: false,
    }),
  );
});
