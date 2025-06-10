import { createAsyncThunk } from '@reduxjs/toolkit';
import { CONTACT_TYPES } from '../../../../api/end-points';
import { fetchAllQuery } from '../../../../api/queries';

export const loadContactTypeValuesThunk = createAsyncThunk<
  {
    data: Array<ContactTypeEntity>;
  },
  BackendSettings
>('devices/loadContactTypeValuesThunk', async (backendSettings, thunkApi) => {
  let contactTypeValues: Array<ContactTypeEntity> = [];
  await fetchAllQuery<ContactTypeEntity>(backendSettings, CONTACT_TYPES)
    .then((res) => (contactTypeValues = res.data))
    .catch((err) => thunkApi.rejectWithValue(err));
  return { data: contactTypeValues };
});
