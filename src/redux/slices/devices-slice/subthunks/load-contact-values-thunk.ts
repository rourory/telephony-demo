import { createAsyncThunk } from "@reduxjs/toolkit";
import { setContactValueFieldLoading } from "../devices-slice";
import { CONTACTS } from "../../../../api/end-points";
import { fetchAllQuery } from "../../../../api/queries";

export const loadContactValuesThunk = createAsyncThunk<
  { ipAddress: string; data: Array<ContactEntity> },
  { ipAddress: string; relativeId: number; backendSettings: BackendSettings }
>('devices/loadContactValuesThunk', async (args, thunkApi) => {
  thunkApi.dispatch(
    setContactValueFieldLoading({ ipAddress: args.ipAddress, loading: true }),
  );
  let contactValues: Array<ContactEntity> = [];
  await fetchAllQuery<ContactEntity>(
    args.backendSettings,
    CONTACTS,
    `?filter=["relativeId","=",${args.relativeId}]`,
  )
    .then((res) => (contactValues = res.data))
    .catch((err) => thunkApi.rejectWithValue(err));
  return { ipAddress: args.ipAddress, data: contactValues };
});
