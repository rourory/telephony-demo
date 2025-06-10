import CustomStore from 'devextreme/data/custom_store';
import {
  deleteQuery,
  fetchAllQuery,
  fetchOneQuery,
  insertQuery,
  updateQuery,
} from '../../api/queries';
import { isNotEmpty, updateValuesOfEntityDataTypeObject } from '../util';
import { CALLS } from '../../api/end-points';

/**
 * Create new custom store which prodives data grid with remote data functionality.
 * @returns custom store for convicted data grid
 */
const callsDataSource = (backendSettings: BackendSettings) =>
  new CustomStore({
    key: 'id',

    load: async (loadOptions: any) => {
      let params = '?';
      ['filter', 'group', 'requireTotalCount', 'sort', 'skip', 'take'].forEach(
        function (i) {
          if (i in loadOptions && isNotEmpty(loadOptions[i])) {
            params += `${i}=${JSON.stringify(loadOptions[i])}&`;
          }
        },
      );
      params = params.slice(0, -1);
      try {
        const response = await fetchAllQuery<CallEntity>(
          backendSettings,
          CALLS,
          params,
        );
        return {
          data: response.data,
          totalCount: response.totalCount,
          summary: response.summary,
          groupCount: response.groupCount,
        };
      } catch (err) {
        // All the thrown errors will be handled in data grid component by onDataErrorOccured function
        throw err;
      }
    },

    byKey: async (key) => {
      return await fetchOneQuery<CallEntity>(backendSettings, CALLS, key).catch(
        (err) => {
          throw err;
        },
      );
    },

    remove: async (key) => {
      return await deleteQuery(backendSettings, CALLS, key).catch((err) => {
        throw err;
      });
    },

    insert: async (values) => {
      return await insertQuery<CallEntity>(backendSettings, CALLS, values)
        .then((res) => {
          if (res.status === 203) {
            const violations: Violations = res.data as Violations;
            throw new Error(res.status.toString(), { cause: violations });
          } else return res.data as CallEntity;
        })
        .catch((err: Error) => {
          throw err;
        });
    },

    update: async (key, values) => {
      //Here we should fetch entity by its id. Because values contain only changed values but not all the entity.
      await fetchOneQuery<CallEntity>(backendSettings, CALLS, key)
        .then(async (res) => {
          // Then we should update changed values in fetched entity
          const returnedData: CallEntity = updateValuesOfEntityDataTypeObject(
            res,
            values,
          );
          // Then just update entity
          await updateQuery<CallEntity>(backendSettings, CALLS, returnedData)
            .then((res) => {
              if (res.status === 203) {
                const violations: Violations = res.data as Violations;
                throw new Error(res.status.toString(), { cause: violations });
              } else return res.data as CallEntity;
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch((err: Error) => {
          throw err;
        });
    },
  });

export default callsDataSource;
