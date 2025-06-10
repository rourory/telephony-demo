
declare interface UserAutocompleteFieldStateType {
  usersForAutocompleteField: Array<AdministrationEntity>;
  fetchingStatus: FetchingStatus;
  usersAutocompleteFieldOpen: boolean;
  autocompleteFieldUser: AdministrationEntity | null;
}

declare interface UserSliceType {
  user: AdministrationEntity | undefined;
  userFetchStatus: FetchingStatus;
  credentials: Credentials;
  permissions: UiPermissionEntity;
}
