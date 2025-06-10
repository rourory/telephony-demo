import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
  loadNotArchivedAdministrationDataThunk,
  loadPermissions,
  refreshToken,
  signIn,
} from './thunks';

export type UserSliceState = UserSliceType & UserAutocompleteFieldStateType;

const initialState: UserSliceState = {
  autocompleteFieldUser: null,
  usersAutocompleteFieldOpen: false,
  usersForAutocompleteField: [],
  fetchingStatus: 'SUCCESS',
  user: undefined,
  userFetchStatus: 'SUCCESS',
  credentials: {
    username: '',
    password: '',
  },
  permissions: {
    roleId: null,
    canGiveCallsToAnotherSquad: false,
    canGiveCallsToControlled: false,
    convictedPagePermitted: false,
    convictedPageEditPermitted: false,
    convictedPageDeletePermitted: false,
    convictedPageRelativeDataGridPermitted: false,
    convictedPageRelativeDataGridEditPermitted: false,
    convictedPageRelativeDataGridDeletePermitted: false,
    convictedPageCallsDataGridPermitted: false,
    convictedPageCallsDataGridEditPermitted: false,
    convictedPageCallsDataGridDeletePermitted: false,
    relativeDataGridContactsDataGridPermitted: false,
    relativeDataGridContactsDataGridEditPermitted: false,
    relativeDataGridContactsDataGridDeletePermitted: false,
    callsPagePermitted: false,
    callsPageEditPermitted: false,
    callsPageDeletePermitted: false,
    devicesPagePermitted: false,
    devicesPageEditPermitted: false,
    devicesPageDeletePermitted: false,
    administrationPagePermitted: false,
    administrationPageEditPermitted: false,
    administrationPageDeletePermitted: false,
    settingsPagePermitted: false,
    permissionsDataGridPermitted: false,
    permissionsDataGridEditPermitted: false,
    permissionsDataGridDeletePermitted: false,
    rolesDataGridPermitted: false,
    rolesDataGridEditPermitted: false,
    rolesDataGridDeletePermitted: false,
    settingsTabPermitted: false,
    temporaryGivingCallsToAnotherSquad: null,
    temporaryGivingCallsToAnotherSquadHours: null,
    auditionColumnsPermitted: false,
    auditionPagePermitted: false,
    vncControllingPermitted: false,
    durationsPagePermitted: false,
    durationsPageEditPermitted: false,
    durationsPageDeletePermitted: false,
    extraCallPagePermitted: false,
    extraCallPageEditPermitted: false,
    extraCallPageDeletePermitted: false,
    callTryingsDataGridPermitted: false,
    callTryingsDataGridEditPermitted: false,
    callTryingsDataGridDeletePermitted: false,
    markedWordsPagePermitted: false,
    markedWordsPageEditPermitted: false,
    markedWordsPageDeletePermitted: false,
    dataPagePermitted: false,
    dataPageContactsDataGridDeletePermitted: false,
    dataPageContactsDataGridEditPermitted: false,
    dataPageContactsDataGridPermitted: false,
    dataPageRecognizedSpeechDgDeletePermitted: false,
    dataPageRecognizedSpeechFgPermitted: false,
    dataPageRecognizedSpeechDgEditPermitted: false,
    convPageRecognizedSpeechDg_permitted: false,
    convPageRecognizedSpeechDgDeletePermitted: false,
    convPageRecognizedSpeechDgEditPermitted: false,
    statisticsPagePermitted: false,
    addRelativePhotoPermitted: false,
    deleteRelativePhotoPermitted: false,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AdministrationEntity>) {
      state.user = action.payload;
    },
    removeUser(state) {
      state.user = undefined;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.credentials.username = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.credentials.password = action.payload;
    },
    setUserAutocompleteFieldFetchingStatus(
      state,
      action: PayloadAction<FetchingStatus>,
    ) {
      state.fetchingStatus = action.payload;
    },
    setUserAutocompleteFieldOpen(state, action: PayloadAction<boolean>) {
      state.usersAutocompleteFieldOpen = action.payload;
    },
    setUsersForAutocompleteField(
      state,
      action: PayloadAction<Array<AdministrationEntity>>,
    ) {
      state.usersForAutocompleteField = action.payload;
    },
    setUserToAutocompleteField(
      state,
      action: PayloadAction<AdministrationEntity | null>,
    ) {
      state.autocompleteFieldUser = action.payload;
    },
    setUserPassword(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.password = action.payload;
      }
    },
    setChangePasswordDate(state, action: PayloadAction<Date>) {
      if (state.user) {
        state.user.passwordChangeDate = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.pending, (state) => {
      state.user = undefined;
      state.userFetchStatus = 'LOADING';
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.userFetchStatus = 'SUCCESS';
      state.user = action.payload.user;
      state.credentials = { username: '', password: '' };
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.user = undefined;
      state.userFetchStatus = 'ERROR';
    });
    builder.addCase(refreshToken.pending, (state) => {
      state.user = undefined;
      state.userFetchStatus = 'LOADING';
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.userFetchStatus = 'SUCCESS';
      state.user = action.payload.user;
    });
    builder.addCase(refreshToken.rejected, (state) => {
      state.userFetchStatus = 'SUCCESS';
      state.user = undefined;
    });
    builder.addCase(
      loadNotArchivedAdministrationDataThunk.fulfilled,
      (state, action) => {
        state.fetchingStatus = 'SUCCESS';
        state.usersForAutocompleteField = action.payload.data;
      },
    );
    builder.addCase(
      loadNotArchivedAdministrationDataThunk.rejected,
      (state, action) => {
        state.fetchingStatus = 'ERROR';
      },
    );
    builder.addCase(loadPermissions.fulfilled, (state, action) => {
      if (action.payload.length > 0) state.permissions = action.payload[0];
    });
  },
});

export default userSlice.reducer;
export const userSelector = (state: RootState) => state.userSlice;
export const userPermissions = (state: RootState) =>
  state.userSlice.permissions;
export const {
  setUsername,
  setPassword,
  setUser,
  removeUser,
  setUserAutocompleteFieldFetchingStatus,
  setUserAutocompleteFieldOpen,
  setUsersForAutocompleteField,
  setUserToAutocompleteField,
  setUserPassword,
  setChangePasswordDate,
} = userSlice.actions;
