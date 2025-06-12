import { REVISIONS } from "../../../api/end-points";
import CustomStore from "devextreme/data/custom_store";
import {
  deleteQuery,
  fetchAllQuery,
  fetchOneQuery,
  insertQuery,
  updateQuery,
} from "../../../api/queries";
import { isNotEmpty, updateValuesOfEntityDataTypeObject } from "../../util";

/**
 * Create new custom store which prodives data grid with remote data functionality.
 * @returns custom store for relatives_aud data grid
 */
const revInfoDataSource = (backendSettigns: BackendSettings) =>
  new CustomStore({
    key: "id",

    load: async (loadOptions: any) => {
      let params = "?";
      ["filter", "group", "requireTotalCount", "sort", "skip", "take"].forEach(
        function (i) {
          if (i in loadOptions && isNotEmpty(loadOptions[i])) {
            params += `${i}=${JSON.stringify(loadOptions[i])}&`;
          }
        }
      );
      params = params.slice(0, -1);

      try {
        const response = await fetchAllQuery<Revision>(
          backendSettigns,
          REVISIONS,
          params
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
      return await fetchOneQuery<Revision>(
        backendSettigns,
        REVISIONS,
        key
      ).catch((err) => {
        throw err;
      });
    },

    remove: async (key) => {
      return await deleteQuery(backendSettigns, REVISIONS, key).catch((err) => {
        throw err;
      });
    },

    insert: async (values) => {
      return await insertQuery<Revision>(backendSettigns, REVISIONS, values)
        .then((res) => {
          if (res.status === 203) {
            const violations: Violations = res.data as Violations;
            throw new Error(res.status.toString(), { cause: violations });
          } else return res.data as Revision;
        })
        .catch((err: Error) => {
          throw err;
        });
    },

    update: async (key, values) => {
      //Here we should fetch entity by its id. Because values contain only changed values but not all the entity.
      await fetchOneQuery<Revision>(backendSettigns, REVISIONS, key)
        .then(async (res) => {
          // Then we should update changed values in fetched entity
          const returnedData: Revision = updateValuesOfEntityDataTypeObject(
            res,
            values
          );
          // Then just update entity
          await updateQuery<Revision>(backendSettigns, REVISIONS, returnedData)
            .then((res) => {
              if (res.status === 203) {
                const violations: Violations = res.data as Violations;
                throw new Error(res.status.toString(), { cause: violations });
              } else return res.data as Revision;
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

export default revInfoDataSource;
