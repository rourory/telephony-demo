import { createAsyncThunk } from "@reduxjs/toolkit";
import { setContactValueFieldLoading } from "../devices-slice";
import { CONTACTS } from "../../../../api/end-points";
import { fetchOneQuery } from "../../../../api/queries";

export const loadContactByIdThunk = createAsyncThunk<
  { ipAddress: string; data: ContactEntity | null },
  { ipAddress: string; contactId: number; backendSettings: BackendSettings }
>('devices/loadContactById', async (args, thunkApi) => {
  thunkApi.dispatch(
    setContactValueFieldLoading({ ipAddress: args.ipAddress, loading: true }),
  );
  let contactData: ContactEntity | null = null;
  await fetchOneQuery<ContactEntity>(
    args.backendSettings,
    CONTACTS,
    args.contactId,
  )
    .then((res) => (contactData = res))
    .catch((err) => thunkApi.rejectWithValue(err));
  return { ipAddress: args.ipAddress, data: contactData };
});
