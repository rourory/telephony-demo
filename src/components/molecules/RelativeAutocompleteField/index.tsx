import React from 'react';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  TextField,
} from '@mui/material';
import StyledParagragp from '../../atoms/StyledParagraph/Index';
import { useDispatch, useSelector } from 'react-redux';
import {
  deviceRecordingServiceSelector,
  deviceRelativeValueAutocompleteFieldStateSelector,
  relationTypeValueOptionsSelector,
  relativeValueOptionsSelector,
  setRelativeValue,
  setRelativeValueFieldOpen,
  setRelativeValueOptions,
} from '../../../redux/slices/devices-slice/devices-slice';
import { AppDispatch, RootState } from '../../../redux/store';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { loadRelativeValuesThunk } from '../../../redux/slices/devices-slice/subthunks/load-relative-values-thunk';

const RelativeAutocompleteField: React.FC<AutocompleteFieldType> = ({
  deviceAddress,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { backendAddress, backendProtocol, backendPort } = useSelector(
    appSettingsStateSelector,
  );

  const fieldState = useSelector((state: RootState) =>
    deviceRelativeValueAutocompleteFieldStateSelector(state, deviceAddress),
  );
  const recordingService = useSelector((state: RootState) =>
    deviceRecordingServiceSelector(state, deviceAddress),
  );
  const optionsData = useSelector(relativeValueOptionsSelector);

  const relationTypes = useSelector(relationTypeValueOptionsSelector);

  const onOpen = React.useCallback(() => {
    dispatch(
      dispatch(
        setRelativeValueFieldOpen({ ipAddress: deviceAddress, open: true }),
      ),
    );
    if (recordingService?.personData?.id)
      dispatch(
        loadRelativeValuesThunk({
          ipAddress: deviceAddress,
          personId: recordingService?.personData?.id,
          backendSettings: {
            backendAddress: backendAddress,
            backendPort: backendPort,
            backendProtocol: backendProtocol,
          },
        }),
      );
  }, [deviceAddress, recordingService?.personData]);

  const onClose = React.useCallback(() => {
    dispatch(
      setRelativeValueFieldOpen({
        ipAddress: deviceAddress,
        open: false,
      }),
    );
    dispatch(setRelativeValueOptions([]));
  }, [deviceAddress]);

  const isOptionEqualToValue = React.useCallback(
    (option: RelativeEntity, value: RelativeEntity) => option.id == value.id,
    [],
  );
  const onChange = React.useCallback(
    (
      _: React.SyntheticEvent<Element, Event>,
      newValue: RelativeEntity | null,
    ) => {
      dispatch(
        setRelativeValue({
          ipAddress: deviceAddress,
          relativeValue: newValue,
        }),
      );
    },
    [deviceAddress],
  );

  const getOptionLabel = React.useCallback(
    (option: RelativeEntity) =>
      `${option.secondName} ${option.firstName} ${
        option.middleName != null ? option.middleName : ''
      } (${relationTypes.find((val) => val.id == option.relationType)
        ?.relationTypeName})`,
    [],
  );

  const renderOption = React.useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: RelativeEntity) => (
      <Box
        key={`${option.id}${option.convictedId}relativeFieldKey`}
        id={`${option.id}${option.convictedId}relativeField`}
        component="li"
        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
        {...props}
      >
        <StyledParagragp
          text={`${option.secondName} ${option.firstName} ${
            option.middleName != null ? option.middleName : ''
          } (${relationTypes.find((val) => val.id == option.relationType)
            ?.relationTypeName})`}
          fontWeight={600}
        />
      </Box>
    ),
    [],
  );

  const renderInput = React.useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        key={`${params.id}relativeAutocompleteRenderInputParamsKey`}
        {...params}
        id={`${params.id}relativeAutocompleteRenderInputParams`}
        label={<StyledParagragp text={'Родственник'} fontWeight={600} />}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {/* {fieldState?.loading ? <UltraLightLoadingIndicator /> : null} */}
              {params.InputProps.endAdornment}
            </React.Fragment>
          ),
        }}
      />
    ),
    [fieldState],
  );

  return (
    <Autocomplete
      sx={{ width: '100%', marginBottom: '10px' }}
      open={fieldState?.open}
      disabled={
        recordingService?.personData == null || recordingService.contact != null
      }
      size="small"
      onOpen={onOpen}
      onClose={onClose}
      loading={fieldState?.loading}
      isOptionEqualToValue={isOptionEqualToValue}
      value={recordingService?.relative}
      onChange={onChange}
      options={optionsData}
      autoHighlight
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={renderInput}
    />
  );
};

export default RelativeAutocompleteField;
