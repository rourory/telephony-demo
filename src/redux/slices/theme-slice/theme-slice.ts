import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getThemeConfigFromLocalStorageIfExists } from '../../../utils/local-storge-utils';
import { ThemeOptionsType } from '../../../@types/redux/theme-slice';

const optionsFromLocalStorage = getThemeConfigFromLocalStorageIfExists();

const initialState: ThemeOptionsType = optionsFromLocalStorage || {
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: undefined,
  },
};

const applicationThemeSlice = createSlice({
  name: 'themes',
  initialState,
  reducers: {
    toggleMode(state) {
      state.palette.mode = state.palette.mode === 'dark' ? 'light' : 'dark';
    },
  },
});

export default applicationThemeSlice.reducer;
export const applicationThemeSelector = (state: RootState) => state.themesSlice;
export const { toggleMode } = applicationThemeSlice.actions;
