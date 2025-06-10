declare type CommitSessionType = {
  ipAddress: string;
  open: boolean;
  person: PersonEntity | null;
  successAction?: () => void;
  failedAction?: () => void;
  errorAction?: () => void;
};
