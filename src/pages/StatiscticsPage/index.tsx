import { DateBox } from "devextreme-react";
import React from "react";

import StyledParagragp from "../../components/atoms/StyledParagraph/Index";
import { useStatistics } from "../../hooks/useStatistics";
import ChartContainer from "../../components/organisms/Charts/CahrtContainer";
import CommonInfoPieChart from "../../components/organisms/Charts/CommnInfoPieChart";
import TopChart from "../../components/organisms/Charts/TopChart";

const StatisticsPage = () => {
  const {
    start,
    setStart,
    end,
    setEnd,
    topConvicted,
    topAdministration,
    commonInfo,
  } = useStatistics();

  const intervalDays = React.useMemo(() => {
    if (start && end) {
      const diff = end.getTime() - start.getTime();
      return diff / (1000 * 60 * 60 * 24);
    }
    return 0;
  }, [end, start]);

  return (
    <>
      <div style={{ display: "flex", width: "100%", marginBottom: "20px" }}>
        <DateBox
          value={start}
          isValid={end >= start}
          onValueChange={(e) => setStart(new Date(e))}
          label="С какого момента"
          type="datetime"
          width={"50%"}
        />
        <DateBox
          value={end}
          isValid={end >= start}
          onValueChange={(e) => setEnd(new Date(e))}
          label="По какой момент"
          type="datetime"
          width={"50%"}
        />
      </div>
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <StyledParagragp
          text={`Период с ${start.toLocaleDateString()} по ${end.toLocaleDateString()}. Интервал: ${Math.ceil(
            intervalDays
          )} дн.`}
          fontSize="20px"
          fontWeight={600}
        />
      </div>
      <ChartContainer title={"Общая информация"} minHeight="500px">
        <CommonInfoPieChart
          data={commonInfo}
          dateFormatterMap={{
            labelFieldName: "resultTypeName",
            valueFieldName: "callAmount",
          }}
        />
      </ChartContainer>

      <ChartContainer
        title={"Статистика осужденных по количеству успешных звонков"}
      >
        <TopChart
          dataset={topConvicted}
          yAxisDataKey={"lastName"}
          xAxis={{
            xAxisLabel: "Количество звонков",
            colorMap: {
              thresholds: [
                intervalDays * 0.3,
                intervalDays * 0.5,
                intervalDays * 0.67,
              ],
              colors: [
                "rgba(144, 202, 249, 0.9)",
                "rgba(246, 255, 0, 0.9)",
                "rgba(245, 0, 0, 0.9)",
              ],
            },
          }}
          series={{
            dataKey: "callAmount",
            label: "Количество звонков",
            valueFormatter: (value: any) => value,
          }}
        />
      </ChartContainer>
      <ChartContainer
        title={"Статистика сотрудников по количеству успешных звонков"}
      >
        <TopChart
          dataset={topAdministration}
          yAxisDataKey={"userName"}
          xAxis={{
            xAxisLabel: "Количество звонков",
            colorMap: {
              thresholds: [
                intervalDays,
                intervalDays * 3,
                intervalDays * 6,
                intervalDays * 9,
                intervalDays * 12,
              ],
              colors: [
                "rgba(0, 255, 153, 0.9)",
                "rgba(144, 202, 249, 0.9)",
                "rgba(246, 255, 0, 0.9)",
                "rgba(255, 149, 0, 0.9)",
                "rgba(245, 0, 0, 0.9)",
              ],
            },
          }}
          series={{
            dataKey: "callAmount",
            label: "Количество звонков",
            valueFormatter: (value: any) => value,
          }}
        />
      </ChartContainer>
    </>
  );
};

export default StatisticsPage;
