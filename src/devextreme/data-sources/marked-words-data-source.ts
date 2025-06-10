import CustomStore from 'devextreme/data/custom_store';
import { isNotEmpty, updateValuesOfEntityDataTypeObject } from '../util';
import {
  deleteQuery,
  fetchAllQuery,
  fetchOneQuery,
  insertQuery,
  updateQuery,
} from '../../api/queries';
import { MARKED_WORDS } from '../../api/end-points';

const markedWordsDataSource = (backendSettings: BackendSettings) => ({
  store: new CustomStore({
    key: 'id',
    load: async (loadOptions: any) => {
      let params = '?';
      ['sort'].forEach(function (i) {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          params += `${i}=${JSON.stringify(loadOptions[i])}&`;
        }
      });
      params = params.slice(0, -1);

      return fetchAllQuery<MarkedWordEntity>(
        backendSettings,
        MARKED_WORDS,
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
      return await fetchOneQuery<MarkedWordEntity>(
        backendSettings,
        MARKED_WORDS,
        key,
      ).catch((err) => {
        throw err;
      });
    },

    remove: async (key) => {
      return await deleteQuery(backendSettings, MARKED_WORDS, key).catch(
        (err) => {
          throw err;
        },
      );
    },

    insert: async (values) => {
      return await insertQuery<MarkedWordEntity>(
        backendSettings,
        MARKED_WORDS,
        values,
      )
        .then((res) => {
          if (res.status === 203) {
            const violations: Violations = res.data as Violations;
            throw new Error(res.status.toString(), { cause: violations });
          } else return res.data as MarkedWordEntity;
        })
        .catch((err: Error) => {
          throw err;
        });
    },

    update: async (key, values) => {
      //Here we should fetch entity by its id. Because values contain only changed values but not all the entity.
      await fetchOneQuery<MarkedWordEntity>(backendSettings, MARKED_WORDS, key)
        .then(async (res) => {
          // Then we should update changed values in fetched entity
          const returnedData: MarkedWordEntity =
            updateValuesOfEntityDataTypeObject(res, values);
          // Then just update entity
          await updateQuery<MarkedWordEntity>(
            backendSettings,
            MARKED_WORDS,
            returnedData,
          )
            .then((res) => {
              if (res.status === 203) {
                const violations: Violations = res.data as Violations;
                throw new Error(res.status.toString(), { cause: violations });
              } else return res.data as MarkedWordEntity;
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
  sort: 'word',
});

export default markedWordsDataSource;
