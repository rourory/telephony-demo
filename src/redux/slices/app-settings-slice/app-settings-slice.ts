import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getAppSettingsFromLocalStorage, setAppSettingstoLocalStorage } from '../../../utils/local-storge-utils';


const initialState: AppSettingsSliceType = getAppSettingsFromLocalStorage();

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setBackendAddress(state, action: PayloadAction<string>) {
      const settings = getAppSettingsFromLocalStorage();
      settings.backendAddress = action.payload;
      setAppSettingstoLocalStorage(settings);
      state.backendAddress = action.payload;
    },
    setBackendPort(state, action: PayloadAction<string>) {
      const settings = getAppSettingsFromLocalStorage();
      settings.backendPort = action.payload;
      setAppSettingstoLocalStorage(settings);
      state.backendPort = action.payload;
    },
    setBackendProtocol(state, action: PayloadAction<string>) {
      const settings = getAppSettingsFromLocalStorage();
      settings.backendProtocol = action.payload;
      setAppSettingstoLocalStorage(settings);
      state.backendProtocol = action.payload;
    },
  },
});

export default appSettingsSlice.reducer;
export const appSettingsStateSelector = (state: RootState) =>
  state.appSettingsSlice;
export const { setBackendAddress, setBackendPort, setBackendProtocol } =
  appSettingsSlice.actions;
