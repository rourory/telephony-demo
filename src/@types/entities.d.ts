interface Entity {
  id?: number;
}

interface CreationInfo {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PersonEntity extends Entity, CreationInfo {
  firstName: string;
  secondName: string;
  middleName: string;
  squadNumber: number;
  isUnderControl: boolean;
  archived: boolean;
  personalFileNumber: number;
}

interface RelativeEntity extends Entity, CreationInfo {
  firstName: string;
  secondName: string;
  middleName: string;
  relationType: number;
  convictedId?: number;
}

interface ContactEntity extends Entity, CreationInfo {
  contactTypeId: number;
  relativeId?: number;
  contactValue: string;
  frozen: boolean;
}

interface RelationTypeEntity extends Entity {
  relationTypeName: string;
  relationTypeShortName: string;
}

interface ContactTypeEntity extends Entity {
  contactTypeName: string;
  contactTypeShortName: string;
}

interface DeviceEntity extends Entity {
  number: number;
  ip: string;
  devicePassword: string;
  recordingServiceVideoPath: string;
  vncUsername: string;
  vncPassword: string;
  vncViewOnly: boolean;
  speechRecognizingEnabled: boolean;
  vncServicePort: number;
  recordingServicePort: number;
  audioStreamingServicePort: number;
  speechStreamingServicePort: number;
  uiControllingServicePort: number;
  powerManagementServicePort: number;
  speechRecognitionServicePort: number;
}

interface CallEntity extends Entity {
  convictedId: number;
  relativeId?: number;
  contactId?: number;
  administrationId: number;
  callStartTime: Date;
  callFinishTime?: Date;
  resultId?: number;
  videoPath?: string;
}

interface AdministrationEntity extends Entity {
  roleId: number;
  username: string;
  squadNumber: number;
  password?: string;
  archived?: boolean;
  passwordChangeDate?: Date;
}

interface CallResultTypeEntity extends Entity {
  callResultTypeName: string;
  callResultTypeShortName: string;
}

interface RoleEntity extends Entity {
  roleName: string;
}

interface MarkedWordEntity extends Entity, CreationInfo {
  word: string;
  root: string;
}

interface UiPermissionEntityBooleanColumns {
  canGiveCallsToAnotherSquad: boolean;
  canGiveCallsToControlled: boolean;
  convictedPagePermitted: boolean;
  convictedPageEditPermitted: boolean;
  convictedPageDeletePermitted: boolean;
  convictedPageRelativeDataGridPermitted: boolean;
  convictedPageRelativeDataGridEditPermitted: boolean;
  convictedPageRelativeDataGridDeletePermitted: boolean;
  convictedPageCallsDataGridPermitted: boolean;
  convictedPageCallsDataGridEditPermitted: boolean;
  convictedPageCallsDataGridDeletePermitted: boolean;
  relativeDataGridContactsDataGridPermitted: boolean;
  relativeDataGridContactsDataGridEditPermitted: boolean;
  relativeDataGridContactsDataGridDeletePermitted: boolean;
  callsPagePermitted: boolean;
  callsPageEditPermitted: boolean;
  callsPageDeletePermitted: boolean;
  devicesPagePermitted: boolean;
  devicesPageEditPermitted: boolean;
  devicesPageDeletePermitted: boolean;
  administrationPagePermitted: boolean;
  administrationPageEditPermitted: boolean;
  administrationPageDeletePermitted: boolean;
  settingsPagePermitted: boolean;
  permissionsDataGridPermitted: boolean;
  permissionsDataGridEditPermitted: boolean;
  permissionsDataGridDeletePermitted: boolean;
  rolesDataGridPermitted: boolean;
  rolesDataGridEditPermitted: boolean;
  rolesDataGridDeletePermitted: boolean;
  settingsTabPermitted: boolean;
  auditionPagePermitted: boolean;
  auditionColumnsPermitted: boolean;
  vncControllingPermitted: boolean;
  durationsPagePermitted: boolean;
  durationsPageEditPermitted: boolean;
  durationsPageDeletePermitted: boolean;
  extraCallPagePermitted: boolean;
  extraCallPageEditPermitted: boolean;
  extraCallPageDeletePermitted: boolean;
  callTryingsDataGridPermitted: boolean;
  callTryingsDataGridEditPermitted: boolean;
  callTryingsDataGridDeletePermitted: boolean;
  dataPagePermitted: boolean;
  dataPageContactsDataGridPermitted: boolean;
  dataPageContactsDataGridEditPermitted: boolean;
  dataPageContactsDataGridDeletePermitted: boolean;
  dataPageRecognizedSpeechFgPermitted: boolean;
  dataPageRecognizedSpeechDgEditPermitted: boolean;
  dataPageRecognizedSpeechDgDeletePermitted: boolean;
  convPageRecognizedSpeechDg_permitted: boolean;
  convPageRecognizedSpeechDgEditPermitted: boolean;
  convPageRecognizedSpeechDgDeletePermitted: boolean;
  markedWordsPagePermitted: boolean;
  markedWordsPageEditPermitted: boolean;
  markedWordsPageDeletePermitted: boolean;
  statisticsPagePermitted: boolean;
  addRelativePhotoPermitted: boolean;
  deleteRelativePhotoPermitted: boolean;
}

interface UiPermissionEntity extends Entity, UiPermissionEntityBooleanColumns {
  roleId: number | null;
  temporaryGivingCallsToAnotherSquad: string | null;
  temporaryGivingCallsToAnotherSquadHours: number | null;
}

interface EnversActionEntity extends Entity {
  actionTypeNumber: number;
  actionTypeName: string;
}

interface PermittedCallDurationEntity extends Entity, CreationInfo {
  duration: number;
}

interface ReconizedSpeechEntity extends Entity, CreationInfo {
  convictedId: number;
  callId: number;
  relativeSaid: string;
  convictedSaid: string;
}

interface CallTryingEntity extends Entity {
  callId: number;
  contactId: number;
  tryingDate: Date;
}

interface ExtraCallPermissionEntity extends Entity, CreationInfo {
  convictedId: number;
  commitiongDate: Date;
  duration: PermittedCallDurationEntity;
}

interface ServerSettingsEntity extends Entity {
  beforeTimerEndsWarningMinutes: number;
  standardCallDuration: PermittedCallDurationEntity | null;
  changePasswordRequiredIntervalMonths: number;
}

//AUDITION
interface Revision extends Entity {
  rev: number;
  revtstmp: number;
  username: string;
}

interface AuditionEntity extends Entity {
  rev: number;
  revision: Revision;
  revtype: number;
}

interface ContactsAudEntity extends AuditionEntity, CreationInfo {
  contactValue: string;
  contactTypeId: number;
  relativeId: number;
  frozen: boolean;
}

interface RelativesAudEntity extends AuditionEntity, CreationInfo {
  firstName: string;
  secondName: string;
  middleName: string;
  relationType: number;
  convictedId: number;
}

interface ConvictedAudEntity extends AuditionEntity, CreationInfo {
  firstName: string;
  secondName: string;
  middleName: string;
  squadNumber: number;
  isUnderControl: boolean;
  archived: boolean;
}
