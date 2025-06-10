import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setCallActionButtonsDisabled,
  setContactValueFieldDisabled,
  setReloadContactButtonDisabled,
  setCommitSessionButtonDisabled,
  setDoCallButtonLoading,
} from '../devices-slice';

export const setDeviceCardNotReadyToCallState = createAsyncThunk<
  void,
  { ipAddress: string }
>('devices/setDeviceCardNotReadyToCallState', (args, thunkApi) => {
  thunkApi.dispatch(
    setDoCallButtonLoading({ address: args.ipAddress, loading: false }),
  );
  thunkApi.dispatch(
    setCallActionButtonsDisabled({
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
