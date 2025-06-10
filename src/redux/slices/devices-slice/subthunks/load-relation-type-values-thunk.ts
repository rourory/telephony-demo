import { createAsyncThunk } from "@reduxjs/toolkit";
import { RELATION_TYPES } from "../../../../api/end-points";
import { fetchAllQuery } from "../../../../api/queries";

export const loadRelationTypeValuesThunk = createAsyncThunk<
  {
    data: Array<RelationTypeEntity>;
  },
  BackendSettings
>('devices/loadRelationTypeValuesThunk', async (backendSettings, thunkApi) => {
  let relationTypeValues: Array<RelationTypeEntity> = [];
  await fetchAllQuery<RelationTypeEntity>(backendSettings, RELATION_TYPES)
    .then((res) => (relationTypeValues = res.data))
    .catch((err) => thunkApi.rejectWithValue(err));
  return { data: relationTypeValues };
});
