import { DatasetType } from '@mui/x-charts/internals';

export interface TopConvictedDTO extends Entity, DatasetType {
  callAmount: number;
  firstName: number;
  lastName: number;
  middleName: number;
  squadNumber: number;
  firstCallDate: number;
  LastCallDate: number;
}

export interface TopAdministrationDTO extends Entity {
  callAmount: number;
  userName: string;
  callStartTime: number;
  callEndTime: number;
}

export interface CommonInfoDTO extends Entity {
  resultTypeName: string;
  callAmount: number;
}
