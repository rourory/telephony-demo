import { CONTACTS_AUD } from './../../../api/end-points';
import CustomStore from 'devextreme/data/custom_store';
import {
  deleteQuery,
  fetchAllQuery,
  fetchOneQuery,
  insertQuery,
  updateQuery,
} from '../../../api/queries';
import { isNotEmpty, updateValuesOfEntityDataTypeObject } from '../../util';

/**
 * Create new custom store which prodives data grid with remote data functionality.
 * @returns custom store for contacts_aud data grid
 */
const contactsAudDataSource = (backendSettigns: BackendSettings) =>
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
        const response = await fetchAllQuery<ContactsAudEntity>(
          backendSettigns,
          CONTACTS_AUD,
          params,
        );
        return {
          data: response.data,
          totalCount: response.totalCount,
          summary: response.summary,
          groupCount: response.groupCount,
        };
      } catch (err) {
        throw err;
      }
    },

    byKey: async (key) => {
      return await fetchOneQuery<ContactsAudEntity>(
        backendSettigns,
        CONTACTS_AUD,
        key,
      ).catch((err) => {
        throw err;
      });
    },

    remove: async (key) => {
      return await deleteQuery(backendSettigns, CONTACTS_AUD, key).catch(
        (err) => {
          throw err;
        },
      );
    },

    insert: async (values) => {
      return await insertQuery<ContactsAudEntity>(
        backendSettigns,
        CONTACTS_AUD,
        values,
      )
        .then((res) => {
          if (res.status === 203) {
            const violations: Violations = res.data as Violations;
            throw new Error(res.status.toString(), { cause: violations });
          } else return res.data as ContactsAudEntity;
        })
        .catch((err: Error) => {
          throw err;
        });
    },

    update: async (key, values) => {
      //Here we should fetch entity by its id. Because values contain only changed values but not all the entity.
      await fetchOneQuery<ContactsAudEntity>(backendSettigns, CONTACTS_AUD, key)
        .then(async (res) => {
          // Then we should update changed values in fetched entity
          const returnedData: ContactsAudEntity =
            updateValuesOfEntityDataTypeObject(res, values);
          // Then just update entity
          await updateQuery<ContactsAudEntity>(
            backendSettigns,
            CONTACTS_AUD,
            returnedData,
          )
            .then((res) => {
              if (res.status === 203) {
                const violations: Violations = res.data as Violations;
                throw new Error(res.status.toString(), { cause: violations });
              } else return res.data as ContactsAudEntity;
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

export default contactsAudDataSource;
