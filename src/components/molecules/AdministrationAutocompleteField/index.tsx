import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import StyledParagragp from "../../atoms/StyledParagraph/Index";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import {
  setUserAutocompleteFieldOpen,
  setUsersForAutocompleteField,
  userSelector,
} from "../../../redux/slices/user-slice/user-slice";
import { loadNotArchivedAdministrationDataThunk } from "../../../redux/slices/user-slice/thunks";
import { APP_TOKEN_ISSUED_KEY, APP_TOKEN_KEY } from "../../../api/constants";

import UltraLightLoadingIndicator from "../UltraLightLoadingIndicator";
import { appSettingsStateSelector } from "../../../redux/slices/app-settings-slice/app-settings-slice";

const AdministrationAutocompleteField: React.FC<{
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    newValue: AdministrationEntity | null
  ) => void;
}> = ({ onChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const backendSettings = useSelector(appSettingsStateSelector);

  const {
    usersForAutocompleteField,
    fetchingStatus,
    usersAutocompleteFieldOpen,
    autocompleteFieldUser,
  } = useSelector(userSelector);
  const onOpen = React.useCallback(() => {
    localStorage.removeItem(APP_TOKEN_KEY);
    localStorage.removeItem(APP_TOKEN_ISSUED_KEY);
    dispatch(loadNotArchivedAdministrationDataThunk(backendSettings));
    dispatch(setUserAutocompleteFieldOpen(true));
  }, [backendSettings]);

  const onClose = React.useCallback(() => {
    dispatch(setUserAutocompleteFieldOpen(false));
    dispatch(setUsersForAutocompleteField([]));
  }, []);

  const isOptionEqualToValue = React.useCallback(
    (option: AdministrationEntity, value: AdministrationEntity) =>
      option.id == value.id,
    []
  );

  const getOptionLabel = React.useCallback(
    (option: AdministrationEntity) => `${option.username}`,
    []
  );

  const renderOption = React.useCallback(
    (
      props: React.HTMLAttributes<HTMLLIElement>,
      option: AdministrationEntity
    ) => {
      return (
        <Box
          id={`${option.id} ${option.username}`}
          key={`${option.id} ${option.username}`}
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <StyledParagragp text={`${option.username}`} fontWeight={600} />
        </Box>
      );
    },
    []
  );

  const renderInput = React.useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        id={`${params.id}`}
        key={`${params.id}`}
        label={<StyledParagragp text={"Имя пользователя"} fontWeight={600} />}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {fetchingStatus === "LOADING" ? (
                <UltraLightLoadingIndicator />
              ) : null}
              {params.InputProps.endAdornment}
            </React.Fragment>
          ),
        }}
      />
    ),
    []
  );

  return (
    <Autocomplete
      id="username"
      sx={{ width: "100%", marginBottom: "10px" }}
      open={usersAutocompleteFieldOpen}
      autoFocus
      fullWidth
      onOpen={onOpen}
      onClose={onClose}
      loading={fetchingStatus === "LOADING"}
      isOptionEqualToValue={isOptionEqualToValue}
      value={autocompleteFieldUser}
      onChange={onChange}
      options={usersForAutocompleteField}
      autoHighlight
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={renderInput}
    />
  );
};

export default AdministrationAutocompleteField;
