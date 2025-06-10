type ErrorWithMessage = {
  messages: Array<string>;
};

type Violations = {
  violations: ViolationObject[];
};

type ViolationObject = {
  attribute: string;
  messages: string[];
};

interface DataResponce<T> {
  data: Array<T>;
  totalCount: number;
  summary: object;
  groupCount: object;
}

interface EnityFieldValidResponse {
  valid: boolean;
  violation: ViolationObject;
}

type UserDataResponce = {
  user: AdministrationEntity;
  token: string;
};
