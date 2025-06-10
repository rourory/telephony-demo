import CustomStore from 'devextreme/data/custom_store';
import { isNotEmpty } from '../util';
import { fetchAllQuery, fetchOneQuery } from '../../api/queries';
import { RELATION_TYPES } from '../../api/end-points';

const relationTypesDataSource = (backendSettings: BackendSettings) => ({
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

      return fetchAllQuery<RelationTypeEntity>(
        backendSettings,
        RELATION_TYPES,
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
      return await fetchOneQuery<RelationTypeEntity>(
        backendSettings,
        RELATION_TYPES,
        key,
      ).catch((err) => {
        throw err;
      });
    },
  }),
  sort: 'relationTypeName',
});

export default relationTypesDataSource;
