import CustomStore from 'devextreme/data/custom_store';
import { isNotEmpty } from '../../util';
import { fetchAllQuery, fetchOneQuery } from '../../../api/queries';
import { ENVERS_ACTIONS } from '../../../api/end-points';

const enversActionsDataSource = (backendSettings: BackendSettings) => ({
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

      return fetchAllQuery<EnversActionEntity>(
        backendSettings,
        ENVERS_ACTIONS,
        params,
      )
        .then((response) => {
          return {
            data: response.data.map((item) => {
              return {
                ...item,
                text: `${item.actionTypeName}`,
                value: item.id! - 1,
              };
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
      return await fetchOneQuery<EnversActionEntity>(
        backendSettings,
        ENVERS_ACTIONS,
        key,
      ).catch((err) => {
        throw err;
      });
    },
  }),
  sort: 'actionTypeName',
});

export default enversActionsDataSource;
