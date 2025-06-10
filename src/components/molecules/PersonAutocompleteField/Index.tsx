import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete, {
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import StyledParagragp from '../../atoms/StyledParagraph/Index';
import { useDispatch, useSelector } from 'react-redux';
import {
  devicePersonDataAutocompleteFieldStateSelector,
  deviceRecordingServiceSelector,
  personDataLoadedAtSelector,
  personDataOptionsSelector,
  setPersonData,
  setPersonDataFieldOpen,
} from '../../../redux/slices/devices-slice/devices-slice';
import { AppDispatch, RootState } from '../../../redux/store';
import {
  userPermissions,
  userSelector,
} from '../../../redux/slices/user-slice/user-slice';
import { plusHours } from '../../../utils/datetimeutils';

import { VariableSizeList, ListChildComponentProps } from 'react-window';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { loadPersonDataThunk } from '../../../redux/slices/devices-slice/subthunks/load-person-data-thunk';
import { loadAvailableExtraCallPermissionsThunk } from '../../../redux/slices/devices-slice/subthunks/load-available-extra-call-permissions-thunk';

const LISTBOX_PADDING = 8;

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;

  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>(
  function OuterElementType(props, ref) {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  },
);

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props as any;
  const itemData = React.Children.toArray(children);
  const itemSize = 48;
  const height = Math.min(8, itemData.length) * itemSize + 2 * LISTBOX_PADDING;

  const gridRef = useResetCache(itemData.length);
  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          ref={gridRef}
          itemData={itemData}
          height={height}
          width="100%"
          innerElementType={'ul'}
          outerElementType={OuterElementType}
          itemSize={() => itemSize}
          itemCount={itemData.length}
          overscanCount={5}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const PersonAutocompleteField: React.FC<AutocompleteFieldType> = ({
  deviceAddress,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const backendSettings = useSelector(appSettingsStateSelector);
  const { user } = useSelector(userSelector);
  const {
    canGiveCallsToAnotherSquad,
    canGiveCallsToControlled,
    temporaryGivingCallsToAnotherSquad,
    temporaryGivingCallsToAnotherSquadHours,
  } = useSelector(userPermissions);

  const isTemporaryPermitted = React.useMemo(() => {
    if (
      temporaryGivingCallsToAnotherSquad != null &&
      temporaryGivingCallsToAnotherSquadHours != null
    ) {
      return (
        new Date().getTime() <=
        plusHours(
          new Date(temporaryGivingCallsToAnotherSquad),
          temporaryGivingCallsToAnotherSquadHours,
        ).getTime()
      );
    }
    return false;
  }, [
    temporaryGivingCallsToAnotherSquad,
    temporaryGivingCallsToAnotherSquadHours,
  ]);

  const fieldState = useSelector((state: RootState) =>
    devicePersonDataAutocompleteFieldStateSelector(state, deviceAddress),
  );
  const recordingService = useSelector((state: RootState) =>
    deviceRecordingServiceSelector(state, deviceAddress),
  );
  const optionsData = useSelector(personDataOptionsSelector);
  const lastLoadedAt = useSelector(personDataLoadedAtSelector);

  const onOpen = React.useCallback(() => {
    dispatch(setPersonDataFieldOpen({ ipAddress: deviceAddress, open: true }));
    dispatch(
      loadPersonDataThunk({
        ipAddress: deviceAddress,
        squadNumber:
          canGiveCallsToAnotherSquad || isTemporaryPermitted
            ? null
            : user?.squadNumber || null,
        archived: false,
        onlyIsNotUnderControl: !canGiveCallsToControlled,
        backendSettings: backendSettings,
        currentData: optionsData,
        lastLoaded: lastLoadedAt,
      }),
    );
  }, [
    deviceAddress,
    canGiveCallsToAnotherSquad,
    isTemporaryPermitted,
    canGiveCallsToControlled,
    user,
    lastLoadedAt,
    optionsData,
  ]);

  const onClose = React.useCallback(() => {
    dispatch(setPersonDataFieldOpen({ ipAddress: deviceAddress, open: false }));
  }, [deviceAddress]);

  const isOptionEqualToValue = React.useCallback(
    (option: PersonEntity, value: PersonEntity) => option.id === value.id,
    [],
  );

  const onChange = React.useCallback(
    (
      _: React.SyntheticEvent<Element, Event>,
      newValue: PersonEntity | null,
    ) => {
      dispatch(
        setPersonData({ ipAddress: deviceAddress, personData: newValue }),
      );
      dispatch(
        loadAvailableExtraCallPermissionsThunk({
          ipAddress: deviceAddress,
          convictedId: newValue?.id || 0,
          backendSettings: backendSettings,
        }),
      );
    },
    [deviceAddress],
  );

  const getOptionLabel = React.useCallback(
    (option: PersonEntity) =>
      `${option.secondName} ${option.firstName} ${
        option.middleName != null ? option.middleName : ''
      } (${option.squadNumber})`,
    [],
  );

  const renderOption = React.useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: PersonEntity) => (
      <Box
        key={`${option.id}convictedFieldKey`}
        id={`${option.id}convictedField`}
        component="li"
        {...props}
      >
        <StyledParagragp
          text={`${option.secondName} ${option.firstName} ${
            option.middleName ?? ''
          }, ${option.squadNumber} отр.`}
          fontWeight={600}
        />
      </Box>
    ),
    [],
  );

  const renderInput = React.useCallback(
    (params: AutocompleteRenderInputParams) => {
      return (
        <TextField
          key={`${params.id}personAutocompleteRenderInputParamsKey`}
          {...params}
          id={`${params.id}personAutocompleteRenderInputParams`}
          label={
            <StyledParagragp text={'Фамилия, имя, отчество'} fontWeight={600} />
          }
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>
            ),
          }}
        />
      );
    },
    [fieldState],
  );

  return (
    <Autocomplete
      sx={{ width: '100%', marginBottom: '10px' }}
      open={fieldState?.open}
      disabled={
        recordingService?.isProcessing || !recordingService?.isAvailable
      }
      size="small"
      onOpen={onOpen}
      onClose={onClose}
      loading={fieldState?.loading}
      isOptionEqualToValue={isOptionEqualToValue}
      value={recordingService?.personData}
      onChange={onChange}
      options={optionsData}
      autoHighlight
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={renderInput}
      ListboxComponent={ListboxComponent}
    />
  );
};

export default PersonAutocompleteField;
