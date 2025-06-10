import { createAsyncThunk } from '@reduxjs/toolkit';

import { setRelativeValueFieldLoading } from '../devices-slice';
import { RELATIVES } from '../../../../api/end-points';
import { fetchAllQuery } from '../../../../api/queries';

export const loadRelativeValuesThunk = createAsyncThunk<
  { ipAddress: string; data: Array<RelativeEntity> },
  { ipAddress: string; personId: number; backendSettings: BackendSettings }
>('devices/loadRelativeValuesThunk', async (args, thunkApi) => {
  thunkApi.dispatch(
    setRelativeValueFieldLoading({ ipAddress: args.ipAddress, loading: true }),
  );
  let relativeValues: Array<RelativeEntity> = [];
  await fetchAllQuery<RelativeEntity>(
    args.backendSettings,
    RELATIVES,
    `?filter=["convictedId","=",${args.personId}]`,
  )
    .then((res) => (relativeValues = res.data))
    .catch((err) => thunkApi.rejectWithValue(err));
  return { ipAddress: args.ipAddress, data: relativeValues };
});
