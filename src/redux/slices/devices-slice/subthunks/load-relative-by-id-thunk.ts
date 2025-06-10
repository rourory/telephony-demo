import { createAsyncThunk } from '@reduxjs/toolkit';
import { setRelativeValueFieldLoading } from '../devices-slice';
import { RELATIVES } from '../../../../api/end-points';
import { fetchOneQuery } from '../../../../api/queries';

export const loadRelativeByIdThunk = createAsyncThunk<
  { ipAddress: string; data: RelativeEntity | null },
  { ipAddress: string; relativeId: number; backendSettings: BackendSettings }
>('devices/loadRelativeById', async (args, thunkApi) => {
  thunkApi.dispatch(
    setRelativeValueFieldLoading({ ipAddress: args.ipAddress, loading: true }),
  );
  let relativeData: RelativeEntity | null = null;
  await fetchOneQuery<RelativeEntity>(
    args.backendSettings,
    RELATIVES,
    args.relativeId,
  )
    .then((res) => (relativeData = res))
    .catch((err) => thunkApi.rejectWithValue(err));
  return { ipAddress: args.ipAddress, data: relativeData };
});
