import { Box } from '@mui/material';
import React from 'react';
import { green, red } from '@mui/material/colors';
import { CustomWidth185Tooltip } from '../../atoms/CustomizedTooltip/width-185-tooltip';
import StyledParagragp from '../../atoms/StyledParagraph/Index';

interface DeviceSpeechRecognizerStateBoxProps {
  audioRecognizerConnectedState: boolean;
  speechRecognizerConnectedState: boolean;
  disabled?: boolean;
}

const defineColor = (connection: boolean, disabled: boolean) => {
  if (disabled) {
    return disabledColor;
  }
  if (connection) {
    return green[500];
  }
  return red[500];
};

const disabledColor = 'rgba(110, 110, 110, 0.63)';

const DeviceSpeechRecognizerStateBox: React.FC<
  DeviceSpeechRecognizerStateBoxProps
> = ({
  audioRecognizerConnectedState,
  speechRecognizerConnectedState,
  disabled = false,
}) => {
  return (
    <CustomWidth185Tooltip
      title={
        <StyledParagragp
          text="Статус подключения к сервису распознавания речи"
          fontSize="13px"
        />
      }
      enterDelay={1000}
      disableHoverListener={disabled}
    >
      <Box
        position={'absolute'}
        sx={{
          border: disabled
            ? '1px solid disabledColor'
            : '1px solid rgba(144, 202, 249, 0.3)',
          borderRadius: '4px',
          padding: '0px 7px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <div style={{ fontSize: '12px' }}>
              <StyledParagragp
                text="Абонент"
                fontSize="12px"
                fontColor={disabled ? disabledColor : ''}
              />
            </div>
            <div style={{ fontSize: '12px' }}>
              <StyledParagragp
                text="Собеседник"
                fontSize="12px"
                fontColor={disabled ? disabledColor : ''}
              />
            </div>
          </div>
          <div
            style={{
              marginLeft: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                backgroundColor: defineColor(
                  audioRecognizerConnectedState,
                  disabled,
                ),
                width: '10px',
                height: '10px',
                borderRadius: '100%',
                transition: '1000ms all',
              }}
            />
            <div
              style={{
                fontSize: '12px',
                backgroundColor: defineColor(
                  speechRecognizerConnectedState,
                  disabled,
                ),
                width: '10px',
                height: '10px',
                borderRadius: '100%',
                transition: '1000ms all',
              }}
            />
          </div>
        </div>
      </Box>
    </CustomWidth185Tooltip>
  );
};

export default DeviceSpeechRecognizerStateBox;
