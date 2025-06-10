import CustomStore from 'devextreme/data/custom_store';
import {
  deleteQuery,
  fetchAllQuery,
  fetchOneQuery,
  insertQuery,
  updateQuery,
} from '../../api/queries';
import { EXTRA_CALL_PERMISSIONS } from '../../api/end-points';
import { isNotEmpty, updateValuesOfEntityDataTypeObject } from '../util';

/**
 * Create new custom store which prodives data grid with remote data functionality.
 * @returns custom store for extra call permissions data grid
 */
const extraCallPermissionsDataSource = (backendSettings: BackendSettings) =>
  new CustomStore({
    key: 'id',
    load: async (loadOptions: any) => {
      let params = '?';
      ['sort', 'filter'].forEach(function (i) {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          params += `${i}=${JSON.stringify(loadOptions[i])}&`;
        }
      });
      params = params.slice(0, -1);

      return fetchAllQuery<ExtraCallPermissionEntity>(
        backendSettings,
        EXTRA_CALL_PERMISSIONS,
        params,
      )
        .then((response) => {
          return {
            data: response.data,
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
      return await fetchOneQuery<ExtraCallPermissionEntity>(
        backendSettings,
        EXTRA_CALL_PERMISSIONS,
        key,
      ).catch((err) => {
        throw err;
      });
    },

    remove: async (key) => {
      return await deleteQuery(
        backendSettings,
        EXTRA_CALL_PERMISSIONS,
        key,
      ).catch((err) => {
        throw err;
      });
    },

    insert: async (values) => {
      return await insertQuery<ExtraCallPermissionEntity>(
        backendSettings,
        EXTRA_CALL_PERMISSIONS,
        values,
      )
        .then((res) => {
          if (res.status === 203) {
            const violations: Violations = res.data as Violations;
            throw new Error(res.status.toString(), { cause: violations });
          } else return res.data as ExtraCallPermissionEntity;
        })
        .catch((err: Error) => {
          throw err;
        });
    },

    update: async (key, values) => {
      //Here we should fetch entity by its id. Because values contain only changed values but not all the entity.
      await fetchOneQuery<ExtraCallPermissionEntity>(
        backendSettings,
        EXTRA_CALL_PERMISSIONS,
        key,
      )
        .then(async (res) => {
          // Then we should update changed values in fetched entity
          const returnedData: ExtraCallPermissionEntity =
            updateValuesOfEntityDataTypeObject(res, values);
          // Then just update entity
          await updateQuery<ExtraCallPermissionEntity>(
            backendSettings,
            EXTRA_CALL_PERMISSIONS,
            returnedData,
          )
            .then((res) => {
              if (res.status === 203) {
                const violations: Violations = res.data as Violations;
                throw new Error(res.status.toString(), { cause: violations });
              } else return res.data as ExtraCallPermissionEntity;
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

export default extraCallPermissionsDataSource;
