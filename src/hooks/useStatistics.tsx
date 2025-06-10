import React from "react";
import { useSelector } from "react-redux";
import {
  TopConvictedDTO,
  TopAdministrationDTO,
  CommonInfoDTO,
} from "../@types/dtos";
import {
  STATISTICS_TOP_CONVICTED,
  STATISTICS_TOP_ADMINISTRATION,
  STATISTICS_TOP_COMMON_INFO,
} from "../api/end-points";
import { fetchAllQuery } from "../api/queries";
import { appSettingsStateSelector } from "../redux/slices/app-settings-slice/app-settings-slice";
import { plusHours } from "../utils/datetimeutils";

export const useStatistics = () => {
  const backendSettings = useSelector(appSettingsStateSelector);

  const [end, setEnd] = React.useState(new Date());
  const [start, setStart] = React.useState<Date>(
    plusHours(new Date(), -24 * 30)
  );

  const [topConvicted, setTopConvicted] = React.useState<any>([]);
  const [topAdministration, setTopAdministration] = React.useState<any>([]);
  const [commonInfo, setCommonInfo] = React.useState<any>([]);

  React.useEffect(() => {
    fetchAllQuery<TopConvictedDTO>(
      backendSettings,
      STATISTICS_TOP_CONVICTED,
      `?start=${start.getTime()}&end=${end.getTime()}`
    )
      .then((res) => {
        setTopConvicted(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    fetchAllQuery<TopAdministrationDTO>(
      backendSettings,
      STATISTICS_TOP_ADMINISTRATION,
      `?start=${start.getTime()}&end=${end.getTime()}`
    )
      .then((res) => {
        setTopAdministration(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    fetchAllQuery<CommonInfoDTO>(
      backendSettings,
      STATISTICS_TOP_COMMON_INFO,
      `?start=${start.getTime()}&end=${end.getTime()}`
    )
      .then((res) => {
        setCommonInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [start, end]);

  return {
    start,
    setStart,
    end,
    setEnd,
    topConvicted,
    topAdministration,
    commonInfo,
  };
};
