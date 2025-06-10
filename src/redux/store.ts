import { configureStore } from '@reduxjs/toolkit';
import themesSlice from './slices/theme-slice/theme-slice';
import drawerSlice from './slices/drawer-slice/drawer-slice';
import closeDialogSlice from './slices/close-dialog-slice/close-dialog-slice';
import vncVideoShowSlice from './slices/vnc-video-show-slice/vnc-video-show-slice';
import devicesSlice from './slices/devices-slice/devices-slice';
import commitSessionSlice from './slices/commit-session-slice/commit-session-slice';
import notifySlice from './slices/notify-slice/notify-slice';
import userSlice from './slices/user-slice/user-slice';
import appSettingsSlice from './slices/app-settings-slice/app-settings-slice';
import photoHolderSlice from './slices/photo-holder-slice/photo-holder-slice';
import serverSettingsSlice from './slices/server-settings-slice/server-settings-slice';
import changePasswordDialogSlice from './slices/change-password-dialog-slice/change-password-dialog-slice';
import recognizedSpeech from './slices/recognized-speech-slice.ts/recognized-speech-slice';

export const store = configureStore({
  reducer: {
    themesSlice,
    drawerSlice,
    closeDialogSlice,
    vncVideoShowSlice,
    devicesSlice,
    commitSessionSlice,
    notifySlice,
    userSlice,
    appSettingsSlice,
    photoHolderSlice,
    serverSettingsSlice,
    changePasswordDialogSlice,
    recognizedSpeech,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
