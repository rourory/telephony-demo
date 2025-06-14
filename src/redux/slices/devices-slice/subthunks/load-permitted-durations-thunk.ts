import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  PERMITTED_CALL_DURATIONS,
} from "../../../../api/end-points";
import { fetchAllQuery } from "../../../../api/queries";

export const loadPermittedDurationsThunk = createAsyncThunk<
  {
    data: Array<PermittedCallDurationEntity>;
  },
  BackendSettings
>("devices/loadPermittedDurationsThunk", async (backendSettings, thunkApi) => {
  let duraions: Array<PermittedCallDurationEntity> = [];
  await fetchAllQuery<PermittedCallDurationEntity>(
    backendSettings,
    PERMITTED_CALL_DURATIONS
  )
    .then((res) => {
      duraions = res.data;
    })
    .catch((err) => thunkApi.rejectWithValue(err));
  return { data: duraions };
});
