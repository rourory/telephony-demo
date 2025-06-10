import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const initialState: VncVideoShowStateType = {
  actualVncServiceUrl: undefined,
  openVncVideoFrame: false,
  fullscreenVncVideoFrame: false,
  fetchStatusVncVideoFrame: 'LOADING',
  vncScreens: [],
};

const vncVideoShowSlice = createSlice({
  name: 'vncVideoShow',
  initialState,
  reducers: {
    setActualVncServiceUrl(state, action: PayloadAction<string | undefined>) {
      state.actualVncServiceUrl = action.payload;
    },
    setOpenVideoFrame(state, action: PayloadAction<boolean>) {
      state.openVncVideoFrame = action.payload;
    },
    setFetchStatusVideoFrame(state, action: PayloadAction<FetchingStatus>) {
      state.fetchStatusVncVideoFrame = action.payload;
    },
    setFullscreenStatusVideoFrame(state, action: PayloadAction<boolean>) {
      state.fullscreenVncVideoFrame = action.payload;
    },
    setVncScreens(state, action: PayloadAction<Array<VncScreenStateType>>) {
      state.vncScreens = action.payload;
    }
  },
});

export default vncVideoShowSlice.reducer;
export const vncVideoShowSelector = (state: RootState) =>
  state.vncVideoShowSlice;
export const {
  setOpenVideoFrame,
  setFetchStatusVideoFrame,
  setFullscreenStatusVideoFrame,
  setActualVncServiceUrl,
  setVncScreens,
} = vncVideoShowSlice.actions;
