import CustomStore from 'devextreme/data/custom_store';
import {
  deleteQuery,
  fetchAllQuery,
  fetchOneQuery,
  insertQuery,
  updateQuery,
} from '../../api/queries';
import { isNotEmpty, updateValuesOfEntityDataTypeObject } from '../util';
import { ADMINISTRATION } from '../../api/end-points';

/**
 * Create new custom store which prodives data grid with remote data functionality.
 * @returns custom store for convicted data grid
 */
const administrationDataSource = (backendSettigns: BackendSettings) =>
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
        const response = await fetchAllQuery<AdministrationEntity>(
          backendSettigns,
          ADMINISTRATION,
          params,
        );
        return {
          data: response.data.map((item) => {
            return {
              ...item,
              text: `${item.username}`,
              value: item.id,
            };
          }),
          totalCount: response.totalCount,
          summary: response.summary,
          groupCount: response.groupCount,
        };
      } catch (err) {
        throw err;
      }
    },

    byKey: async (key) => {
      return await fetchOneQuery<AdministrationEntity>(
        backendSettigns,
        ADMINISTRATION,
        key,
      ).catch((err) => {
        throw err;
      });
    },

    remove: async (key) => {
      return await deleteQuery(backendSettigns, ADMINISTRATION, key).catch(
        (err) => {
          throw err;
        },
      );
    },

    insert: async (values) => {
      return await insertQuery<AdministrationEntity>(
        backendSettigns,
        ADMINISTRATION,
        values,
      )
        .then((res) => {
          if (res.status === 203) {
            const violations: Violations = res.data as Violations;
            throw new Error(res.status.toString(), { cause: violations });
          } else return res.data as AdministrationEntity;
        })
        .catch((err: Error) => {
          throw err;
        });
    },

    update: async (key, values) => {
      //Here we should fetch entity by its id. Because values contain only changed values but not all the entity.
      await fetchOneQuery<AdministrationEntity>(
        backendSettigns,
        ADMINISTRATION,
        key,
      )
        .then(async (res) => {
          // Then we should update changed values in fetched entity
          const returnedData: AdministrationEntity =
            updateValuesOfEntityDataTypeObject(res, values);
          // Then just update entity
          await updateQuery<AdministrationEntity>(
            backendSettigns,
            ADMINISTRATION,
            returnedData,
          )
            .then((res) => {
              if (res.status === 203) {
                const violations: Violations = res.data as Violations;
                throw new Error(res.status.toString(), { cause: violations });
              } else return res.data as AdministrationEntity;
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

export default administrationDataSource;
