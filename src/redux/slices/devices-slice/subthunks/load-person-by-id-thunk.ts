import { createAsyncThunk } from "@reduxjs/toolkit";
import { setPersonDataFieldLoading } from "../devices-slice";
import { CONVICTED } from "../../../../api/end-points";
import { fetchOneQuery } from "../../../../api/queries";

export const loadPersonByIdThunk = createAsyncThunk<
  { ipAddress: string; data: PersonEntity | null },
  { ipAddress: string; personId: number; backendSettings: BackendSettings }
>('devices/loadPersonById', async (args, thunkApi) => {
  thunkApi.dispatch(
    setPersonDataFieldLoading({ ipAddress: args.ipAddress, loading: true }),
  );
  let personData: PersonEntity | null = null;
  await fetchOneQuery<PersonEntity>(
    args.backendSettings,
    CONVICTED,
    args.personId,
  )
    .then((res) => (personData = res))
    .catch((err) => thunkApi.rejectWithValue(err));
  return { ipAddress: args.ipAddress, data: personData };
});
