interface BooleanResultType {
  address: string;
  booleanResult: boolean;
}

interface ServiceResponceType extends BooleanResultType {
  serviceName: string;
}

type DevicesSliceType = {
  fetching: FetchingStatus;
  devices: Array<DeviceState>;
  personDataOptions: Array<PersonEntity>;
  personDataOptionsLoadedAt?: Date;
  relativeValueOptions: Array<RelativeEntity>;
  contactValueOptions: Array<ContactEntity>;
  contactTypeValueOptions: Array<ContactTypeEntity>;
  relationTypeValueOptions: Array<RelationTypeEntity>;
  markedWords?: Array<MarkedWordEntity>;
  permittedDurations: Array<PermittedCallDurationEntity>;
};

type ServiceSocketConnection = {
  socket: WebSocket | null;
  ipAddress: string;
  port: number;
  serviceName: string;
};

type EstablishRemoteConnectionType = (
  serviceAddress: string,
  servicePort: number,
) => Promise<RemoteServiceState>;

interface RemoteServiceState {
  serviceName: string;
  isAvailable: boolean;
  isProcessing: boolean;
  port: number;
  socket: WebSocket | null;
  establishingConnection: boolean;
}

interface RecordingServiceExtended {
  callId: number | null;
  startTime: Date | null;
  personData: PersonEntity | null;
  relative: RelativeEntity | null;
  contact: ContactEntity | null;
  videoPath: string | null;
  isRecordProcessingStarting: boolean;
}

type RecordingService = RemoteServiceState & RecordingServiceExtended;

interface VncServiceState {
  address: string;
  port: number;
  username: string;
  password: string;
  viewOnly: boolean;
}

type VncScreenStateType = {
  address: string;
  screen: () => JSX.Element;
};

type VncVideoShowStateType = {
  actualVncServiceUrl?: string;
  openVncVideoFrame: boolean;
  fullscreenVncVideoFrame: boolean;
  fetchStatusVncVideoFrame: FetchingStatus;
  vncScreens: Array<VncScreenStateType>;
};

type DeviceState = {
  number: number;
  ipAddress: string;
  devicePassword: string;
  isTurnedOn: boolean;
  recordingService: RecordingService;
  recognitionService: RemoteServiceState;
  services: Array<RemoteServiceState>;
  vncService: VncServiceState;
  personDataAutocompleteField: {
    open: boolean;
    loading: boolean;
  };
  relativeValueAutocompleteField: {
    open: boolean;
    loading: boolean;
  };
  contactValueAutocompleteField: {
    open: boolean;
    loading: boolean;
    disabled: boolean;
  };
  doCallButtonDisabled: boolean;
  speechRecognizingEnabled: boolean;
  cancelCallButtonDisabled: boolean;
  reloadButtonDisabled: boolean;
  commitSessionButtonDisabled: boolean;
  doCallButtonLoading: boolean;
  cancelCallButtonLoading: boolean;
  commitSessionButtonLoading: boolean;
  availableSessions: Array<ExtraCallPermissionEntity>;
  currentCallDuration?: number;
  audioRetranslationSocketConnected: boolean;
  speechRetranslationSocketConnected: boolean;
};

interface RecordingServiceResponce {
  Code: string;
  Message: string;
}

interface UIControllingServiceResponce {
  Code: number;
  Message: string;
  CallId: number;
  ContactId: number;
}

interface CurrentSessionResponce extends RecordingServiceResponce {
  session: RecordingServiceCurrentSessionType;
}

type RecordingServiceCurrentSessionType = {
  CallId?: number;
  UserId?: number;
  UserName?: string;
  UserSurName?: string;
  UserMiddleName?: string;
  SessionStarted?: string;
  RelativeId?: number;
  ContactId?: number;
  VideoPath?: string;
  ResultId?: number;
  AdministrationId?: number;
  DurationMinutes?: number;
  BeforeTimerEndsWarningMinutes?: number;
  InternalCallType?: number;
  ExtraCallPermissionId?: number;
};

interface AudioChunkMessage {
  SoundType: string;
  RecognizedText: string;
  CallId: string;
  ConvictedId: string;
}
