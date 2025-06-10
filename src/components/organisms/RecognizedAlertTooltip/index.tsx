import { IconButton } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { recognizedSpeechItemSelector, clearAllMarkedWordsFromRecognizedSpeech } from '../../../redux/slices/recognized-speech-slice.ts/recognized-speech-slice';
import { AppDispatch, RootState } from '../../../redux/store';
import { RecognizerAlertTooltip } from '../../atoms/CustomizedTooltip/width-350-tooltip';
import StyledParagragp from '../../atoms/StyledParagraph/Index';


interface RecognizedAlertTooltipProps {
  device: DeviceState;
  child: React.ReactElement
}

const RecognizedAlertTooltipComponent: React.FC<RecognizedAlertTooltipProps> = ({ device, child }) => {

    const dispatch = useDispatch<AppDispatch>();
    const [closeButtonHovered, setCloseButtonHovered] = React.useState(false);

  const recognizedSpeechItem = useSelector((state: RootState) =>
    recognizedSpeechItemSelector(state, device.ipAddress),
  );

  const recognizedSpeechAlertOpen = React.useMemo(
    () =>
      (recognizedSpeechItem && recognizedSpeechItem.recognized.length > 0) ||
      false,
    [recognizedSpeechItem],
  );

  const recognizedWord = React.useMemo(() => {
    if (recognizedSpeechItem && recognizedSpeechItem.recognized.length > 0) {
      return recognizedSpeechItem.recognized[0].recognizedWord;
    }
  }, [recognizedSpeechItem]);
  const text = React.useMemo(() => {
    if (recognizedSpeechItem && recognizedSpeechItem.recognized.length > 0) {
      return recognizedSpeechItem.recognized[0].text;
    }
  }, [recognizedSpeechItem]);

  const onMouseEnterCloseIcon = React.useCallback((ev: any) => {
    setCloseButtonHovered(true);
  }, []);
  const onMouseLeaveCloseIcon = React.useCallback((ev: any) => {
    setCloseButtonHovered(false);
  }, []);

  const closeButtonClicked = React.useCallback((ev: any) => {
    dispatch(
      clearAllMarkedWordsFromRecognizedSpeech({
        deviceAddress: device.ipAddress,
      }),
    );
    setCloseButtonHovered(false);
  }, []);

  return <RecognizerAlertTooltip
  open={recognizedSpeechAlertOpen}
  title={
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          paddingLeft: '10px',
        }}
      >
        <StyledParagragp
          text="Внимание!"
          fontWeight={400}
          fontSize="18px"
        />
        <IconButton
          id={`${device.ipAddress}recognized-speech-alert-close-button`}
          size={'small'}
          color={closeButtonHovered ? 'error' : 'default'}
          onMouseEnter={onMouseEnterCloseIcon}
          onMouseLeave={onMouseLeaveCloseIcon}
          onClick={closeButtonClicked}
          sx={{ scale: '0.8' }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div style={{ margin: '10px 2px 5px 2px' }}>
        <p>
          {'Во время разговора было обнаружено слово '}
          <u>{`"${recognizedWord}".`}</u>{' '}
          {' Обратите внимание на разговор! Произнесенная фраза: "'}
          <u>{`${text}`}</u>
          {'"'}
        </p>
      </div>
    </React.Fragment>
  }
  placement="bottom-start"
>
  {child}
</RecognizerAlertTooltip>;
};

export default RecognizedAlertTooltipComponent;
