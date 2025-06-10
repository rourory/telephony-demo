interface ChangePasswordDialogSlice {
  open: boolean;
  password: string;
  text?: string;
  confirmation: string;
  fetchingStatus: FetchingStatus;
}
