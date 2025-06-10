import { createAsyncThunk } from "@reduxjs/toolkit";
import { MARKED_WORDS } from "../../../../api/end-points";
import { fetchAllQuery } from "../../../../api/queries";


export const loadMarkedWordsThunk = createAsyncThunk<
  {
    data: Array<MarkedWordEntity>;
  },
  BackendSettings
>('devices/loadMarkedWordsThunk', async (backendSettings, thunkApi) => {
  let markedWords: Array<MarkedWordEntity> = [];
  await fetchAllQuery<MarkedWordEntity>(backendSettings, MARKED_WORDS)
    .then((res) => {
      markedWords = res.data;
    })
    .catch((err) => thunkApi.rejectWithValue(err));
  return { data: markedWords };
});
