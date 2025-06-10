import CustomStore from 'devextreme/data/custom_store';
import { isNotEmpty, updateValuesOfEntityDataTypeObject } from '../util';
import {
  deleteQuery,
  fetchAllQuery,
  fetchOneQuery,
  insertQuery,
  updateQuery,
} from '../../api/queries';
import { PERMISSIONS } from '../../api/end-points';

const uiPermissionsDataSource = (backendSettings: BackendSettings) =>
  new CustomStore<UiPermissionEntity, number>({
    key: 'id',

    load: async (loadOptions: any) => {
      let params = '?';
      ['filter', 'requireTotalCount', 'sort'].forEach(function (i) {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          params += `${i}=${JSON.stringify(loadOptions[i])}&`;
        }
      });
      params = params.slice(0, -1);
      try {
        const response = await fetchAllQuery<UiPermissionEntity>(
          backendSettings,
          PERMISSIONS,
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
      return await fetchOneQuery<UiPermissionEntity>(
        backendSettings,
        PERMISSIONS,
        key,
      ).catch((err) => {
        throw err;
      });
    },

    remove: async (key) => {
      return await deleteQuery(backendSettings, PERMISSIONS, key).catch(
        (err) => {
          throw err;
        },
      );
    },

    insert: async (values) => {
      return await insertQuery<UiPermissionEntity>(
        backendSettings,
        PERMISSIONS,
        values,
      )
        .then((res) => {
          if (res.status === 203) {
            const violations: Violations = res.data as Violations;
            throw new Error(res.status.toString(), { cause: violations });
          } else return res.data as UiPermissionEntity;
        })
        .catch((err: Error) => {
          throw err;
        });
    },

    update: async (key, values) => {
      //Here we should fetch entity by its id. Because values contain only changed values but not all the entity.
      await fetchOneQuery<UiPermissionEntity>(backendSettings, PERMISSIONS, key)
        .then(async (res) => {
          // Then we should update changed values in fetched entity
          const returnedData: UiPermissionEntity =
            updateValuesOfEntityDataTypeObject(res, values);
          // Then just update entity
          await updateQuery<UiPermissionEntity>(
            backendSettings,
            PERMISSIONS,
            returnedData,
          )
            .then((res) => {
              if (res.status === 203) {
                const violations: Violations = res.data as Violations;
                throw new Error(res.status.toString(), { cause: violations });
              } else return res.data as UiPermissionEntity;
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

export default uiPermissionsDataSource;
