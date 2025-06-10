import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import StyledParagragp from '../../../atoms/StyledParagraph/Index';

interface CommonInfoPieChartProps {
  data: any[];
  dateFormatterMap: {
    labelFieldName: string;
    valueFieldName: string;
  };
}

const CommonInfoPieChart: React.FC<CommonInfoPieChartProps> = ({
  data,
  dateFormatterMap,
}) => {
  const formattedData = React.useMemo(() => {
    return data.map((item) => {
      return {
        label: item[dateFormatterMap.labelFieldName],
        value: item[dateFormatterMap.valueFieldName],
      };
    });
  }, [data]);

  const valueFormatter = React.useCallback(
    (item: { value: number }, totalAmount: number) => {
      if (totalAmount === 0) return '0 (0%)';
      const percentage = (item.value / totalAmount) * 100;
      return `${item.value} (${percentage.toFixed(2)}%)`;
    },
    [],
  );

  const totalAmount = React.useMemo(() => {
    return formattedData.reduce((acc, item) => acc + item.value, 0);
  }, [formattedData]);

  return (
    <>
      <PieChart
        series={[
          {
            data: formattedData,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 115, additionalRadius: -15, color: 'gray' },
            valueFormatter: (item) => valueFormatter(item, totalAmount),
            innerRadius: 100,
            outerRadius: 180,
          },
        ]}
        height={200}
      />
      <StyledParagragp
        text={`Всего осуществлено ${totalAmount} звонков`}
        fontSize="24px"
        fontWeight={600}
      />
    </>
  );
};

export default CommonInfoPieChart;
