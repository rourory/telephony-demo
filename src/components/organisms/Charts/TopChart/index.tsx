import { BarChart } from '@mui/x-charts';
import { DatasetType } from '@mui/x-charts/internals';
import React from 'react';

interface TopChartProps {
  dataset: DatasetType;
  yAxisDataKey: string;
  xAxis: {
    xAxisLabel: string;
    colorMap: {
      thresholds: (number | Date)[];
      colors: string[];
    };
  };
  series: {
    dataKey: string;
    label: string;
    valueFormatter: (value: any) => string;
  };
  layout?: 'horizontal' | 'vertical' | undefined;
}

const TopChart: React.FC<TopChartProps> = ({
  dataset,
  yAxisDataKey,
  xAxis,
  series,
  layout = 'horizontal',
}) => {
  return (
    <div style={{ width: '95%', position: 'relative' }}>
      <BarChart
        dataset={dataset}
        margin={{ left: 150 }}
        colors={['rgba(144, 202, 249, 0.7)']}
        yAxis={[
          {
            scaleType: 'band',
            dataKey: yAxisDataKey,
            tickLabelStyle: {
              fontSize: '13px',
            },
          },
        ]}
        series={[
          {
            dataKey: series.dataKey,
            label: series.label,
            valueFormatter: series.valueFormatter,
          },
        ]}
        legend={{hidden: true}}
        layout={layout}
        grid={{ vertical: true }}
        height={800}
        xAxis={[
          {
            label: xAxis.xAxisLabel,
            colorMap: {
              type: 'piecewise',
              thresholds: xAxis.colorMap.thresholds,
              colors: xAxis.colorMap.colors,
            },
          },
        ]}
      />
    </div>
  );
};

export default TopChart;
