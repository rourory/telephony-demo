import CustomStore from 'devextreme/data/custom_store';
import { isNotEmpty } from '../util';
import { CONTACT_TYPES } from '../../api/end-points';
import { fetchAllQuery, fetchOneQuery } from '../../api/queries';

const contactTypesDataSource = (backendSettings: BackendSettings) => ({
  store: new CustomStore<ContactTypeEntity, number>({
    key: 'id',

    load: async (loadOptions: any) => {
      let params = '?';
      ['sort'].forEach(function (i) {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          params += `${i}=${JSON.stringify(loadOptions[i])}&`;
        }
      });
      params = params.slice(0, -1);

      return fetchAllQuery<ContactTypeEntity>(
        backendSettings,
        CONTACT_TYPES,
        params,
      )
        .then((response) => {
          return {
            data: response.data.map((item) => {
              return {
                ...item,
                text: `${item.contactTypeName}`,
                value: item.id,
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
      return await fetchOneQuery<ContactTypeEntity>(
        backendSettings,
        CONTACT_TYPES,
        key,
      ).catch((err) => {
        throw err;
      });
    },
  }),
  sort: 'contactTypeName',
});

export default contactTypesDataSource;
