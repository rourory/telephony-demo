import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { loadServerSettingsThunk } from './thunks';

const initialState: ServerSettingsEntity = {
  beforeTimerEndsWarningMinutes: 5,
  standardCallDuration: null,
  changePasswordRequiredIntervalMonths: 3,
};

const serverSettingsSlice = createSlice({
  name: 'serverSettings',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AdministrationEntity>) {},
  },
  extraReducers: (builder) => {
    builder.addCase(loadServerSettingsThunk.pending, (state) => {});
    builder.addCase(loadServerSettingsThunk.fulfilled, (state, action) => {
      state.beforeTimerEndsWarningMinutes =
        action.payload.data[0].beforeTimerEndsWarningMinutes;
      state.standardCallDuration = action.payload.data[0].standardCallDuration;
    });
  },
});

export default serverSettingsSlice.reducer;
export const serverSettingsSelector = (state: RootState) =>
  state.serverSettingsSlice;
export const { setUser } = serverSettingsSlice.actions;
