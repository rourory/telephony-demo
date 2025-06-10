import CustomStore from 'devextreme/data/custom_store';
import { isNotEmpty, updateValuesOfEntityDataTypeObject } from '../util';
import {
  deleteQuery,
  fetchAllQuery,
  fetchOneQuery,
  insertQuery,
  updateQuery,
} from '../../api/queries';
import { PERMITTED_CALL_DURATIONS } from '../../api/end-points';

const permittedCallDurationsDataSource = (
  backendSettings: BackendSettings,
) => ({
  store: new CustomStore({
    key: 'id',

    load: async (loadOptions: any) => {
      let params = '?';
      ['searchValue', 'sort'].forEach(function (i) {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          params += `${i}=${JSON.stringify(loadOptions[i])}&`;
        }
      });
      params = params.slice(0, -1);
      return fetchAllQuery<PermittedCallDurationEntity>(
        backendSettings,
        PERMITTED_CALL_DURATIONS,
        params,
      )
        .then((response) => {
          return {
            data: response.data.map((item) => {
              return { ...item, text: item.duration, value: item.id };
            }),
            totalCount: response.totalCount,
            summary: response.summary,
            groupCount: response.groupCount,
          };
        })
        .catch((err) => {
          throw err;
        });
    },

    byKey: async (key) => {
      return await fetchOneQuery<PermittedCallDurationEntity>(
        backendSettings,
        PERMITTED_CALL_DURATIONS,
        key,
      ).catch((err) => {
        throw err;
      });
    },

    remove: async (key) => {
      return await deleteQuery(
        backendSettings,
        PERMITTED_CALL_DURATIONS,
        key,
      ).catch((err) => {
        throw err;
      });
    },

    insert: async (values) => {
      return await insertQuery<PermittedCallDurationEntity>(
        backendSettings,
        PERMITTED_CALL_DURATIONS,
        values,
      )
        .then((res) => {
          if (res.status === 203) {
            const violations: Violations = res.data as Violations;
            throw new Error(res.status.toString(), { cause: violations });
          } else return res.data as PermittedCallDurationEntity;
        })
        .catch((err: Error) => {
          throw err;
        });
    },

    update: async (key, values) => {
      //Here we should fetch entity by its id. Because values contain only changed values but not all the entity.
      await fetchOneQuery<PermittedCallDurationEntity>(
        backendSettings,
        PERMITTED_CALL_DURATIONS,
        key,
      )
        .then(async (res) => {
          // Then we should update changed values in fetched entity
          const returnedData: PermittedCallDurationEntity =
            updateValuesOfEntityDataTypeObject(res, values);
          // Then just update entity
          await updateQuery<PermittedCallDurationEntity>(
            backendSettings,
            PERMITTED_CALL_DURATIONS,
            returnedData,
          )
            .then((res) => {
              if (res.status === 203) {
                const violations: Violations = res.data as Violations;
                throw new Error(res.status.toString(), { cause: violations });
              } else return res.data as PermittedCallDurationEntity;
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch((err: Error) => {
          throw err;
        });
    },
  }),
  sort: 'duration',
});

export default permittedCallDurationsDataSource;
