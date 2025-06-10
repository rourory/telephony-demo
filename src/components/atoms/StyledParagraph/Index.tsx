import React, { memo } from 'react';

type StyledParagraphType = {
  text: string;
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  fontSize?: string;
  fontColor?: string;
  textAlign?: any;
};

const StyledParagragp: React.FC<StyledParagraphType> = memo(
  ({
    text,
    fontWeight = 400,
    fontSize = '18px',
    fontColor = '',
    textAlign = '',
  }) => {
    return (
      <span
        style={{
          fontFamily: 'AdventPro',
          marginBlockStart: 0,
          marginBlockEnd: 0,
          fontWeight: fontWeight,
          fontSize: fontSize,
          userSelect: 'none',
          color: fontColor,
          textAlign: textAlign,
        }}
      >
        {text}
      </span>
    );
  },
);

export default StyledParagragp;
