import { ThemeOptionsType } from '../@types/redux/theme-slice';
import { DEFAULT_BACKEND_ADDRESS, DEFAULT_BACKEND_PORT, DEFAULT_BACKEND_PROTOCOL } from '../api/constants';

/**
 * Retreives theme configuration object from the browser's local storage if such object exists.
 * @returns theme configuration object from the browser's local storage or undefined
 */
export const getThemeConfigFromLocalStorageIfExists = ():
  | ThemeOptionsType
  | undefined => {
  const asText = localStorage.getItem('themeOptions');
  return asText ? (JSON.parse(asText) as ThemeOptionsType) : undefined;
};

/**
 * Saves theme configuration object to the browser's local storage local storage
 * @param config theme configuration object
 */
export const setThemeConfigToLocalStorage = (config: ThemeOptionsType) => {
  localStorage.setItem('themeOptions', JSON.stringify(config));
};

/**
 *
 * @returns application settings from the browser's local storage
 */
export const getAppSettingsFromLocalStorage = (): AppSettingsSliceType => {
  const asText = localStorage.getItem('TDAppSettings');
  if (asText) {
    return JSON.parse(asText);
  } else {
    const defaultSettings: AppSettingsSliceType = {
      backendAddress: DEFAULT_BACKEND_ADDRESS,
      backendPort: DEFAULT_BACKEND_PORT,
      backendProtocol: DEFAULT_BACKEND_PROTOCOL,
    };
    setAppSettingstoLocalStorage(defaultSettings);
    return defaultSettings;
  }
};

/**
 * Saves application settings to the browser's local storage
 * @param settings apllication settings
 */
export const setAppSettingstoLocalStorage = (
  settings: AppSettingsSliceType,
) => {
  localStorage.setItem('TDAppSettings', JSON.stringify(settings));
};
