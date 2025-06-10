import { createAsyncThunk } from '@reduxjs/toolkit';
import { addNotification } from '../notify-slice/notify-slice';
import { SETTINGS } from '../../../api/end-points';
import { fetchAllQuery } from '../../../api/queries';


export const loadServerSettingsThunk = createAsyncThunk<
  {
    data: Array<ServerSettingsEntity>;
  },
  BackendSettings
>('serverSettings/loadServerSettingsThunk', async (backendSettings, thunkApi) => {
  let serverSettings: Array<ServerSettingsEntity> = [];
  await fetchAllQuery<ServerSettingsEntity>(backendSettings, SETTINGS)
    .then((res) => {
      serverSettings = res.data;
    })
    .catch((err) => {
      thunkApi.dispatch(addNotification({ type: 'error', message: err }));
      thunkApi.rejectWithValue(err);
    });
  return { data: serverSettings };
});
