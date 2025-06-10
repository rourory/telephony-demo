import React from 'react';
import StyledParagragp from '../../../atoms/StyledParagraph/Index';

interface ChartContainerProps {
  title: string;
  minHeight?: string;
}

const ChartContainer: React.FC<
  React.PropsWithChildren<ChartContainerProps>
> = ({ children, title, minHeight = '200px' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '20px 20px 10px 20px',
        padding: '10px',
        border: '2px solid rgba(144, 202, 249, 0.3)',
        borderRadius: '20px',
        alignItems: 'center',
        minHeight: minHeight,
      }}
    >
      <StyledParagragp text={title} fontSize="24px" fontWeight={600} />
      <div
        style={{
          width: '95%',
          height: '2px',
          marginTop: '10px',
          backgroundColor: 'rgba(144, 202, 249, 0.3)',
        }}
      />
      {children}
    </div>
  );
};

export default ChartContainer;
