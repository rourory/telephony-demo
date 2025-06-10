import CustomStore from 'devextreme/data/custom_store';
import { isNotEmpty, updateValuesOfEntityDataTypeObject } from '../util';
import {
  deleteQuery,
  fetchAllQuery,
  fetchOneQuery,
  insertQuery,
  updateQuery,
} from '../../api/queries';
import { RELATIVES } from '../../api/end-points';

/**
 * Create new custom store which prodives data grid with remote data functionality.
 * @returns custom store for convicted data grid
 */
const relativesDataSource = (backendSettings: BackendSettings) =>
  new CustomStore<RelativeEntity, number>({
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
        const response = await fetchAllQuery<RelativeEntity>(
          backendSettings,
          RELATIVES,
          params,
        );
        return {
          data: response.data.map((item) => {
            return {
              ...item,
              text: `${item.secondName} ${item.firstName}`,
              value: item.id,
            };
          }),
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
      return await fetchOneQuery<RelativeEntity>(
        backendSettings,
        RELATIVES,
        key,
      ).catch((err) => {
        throw err;
      });
    },

    remove: async (key) => {
      return await deleteQuery(backendSettings, RELATIVES, key).catch((err) => {
        throw err;
      });
    },

    insert: async (values) => {
      return await insertQuery<RelativeEntity>(
        backendSettings,
        RELATIVES,
        values,
      )
        .then((res) => {
          if (res.status === 203) {
            const violations: Violations = res.data as Violations;
            throw new Error(res.status.toString(), { cause: violations });
          } else return res.data as RelativeEntity;
        })
        .catch((err: Error) => {
          throw err;
        });
    },

    update: async (key, values) => {
      //Here we should fetch entity by its id. Because values contain only changed values but not all the entity.
      await fetchOneQuery<RelativeEntity>(backendSettings, RELATIVES, key)
        .then(async (res) => {
          // Then we should update changed values in fetched entity
          const returnedData: RelativeEntity =
            updateValuesOfEntityDataTypeObject(res, values);
          // Then just update entity
          await updateQuery<RelativeEntity>(
            backendSettings,
            RELATIVES,
            returnedData,
          )
            .then((res) => {
              if (res.status === 203) {
                const violations: Violations = res.data as Violations;
                throw new Error(res.status.toString(), { cause: violations });
              } else return res.data as RelativeEntity;
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

export default relativesDataSource;
