export const enum DeviceServiceEnum {
  SRVC_UI_CONTROLLING = 'UiControllingService',
  SRVC_RECORDING = 'RecordingService',
  SRVC_AUDIO_STREAMING = 'AudioStreamingService',
  SRVC_SPEECH_RECEIVING = 'SpeechReceivingService',
  SRVC_POWER_MANAGEMENT = 'PowerManagementService',
  SRVC_SPEECH_RECOGNITION = 'SpeechRecognitionService',
}

export const enum AudioServiceCommandProtocolEnum {
  NOT_READY_TO_RECEIVE_DATA = '100',
  READY_TO_RECEIVE_DATA = '101',
  READY_TO_RECEIVE_AUDIO = '102',
  NOT_READY_TO_RECEIVE_AUDIO = '103',
  READY_TO_RECEIVE_SPEECH = '104',
  NOT_READY_TO_RECEIVE_SPEECH = '105',
}

export const enum SoundTypeEnum {
  SILENCE = '0',
  AUDIO_TYPE = '1',
  SPEECH_TYPE = '2',
  NOTHING = '3',
}

export const enum CallResultConstant {
  CALL_FAILED = 1,
  CALL_SUCCEEDED = 2,
  CALL_ERROR = 3,
  CALL_PROCESSING = 4,
}

export const enum CommonServiceProtocolEnum {
  CLOSE_CONNECTION = 1000,
}

//_______________________ RecordingService_______________________

export const enum RecordingServiceResponceCodesEnum {
  ERROR = '0',
  CURRENT_SESSION = '2',
  RECORDING_STARTED = '3',
  RECORDING_FINISHED = '4',
  CLIENT_NOTIFIED = '5',
  RECORDING_INTERRUPTED_FORCEFULLY = '6',
}

export const enum RecordingRequestCodes {
  END_RECORDING = 0,
  CREATE_RECORDING = 1,
  SET_RELATIVE_ID = 3,
  SET_CONTACT_ID = 4,
  SET_CALL_ID = 5,
  ATTACH_CALL = 6,
}

export const enum InternalCallTypes {
  COMMON = 1,
  EXTRA = 2,
}

// ____________________UIControllingService_______________________
//1-10 - Errors
//11-20 - Need extra actions
//21-30 - Success
export const enum UIControllingServiceResponceCodes {
  Error = 1,
  ErrorDuringLaunching = 2,
  NotLaunched = 3,
  RecordingFailed = 4,
  UserNotFound = 11,
  CallNotSucceeded = 12,
  UserFound = 21,
  CallSucceeded = 22,
  CallFinished = 23,
  RecordingStarted = 24,
  RecordingFinished = 25,
  Launched = 26,
  UserFoundButNotValid = 27,
}

export const enum UIControllingRequestActionCodes {
  FIND_RELATIVE = '1',
  DO_AUDIO_CALL = '2',
  DO_VIDEO_CALL = '3',
  DECLINE_CALL = '4',
}

// ____________________PowerManagement_______________________
export const enum PowerManagementCodesEnum {
  REBOOT = '1',
  SHUTDOWN = '2',
  RESTART_TELEGRAM = '3',
}

// ____________________Recognition_______________________
export const enum RecognitionServiceRequestCodes {
  START_RECOGNITION = 1,
  END_RECOGNITION = 2,
}
