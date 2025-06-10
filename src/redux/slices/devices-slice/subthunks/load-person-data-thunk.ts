import { createAsyncThunk } from '@reduxjs/toolkit';

import { setPersonDataFieldLoading } from '../devices-slice';
import { resolvePersonDataThunkPredicates } from '../resolve-person-data-thunk-predicates';
import { CONVICTED } from '../../../../api/end-points';
import { fetchAllQuery } from '../../../../api/queries';
import { plusMinutes } from '../../../../utils/datetimeutils';

export const loadPersonDataThunk = createAsyncThunk<
  { ipAddress: string; data: Array<PersonEntity>; lastLoaded: Date },
  {
    ipAddress: string;
    squadNumber: number | null;
    onlyIsNotUnderControl: boolean;
    archived: boolean;
    backendSettings: BackendSettings;
    lastLoaded?: Date;
    currentData: Array<PersonEntity>;
  }
>('devices/loadPersonDataThunk', async (args, thunkApi) => {
  thunkApi.dispatch(
    setPersonDataFieldLoading({ ipAddress: args.ipAddress, loading: true }),
  );
  let personData: Array<PersonEntity> = [];
  let lastLoaded = args.lastLoaded;



  if (!lastLoaded) {
    lastLoaded = new Date();
    await fetchAllQuery<PersonEntity>(
      args.backendSettings,
      CONVICTED,
      resolvePersonDataThunkPredicates(
        args.squadNumber,
        args.onlyIsNotUnderControl,
        args.archived,
      ),
    )
      .then((res) => {
        personData = res.data;
      })
      .catch((err) => thunkApi.rejectWithValue(err));
  } else if (new Date() >= plusMinutes(lastLoaded, 1)) {
    lastLoaded = new Date();
    await fetchAllQuery<PersonEntity>(
      args.backendSettings,
      CONVICTED,
      resolvePersonDataThunkPredicates(
        args.squadNumber,
        args.onlyIsNotUnderControl,
        args.archived,
      ),
    )
      .then((res) => {
        personData = res.data;
      })
      .catch((err) => thunkApi.rejectWithValue(err));
  } else {
    personData = args.currentData;
  }

  return {
    ipAddress: args.ipAddress,
    data: personData,
    lastLoaded: lastLoaded,
  };
});
