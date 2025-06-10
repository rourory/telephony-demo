type PhotoHolderEntity = 'RELATIVE' | 'CONVICTED' | 'ADMINISTRATION';

interface PhotoHolderUnit {
  id: number;
  entity: PhotoHolderEntity;
  state: FetchingStatus;
}

interface PhotoHolderState {
  photoHolders: Array<PhotoHolderUnit>;
}
