import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  TextField,
} from "@mui/material";
import React from "react";
import StyledParagragp from "../../atoms/StyledParagraph/Index";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  contactTypeValueOptionsSelector,
  contactValueOptionsSelector,
  deviceContactValueAutocompleteFieldStateSelector,
  deviceRecordingServiceSelector,
  setCallActionButtonsDisabled,
  setContactValue,
  setContactValueFieldOpen,
  setContactValueOptions,
} from "../../../redux/slices/devices-slice/devices-slice";
import { appSettingsStateSelector } from "../../../redux/slices/app-settings-slice/app-settings-slice";
import { loadContactValuesThunk } from "../../../redux/slices/devices-slice/subthunks/load-contact-values-thunk";

const ContactAutocompleteField: React.FC<AutocompleteFieldType> = ({
  deviceAddress,
  disabled,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { backendAddress, backendProtocol, backendPort } = useSelector(
    appSettingsStateSelector
  );

  const fieldState = useSelector((state: RootState) =>
    deviceContactValueAutocompleteFieldStateSelector(state, deviceAddress)
  );
  const recordingService = useSelector((state: RootState) =>
    deviceRecordingServiceSelector(state, deviceAddress)
  );
  const optionsData = useSelector(contactValueOptionsSelector);
  const contactTypeOptionsData = useSelector(contactTypeValueOptionsSelector);

  const onOpen = React.useCallback(() => {
    dispatch(
      setContactValueFieldOpen({ ipAddress: deviceAddress, open: true })
    );
    if (recordingService?.relative?.id)
      dispatch(
        loadContactValuesThunk({
          ipAddress: deviceAddress,
          relativeId: recordingService?.relative?.id,
          backendSettings: {
            backendAddress: backendAddress,
            backendPort: backendPort,
            backendProtocol: backendProtocol,
          },
        })
      );
  }, [deviceAddress, recordingService?.relative]);

  const onClose = React.useCallback(() => {
    dispatch(
      setContactValueFieldOpen({ ipAddress: deviceAddress, open: false })
    );
    dispatch(setContactValueOptions([]));
  }, [deviceAddress]);

  const isOptionEqualToValue = React.useCallback(
    (option: ContactEntity, value: ContactEntity) => option.id == value.id,
    []
  );

  const onChange = React.useCallback(
    (
      _: React.SyntheticEvent<Element, Event>,
      newValue: ContactEntity | null
    ) => {
      dispatch(
        setContactValue({
          ipAddress: deviceAddress,
          contactValue: newValue,
        })
      );
      dispatch(
        setCallActionButtonsDisabled({
          address: deviceAddress,
          disabled: true,
        })
      );
    },
    [deviceAddress]
  );

  const getOptionDisabled = React.useCallback(
    (option: ContactEntity) => option.frozen,
    []
  );

  const getOptionLabel = React.useCallback(
    (option: ContactEntity) => `${option.contactValue}`,
    []
  );

  const renderOption = React.useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: ContactEntity) => (
      <Box
        key={`${option.id}${option.relativeId}contactFieldKey`}
        id={`${option.id}${option.relativeId}contactField`}
        component="li"
        sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
        {...props}
      >
        <StyledParagragp
          text={`${option.contactValue} (${
            contactTypeOptionsData.find(
              (val: any) => val.id == option.contactTypeId
            )?.contactTypeName
          })`}
          fontWeight={600}
        />
      </Box>
    ),
    []
  );

  const renderInput = React.useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        key={`${params.id}contactAutocompleteRenderInputParamsKey`}
        {...params}
        id={`${params.id}contactAutocompleteRenderInputParams`}
        label={
          <StyledParagragp text={"Контакт родственника"} fontWeight={600} />
        }
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
    [fieldState]
  );

  return (
    <Autocomplete
      sx={{ width: "100%", marginBottom: "10px" }}
      open={fieldState?.open}
      getOptionDisabled={getOptionDisabled}
      disabled={recordingService?.relative == null || disabled}
      size="small"
      onOpen={onOpen}
      onClose={onClose}
      loading={fieldState?.loading}
      isOptionEqualToValue={isOptionEqualToValue}
      value={recordingService?.contact}
      onChange={onChange}
      options={optionsData}
      autoHighlight
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={renderInput}
    />
  );
};

export default ContactAutocompleteField;
